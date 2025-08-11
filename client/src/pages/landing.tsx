import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product/product-card";
import { Card, CardContent } from "@/components/ui/card";
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
  Award
} from "lucide-react";

export default function Landing() {
  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", { limit: 6 }],
    retry: false,
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
    retry: false,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 fade-in">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Smile Pills Ltd
              </h1>
              <p className="text-2xl text-blue-200 font-semibold mb-2">
                Smile Forever
              </p>
              <p className="text-xl text-blue-100 leading-relaxed">
                Ghana's trusted pharmaceutical wholesale and medical supplies company, delivering health with trust, quality, and convenience to pharmacies, hospitals, and individual customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    <Pill className="mr-2 h-5 w-5" />
                    Shop Now
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <Stethoscope className="mr-2 h-5 w-5" />
                  Consult Pharmacist
                </Button>
              </div>
              
              {/* Trust badges */}
              <div className="flex items-center space-x-6 pt-8">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Licensed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Ghana Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Mon-Sat 24/7</span>
                </div>
              </div>
            </div>
            
            {/* Hero image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern pharmacy interior with professional pharmacist" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Find exactly what you need for your health and wellness</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/shop?category=prescription-drugs">
              <Card className="group cursor-pointer transform hover:scale-105 transition-transform duration-300 h-64 bg-gradient-to-br from-primary to-blue-600 text-white overflow-hidden">
                <CardContent className="p-8 h-full flex flex-col justify-between relative">
                  <div className="absolute top-4 right-4 text-6xl opacity-20">
                    <Pill />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Prescription Drugs</h3>
                    <p className="text-blue-100">Licensed prescription medications with professional consultation</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">500+ Products</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/shop?category=over-the-counter">
              <Card className="group cursor-pointer transform hover:scale-105 transition-transform duration-300 h-64 bg-gradient-to-br from-secondary to-green-600 text-white overflow-hidden">
                <CardContent className="p-8 h-full flex flex-col justify-between relative">
                  <div className="absolute top-4 right-4 text-6xl opacity-20">
                    <Heart />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Over-the-Counter</h3>
                    <p className="text-green-100">Safe, effective medicines available without prescription</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">800+ Products</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/shop?category=health-supplements">
              <Card className="group cursor-pointer transform hover:scale-105 transition-transform duration-300 h-64 bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden">
                <CardContent className="p-8 h-full flex flex-col justify-between relative">
                  <div className="absolute top-4 right-4 text-6xl opacity-20">
                    <Award />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Health Supplements</h3>
                    <p className="text-purple-100">Premium vitamins and supplements for optimal wellness</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">300+ Products</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts && Array.isArray(featuredProducts) && featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
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
                <Button size="lg" className="bg-primary text-white hover:bg-blue-700">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral mb-4">Why Choose Smile Pills Ltd?</h2>
            <p className="text-xl text-gray-600">Your trusted partner in health and wellness</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Licensed Pharmacists</h3>
              <p className="text-gray-600 text-sm">Expert consultation from certified pharmacists available 24/7</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Free next-day delivery on orders over $50</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure & Safe</h3>
              <p className="text-gray-600 text-sm">FDA-approved medications with secure payment processing</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Best Prices</h3>
              <p className="text-gray-600 text-sm">Competitive pricing with regular discounts and offers</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
