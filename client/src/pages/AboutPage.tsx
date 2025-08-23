import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/layout/header";
import Chatbot from "@/components/chatbot/Chatbot";
import { 
  Shield, 
  Users, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Award,
  Star,
  ArrowRight 
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cyan-400 to-blue-500 py-12 lg:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-2xl z-10 relative">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                About us
              </h1>
              <p className="text-base lg:text-lg text-white/95 mb-6 leading-relaxed">
                Our purpose is to enhance health outcomes across Ghana, providing quality, affordable, and accessible medicines with trust, innovation, and exceptional service when it matters most.
              </p>
              
              {/* Rating Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-semibold text-white">Excellent</span>
                  <div className="flex text-yellow-300">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-white/90">
                  <span className="font-medium">500+</span> reviews on 
                  <span className="font-medium"> Trustpilot</span>
                </p>
              </div>
              
              <p className="text-sm lg:text-base font-medium text-white/95 italic">
                Smile Forever – delivering health with trust, quality, and convenience
              </p>
            </div>
            
            {/* Visual Elements Section */}
            <div className="relative h-96 lg:h-[400px] flex items-center justify-center">
              {/* Person 1 - Left side with Pink Frame */}
              <div className="absolute left-0 top-1/4 z-10">
                <div className="w-32 h-32 bg-pink-500 rounded-full p-2 shadow-lg">
                  <img 
                    src="/attached_assets/two-african-american-pharmacist-working-drugstore-hospital-pharmacy-african-healthcare_1755808621831.jpg" 
                    alt="African American pharmacists working in hospital pharmacy" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              
              {/* Central Person Image */}
              <div className="z-20 mx-auto">
                <div className="w-36 h-36 bg-green-400 rounded-full p-2 shadow-xl">
                  <img 
                    src="/attached_assets/cheerful-ethnic-doctor-with-arms-crossed_1755808621834.jpg" 
                    alt="Cheerful ethnic doctor with arms crossed" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              
              {/* Person 2 - Right side */}
              <div className="absolute right-0 bottom-1/4 z-10">
                <div className="w-28 h-28 bg-white rounded-full p-2 shadow-xl">
                  <img 
                    src="/attached_assets/african-american-woman-pharmacist-smiling-confident-standing-pharmacy_1755808621834.jpg" 
                    alt="African American woman pharmacist smiling confidently in pharmacy" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              
              {/* Decorative yellow element */}
              <div className="absolute top-8 right-1/4 w-16 h-16 bg-yellow-400 rounded-full opacity-90 z-5"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Licensed Pharmacy</h3>
              <p className="text-gray-600">Certified pharmacy technician with 4+ years experience</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Trusted Partner</h3>
              <p className="text-gray-600">Full compliance with healthcare regulations</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Serving Ghana</h3>
              <p className="text-gray-600">Quality healthcare solutions nationwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get to Know Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Get to know Smile Pills Ltd
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're Ghana's trusted pharmaceutical wholesale and medical supplies company, working to provide quality, affordable, and accessible medicines. 
            Scroll down to see how we support our patients and customers nationwide.
          </p>
        </div>
      </section>

      {/* Service Sections */}
      {/* Pharmaceutical Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://drive.google.com/uc?export=view&id=1GHwe8W3TfwtEGiUiRblhOrUY8NsV8NbJ"
                alt="Quality Pharmaceutical Products"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Quality Medicines</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Browse our extensive catalog of quality medicines and medical supplies. From prescription medications to over-the-counter products, we ensure the highest standards in product sourcing, handling, and distribution.
              </p>
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Shop now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Prescription Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <img
                src="https://drive.google.com/uc?export=view&id=1me6tSU1YgGBH9wGVfIxvdzL8KdvDo-Y2"
                alt="Prescription Verification Services"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Prescription Verification</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Professional prescription verification services with our certified pharmacy technicians. We ensure all prescription medicines are dispensed safely and according to healthcare regulations and best practices.
              </p>
              <Button size="lg" variant="outline">
                Find out more
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://drive.google.com/uc?export=view&id=1xXppxjWBpdZzFacAG9o8HEemyNOjCujW"
                alt="Fast and Reliable Delivery"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Fast & Reliable Delivery</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Reliable delivery across Ghana with secure handling of pharmaceutical products. We provide same-day delivery in Accra and typically complete orders within 1–3 working days nationwide.
              </p>
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Find out more
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Support */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <img
                src="https://drive.google.com/uc?export=view&id=1nI5O-KFeo5G7roahL_Sot03Ru4MzLeHT"
                alt="24/7 Customer Support"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">24/7 Customer Support</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Get expert guidance and support from our experienced pharmacy team. Available Monday – Saturday, 24/7 to help with product questions, prescription verification, and order assistance.
              </p>
              <Button size="lg" variant="outline">
                Get support
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our vision and mission</h2>
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
            <blockquote className="text-xl lg:text-2xl text-gray-700 italic leading-relaxed mb-6">
              "Our aim is to be Ghana's leading pharmaceutical and medical supplies provider, integrating innovation and excellence in community pharmacy. Quality, trust, and exceptional service drive us forward to deliver the best healthcare solutions possible. We exist to help our customers manage their health with confidence, choice, and convenience."
            </blockquote>
            <cite className="text-lg font-semibold text-gray-900">
              Founder & Licensed Pharmacy Technician, Smile Pills Ltd
            </cite>
          </div>
        </div>
      </section>

      {/* Our History Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our history</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Smile Pills Ltd was founded by a certified pharmacy technician with over 4 years of experience in both retail and hospital pharmacy settings. We established our business to meet the growing demand for quality pharmaceutical products and medical supplies in Ghana.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="contact-support">
              <AccordionTrigger className="text-left">How can I contact customer support?</AccordionTrigger>
              <AccordionContent>
                You can reach our customer support team via email at smilepills21@gmail.com, by phone at 0544137947 or +233 209339912, or through WhatsApp. Our team is available Monday through Saturday, 24/7.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="medication-safety">
              <AccordionTrigger className="text-left">Are your medications safe?</AccordionTrigger>
              <AccordionContent>
                All our medications undergo rigorous testing and comply with regulatory standards set by agencies like the FDA and EMA to ensure safety, efficacy, and quality.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="medication-info">
              <AccordionTrigger className="text-left">How can I find information about a specific medication?</AccordionTrigger>
              <AccordionContent>
                Visit the "Shop" section on our website to browse our medication catalog. Each product page includes detailed information about uses, dosage, side effects, and precautions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="generic-medications">
              <AccordionTrigger className="text-left">Do you offer generic medications?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer a range of generic medications that are bioequivalent to brand-name drugs, providing cost-effective options without compromising quality.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="prescription-required">
              <AccordionTrigger className="text-left">Do I need a prescription to order medications?</AccordionTrigger>
              <AccordionContent>
                Most of our medications require a valid prescription from a licensed healthcare provider. Some over-the-counter (OTC) products may be purchased without a prescription.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ordering-process">
              <AccordionTrigger className="text-left">How can I order medications from your website?</AccordionTrigger>
              <AccordionContent>
                To order, browse our product catalog, select your medication, upload a valid prescription (if required), and follow the checkout process. Orders are processed securely, and shipping details will be provided.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="international-delivery">
              <AccordionTrigger className="text-left">Can I get my medication delivered internationally?</AccordionTrigger>
              <AccordionContent>
                Currently we primarily serve customers in Ghana with same-day delivery in Accra and typically complete orders within 1–3 working days nationwide. Please contact us for specific international shipping requests.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="side-effects">
              <AccordionTrigger className="text-left">What should I do if I experience side effects?</AccordionTrigger>
              <AccordionContent>
                If you experience any side effects, contact your healthcare provider immediately. You can also report adverse effects to us via our website or by calling our support line.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="medication-suitability">
              <AccordionTrigger className="text-left">How do I know if a medication is right for me?</AccordionTrigger>
              <AccordionContent>
                Always consult your doctor or pharmacist before starting any new medication to ensure it is appropriate for your health condition and medical history.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="return-policy">
              <AccordionTrigger className="text-left">What is your return policy?</AccordionTrigger>
              <AccordionContent>
                Due to the nature of pharmaceutical products, returns are generally not accepted unless the product is damaged or incorrect. Please contact our support team for assistance.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="refund-request">
              <AccordionTrigger className="text-left">How do I request a refund?</AccordionTrigger>
              <AccordionContent>
                If eligible, you can request a refund by contacting our customer support team within 7 days of receiving your order. Provide your order number and details of the issue.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-security">
              <AccordionTrigger className="text-left">Is my personal information safe?</AccordionTrigger>
              <AccordionContent>
                We prioritize your privacy and use industry-standard encryption to protect your personal and payment information. We comply with all applicable data protection regulations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="prescription-data">
              <AccordionTrigger className="text-left">How do you handle prescription data?</AccordionTrigger>
              <AccordionContent>
                Prescription data is securely stored and only shared with authorized personnel to process your order. We comply with all applicable data protection regulations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="health-resources">
              <AccordionTrigger className="text-left">Where can I learn more about health conditions?</AccordionTrigger>
              <AccordionContent>
                Our website features health information and guidance. For specific medical advice, always consult with qualified healthcare professionals.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="discounts">
              <AccordionTrigger className="text-left">Do you offer discounts or patient assistance programs?</AccordionTrigger>
              <AccordionContent>
                Yes, we provide discounts and patient assistance programs for eligible customers. Contact our support team for more information about available programs and eligibility requirements.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Key Company Information */}
      <section className="py-12 bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Key company information</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Head office address:</p>
                      <p className="text-gray-600">East Legon Hills, Accra, Ghana</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Phone:</p>
                      <p className="text-gray-600">0544137947 | +233 209339912</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Email:</p>
                      <p className="text-gray-600">smilepills21@gmail.com</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Operating hours:</p>
                      <p className="text-gray-600">Monday – Saturday, 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Licensed pharmacy:</p>
                      <p className="text-gray-600">Certified pharmacy technician</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Experience:</p>
                      <p className="text-gray-600">4+ years in retail & hospital pharmacy</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Chatbot />
    </div>
  );
}