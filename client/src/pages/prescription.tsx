import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload, Camera, FileText, Shield, MessageCircle, HelpCircle, CheckCircle2, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

const prescriptionSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  doctorName: z.string().min(2, "Doctor name must be at least 2 characters"),
  doctorContact: z.string().min(10, "Please provide valid doctor contact"),
  prescriptionDate: z.date({
    required_error: "Prescription date is required",
  }),
  medications: z.string().optional(),
  privacyConsent: z.boolean().refine(val => val === true, {
    message: "You must consent to prescription verification",
  }),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

interface PrescriptionHistory {
  id: string;
  patientName: string;
  doctorName: string;
  prescriptionDate: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  files: string[];
}

export default function PrescriptionPage() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientName: "",
      doctorName: "",
      doctorContact: "",
      medications: "",
      privacyConsent: false,
    },
  });

  // Fetch prescription history
  const { data: prescriptionHistory } = useQuery<PrescriptionHistory[]>({
    queryKey: ['/api/prescriptions/history'],
    enabled: isAuthenticated,
  });

  // Submit prescription mutation
  const submitPrescription = useMutation({
    mutationFn: async (data: PrescriptionFormData & { files: File[] }) => {
      const formData = new FormData();
      
      // Add form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'files' && key !== 'prescriptionDate') {
          formData.append(key, value.toString());
        }
      });
      
      formData.append('prescriptionDate', data.prescriptionDate.toISOString());
      
      // Add files
      data.files.forEach((file, index) => {
        formData.append(`prescription_${index}`, file);
      });

      return apiRequest("POST", "/api/prescriptions/submit", formData);
    },
    onSuccess: (response: any) => {
      toast({
        title: "Prescription Submitted Successfully",
        description: "Your prescription has been sent for verification. You'll receive a WhatsApp confirmation shortly.",
      });
      
      // Reset form and files
      form.reset();
      setUploadedFiles([]);
      
      // Send WhatsApp message
      const whatsappData = form.getValues();
      const message = generateWhatsAppMessage(whatsappData, response.id);
      window.open(`https://wa.me/233200751811?text=${encodeURIComponent(message)}`, '_blank');
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit prescription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateWhatsAppMessage = (data: PrescriptionFormData, prescriptionId: string) => {
    const baseUrl = window.location.origin;
    return `🏥 *New Prescription Submission*

*Patient Details:*
• Name: ${data.patientName}
• Prescription Date: ${format(data.prescriptionDate, 'PPP')}

*Doctor Information:*
• Doctor: ${data.doctorName}
• Contact: ${data.doctorContact}

*Medications:* ${data.medications || 'Not specified'}

*Prescription ID:* ${prescriptionId}

📋 *View Full Details & Images:*
${baseUrl}/prescription-view/${prescriptionId}

Please verify this prescription and confirm medication availability.`;
  };

  const handleFileSelect = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        toast({
          title: "Invalid File Type",
          description: "Please upload only JPG, PNG, or PDF files.",
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File Too Large",
          description: "Files must be under 5MB.",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      id: Math.random().toString(36).substring(7),
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFileSelect(files);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'camera');
      fileInputRef.current.click();
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const onSubmit = (data: PrescriptionFormData) => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Prescription Uploaded",
        description: "Please upload at least one prescription image or PDF.",
        variant: "destructive",
      });
      return;
    }

    const files = uploadedFiles.map(f => f.file);
    submitPrescription.mutate({ ...data, files });
  };

  const faqItems = [
    {
      question: "What file formats are accepted?",
      answer: "We accept JPG, PNG, and PDF files up to 5MB each. Make sure your prescription is clear and readable."
    },
    {
      question: "How long does verification take?",
      answer: "Prescription verification typically takes 2-4 hours during business hours (9 AM - 6 PM, Monday-Saturday)."
    },
    {
      question: "What if my prescription is rejected?",
      answer: "If rejected, we'll contact you via WhatsApp with the reason and guide you on resubmission requirements."
    },
    {
      question: "Is my prescription information secure?",
      answer: "Yes, all prescription data is encrypted and only used for verification. We comply with healthcare privacy standards."
    },
    {
      question: "Can I order without a prescription?",
      answer: "Over-the-counter medications don't require prescriptions, but prescription drugs legally require valid prescriptions."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral mb-4">Upload Your Prescription</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Prescriptions are required for certain medications to ensure your safety and legal compliance. 
            Our certified pharmacy technicians will verify your prescription within 2-4 hours.
          </p>
        </div>

        {/* Quick Actions */}
        {isAuthenticated && (
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Prescription History
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFAQ(!showFAQ)}
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              FAQ
            </Button>
          </div>
        )}

        {/* Prescription History */}
        {showHistory && prescriptionHistory && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your Prescription History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prescriptionHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No prescriptions submitted yet.</p>
              ) : (
                <div className="space-y-4">
                  {prescriptionHistory.map((prescription) => (
                    <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{prescription.patientName}</h4>
                        <p className="text-sm text-gray-600">Dr. {prescription.doctorName}</p>
                        <p className="text-sm text-gray-500">
                          Submitted: {format(new Date(prescription.createdAt), 'PPP')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            prescription.status === 'verified' ? 'default' :
                            prescription.status === 'rejected' ? 'destructive' : 'secondary'
                          }
                        >
                          {prescription.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* FAQ Section */}
        {showFAQ && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-neutral mb-2">{item.question}</h4>
                    <p className="text-gray-600 text-sm">{item.answer}</p>
                    {index < faqItems.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Prescription
              </CardTitle>
              <p className="text-sm text-gray-600">
                Accepted formats: PDF, JPG, PNG • Max size: 5MB per file
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? 'border-primary bg-primary/5' : 'border-gray-300'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Drop your prescription here</h3>
                <p className="text-gray-600 mb-4">or choose files to upload</p>
                
                <div className="flex gap-3 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Browse Files
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCameraCapture}
                    className="md:hidden"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Uploaded Files ({uploadedFiles.length})</h4>
                  {uploadedFiles.map((uploadedFile) => (
                    <div key={uploadedFile.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {uploadedFile.preview ? (
                          <img src={uploadedFile.preview} alt="Preview" className="h-10 w-10 object-cover rounded" />
                        ) : (
                          <FileText className="h-10 w-10 text-gray-400" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{uploadedFile.file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadedFile.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Prescription Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter patient's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="doctorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter prescribing doctor's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="doctorContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor's Contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number or hospital contact" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prescriptionDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Prescription Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Select prescription date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medications & Dosage (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List medications and dosages if visible on prescription"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This helps us prepare your order faster
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Privacy Section */}
                  <div className="border-t pt-6">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg mb-4">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <h4 className="font-medium text-blue-900 mb-1">Privacy & Security</h4>
                        <p className="text-blue-800">
                          Your prescription will only be used for order verification and will remain confidential. 
                          We comply with healthcare privacy standards and never share your medical information.
                        </p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="privacyConsent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              I consent to storing and verifying my prescription for order processing
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={submitPrescription.isPending}
                  >
                    {submitPrescription.isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Submit Prescription
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <MessageCircle className="h-8 w-8 text-secondary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Need Help with Your Prescription?</h3>
              <p className="text-gray-600 mb-4">
                Our certified pharmacy technicians are available to assist you with prescription requirements
              </p>
              <div className="flex gap-3 justify-center">
                <a href="https://wa.me/233200751811" target="_blank">
                  <Button className="bg-secondary hover:bg-secondary/90">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp Support
                  </Button>
                </a>
                <Button variant="outline">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Live Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}