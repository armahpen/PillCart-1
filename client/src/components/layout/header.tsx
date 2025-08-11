import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CartSidebar from "@/components/cart/cart-sidebar";
import { Link, useLocation } from "wouter";
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Phone, 
  Mail,
  Pill,
  Menu,
  X
} from "lucide-react";

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: cartItems } = useQuery({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const cartItemCount = Array.isArray(cartItems) ? cartItems.length : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const categories = [
    { name: "All Products", slug: "", href: "/shop" },
    { name: "Prescription", slug: "prescription-drugs", href: "/shop?category=prescription-drugs" },
    { name: "Over-the-Counter", slug: "over-the-counter", href: "/shop?category=over-the-counter" },
    { name: "Supplements", slug: "health-supplements", href: "/shop?category=health-supplements" },
    { name: "First Aid", slug: "first-aid", href: "/shop?category=first-aid" },
    { name: "Wellness", slug: "wellness", href: "/shop?category=wellness" },
    { name: "Medical Devices", slug: "medical-devices", href: "/shop?category=medical-devices" },
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        {/* Top bar */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2 text-sm">
              <div className="hidden md:flex items-center space-x-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-secondary" />
                  <span>0544137947</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-secondary" />
                  <span>smilepills21@gmail.com</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <span className="text-gray-600">
                      Welcome, {(user as any)?.firstName || 'User'}!
                    </span>
                    <a 
                      href="/api/logout" 
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Logout
                    </a>
                  </>
                ) : (
                  <>
                    <a 
                      href="/api/login" 
                      className="text-gray-600 hover:text-primary transition-colors flex items-center"
                    >
                      <User className="h-4 w-4 mr-1" />
                      Login
                    </a>
                    <span className="text-gray-300">|</span>
                    <a 
                      href="/api/login" 
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Register
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img 
                  src="/assets/smile-pills-logo.png" 
                  alt="Smile Pills Ltd - Smile Forever" 
                  className="h-12 w-auto object-contain"
                />
              </div>
            </Link>

            {/* Search bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search for medicines, health products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </form>
            </div>

            {/* Cart and User actions */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-secondary text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="sm" className="relative hidden sm:block">
                <Heart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                  0
                </Badge>
              </Button>
            </div>
          </nav>

          {/* Mobile search */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </form>
            </div>
          )}

          {/* Category navigation */}
          <div className="hidden md:block pb-4">
            <nav className="flex space-x-8 overflow-x-auto">
              {categories.map((category) => (
                <Link key={category.slug} href={category.href}>
                  <span
                    className={`whitespace-nowrap pb-2 transition-colors ${
                      location === category.href || 
                      (category.slug && location.includes(`category=${category.slug}`))
                        ? "text-primary border-b-2 border-primary font-medium"
                        : "text-gray-600 hover:text-primary"
                    }`}
                  >
                    {category.name}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Mobile category navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 border-t pt-4">
              <nav className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link key={category.slug} href={category.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}
