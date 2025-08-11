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
  ChevronRight
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
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      badge: "Stock Checker"
    },
    {
      title: "Free home delivery of your prescription medicines",
      subtitle: "NHS SERVICE",
      description: "Get your NHS repeat prescriptions delivered to your door for free across Ghana.",
      buttonText: "Find out more",
      buttonLink: "/about",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      badge: "Providing NHS Services"
    },
    {
      title: "Manage prescriptions for the whole family",
      subtitle: "NEW",
      description: "Add family members to your account and manage all prescriptions in one place.",
      buttonText: "Sign up for free",
      buttonLink: "/api/login",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      badge: "Family Accounts"
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
                          <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                            {slide.buttonText}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                        
                        {index === 0 && (
                          <Link href="/api/login">
                            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                              Log in & re-order
                            </Button>
                          </Link>
                        )}
                      </div>
                      
                      {/* Trust indicators */}
                      <div className="flex items-center space-x-6 pt-4">
                        <div className="flex items-center space-x-2">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">Excellent</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">4.5 rating</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          1,000+ reviews
                        </div>
                      </div>
                      
                      {slide.badge && (
                        <div className="pt-4">
                          <Badge variant="outline" className="text-xs text-secondary border-secondary">
                            {slide.badge}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    {/* Image */}
                    <div className="relative">
                      <img 
                        src={slide.image}
                        alt={slide.title}
                        className="rounded-2xl shadow-xl w-full h-auto max-w-lg mx-auto"
                      />
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

      {/* Trust Indicators Bar */}
      <section className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Excellent rating</div>
                <div className="text-xs text-gray-600">Trustpilot</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Licensed pharmacy</div>
                <div className="text-xs text-gray-600">Ghana certified</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Serving 10,000+</div>
                <div className="text-xs text-gray-600">Happy customers</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <Truck className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Ghana delivery</div>
                <div className="text-xs text-gray-600">Fast & reliable</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral mb-4">
              Welcome to Ghana's leading online pharmacy
            </h2>
            <p className="text-xl text-gray-600 font-medium mb-8">
              What would you like to do today?
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Prescription Management */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Pill className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Manage my prescription</h3>
                <ul className="space-y-3 text-sm text-gray-600 mb-6 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    Find out more about prescriptions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    Order your prescription
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    Track your orders
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    Check medicine stock
                  </li>
                </ul>
                <Link href="/shop?category=prescription-drugs">
                  <Button className="w-full bg-primary text-white hover:bg-primary/90">
                    Order Prescription
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Online Doctor */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Stethoscope className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Consult our pharmacists</h3>
                <ul className="space-y-3 text-sm text-gray-600 mb-6 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    Professional consultation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    Health condition advice
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    Medicine information
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    24/7 support available
                  </li>
                </ul>
                <Link href="/contact">
                  <Button className="w-full bg-secondary text-white hover:bg-secondary/90">
                    Get Consultation
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Shop Health Products */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Shop health & wellness</h3>
                <ul className="space-y-3 text-sm text-gray-600 mb-6 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    Browse quality products
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    Latest health offers
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    Track your orders
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    Fast Ghana delivery
                  </li>
                </ul>
                <Link href="/shop">
                  <Button className="w-full bg-primary text-white hover:bg-primary/90">
                    Explore Shop
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral mb-4">Access leading brands at great value</h2>
            <p className="text-xl text-gray-600">Shop our most popular categories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/shop?category=prescription-drugs">
              <Card className="group cursor-pointer transform hover:scale-105 transition-all duration-300 h-64 bg-gradient-to-br from-primary to-blue-600 text-white overflow-hidden relative">
                <CardContent className="p-6 h-full flex flex-col justify-between relative z-10">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Prescription Drugs</h3>
                    <p className="text-blue-100 text-sm">Licensed prescription medications</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-white/20 text-white border-none">
                      From ¢15
                    </Badge>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
                <div className="absolute top-4 right-4 text-6xl opacity-10">
                  <Pill />
                </div>
              </Card>
            </Link>

            <Link href="/shop?category=over-the-counter">
              <Card className="group cursor-pointer transform hover:scale-105 transition-all duration-300 h-64 bg-gradient-to-br from-secondary to-green-600 text-white overflow-hidden relative">
                <CardContent className="p-6 h-full flex flex-col justify-between relative z-10">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Over-the-Counter</h3>
                    <p className="text-green-100 text-sm">Safe medicines without prescription</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-white/20 text-white border-none">
                      From ¢8
                    </Badge>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
                <div className="absolute top-4 right-4 text-6xl opacity-10">
                  <Heart />
                </div>
              </Card>
            </Link>

            <Link href="/shop?category=health-supplements">
              <Card className="group cursor-pointer transform hover:scale-105 transition-all duration-300 h-64 bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative">
                <CardContent className="p-6 h-full flex flex-col justify-between relative z-10">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Health Supplements</h3>
                    <p className="text-purple-100 text-sm">Premium vitamins & wellness</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-white/20 text-white border-none">
                      UP TO 30% OFF
                    </Badge>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
                <div className="absolute top-4 right-4 text-6xl opacity-10">
                  <Award />
                </div>
              </Card>
            </Link>

            <Link href="/shop/offers">
              <Card className="group cursor-pointer transform hover:scale-105 transition-all duration-300 h-64 bg-gradient-to-br from-red-500 to-red-600 text-white overflow-hidden relative">
                <CardContent className="p-6 h-full flex flex-col justify-between relative z-10">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Special Offers</h3>
                    <p className="text-red-100 text-sm">Great deals on health products</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-white/20 text-white border-none">
                      UP TO 60% OFF
                    </Badge>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
                <div className="absolute top-4 right-4 text-6xl opacity-10">
                  <Globe />
                </div>
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

      {/* Search and Tools */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral mb-4">
              Putting you in control with our free health tools
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Medicine Stock Checker</h3>
              <p className="text-gray-600 text-sm mb-4">
                See if we have the medicine you need before you place a prescription request.
              </p>
              <Link href="/shop">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Check stock now
                </Button>
              </Link>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Local services finder</h3>
              <p className="text-gray-600 text-sm mb-4">
                Find pharmacy services and healthcare providers near you in Ghana.
              </p>
              <Link href="/contact">
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                  Search now
                </Button>
              </Link>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Health Conditions A-Z</h3>
              <p className="text-gray-600 text-sm mb-4">
                Browse comprehensive information about health conditions and treatments.
              </p>
              <Link href="/about">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Explore conditions
                </Button>
              </Link>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Medicines A-Z Directory</h3>
              <p className="text-gray-600 text-sm mb-4">
                Browse detailed information about medicines and their uses.
              </p>
              <Link href="/shop">
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                  Browse medicines
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Help & Support */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
                alt="Help and Support"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-neutral">Help and Support</h2>
              <p className="text-xl text-gray-600">
                We're here when you need us. Our Help & Support hub has everything you need 
                to find answers to commonly asked questions and you can contact our dedicated team.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <Link href="/contact">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                    Contact Us
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white">
                    About Smile Pills
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-primary" />
                  <span>Phone: 0544137947 | +233 209339912</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-3 text-secondary" />
                  <span>Hours: Monday-Saturday, 24/7 support</span>
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