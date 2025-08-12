import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CartSidebar from "@/components/cart/cart-sidebar";
import { Link, useLocation } from "wouter";
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Phone, 
  Mail,
  Menu,
  X
} from "lucide-react";

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: cartItems } = useQuery({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const cartItemCount = Array.isArray(cartItems) ? cartItems.length : 0;

  const categories = [
    { name: "Prescription", slug: "prescriptions", href: "/prescription" },
    { name: "Shop", slug: "shop", href: "/shop" },
    { name: "Browse All", slug: "browse", href: "/browse" },
    { name: "Advice", slug: "advice", href: "#advice" },
    { name: "Help", slug: "help", href: "#help" },
  ];

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
        {/* Top bar */}
        <div className="border-b border-gray-100/50">
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
          <nav className="flex items-center justify-between py-2">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img 
                  src="/assets/IMG_1598%20(1)_1754986183203.PNG" 
                  alt="Smile Pills Ltd - Smile Forever" 
                  className="h-10 w-auto object-contain"
                />
              </div>
            </Link>

            {/* Spacer */}
            <div className="flex-1"></div>

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



          {/* Category navigation */}
          <div className="hidden md:block pb-2">
            <nav className="flex justify-center space-x-8">
              {categories.map((category) => (
                <Link key={category.slug} href={category.href}>
                  <span
                    className={`whitespace-nowrap pb-2 transition-colors font-medium ${
                      location === category.href || 
                      (category.slug && location.includes(`category=${category.slug}`))
                        ? "text-primary border-b-2 border-primary"
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
              <nav className="grid grid-cols-1 gap-2">
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
