import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  Users, 
  Globe,
  Cookie,
  Database,
  Mail,
  Phone
} from "lucide-react";

export default function Privacy() {
  const lastUpdated = "August 11, 2025";

  const sections = [
    {
      icon: <Database className="h-5 w-5" />,
      title: "Information We Collect",
      content: [
        "Personal details (name, phone number, email, delivery address)",
        "Payment information (processed securely through trusted payment providers)",
        "Prescription documents (where applicable)",
        "Website usage data (cookies, browsing activity)",
        "Device and browser information for security purposes"
      ]
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "How We Use Your Information",
      content: [
        "To process and deliver your orders",
        "To verify prescriptions for restricted medicines",
        "To communicate updates, promotions, or important notices",
        "To improve our products, services, and website experience",
        "To comply with legal and regulatory requirements in Ghana"
      ]
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Data Protection & Security",
      content: [
        "All data is encrypted in transit and at rest using industry-standard protocols",
        "We are HIPAA compliant and maintain appropriate safeguards for health information",
        "Access to your information is restricted to authorized personnel only",
        "Regular security audits and vulnerability assessments are conducted",
        "Secure payment processing through PCI DSS compliant systems"
      ]
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "Information may be shared with healthcare providers as necessary for your care",
        "We may share data with service providers who assist in our operations (under strict confidentiality agreements)",
        "Legal authorities may receive information when required by law or court order",
        "Anonymized, aggregated data may be used for research and analytics"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              At Smile Pills Ltd, your privacy is important to us. Learn how we protect and handle your personal information.
            </p>
            <p className="mt-4 text-blue-200">
              Effective Date: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral mb-3">Our Commitment to Your Privacy</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    At SmilePills, we understand that your health information is deeply personal and sensitive. 
                    This Privacy Policy explains how we collect, use, protect, and share your information when 
                    you use our online pharmacy services.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We are committed to maintaining the highest standards of privacy protection and comply with 
                    all applicable laws, including HIPAA (Health Insurance Portability and Accountability Act) 
                    and state pharmacy regulations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Privacy Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    {section.icon}
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* HIPAA Compliance Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-secondary border-2">
            <CardHeader>
              <CardTitle className="flex items-center text-secondary">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5" />
                </div>
                HIPAA Compliance & Health Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                As a healthcare provider, SmilePills is required to comply with HIPAA regulations. 
                Your Protected Health Information (PHI) is handled with the utmost care and security:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-neutral mb-2">Your Rights Under HIPAA:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Right to access your health information</li>
                    <li>• Right to request corrections to your records</li>
                    <li>• Right to request restrictions on information use</li>
                    <li>• Right to request confidential communications</li>
                    <li>• Right to file complaints</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral mb-2">Our Responsibilities:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Maintain privacy of your health information</li>
                    <li>• Provide notice of privacy practices</li>
                    <li>• Follow the terms of our current notice</li>
                    <li>• Not use or share information except as described</li>
                    <li>• Notify you of breaches if they occur</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cookies and Tracking */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <Cookie className="h-5 w-5 text-orange-600" />
                </div>
                Cookies and Website Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We use cookies and similar technologies to enhance your browsing experience and improve our services:
              </p>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-neutral mb-2">Essential Cookies:</h4>
                  <p className="text-sm text-gray-600">
                    Required for basic website functionality, security, and your shopping cart. 
                    These cannot be disabled without affecting site performance.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral mb-2">Analytics Cookies:</h4>
                  <p className="text-sm text-gray-600">
                    Help us understand how visitors use our website so we can improve navigation and functionality. 
                    No personal health information is included in analytics data.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral mb-2">Marketing Cookies:</h4>
                  <p className="text-sm text-gray-600">
                    Used to show relevant advertisements and measure campaign effectiveness. 
                    You can opt out of these through your browser settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Data Retention and Deletion */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Database className="h-5 w-5 mr-2" />
                  Data Retention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700 text-sm">
                  We retain your information only as long as necessary for the purposes outlined in this policy:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Account information: Until account deletion</li>
                  <li>• Prescription records: 7 years (legal requirement)</li>
                  <li>• Order history: 7 years for tax and audit purposes</li>
                  <li>• Marketing data: Until you opt out</li>
                  <li>• Website analytics: 2 years maximum</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Eye className="h-5 w-5 mr-2" />
                  Your Control Over Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700 text-sm">
                  You have control over your personal information and can:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Update your account information anytime</li>
                  <li>• Request a copy of your data</li>
                  <li>• Delete your account and associated data</li>
                  <li>• Opt out of marketing communications</li>
                  <li>• Control cookie preferences</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Third-Party Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Third-Party Services and Partners
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700">
                We work with trusted partners to provide our services. These partners are bound by strict 
                confidentiality agreements and data protection standards:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-sm mb-2">Payment Processing</h4>
                  <p className="text-xs text-gray-600">Stripe handles all payment data with PCI DSS compliance</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-sm mb-2">Email Services</h4>
                  <p className="text-xs text-gray-600">HIPAA-compliant email providers for prescription notifications</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Database className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-sm mb-2">Cloud Storage</h4>
                  <p className="text-xs text-gray-600">Secure, encrypted database hosting with backup systems</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact and Updates */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-primary border-2">
              <CardHeader>
                <CardTitle className="text-primary">Questions About Privacy?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-sm">
                  If you have questions about this Privacy Policy or how we handle your information, 
                  please contact our Privacy Officer:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm">privacy@smilepills.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm">+1 (555) 123-4567 ext. 101</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Policy Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700 text-sm">
                  We may update this Privacy Policy periodically to reflect changes in our practices 
                  or legal requirements.
                </p>
                <p className="text-gray-700 text-sm">
                  We will notify you of significant changes by email or prominent notice on our website 
                  at least 30 days before the changes take effect.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">
                    <strong>Current Version:</strong> v2.1<br />
                    <strong>Effective Date:</strong> {lastUpdated}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
