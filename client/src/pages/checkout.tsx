import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";

// Initialize Stripe conditionally
let stripePromise: Promise<any> | null = null;
if (import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
}

export default function Checkout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please Login",
        description: "You need to be logged in to checkout.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Create checkout session
  useEffect(() => {
    if (isAuthenticated && !clientSecret && !isCreatingSession) {
      setIsCreatingSession(true);
      
      apiRequest("POST", "/api/create-checkout-session", {})
        .then(response => {
          if (response.status === 401) {
            throw new Error('401: Unauthorized');
          }
          return response.json();
        })
        .then(data => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            throw new Error(data.message || 'Failed to create checkout session');
          }
        })
        .catch(error => {
          console.error('Error creating checkout session:', error);
          
          if (isUnauthorizedError(error)) {
            toast({
              title: "Unauthorized",
              description: "You are logged out. Logging in again...",
              variant: "destructive",
            });
            setTimeout(() => {
              window.location.href = "/api/login";
            }, 500);
            return;
          }
          
          toast({
            title: "Checkout Error",
            description: error.message || "Failed to initialize checkout. Please try again.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsCreatingSession(false);
        });
    }
  }, [isAuthenticated, clientSecret, isCreatingSession, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/cart" className="flex items-center text-primary hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Link>
          </div>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Processing Unavailable</h2>
              <p className="text-muted-foreground mb-4">
                Payment processing is currently unavailable. Please contact support or try again later.
              </p>
              <Link href="/contact" className="text-primary hover:underline">
                Contact Support
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Unable to Load Payment System</h2>
              <p className="text-muted-foreground">
                There was an issue loading the payment system. Please refresh the page or contact support.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isCreatingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/cart" className="flex items-center text-primary hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Link>
          </div>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Preparing Checkout</h2>
              <p className="text-muted-foreground">
                Setting up your secure payment session...
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/cart" className="flex items-center text-primary hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Link>
          </div>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Checkout Unavailable</h2>
              <p className="text-muted-foreground mb-4">
                Unable to initialize checkout. This might be because your cart is empty or there was an error.
              </p>
              <Link href="/cart" className="text-primary hover:underline">
                Return to Cart
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/cart" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
        </div>

        <div className="grid lg:grid-cols-1 gap-8">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-6">Secure Checkout</h1>
              
              <EmbeddedCheckoutProvider 
                stripe={stripePromise} 
                options={{ clientSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}