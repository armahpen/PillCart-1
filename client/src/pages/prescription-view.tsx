import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FileText, Download, Eye, Shield, Calendar, User, Phone, Pill, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PrescriptionDetails {
  id: string;
  patientName: string;
  doctorName: string;
  doctorContact: string;
  prescriptionDate: string;
  medications: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  files: Array<{
    id: string;
    filename: string;
    url: string;
    type: string;
    size: number;
  }>;
}

export default function PrescriptionViewPage() {
  const params = useParams();
  const prescriptionId = params.id;

  const { data: prescription, isLoading, error } = useQuery<PrescriptionDetails>({
    queryKey: ['/api/prescriptions/view', prescriptionId],
    enabled: !!prescriptionId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading prescription details...</p>
        </div>
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Prescription Not Found</h2>
            <p className="text-gray-600 mb-4">
              The prescription you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-neutral">Prescription Details</h1>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(prescription.status)}`}>
            {getStatusIcon(prescription.status)}
            <span className="font-medium capitalize">{prescription.status}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient & Doctor Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient & Doctor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Patient Name</label>
                    <p className="text-lg font-medium">{prescription.patientName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Doctor Name</label>
                    <p className="text-lg font-medium">Dr. {prescription.doctorName}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-600">Doctor Contact</label>
                      <p className="font-medium">{prescription.doctorContact}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-600">Prescription Date</label>
                      <p className="font-medium">{format(new Date(prescription.prescriptionDate), 'PPP')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medications */}
            {prescription.medications && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    Medications & Dosage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">{prescription.medications}</pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Prescription Images/Files */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Prescription Files ({prescription.files.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {prescription.files.map((file) => (
                    <div key={file.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      {file.type.startsWith('image/') ? (
                        <div className="space-y-3">
                          <img
                            src={file.url}
                            alt={file.filename}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{file.filename}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <a href={file.url} download={file.filename}>
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm">{file.filename}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <a href={file.url} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <a href={file.url} download={file.filename}>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Submitted</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(prescription.submittedAt), 'PPP p')}
                    </p>
                  </div>
                </div>
                
                {prescription.status === 'verified' && prescription.verifiedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-green-700">Verified</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(prescription.verifiedAt), 'PPP p')}
                      </p>
                      {prescription.verifiedBy && (
                        <p className="text-sm text-gray-500">By: {prescription.verifiedBy}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {prescription.status === 'rejected' && prescription.rejectionReason && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-red-700">Rejected</p>
                      <p className="text-sm text-red-600 bg-red-50 p-2 rounded mt-1">
                        {prescription.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}
                
                {prescription.status === 'pending' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 animate-pulse" />
                    <div>
                      <p className="font-medium text-yellow-700">Under Review</p>
                      <p className="text-sm text-gray-500">
                        Expected completion: 2-4 hours
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <h4 className="font-medium text-blue-900 mb-1">Secure Access</h4>
                    <p className="text-blue-800">
                      This prescription view is secure and only accessible to authorized pharmacy staff for verification purposes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.print()}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Print Details
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  asChild
                >
                  <a href="https://wa.me/233200751811" target="_blank">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Support
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}