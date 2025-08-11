import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Award, 
  Shield, 
  Heart, 
  Target,
  CheckCircle,
  Stethoscope,
  Pill
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Patient-Centered Care",
      description: "We put our patients' health and well-being at the center of everything we do, ensuring personalized care and attention."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Safety & Quality",
      description: "All our medications are sourced from licensed manufacturers and undergo rigorous quality control processes."
    },
    {
      icon: <Users className="h-8 w-8 text-secondary" />,
      title: "Professional Expertise",
      description: "Our team of licensed pharmacists and healthcare professionals are available 24/7 to provide expert guidance."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      title: "Accessibility",
      description: "We make healthcare accessible to everyone through competitive pricing and convenient online services."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "10,000+", label: "Products Available" },
    { number: "24/7", label: "Customer Support" },
    { number: "99.9%", label: "Customer Satisfaction" }
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Pharmacist",
      credentials: "PharmD, RPh",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&h=300",
      bio: "15+ years of experience in clinical pharmacy and medication management."
    },
    {
      name: "Dr. Michael Chen",
      role: "Clinical Pharmacist",
      credentials: "PharmD, BCPS",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&h=300",
      bio: "Specialist in infectious diseases and antimicrobial stewardship."
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Consultant Pharmacist",
      credentials: "PharmD, CGP",
      image: "https://images.unsplash.com/photo-1594824475520-b8a2b6b219e8?auto=format&fit=crop&w=300&h=300",
      bio: "Expert in geriatric pharmacy and medication therapy management."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About SmilePills</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner in health and wellness, committed to providing quality medications 
              and exceptional pharmaceutical care to communities worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-neutral mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                At SmilePills, we believe that everyone deserves access to quality healthcare and medications. 
                Our mission is to bridge the gap between patients and pharmacy services by providing a 
                convenient, secure, and professional online platform.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span className="text-gray-700">FDA-approved medications only</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span className="text-gray-700">Licensed pharmacists available 24/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span className="text-gray-700">Secure and confidential service</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span className="text-gray-700">Fast and reliable delivery</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=600&h=400"
                alt="Modern pharmacy interior"
                className="rounded-2xl shadow-lg w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-gray-600">Our commitment to excellence speaks through our achievements</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral mb-4">Meet Our Expert Team</h2>
            <p className="text-xl text-gray-600">Licensed pharmacists dedicated to your health and well-being</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-lg text-neutral">{member.name}</h3>
                  <p className="text-primary font-medium mb-1">{member.role}</p>
                  <Badge variant="outline" className="mb-3">{member.credentials}</Badge>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral mb-4">Certifications & Compliance</h2>
            <p className="text-xl text-gray-600">We meet the highest standards in pharmaceutical care</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">FDA Approved</h3>
                <p className="text-gray-600 text-sm">
                  All medications sourced from FDA-approved manufacturers with proper licensing.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">HIPAA Compliant</h3>
                <p className="text-gray-600 text-sm">
                  Your health information is protected with the highest security standards.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Pill className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">State Licensed</h3>
                <p className="text-gray-600 text-sm">
                  Licensed to operate in multiple states with qualified pharmacist oversight.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
