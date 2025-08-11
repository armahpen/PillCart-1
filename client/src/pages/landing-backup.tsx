import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product/product-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { formatPrice } from "@/lib/currency";
import { 
  ShieldCheck, 
  Truck, 
  Clock, 
  UserCheck, 
  Star,
  ArrowRight,
  Pill,
  Heart,
  Stethoscope,
  Award,
  Search,
  Phone,
  CheckCircle,
  Users,
  Globe,
  ChevronLeft,
  ChevronRight,
  Calculator,
  FileText,
  MapPin,
  MessageCircle
} from "lucide-react";

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch('/api/products?limit=6');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  // Hero carousel slides - Ghana pharmaceutical focus
  const heroSlides = [
    {
      title: "Instantly check stock of your prescription medicines",
      subtitle: "NEW",
      description: "See if we have the medicine you need before you place your order. Serving Ghana with quality pharmaceutical care.",
      buttonText: "Check stock now",
      buttonLink: "/shop",
      buttonText2: "Log in & re-order",
      buttonLink2: "/api/login",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1025&h=724",
      badge: "Licensed Services"
    },
    {
      title: "Free delivery of your prescriptions across Ghana",
      subtitle: "",
      description: "Get your prescriptions delivered to your door across Accra and major cities in Ghana.",
      buttonText: "Find out more",
      buttonLink: "/about",
      buttonText2: "Log in & re-order", 
      buttonLink2: "/api/login",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1025&h=736",
      badge: "Licensed Services"
    },
    {
      title: "Manage prescriptions for the whole family in one account",
      subtitle: "NEW",
      description: "Create a family account and manage all prescriptions from one convenient location.",
      buttonText: "Sign up for free",
      buttonLink: "/api/login",
      buttonText2: "Add a patient",
      buttonLink2: "/api/login",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1025&h=736",
      badge: "Licensed Services"
    },
    {
      title: "Professional pharmaceutical care from certified technicians",
      subtitle: "Save ₵40",
      description: "Get expert consultation and pharmaceutical care from our certified pharmacy technicians with over 4+ years experience.",
      buttonText: "Book consultation",
      buttonLink: "/contact",
      buttonText2: "",
      buttonLink2: "",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1406&h=1441",
      badge: ""
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Carousel Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
        <div className="relative h-[600px] md:h-[650px]">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="grid lg:grid-cols-2 gap-8 h-full items-center">
                  <div className="space-y-6 lg:pr-8">
                    {slide.subtitle && (
                      <Badge className="bg-secondary text-white px-3 py-1">
                        {slide.subtitle}
                      </Badge>
                    )}
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral leading-tight">
                      {slide.title}
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                      {slide.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href={slide.buttonLink}>
                        <Button 
                          size="lg" 
                          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold"
                        >
                          {slide.buttonText}
                        </Button>
                      </Link>
                      
                      {slide.buttonText2 && (
                        <Link href={slide.buttonLink2}>
                          <Button 
                            variant="outline" 
                            size="lg"
                            className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg font-semibold"
                          >
                            {slide.buttonText2}
                          </Button>
                        </Link>
                      )}
                    </div>
                    
                    {slide.badge && (
                      <div className="flex items-center space-x-2">
                        <img 
                          src="/assets/pharmacy-badge.svg" 
                          alt="Licensed Services" 
                          className="h-8"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span className="text-sm text-gray-600">{slide.badge}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative lg:pl-8">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-auto max-h-96 object-cover rounded-2xl shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Carousel Navigation */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-secondary" />
                </div>
              </div>
              <h3 className="font-semibold text-neutral mb-2">Excellent Service Rating</h3>
              <p className="text-gray-600 text-sm">4+ years serving Ghana</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-neutral mb-2">Trusted Licensed Partner</h3>
              <p className="text-gray-600 text-sm">Certified pharmacy technician</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Pill className="h-8 w-8 text-secondary" />
                </div>
              </div>
              <h3 className="font-semibold text-neutral mb-2">Regulated Pharmacy</h3>
              <p className="text-gray-600 text-sm">Licensed pharmaceutical business</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-neutral mb-2">Serving Ghana</h3>
              <p className="text-gray-600 text-sm">East Legon Hills, Accra</p>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral mb-4">
              Welcome to Ghana's trusted online pharmacy
            </h2>
            <h3 className="text-xl text-gray-600 font-semibold">
              What would you like to do today?
            </h3>
          </div>
          
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Manage Prescriptions */}
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-neutral mb-4">
                  Manage my prescription
                </h3>
              </div>
              
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="text-primary hover:underline">Find out more</Link></li>
                <li><Link href="/api/login" className="text-primary hover:underline">Order your prescription</Link></li>
                <li><Link href="/api/login" className="text-primary hover:underline">Track your orders</Link></li>
                <li><Link href="/shop" className="text-primary hover:underline">Check medicine stock</Link></li>
              </ul>
              
              <div className="mt-6 text-center">
                <span className="text-sm text-gray-600">Join Smile Pills today</span>
              </div>
            </div>

            {/* Professional Consultation */}
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-neutral mb-4">
                  Professional consultation
                </h3>
              </div>
              
              <ul className="space-y-3 text-sm">
                <li><Link href="/contact" className="text-primary hover:underline">Book consultation</Link></li>
                <li><Link href="/contact" className="text-primary hover:underline">Find out how it works</Link></li>
                <li><Link href="/contact" className="text-primary hover:underline">Speak with pharmacist</Link></li>
                <li><Link href="/contact" className="text-primary hover:underline">Get health advice</Link></li>
              </ul>
              
              <div className="mt-6 text-center">
                <Link href="/contact">
                  <Button variant="outline" size="sm" className="text-xs">
                    Visit Consultation
                  </Button>
                </Link>
              </div>
            </div>

            {/* Shop Health Products */}
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-neutral mb-4">
                  Shop health & wellness
                </h3>
              </div>
              
              <ul className="space-y-3 text-sm">
                <li><Link href="/shop" className="text-primary hover:underline">Order great products</Link></li>
                <li><Link href="/shop" className="text-primary hover:underline">Shop health essentials</Link></li>
                <li><Link href="/shop" className="text-primary hover:underline">Shop latest offers</Link></li>
                <li><Link href="/api/login" className="text-primary hover:underline">Track your orders</Link></li>
                <li><Link href="/api/login" className="text-primary hover:underline">View your account</Link></li>
              </ul>
              
              <div className="mt-6 text-center">
                <Link href="/shop">
                  <Button variant="outline" size="sm" className="text-xs">
                    Explore the shop
                  </Button>
                </Link>
              </div>
            </div>

            {/* Free Health Services */}
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-neutral mb-4">
                  Use our health services
                </h3>
              </div>
              
              <ul className="space-y-3 text-sm">
                <li><Link href="/contact" className="text-primary hover:underline">Health consultation</Link></li>
                <li><Link href="/contact" className="text-primary hover:underline">Find expert healthcare advice</Link></li>
                <li><Link href="/contact" className="text-primary hover:underline">Pharmacy services</Link></li>
                <li><Link href="/contact" className="text-primary hover:underline">Get medicine advice</Link></li>
              </ul>
              
              <div className="mt-6 text-center">
                <Link href="/contact">
                  <Button variant="outline" size="sm" className="text-xs">
                    View Health Services
                  </Button>
                </Link>
              </div>
            </div>

            {/* Contact & Support */}
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-neutral mb-4">
                  Contact & support
                </h3>
              </div>
              
              <ul className="space-y-3 text-sm">
                <li><Link href="/contact" className="text-primary hover:underline">WhatsApp support</Link></li>
                <li><Link href="/contact" className="text-primary hover:underline">Call: 0544137947</Link></li>
                <li><Link href="/contact" className="text-primary hover:underline">Email support</Link></li>
                <li><Link href="/contact" className="text-primary hover:underline">Visit our location</Link></li>
              </ul>
              
              <div className="mt-6 text-center">
                <Link href="/contact">
                  <Button variant="outline" size="sm" className="text-xs">
                    Get Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Tools Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral mb-4">
              Putting you in control with our free health tools
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=699&h=269"
                alt="Health Hub"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-neutral mb-4">Health Hub</h3>
              <p className="text-gray-600 mb-6">
                Access reliable health advice and guidance reviewed by our healthcare professionals
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Link href="/contact" className="text-primary hover:underline font-medium">
                  Heart Health
                </Link>
                <Link href="/contact" className="text-primary hover:underline font-medium">
                  Weight Management  
                </Link>
                <Link href="/contact" className="text-primary hover:underline font-medium">
                  Digestive Health
                </Link>
                <Link href="/contact" className="text-primary hover:underline font-medium">
                  Mental Health
                </Link>
                <Link href="/contact" className="text-primary hover:underline font-medium">
                  Women's Health
                </Link>
                <Link href="/contact" className="text-primary hover:underline font-medium">
                  Men's Health
                </Link>
              </div>
              
              <Link href="/contact">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Visit Health Hub
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Health Tools Grid */}
          <div className="grid md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold text-neutral mb-2">Medicine Stock Checker</h4>
              <p className="text-sm text-gray-600 mb-4">
                See if we have the medicine you need before you place a prescription request.
              </p>
              <Link href="/shop" className="text-primary hover:underline font-medium">
                Check stock now
              </Link>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-secondary" />
              </div>
              <h4 className="font-semibold text-neutral mb-2">Local services finder</h4>
              <Link href="/contact" className="text-primary hover:underline font-medium">
                Search now
              </Link>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold text-neutral mb-2">Health Conditions A-Z Directory</h4>
              <Link href="/contact" className="text-primary hover:underline font-medium">
                Explore conditions
              </Link>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-secondary" />
              </div>
              <h4 className="font-semibold text-neutral mb-2">Health Calculator</h4>
              <Link href="/contact" className="text-primary hover:underline font-medium">
                Calculate now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral mb-4">
                Access leading brands at great value
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 6).map((product: any) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  variant="grid"
                />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Help & Support Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1424&h=618"
                alt="Help and Support"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              
              <h3 className="text-2xl font-bold text-neutral mt-6 mb-4">Help and Support</h3>
              <p className="text-gray-600 mb-6">
                We're here when you need us. Our Help & Support hub has everything you need to find answers to commonly asked questions and you can contact our dedicated team.
              </p>
              
              <ul className="space-y-3">
                <li><Link href="/api/login" className="text-primary hover:underline">My account</Link></li>
                <li><Link href="/contact" className="text-primary hover:underline">Orders & delivery</Link></li>
                <li><Link href="/contact" className="text-primary hover:underline">Payments & support</Link></li>
                <li><Link href="/contact" className="text-primary hover:underline">Health FAQs</Link></li>
                <li><Link href="/contact" className="text-primary hover:underline">Contact us</Link></li>
              </ul>
            </div>
            
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-neutral mb-4">About Smile Pills Ltd</h3>
                <p className="text-gray-600 mb-6">
                  Founded by a certified pharmacy technician with over 4+ years of experience in both retail and hospital pharmacy settings, serving the pharmaceutical needs of Ghana.
                </p>
                
                <ul className="space-y-3">
                  <li><Link href="/about" className="text-primary hover:underline">About us</Link></li>
                  <li><Link href="/about" className="text-primary hover:underline">Our mission</Link></li>
                  <li><Link href="/contact" className="text-primary hover:underline">Meet the team</Link></li>
                  <li><Link href="/contact" className="text-primary hover:underline">Contact us</Link></li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-neutral mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Phone:</strong> 0544137947 | +233 209339912</p>
                  <p><strong>Email:</strong> smilepills21@gmail.com</p>
                  <p><strong>Location:</strong> East Legon Hills, Accra, Ghana</p>
                  <p><strong>Hours:</strong> Monday – Saturday, 24/7</p>
                  <Link 
                    href="https://wa.me/message/GKIVR7F2FJPJE1" 
                    target="_blank"
                    className="inline-block mt-3 text-primary hover:underline font-medium"
                  >
                    WhatsApp Support →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}