import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ShoppingCart, Truck, RotateCcw, AlertTriangle, Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary to-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="h-16 w-16 mx-auto mb-6 text-green-200" />
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl text-green-100">
            Please read these terms and conditions carefully before using our services.
          </p>
        </div>
      </section>

      {/* Terms Content */}
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
                By using the Smile Pills Ltd website, you agree to the following terms and conditions.
              </p>
            </CardContent>
          </Card>

          {/* General */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-6 w-6 mr-3 text-primary" />
                1. General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span className="text-gray-700">We are a licensed pharmaceutical and medical supplies business operating in Ghana.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span className="text-gray-700">All prices are listed in Ghana Cedis (GHS) and include applicable taxes unless stated otherwise.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders & Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-6 w-6 mr-3 text-secondary" />
                2. Orders & Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span className="text-gray-700">Orders are confirmed only after payment is received.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span className="text-gray-700">Prescription medicines will be processed only after a valid prescription is verified.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-6 w-6 mr-3 text-green-600" />
                3. Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">Delivery timelines vary by location but are typically completed within 1–3 working days in Accra.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">Delays due to unforeseen circumstances will be communicated promptly.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Returns & Refunds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RotateCcw className="h-6 w-6 mr-3 text-purple-600" />
                4. Returns & Refunds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">See Return & Refund Policy for details.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">Pharmaceutical products cannot be returned once opened, except in cases of damage or wrong delivery.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return & Refund Policy */}
          <Card className="border-purple-200">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center text-purple-800">
                <RotateCcw className="h-6 w-6 mr-3" />
                Return & Refund Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Eligibility for Returns */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Eligibility for Returns</h4>
                <p className="text-gray-700 mb-3">We accept returns for:</p>
                <div className="grid gap-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span className="text-gray-700">Products delivered in error</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span className="text-gray-700">Products damaged before delivery</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span className="text-gray-700">Products that have expired before delivery</span>
                  </div>
                </div>
              </div>

              {/* Non-Returnable Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Non-Returnable Items</h4>
                <div className="grid gap-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">Opened pharmaceutical products</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">Products without original packaging</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">Items returned more than 48 hours after delivery</span>
                  </div>
                </div>
              </div>

              {/* Refund Process */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Refund Process</h4>
                <div className="grid gap-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">Refunds are issued within 7 working days after returned items are inspected and approved.</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">Refunds will be processed via the same payment method used for the purchase.</span>
                  </div>
                </div>
              </div>

              {/* How to Initiate a Return */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">How to Initiate a Return</h4>
                <div className="grid gap-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">Contact us via +233 544137947 or smilepills21@gmail.com within 48 hours of receiving your order.</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">Provide order details, reason for return, and pictures if applicable.</span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Prescription Policy */}
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center text-blue-800">
                <FileText className="h-6 w-6 mr-3" />
                Prescription Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">All prescription medicines require a valid prescription from a licensed medical practitioner.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">Prescriptions can be uploaded during checkout or sent via WhatsApp/email.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">Orders without valid prescriptions will not be processed and payments will be refunded (minus any processing fees).</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-6 w-6 mr-3 text-orange-600" />
                5. Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">We are not responsible for misuse of products purchased from our platform.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">Always consult a licensed healthcare provider before using any medication.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-6 w-6 mr-3 text-gray-600" />
                6. Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                These terms are governed by the laws of Ghana.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-secondary text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Questions About Our Terms?</h3>
              <p className="mb-4">
                If you have any questions about these terms and conditions, please contact us.
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