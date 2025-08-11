import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Lock, ThumbsUp, Clock, Pill, Heart, Users, Shield, Phone } from "lucide-react";

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: featuredProducts } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch('/api/products?limit=8');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="hero relative min-h-[60vh] flex items-center bg-gradient-to-br from-primary/5 to-secondary/10 py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-white"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-neutral leading-tight">
                Online Pharmacy & Prescription Services
              </h1>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                Order your prescriptions and shop trusted health essentials with fast, discreet delivery across Ghana.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/api/login">
                  <Button 
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-6 py-2 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Order Repeat Prescription
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button 
                    variant="outline" 
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-2 text-sm font-semibold transition-all duration-200"
                  >
                    Shop Medicines
                  </Button>
                </Link>
                <a href="https://wa.me/233200751811" target="_blank">
                  <Button 
                    className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                    </svg>
                    WhatsApp Chat
                  </Button>
                </a>
              </div>
              
              {/* Search Bar */}
              <div className="mt-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search medicines and health essentials"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 h-10 rounded-lg border-2 border-gray-200 focus:border-primary text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <img
                src="/assets/african-american-woman-pharmacist-standing-with-serious-expression-pharmacy_1754949718521.jpg"
                alt="Professional African American woman pharmacist at Smile Pills Ltd"
                className="w-full max-w-md h-auto object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-4 bg-secondary/20 border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
            <div className="flex items-center gap-2 text-primary font-medium">
              <Lock className="h-5 w-5" />
              <span>Licensed & regulated service</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <ThumbsUp className="h-5 w-5" />
              <span>Thousands of happy customers</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <Clock className="h-5 w-5" />
              <span>Fast, discreet delivery options</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white" id="prescriptions">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
              Trusted Pharmacy Services
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for everyday health, delivered.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:transform hover:scale-105 transition-all duration-200">
              <div className="mb-4">
                <Pill className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-neutral mb-2">Prescription Services</h3>
              <p className="text-gray-600 text-sm">
                Order your repeat prescriptions online with free delivery across Ghana.
              </p>
            </div>
            
            <div className="card bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:transform hover:scale-105 transition-all duration-200">
              <div className="mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-neutral mb-2">Health & Wellness</h3>
              <p className="text-gray-600 text-sm">
                Shop vitamins, supplements and health products from trusted brands.
              </p>
            </div>
            
            <div className="card bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:transform hover:scale-105 transition-all duration-200">
              <div className="mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-neutral mb-2">Professional Consultation</h3>
              <p className="text-gray-600 text-sm">
                Get expert advice from our certified pharmacy technicians.
              </p>
            </div>
            
            <div className="card bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:transform hover:scale-105 transition-all duration-200">
              <div className="mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-neutral mb-2">Licensed Service</h3>
              <p className="text-gray-600 text-sm">
                Regulated pharmaceutical services you can trust for your health needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50" id="shop">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
                Featured Health Products
              </h2>
              <p className="text-xl text-gray-600">
                Quality medicines and health essentials at great prices.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product: any) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  variant="grid"
                />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/shop">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold"
                >
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Health Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
              Shop by Health Category
            </h2>
            <p className="text-xl text-gray-600">
              Find exactly what you need for your health and wellness.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/shop">
              <div className="cat bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:transform hover:scale-105 transition-all duration-200">
                <h3 className="text-lg font-semibold text-neutral mb-2">Pain & Fever Relief</h3>
                <p className="text-gray-600 text-sm">
                  Paracetamol, ibuprofen, and effective pain management solutions.
                </p>
              </div>
            </Link>
            
            <Link href="/shop">
              <div className="cat bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:transform hover:scale-105 transition-all duration-200">
                <h3 className="text-lg font-semibold text-neutral mb-2">Digestive Health</h3>
                <p className="text-gray-600 text-sm">
                  Antacids, probiotics, and digestive wellness products.
                </p>
              </div>
            </Link>
            
            <Link href="/shop">
              <div className="cat bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:transform hover:scale-105 transition-all duration-200">
                <h3 className="text-lg font-semibold text-neutral mb-2">Vitamins & Supplements</h3>
                <p className="text-gray-600 text-sm">
                  Essential vitamins, minerals, and nutritional supplements.
                </p>
              </div>
            </Link>
            
            <Link href="/shop">
              <div className="cat bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:transform hover:scale-105 transition-all duration-200">
                <h3 className="text-lg font-semibold text-neutral mb-2">Cold & Flu</h3>
                <p className="text-gray-600 text-sm">
                  Cough syrups, decongestants, and cold relief medications.
                </p>
              </div>
            </Link>
            
            <Link href="/shop">
              <div className="cat bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:transform hover:scale-105 transition-all duration-200">
                <h3 className="text-lg font-semibold text-neutral mb-2">First Aid</h3>
                <p className="text-gray-600 text-sm">
                  Bandages, antiseptics, and essential first aid supplies.
                </p>
              </div>
            </Link>
            
            <Link href="/shop">
              <div className="cat bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:transform hover:scale-105 transition-all duration-200">
                <h3 className="text-lg font-semibold text-neutral mb-2">Personal Care</h3>
                <p className="text-gray-600 text-sm">
                  Health and hygiene products for daily wellness routines.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50" id="advice">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-6">
                About Smile Pills Ltd
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded by a certified pharmacy technician with over 4+ years of experience in both retail and hospital pharmacy settings, Smile Pills Ltd is committed to serving the pharmaceutical needs of Ghana.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our mission is "Smile Forever" - delivering health with trust, quality, and convenience. We're located in East Legon Hills, Accra, and operate Monday through Saturday, 24/7.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-gray-700">0544137947 | +233 209339912</span>
                </div>
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-primary" />
                  <span className="text-gray-700">smilepills21@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                  </svg>
                  <a href="https://wa.me/233200751811" target="_blank" className="text-gray-700 hover:text-primary transition-colors">
                    WhatsApp: 020 075 1811
                  </a>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img
                src="/assets/portrait-woman-working-pharmaceutical-industry_1754949834568.jpg"
                alt="Smile Pills pharmaceutical professional team member"
                className="w-full max-w-lg h-auto object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}