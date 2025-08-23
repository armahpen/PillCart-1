import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, User, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6 text-blue-200" />
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-blue-100">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Effective Date */}
          <div className="text-center">
            <p className="text-sm text-gray-600">Effective Date: January 1, 2025</p>
          </div>

          {/* Introduction */}
          <Card>
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                At Smile Pills Ltd, your privacy is important to us. This Privacy Policy explains how we collect, 
                use, and protect your personal information when you visit or purchase from our website.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-6 w-6 mr-3 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span className="text-gray-700">Personal details (name, phone number, email, delivery address)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span className="text-gray-700">Payment information (processed securely through trusted payment providers)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span className="text-gray-700">Prescription documents (where applicable)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span className="text-gray-700">Website usage data (cookies, browsing activity)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-6 w-6 mr-3 text-secondary" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span className="text-gray-700">To process and deliver your orders</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span className="text-gray-700">To verify prescriptions for restricted medicines</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span className="text-gray-700">To communicate updates, promotions, or important notices</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span className="text-gray-700">To improve our products, services, and website experience</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-6 w-6 mr-3 text-green-600" />
                Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We store your information securely and do not share it with third parties except:
              </p>
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">When required by law</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">When necessary for delivery or payment processing</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">When verifying prescriptions with licensed pharmacists</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-3 text-purple-600" />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                You can request to access, correct, or delete your personal data at any time. Contact us at:
              </p>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold text-purple-900">
                  Email: <a href="mailto:smilepills21@gmail.com" className="text-purple-600 hover:underline">smilepills21@gmail.com</a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-primary text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Questions About Our Privacy Policy?</h3>
              <p className="mb-4">
                If you have any questions or concerns about our privacy practices, please don't hesitate to contact us.
              </p>
              <div className="space-y-2 text-sm">
                <p>📧 Email: smilepills21@gmail.com</p>
                <p>📞 Phone: 0544137947 | +233 209339912</p>
                <p>📍 Address: East Legon Hills, Accra, Ghana</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>

      <Footer />
    </div>
  );
}