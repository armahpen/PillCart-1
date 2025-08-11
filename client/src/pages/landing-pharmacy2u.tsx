import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ChevronLeft,
  ChevronRight,
  Calculator,
  FileText,
  MapPin,
  MessageCircle,
  Activity,
  Package
} from "lucide-react";

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch('/api/products?limit=8');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  // Hero carousel slides matching Pharmacy2U exactly
  const heroSlides = [
    {
      badge: "NEW",
      title: "Instantly check stock of your prescription medicines",
      buttonText: "Check stock now",
      buttonLink: "/shop",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1025&h=724",
      trustLogo: true
    },
    {
      badge: "",
      title: "Free home delivery of your repeat prescriptions",
      buttonText: "Find out more",
      buttonLink: "/about",
      buttonText2: "Log in & re-order",
      buttonLink2: "/api/login",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1025&h=736",
      trustLogo: true
    },
    {
      badge: "NEW",
      title: "Manage prescriptions for the whole family in one account",
      buttonText: "Sign up for free",
      buttonLink: "/api/login",
      buttonText2: "Add a patient",
      buttonLink2: "/api/login",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1025&h=736",
      trustLogo: true
    },
    {
      badge: "Save ₵40",
      title: "Professional pharmaceutical care",
      subtitle: "with our certified pharmacy technicians",
      buttonText: "Find out more",
      buttonLink: "/contact",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1406&h=1441",
      trustLogo: true
    }
  ];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Carousel - Full Width */}
      <section className="relative bg-white">
        <div className="relative h-[500px] lg:h-[600px]">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Main carousel container */}
              <div className="h-full bg-gradient-to-r from-primary/5 to-secondary/10">
                <div className="container mx-auto px-4 h-full">
                  <div className="flex items-center h-full">
                    <div className="w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                      {/* Text content - left side */}
                      <div className="space-y-6 text-center lg:text-left">
                        {slide.badge && (
                          <div className="flex justify-center lg:justify-start">
                            <Badge className="bg-secondary text-white px-4 py-2 text-sm font-bold">
                              {slide.badge}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral leading-tight">
                            {slide.title}
                          </h1>
                          {slide.subtitle && (
                            <h2 className="text-2xl lg:text-3xl font-bold text-neutral leading-tight">
                              {slide.subtitle}
                            </h2>
                          )}
                        </div>
                        
                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                          <Link href={slide.buttonLink}>
                            <Button 
                              size="lg" 
                              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold min-w-[200px]"
                            >
                              {slide.buttonText}
                            </Button>
                          </Link>
                          
                          {slide.buttonText2 && (
                            <Link href={slide.buttonLink2}>
                              <Button 
                                variant="outline" 
                                size="lg"
                                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold min-w-[200px]"
                              >
                                {slide.buttonText2}
                              </Button>
                            </Link>
                          )}
                        </div>
                        
                        {/* Trust pilot logo area */}
                        {slide.trustLogo && (
                          <div className="flex items-center justify-center lg:justify-start space-x-3 pt-4">
                            <div className="flex items-center space-x-2">
                              <Star className="h-5 w-5 fill-current text-yellow-400" />
                              <Star className="h-5 w-5 fill-current text-yellow-400" />
                              <Star className="h-5 w-5 fill-current text-yellow-400" />
                              <Star className="h-5 w-5 fill-current text-yellow-400" />
                              <Star className="h-5 w-5 fill-current text-yellow-400" />
                            </div>
                            <span className="text-sm text-gray-600 font-medium">Excellent</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Image - right side */}
                      <div className="flex justify-center lg:justify-end">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* NHS Services badge equivalent - positioned bottom right */}
                <div className="absolute bottom-6 right-6">
                  <div className="bg-primary/10 px-4 py-2 rounded-full">
                    <span className="text-primary font-semibold text-sm">Licensed Pharmacy Services</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
          
          {/* Carousel dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-primary scale-125' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators - Exact 4-column layout */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9IiM0Yjc2ODgiLz4KPHBhdGggZD0iTTc1IDMwVjEyME03NSA3NUgzME03NSA3NUgxMjAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=" 
                  alt="Excellent rating" 
                  className="w-20 h-20 mx-auto"
                />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Excellent service rating</h3>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9IiM0Yjc2ODgiLz4KPHBhdGggZD0iTTUwIDc1TDY1IDkwTDEwMCA2MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI4IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==" 
                  alt="Trusted partner" 
                  className="w-20 h-20 mx-auto"
                />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Trusted licensed partner</h3>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9IiM0Yjc2ODgiLz4KPGNpcmNsZSBjeD0iNzUiIGN5PSI0NSIgcj0iMTIiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjYzIiB5PSI2NSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjUwIiByeD0iNCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==" 
                  alt="Regulated pharmacy" 
                  className="w-20 h-20 mx-auto"
                />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Regulated pharmacy</h3>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9IiM0Yjc2ODgiLz4KPGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iMTAiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjkwIiBjeT0iNjAiIHI9IjEwIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSI3NSIgY3k9IjkwIiByPSIxMCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==" 
                  alt="Serving Ghana" 
                  className="w-20 h-20 mx-auto"
                />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Serving Ghana nationwide</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section - Exact Pharmacy2U Layout */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Welcome to Ghana's leading online pharmacy
            </h2>
            <h3 className="text-xl font-bold text-gray-700">
              What would you like to do today?
            </h3>
          </div>
          
          {/* 5-column service grid - exact Pharmacy2U layout */}
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
            {/* Column 1 */}
            <div className="text-center space-y-6">
              <div className="mb-6">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0IiBoZWlnaHQ9IjE0NCIgdmlld0JveD0iMCAwIDE0NCAxNDQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDQiIGhlaWdodD0iMTQ0IiByeD0iNzIiIGZpbGw9IiM0Yjc2ODgiLz4KPHJlY3QgeD0iNDgiIHk9IjQ4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSI4IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" 
                  alt="Prescription icon" 
                  className="w-16 h-16 mx-auto"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Manage my prescription</h3>
              <div className="space-y-3 text-sm">
                <div><Link href="/about" className="text-primary hover:underline">Find out more</Link></div>
                <div><Link href="/api/login" className="text-primary hover:underline">Order your prescription</Link></div>
                <div><Link href="/api/login" className="text-primary hover:underline">Track your orders</Link></div>
                <div><Link href="/shop" className="text-primary hover:underline">Check medicine stock</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Download app</Link></div>
              </div>
              <p className="text-xs text-gray-600 pt-4">Join Smile Pills today</p>
            </div>

            {/* Column 2 */}
            <div className="text-center space-y-6">
              <div className="mb-6">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9IiM0Yjc2ODgiLz4KPGNpcmNsZSBjeD0iNzUiIGN5PSI1NSIgcj0iMTUiIGZpbGw9IndoaXRlIi8+CjxlbGxpcHNlIGN4PSI3NSIgY3k9IjEwNSIgcng9IjI1IiByeT0iMjAiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=" 
                  alt="Online Doctor icon" 
                  className="w-16 h-16 mx-auto"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Explore professional support</h3>
              <div className="space-y-3 text-sm">
                <div><Link href="/contact" className="text-primary hover:underline">View services</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Find out how it works</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Book consultations</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Expert treatments</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Pharmaceutical advice</Link></div>
              </div>
              <p className="text-xs text-primary underline pt-4">Visit Professional Support</p>
            </div>

            {/* Column 3 */}
            <div className="text-center space-y-6">
              <div className="mb-6">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ5IiBoZWlnaHQ9IjE0OSIgdmlld0JveD0iMCAwIDE0OSAxNDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDkiIGhlaWdodD0iMTQ5IiByeD0iNzQuNSIgZmlsbD0iIzRiNzY4OCIvPgo8cGF0aCBkPSJNNzQuNSA0MEM4NC4xNjUgNDAgOTIgNDcuODM1IDkyIDU3LjVTODQuMTY1IDc1IDc0LjUgNzVTNTcgNjcuMTY1IDU3IDU3LjVTNjQuODM1IDQwIDc0LjUgNDBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNTAgMTA5QzUwIDk1LjE5MyA2MS4xOTMgODQgNzUgODRIOGM5My44MDcgODQgMTA1IDk1LjE5MyAxMDUgMTA5VjEwOUg1MFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=" 
                  alt="Shop icon" 
                  className="w-16 h-16 mx-auto"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Shop health and wellness</h3>
              <div className="space-y-3 text-sm">
                <div><Link href="/shop" className="text-primary hover:underline">Order great products</Link></div>
                <div><Link href="/shop" className="text-primary hover:underline">Shop health essentials</Link></div>
                <div><Link href="/shop" className="text-primary hover:underline">Shop latest offers</Link></div>
                <div><Link href="/api/login" className="text-primary hover:underline">Track your orders</Link></div>
                <div><Link href="/api/login" className="text-primary hover:underline">View your account</Link></div>
              </div>
              <p className="text-xs text-primary underline pt-4">Explore the shop</p>
            </div>

            {/* Column 4 */}
            <div className="text-center space-y-6">
              <div className="mb-6">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9IiM0Yjc2ODgiLz4KPHBhdGggZD0iTTc1IDMwVjEyME03NSA3NUgzME03NSA3NUgxMjAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=" 
                  alt="Health services icon" 
                  className="w-16 h-16 mx-auto"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Use our health services</h3>
              <div className="space-y-3 text-sm">
                <div><Link href="/contact" className="text-primary hover:underline">Health consultation</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Find expert healthcare advice</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Pharmacy services</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Get medicine advice</Link></div>
              </div>
              <p className="text-xs text-primary underline pt-4">View Health Services</p>
            </div>

            {/* Column 5 */}
            <div className="text-center space-y-6">
              <div className="mb-6">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ5IiBoZWlnaHQ9IjE0OSIgdmlld0JveD0iMCAwIDE0OSAxNDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDkiIGhlaWdodD0iMTQ5IiByeD0iNzQuNSIgZmlsbD0iIzRiNzY4OCIvPgo8cGF0aCBkPSJNNjAgNjBMMzkgODFMNjAgMTAyTDgxIDgxTDYwIDYwWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTg5IDYwTDExMCA4MUw4OSAxMDJMMTEwIDgxTDg5IDYwWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==" 
                  alt="Contact icon" 
                  className="w-16 h-16 mx-auto"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact & support</h3>
              <div className="space-y-3 text-sm">
                <div><Link href="/contact" className="text-primary hover:underline">WhatsApp support</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Call: 0544137947</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Email support</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Visit our location</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">View operating hours</Link></div>
              </div>
              <p className="text-xs text-primary underline pt-4">Get Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Health Tools Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Putting you in control with our free health tools
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            {/* Health Hub */}
            <div>
              <img
                src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=699&h=269"
                alt="Health Hub"
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Health Hub</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access reliable health advice and guidance reviewed by our healthcare professionals
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Link href="/contact" className="text-primary hover:underline font-medium">Heart Health</Link>
                <Link href="/contact" className="text-primary hover:underline font-medium">Weight Loss</Link>
                <Link href="/contact" className="text-primary hover:underline font-medium">Digestive Health</Link>
                <Link href="/contact" className="text-primary hover:underline font-medium">Mental Health</Link>
                <Link href="/contact" className="text-primary hover:underline font-medium">Women's Health</Link>
                <Link href="/contact" className="text-primary hover:underline font-medium">Men's Health</Link>
              </div>
              
              <Link href="/contact">
                <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2">
                  Visit Health Hub
                </Button>
              </Link>
            </div>
            
            {/* Medicine Stock Checker */}
            <div>
              <div className="bg-primary/10 p-6 rounded-lg mb-6">
                <h4 className="font-bold text-gray-900 text-lg mb-2">Medicine Stock Checker</h4>
                <p className="text-gray-600 text-sm mb-4">
                  See if we have the medicine you need before you place a prescription request.
                </p>
                <Link href="/shop">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-semibold">
                    Check stock now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* 4-column tools grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="mb-4">
                <Search className="w-12 h-12 text-primary mx-auto" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Local services finder</h4>
              <Link href="/contact" className="text-primary hover:underline font-medium">Search now</Link>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <Activity className="w-12 h-12 text-primary mx-auto" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Health Conditions A-Z Directory</h4>
              <Link href="/contact" className="text-primary hover:underline font-medium">Explore conditions</Link>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <Package className="w-12 h-12 text-primary mx-auto" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Medicines A-Z Directory</h4>
              <Link href="/contact" className="text-primary hover:underline font-medium">Browse medicines</Link>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <Calculator className="w-12 h-12 text-primary mx-auto" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">BMI Calculator</h4>
              <Link href="/contact" className="text-primary hover:underline font-medium">Calculate my BMI</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Carousel Section */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Access leading brands at great value
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12">
              {featuredProducts.slice(0, 5).map((product: any, index: number) => (
                <div key={product.id} className={index === 0 ? "md:col-span-2 md:row-span-2" : ""}>
                  <ProductCard 
                    product={product} 
                    variant="grid"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Jump straight in...find advice, apps and health tools here
          </h3>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Help and Support */}
            <div>
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1424&h=618"
                alt="Help and Support"
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Help and Support</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We're here when you need us. Our Help & Support hub has everything you need to find answers to commonly asked questions and you can contact our dedicated team.
              </p>
              
              <div className="space-y-3 mb-6">
                <div><Link href="/api/login" className="text-primary hover:underline">My account</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Orders & delivery</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Payments & exemptions</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Health FAQs</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">FAQs</Link></div>
              </div>
            </div>
            
            {/* About Us */}
            <div>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-primary mb-2">Smile Pills Ltd</h4>
                <p className="text-sm text-gray-600">Smile Forever - delivering health with trust</p>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">About us</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded by a certified pharmacy technician with over 4+ years of experience, we proudly serve patients across Ghana with quality pharmaceutical services.
              </p>
              
              <div className="space-y-3 mb-6">
                <div><Link href="/about" className="text-primary hover:underline">About us</Link></div>
                <div><Link href="/about" className="text-primary hover:underline">Our mission</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Meet the team</Link></div>
                <div><Link href="/contact" className="text-primary hover:underline">Careers</Link></div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-bold text-gray-900 mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Phone:</strong> 0544137947 | +233 209339912</p>
                  <p><strong>Email:</strong> smilepills21@gmail.com</p>
                  <p><strong>Location:</strong> East Legon Hills, Accra, Ghana</p>
                  <p><strong>Hours:</strong> Monday – Saturday, 24/7</p>
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