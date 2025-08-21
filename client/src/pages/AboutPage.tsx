import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/header";
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
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" 
                    alt="Happy customer" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              
              {/* Central Person Image */}
              <div className="z-20 mx-auto">
                <div className="w-36 h-36 bg-green-400 rounded-full p-2 shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" 
                    alt="Healthcare professional" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              
              {/* Person 2 - Right side */}
              <div className="absolute right-0 bottom-1/4 z-10">
                <div className="w-28 h-28 bg-white rounded-full p-2 shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b353?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" 
                    alt="Satisfied customer" 
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
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
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
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
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
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
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
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Our History"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our history</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Smile Pills Ltd was founded by a certified pharmacy technician with over 4 years of experience in both retail and hospital pharmacy settings. We established our business to meet the growing demand for quality pharmaceutical products and medical supplies in Ghana.
              </p>
              <Button size="lg" variant="outline">
                Our story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Contact Us"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in touch</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Ready to enhance your health journey? Contact our experienced team for product questions, prescription verification, or personalized healthcare guidance.
              </p>
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Contact us
              </Button>
            </div>
          </div>
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
    </div>
  );
}