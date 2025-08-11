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
  ArrowLeft,
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
    queryKey: ["/api/products", { limit: 6 }],
    retry: false,
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
    retry: false,
  });

  // Hero carousel slides
  const heroSlides = [
    {
      title: "Instantly check stock of your prescription medicines",
      subtitle: "NEW",
      description: "See if we have the medicine you need before you place a prescription request.",
      buttonText: "Check stock now",
      buttonLink: "/shop",
      buttonText2: "Log in & re-order",
      buttonLink2: "/api/login",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1025&h=724",
      badge: "Licensed Services"
    },
    {
      title: "Free home delivery of your repeat prescriptions",
      subtitle: "",
      description: "Get your repeat prescriptions delivered to your door for free across Ghana.",
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
      description: "Add family members to your account and manage all prescriptions in one place.",
      buttonText: "Sign up for free",
      buttonLink: "/api/login",
      buttonText2: "Add a patient",
      buttonLink2: "/api/login",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1025&h=736",
      badge: "Licensed Services"
    },
    {
      title: "Expert pharmaceutical consultation",
      subtitle: "Save ¢40: from ¢85 for your first consultation",
      description: "Connect with our certified pharmacists for professional health advice and prescription guidance.",
      buttonText: "Find out more",
      buttonLink: "/contact",
      buttonText2: "",
      buttonLink2: "",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1406&h=1441",
      badge: "Licensed Services"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Carousel Section */}
      <section className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {heroSlides.map((slide, index) => (
                <div key={index} className="min-w-full">
                  <div className="grid lg:grid-cols-2 gap-8 items-center p-8 lg:p-16">
                    {/* Content */}
                    <div className="space-y-6">
                      {slide.subtitle && (
                        <Badge variant="secondary" className="bg-secondary text-white font-medium">
                          {slide.subtitle}
                        </Badge>
                      )}
                      
                      <h1 className="text-4xl lg:text-5xl font-bold text-neutral leading-tight">
                        {slide.title}
                      </h1>
                      
                      <p className="text-xl text-gray-600 leading-relaxed">
                        {slide.description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link href={slide.buttonLink}>
                          <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-8">
                            {slide.buttonText}
                          </Button>
                        </Link>
                        
                        {slide.buttonText2 && (
                          <Link href={slide.buttonLink2}>
                            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8">
                              {slide.buttonText2}
                            </Button>
                          </Link>
                        )}
                      </div>
                      
                      {/* Trust indicators */}
                      <div className="flex items-center space-x-8 pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">Excellent</div>
                          <div className="flex items-center justify-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-green-500 fill-current" />
                            ))}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-700">1,000+ reviews on</div>
                          <div className="text-lg font-bold text-primary">Trustpilot</div>
                        </div>
                      </div>
                      

                    </div>
                    
                    {/* Image */}
                    <div className="relative">
                      <img 
                        src={slide.image}
                        alt={slide.title}
                        className="rounded-lg shadow-lg w-full h-auto max-w-lg mx-auto"
                      />
                      {slide.badge && (
                        <div className="absolute bottom-4 left-4">
                          <Badge variant="secondary" className="bg-primary text-white px-3 py-1">
                            {slide.badge}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
            
            {/* Dots indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-primary' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white text-orange-600 font-bold px-3 py-1">
                UP TO 33% OFF
              </Badge>
              <h3 className="text-lg font-bold">
                Real solutions for real health concerns with premium brands and more
              </h3>
            </div>
            <Link href="/shop">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                Shop now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-sm">Excellent Trustpilot rating</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-sm">Licensed pharmaceutical partner</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">Regulated pharmacy</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-sm">Serving 1,000+ patients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Ghana's leading online pharmacy
            </h2>
            <h3 className="text-xl font-semibold text-gray-700 mb-8">
              What would you like to do today?
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Prescription Management */}
            <Card className="group hover:shadow-lg transition-shadow duration-300 bg-white">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Pill className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-3">Manage my prescription</h3>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li><Link href="/about" className="hover:text-primary">Find out more</Link></li>
                  <li><Link href="/api/login" className="hover:text-primary">Order your prescription</Link></li>
                  <li><Link href="/api/login" className="hover:text-primary">Track your orders</Link></li>
                  <li><Link href="/shop" className="hover:text-primary">Check medicine stock</Link></li>
                </ul>
                <Link href="/api/login" className="text-primary font-medium text-sm hover:underline">
                  Join Smile Pills today
                </Link>
              </CardContent>
            </Card>

            {/* Pharmacy Consultation */}
            <Card className="group hover:shadow-lg transition-shadow duration-300 bg-white">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Stethoscope className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-3">Explore pharmacist support</h3>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li><Link href="/contact" className="hover:text-primary">View consultation services</Link></li>
                  <li><Link href="/contact" className="hover:text-primary">Find out how it works</Link></li>
                  <li><Link href="/contact" className="hover:text-primary">Book consultation</Link></li>
                  <li><Link href="/contact" className="hover:text-primary">Prescription guidance</Link></li>
                </ul>
                <Link href="/contact" className="text-primary font-medium text-sm hover:underline">
                  Visit Pharmacy Support
                </Link>
              </CardContent>
            </Card>

            {/* Shop Health Products */}
            <Card className="group hover:shadow-lg transition-shadow duration-300 bg-white">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold mb-3">Shop health and wellness</h3>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li><Link href="/shop" className="hover:text-primary">Order quality products</Link></li>
                  <li><Link href="/shop" className="hover:text-primary">Shop health essentials</Link></li>
                  <li><Link href="/shop" className="hover:text-primary">Shop latest offers</Link></li>
                  <li><Link href="/api/login" className="hover:text-primary">Track your orders</Link></li>
                </ul>
                <Link href="/shop" className="text-primary font-medium text-sm hover:underline">
                  Explore the shop
                </Link>
              </CardContent>
            </Card>

            {/* Licensed Services */}
            <Card className="group hover:shadow-lg transition-shadow duration-300 bg-white">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-3">Use our licensed services</h3>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li><Link href="/about" className="hover:text-primary">Prescription verification</Link></li>
                  <li><Link href="/contact" className="hover:text-primary">Find expert healthcare advice</Link></li>
                  <li><Link href="/contact" className="hover:text-primary">Pharmacy First service</Link></li>
                  <li><Link href="/about" className="hover:text-primary">Get new medicine advice</Link></li>
                </ul>
                <Link href="/about" className="text-primary font-medium text-sm hover:underline">
                  View Licensed Services
                </Link>
              </CardContent>
            </Card>

            {/* Health Management */}
            <Card className="group hover:shadow-lg transition-shadow duration-300 bg-white">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-3">Manage your family's health</h3>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li><Link href="/api/login" className="hover:text-primary">Family account setup</Link></li>
                  <li><Link href="/about" className="hover:text-primary">Health monitoring tools</Link></li>
                  <li><Link href="/shop" className="hover:text-primary">Shop health products</Link></li>
                  <li><Link href="/api/login" className="hover:text-primary">Track family orders</Link></li>
                </ul>
                <Link href="/api/login" className="text-primary font-medium text-sm hover:underline">
                  Manage Family Health
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Free Health Tools Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Putting you in control with our free health tools
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            {/* Health Hub */}
            <div>
              <img 
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
                alt="Health Hub"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Health Hub</h3>
              <p className="text-gray-600">
                Access reliable health advice and guidance reviewed by our healthcare professionals
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <Link href="/about" className="text-primary hover:underline font-medium">
                  Heart Health
                </Link>
                <Link href="/about" className="text-primary hover:underline font-medium">
                  Weight Management
                </Link>
                <Link href="/about" className="text-primary hover:underline font-medium">
                  Digestive Health
                </Link>
                <Link href="/about" className="text-primary hover:underline font-medium">
                  Mental Health
                </Link>
                <Link href="/about" className="text-primary hover:underline font-medium">
                  Women's Health
                </Link>
                <Link href="/about" className="text-primary hover:underline font-medium">
                  Men's Health
                </Link>
              </div>
              
              <Link href="/about" className="inline-block text-primary font-semibold hover:underline">
                Visit Health Hub
              </Link>
            </div>
          </div>
          
          {/* Medicine Stock Checker */}
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-8 rounded-lg mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Medicine Stock Checker</h3>
                <p className="text-blue-100">
                  See if we have the medicine you need before you place a prescription request.
                </p>
              </div>
              <Link href="/shop">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Check stock now
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Local services finder</h3>
              <Link href="/contact">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Search now
                </Button>
              </Link>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Health Conditions A-Z Directory</h3>
              <Link href="/about">
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                  Explore conditions
                </Button>
              </Link>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Medicines A-Z Directory</h3>
              <Link href="/shop">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Browse medicines
                </Button>
              </Link>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Health Calculator</h3>
              <Link href="/about">
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                  Calculate now
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Access leading brands at great value</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link href="/shop?category=baby-child">
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-white">
                <CardContent className="p-0">
                  <img 
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                    alt="Baby & Child"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">Baby & Child Essentials</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/shop?category=oral-care">
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-white">
                <CardContent className="p-0">
                  <img 
                    src="https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                    alt="Oral Care"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">Oral Care</h3>
                    <Badge className="bg-red-500 text-white">Better Than Half Price</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/shop?category=allergy">
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-white">
                <CardContent className="p-0">
                  <img 
                    src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                    alt="Allergy Relief"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">Allergy Relief</h3>
                    <Badge className="bg-primary text-white">From ¢8</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/shop?category=hair-care">
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-white">
                <CardContent className="p-0">
                  <img 
                    src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                    alt="Healthy Hair"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">Healthy Hair</h3>
                    <Badge className="bg-secondary text-white">UP TO 33% OFF</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/shop/clearance">
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-red-500 text-white">
                <CardContent className="p-8 flex items-center justify-center h-48">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">UP TO 60% OFF</div>
                    <div className="text-xl">SALE</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts && Array.isArray(featuredProducts) && featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-neutral mb-4">Featured Products</h2>
              <p className="text-xl text-gray-600">Our most popular health and wellness products</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredProducts as any[]).slice(0, 6).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/shop">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}



      {/* Jump Straight In Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Jump straight in...find advice, apps and health tools here
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Help & Support */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
                  alt="Help and Support"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Help and Support</h3>
                <p className="text-gray-600">
                  We're here when you need us. Our Help & Support hub has everything you need 
                  to find answers to commonly asked questions and you can contact our dedicated team.
                </p>
                
                <div className="space-y-2 text-sm">
                  <Link href="/api/login" className="block text-primary hover:underline">
                    My account
                  </Link>
                  <Link href="/contact" className="block text-primary hover:underline">
                    Orders & delivery
                  </Link>
                  <Link href="/about" className="block text-primary hover:underline">
                    Payments & prescriptions
                  </Link>
                  <Link href="/contact" className="block text-primary hover:underline">
                    Health FAQs
                  </Link>
                  <Link href="/about" className="block text-primary hover:underline">
                    FAQs
                  </Link>
                </div>
              </div>
            </div>

            {/* About Us */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">Smile Pills Ltd</h3>
                <p className="text-sm text-gray-600">Smile Forever – delivering health with trust, quality, and convenience</p>
              </div>
              
              <h4 className="text-xl font-bold text-gray-900">About us</h4>
              <p className="text-gray-600">
                From licensed pharmaceutical services to comprehensive healthcare solutions, 
                we proudly serve customers across Ghana with quality medicines and expert advice.
              </p>
              
              <div className="space-y-2 text-sm">
                <Link href="/about" className="block text-primary hover:underline">
                  About us
                </Link>
                <Link href="/about" className="block text-primary hover:underline">
                  Our Mission & Vision
                </Link>
                <Link href="/about" className="block text-primary hover:underline">
                  Meet the team
                </Link>
                <Link href="/privacy" className="block text-primary hover:underline">
                  Privacy Policy
                </Link>
                <Link href="/contact" className="block text-primary hover:underline">
                  Contact & Location
                </Link>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3 text-primary" />
                  <span>East Legon Hills, Accra, Ghana</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-secondary" />
                  <span>0544137947 | +233 209339912</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-3 text-primary" />
                  <span>smilepills21@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-3 text-secondary" />
                  <span>Monday-Saturday, 24/7 support</span>
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