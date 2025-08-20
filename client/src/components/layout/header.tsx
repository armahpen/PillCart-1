import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CartSidebar from "@/components/cart/cart-sidebar";
import { CartBadge } from "@/components/cart/CartBadge";
import { Link, useLocation } from "wouter";
import { 
  ShoppingCart, 
  User, 
  Phone, 
  Mail,
  Menu,
  X,
  Settings,
  Shield,
  LogOut,
  UserCircle,
  ChevronDown
} from "lucide-react";

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const [location, setLocation] = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const { data: cartItems } = useQuery({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const cartItemCount = Array.isArray(cartItems) ? cartItems.length : 0;

  // Check if user is admin
  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentUser(user);
    }
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  const getUserInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.username) {
      return user.username;
    }
    if (user?.email) {
      return user.email;
    }
    return 'User';
  };

  const categories = [
    { name: "Prescription", slug: "prescriptions", href: "/prescription" },
    { name: "Shop", slug: "shop", href: "/shop" },
    { name: "Advice", slug: "advice", href: "#advice" },
    { name: "Help", slug: "help", href: "#help" },
    ...(currentUser?.isAdmin ? [{ name: "Admin", slug: "admin", href: "/admin" }] : []),
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
                {isAuthenticated && currentUser ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="relative h-8 w-8 rounded-full p-0"
                        data-testid="profile-menu-trigger"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={currentUser?.profilePicture} alt={getUserDisplayName(currentUser)} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getUserInitials(currentUser)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {getUserDisplayName(currentUser)}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {currentUser?.email || 'No email'}
                          </p>
                          {currentUser?.isAdmin && (
                            <Badge variant="secondary" className="mt-1 w-fit">
                              {currentUser?.adminRole || 'Admin'}
                            </Badge>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {currentUser?.isAdmin && (
                        <DropdownMenuItem 
                          onClick={() => setLocation('/admin')}
                          data-testid="admin-dashboard-link"
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem 
                        onClick={() => setLocation('/prescription')}
                        data-testid="prescription-link"
                      >
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>My Prescriptions</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={() => setLocation('/cart')}
                        data-testid="my-orders-link"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        data-testid="logout-button"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Link href="/login">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-primary transition-colors flex items-center"
                        data-testid="login-button"
                      >
                        <User className="h-4 w-4 mr-1" />
                        Login
                      </Button>
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link href="/login">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-primary transition-colors"
                        data-testid="register-button"
                      >
                        Register
                      </Button>
                    </Link>
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
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  data-testid="button-cart-header"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <CartBadge />
                </Button>
              </Link>

              {/* User Profile/Admin dropdown in main nav */}
              {isAuthenticated && currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="relative h-8 w-8 rounded-full p-0"
                      data-testid="profile-menu-main"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser?.profilePicture} alt={getUserDisplayName(currentUser)} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getUserInitials(currentUser)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {getUserDisplayName(currentUser)}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser?.email || 'No email'}
                        </p>
                        {currentUser?.isAdmin && (
                          <Badge variant="secondary" className="mt-1 w-fit">
                            {currentUser?.adminRole || 'Admin'}
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {currentUser?.isAdmin && (
                      <DropdownMenuItem 
                        onClick={() => setLocation('/admin')}
                        data-testid="admin-dashboard-main"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem 
                      onClick={() => setLocation('/prescription')}
                      data-testid="prescription-main"
                    >
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>My Prescriptions</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => setLocation('/cart')}
                      data-testid="my-orders-main"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      data-testid="logout-main"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="flex items-center"
                    data-testid="login-main"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}

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
