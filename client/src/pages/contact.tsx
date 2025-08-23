import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Chatbot from "@/components/chatbot/Chatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle,
  Send,
  CheckCircle,
  ExternalLink
} from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create WhatsApp message
    const message = `Hi Smile Pills! 

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Category: ${formData.category}
Subject: ${formData.subject}

Message: ${formData.message}`;
    
    const whatsappUrl = `https://wa.me/233209339912?text=${encodeURIComponent(message)}`;
    
    setTimeout(() => {
      toast({
        title: "Redirecting to WhatsApp!",
        description: "You'll be redirected to WhatsApp to send your message directly to our team.",
      });
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Visit Our Location",
      details: ["East Legon Hills", "Accra, Ghana"],
      action: "Get Directions",
      link: "https://maps.google.com/?q=East+Legon+Hills+Accra+Ghana"
    },
    {
      icon: <Phone className="h-6 w-6 text-secondary" />,
      title: "Call Us",
      details: ["0544137947", "+233 209339912"],
      action: "Call Now",
      link: "tel:+233209339912"
    },
    {
      icon: <Mail className="h-6 w-6 text-purple-600" />,
      title: "Email Support",
      details: ["smilepills21@gmail.com"],
      action: "Send Email",
      link: "mailto:smilepills21@gmail.com"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-green-500" />,
      title: "WhatsApp",
      details: ["Chat with us instantly", "Available 24/7"],
      action: "Start WhatsApp Chat",
      link: "https://wa.me/233209339912"
    }
  ];

  const faqCategories = [
    { value: "prescription", label: "Prescription Questions" },
    { value: "orders", label: "Order Status" },
    { value: "shipping", label: "Shipping & Delivery" },
    { value: "insurance", label: "Insurance & Billing" },
    { value: "account", label: "Account Issues" },
    { value: "technical", label: "Technical Support" },
    { value: "general", label: "General Inquiry" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Contact Smile Pills Ltd</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We're here to help! Get in touch with our licensed pharmaceutical team 
              for any questions about medications, orders, or healthcare services in Ghana.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">Multiple ways to reach our expert team</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    {info.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{info.title}</h3>
                  <div className="space-y-1 mb-4">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(info.link, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {info.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Emergency Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {faqCategories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Please describe your question or concern in detail..."
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Quick Info */}
            <div className="space-y-6">
              {/* Response Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-secondary" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">WhatsApp Support:</span>
                    <span className="text-sm font-semibold text-secondary">Immediate</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Phone Support:</span>
                    <span className="text-sm font-semibold text-secondary">Immediate</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email Support:</span>
                    <span className="text-sm font-semibold text-secondary">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Prescription Questions:</span>
                    <span className="text-sm font-semibold text-secondary">Within 2 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Order Issues:</span>
                    <span className="text-sm font-semibold text-secondary">Same day</span>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp Direct */}
              <Card className="bg-green-600 text-white">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-green-200" />
                  <h3 className="font-semibold text-lg mb-2">WhatsApp Support</h3>
                  <p className="text-green-100 text-sm mb-4">
                    Get instant help from our pharmacy team on WhatsApp.
                  </p>
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => window.open('https://wa.me/233209339912', '_blank')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
