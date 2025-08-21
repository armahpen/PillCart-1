import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import { Building2, Phone, Mail, Clock, MapPin, Shield, Heart, Users, Star, FileText, RefreshCw, Stethoscope } from "lucide-react";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Smile Pills Ltd</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Licensed pharmaceutical wholesale and medical supplies company dedicated to enhancing health outcomes through quality, innovation, and exceptional service.
          </p>
          <Badge className="mt-4 bg-secondary text-white px-6 py-2 text-lg">
            Smile Forever – delivering health with trust, quality, and convenience
          </Badge>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              About Us
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Terms
            </TabsTrigger>
            <TabsTrigger value="prescription" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Prescription
            </TabsTrigger>
          </TabsList>

          {/* About Us Tab */}
          <TabsContent value="about" className="mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Company Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-secondary" />
                    Company Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Smile Pills Ltd</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We are a licensed pharmaceutical wholesale and medical supplies company based in Ghana. 
                      We provide quality, affordable, and accessible medicines and medical products to pharmacies, 
                      hospitals, and individual customers.
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 leading-relaxed">
                      Our mission is to enhance health outcomes through innovation, exceptional customer service, 
                      and reliable delivery systems.
                    </p>
                  </div>

                  <div className="flex items-start gap-2 pt-4">
                    <MapPin className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Physical Address</p>
                      <p className="text-gray-600">East Legon Hills, Accra, Ghana</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vision & Values */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-secondary" />
                    Our Vision & Values
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-secondary mb-2">Vision</h4>
                    <p className="text-gray-600">
                      To be Ghana's leading pharmaceutical and medical supplies provider, 
                      integrating future innovations in community and retail pharmacy.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-secondary mb-2">Values</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Integrity', 'Quality', 'Innovation', 'Accessibility', 'Customer Care'].map((value) => (
                        <Badge key={value} variant="outline" className="bg-secondary/10">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-secondary" />
                    Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-secondary" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">0544137947 | +233 209339912</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-secondary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">smilepills21@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-secondary" />
                    <div>
                      <p className="font-medium">Operating Hours</p>
                      <p className="text-gray-600">Monday – Saturday, 24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Our Story */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-secondary" />
                    Our Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Founded by a certified pharmacy technician with over 4 years of experience in both 
                    retail and hospital pharmacy settings, Smile Pills Ltd was established to meet the 
                    growing demand for quality pharmaceutical products and medical supplies in Ghana.
                  </p>
                  <p className="text-gray-600 leading-relaxed mt-3">
                    We operate under full compliance with healthcare regulations, ensuring the highest 
                    standards in product sourcing, handling, and distribution. Our commitment to innovation 
                    and service excellence drives our mission to keep our clients smiling — forever.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy Policy Tab */}
          <TabsContent value="policies" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
                <p className="text-sm text-gray-600">At Smile Pills Ltd, your privacy is important to us.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Information We Collect</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Personal details (name, phone number, email, delivery address)</li>
                    <li>Payment information (processed securely through trusted payment providers)</li>
                    <li>Prescription documents (where applicable)</li>
                    <li>Website usage data (cookies, browsing activity)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">How We Use Your Information</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>To process and deliver your orders</li>
                    <li>To verify prescriptions for restricted medicines</li>
                    <li>To communicate updates, promotions, or important notices</li>
                    <li>To improve our products, services, and website experience</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Data Protection</h3>
                  <p className="text-gray-600 mb-3">
                    We store your information securely and do not share it with third parties except:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>When required by law</li>
                    <li>When necessary for delivery or payment processing</li>
                    <li>When verifying prescriptions with licensed pharmacists</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Your Rights</h3>
                  <p className="text-gray-600">
                    You can request to access, correct, or delete your personal data at any time. 
                    Contact us at: <a href="mailto:smilepills21@gmail.com" className="text-secondary underline">smilepills21@gmail.com</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Terms & Conditions Tab */}
          <TabsContent value="terms" className="mt-8">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                  <p className="text-sm text-gray-600">By using the Smile Pills Ltd website, you agree to the following terms:</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">1. General</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                      <li>We are a licensed pharmaceutical and medical supplies business operating in Ghana.</li>
                      <li>All prices are listed in Ghana Cedis (GHS) and include applicable taxes unless stated otherwise.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">2. Orders & Payments</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                      <li>Orders are confirmed only after payment is received.</li>
                      <li>Prescription medicines will be processed only after a valid prescription is verified.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">3. Delivery</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                      <li>Delivery timelines vary by location but are typically completed within 1–3 working days in Accra.</li>
                      <li>Delays due to unforeseen circumstances will be communicated promptly.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">4. Returns & Refunds</h3>
                    <p className="text-gray-600">See Return & Refund Policy for details. Pharmaceutical products cannot be returned once opened, except in cases of damage or wrong delivery.</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">5. Liability</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                      <li>We are not responsible for misuse of products purchased from our platform.</li>
                      <li>Always consult a licensed healthcare provider before using any medication.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">6. Governing Law</h3>
                    <p className="text-gray-600">These terms are governed by the laws of Ghana.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Return & Refund Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Eligibility for Returns</h3>
                    <p className="text-gray-600 mb-2">We accept returns for:</p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                      <li>Products delivered in error</li>
                      <li>Products damaged before delivery</li>
                      <li>Products that have expired before delivery</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Non-Returnable Items</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                      <li>Opened pharmaceutical products</li>
                      <li>Products without original packaging</li>
                      <li>Items returned more than 48 hours after delivery</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Refund Process</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                      <li>Refunds are issued within 7 working days after returned items are inspected and approved.</li>
                      <li>Refunds will be processed via the same payment method used for the purchase.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">How to Initiate a Return</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                      <li>Contact us via +233 544137947 or smilepills21@gmail.com within 48 hours of receiving your order.</li>
                      <li>Provide order details, reason for return, and pictures if applicable.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Prescription Policy Tab */}
          <TabsContent value="prescription" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Prescription Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium mb-2">Important Notice</p>
                  <p className="text-blue-700">
                    All prescription medicines require a valid prescription from a licensed medical practitioner.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Prescription Requirements</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                      <li>Prescriptions can be uploaded during checkout or sent via WhatsApp/email</li>
                      <li>All prescriptions must be from licensed medical practitioners</li>
                      <li>Prescriptions must be valid and not expired</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Order Processing</h3>
                    <p className="text-gray-600">
                      Orders without valid prescriptions will not be processed and payments will be refunded 
                      (minus any processing fees).
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">How to Submit Your Prescription</h4>
                    <ul className="list-decimal pl-6 space-y-1 text-sm text-gray-600">
                      <li>Upload during checkout process</li>
                      <li>Send via WhatsApp: <a href="https://wa.me/message/GKIVR7F2FJPJE1" className="text-secondary underline" target="_blank" rel="noopener noreferrer">Click here</a></li>
                      <li>Email to: <a href="mailto:smilepills21@gmail.com" className="text-secondary underline">smilepills21@gmail.com</a></li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}