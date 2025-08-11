import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function CheckoutReturn() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  const [sessionStatus, setSessionStatus] = useState<{
    status: string;
    customer_email?: string;
  } | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);

  // Extract session_id from URL
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const sessionId = urlParams.get('session_id');

  // Fetch session status
  useEffect(() => {
    if (sessionId && !sessionStatus) {
      apiRequest("GET", `/api/session-status?session_id=${sessionId}`)
        .then(response => response.json())
        .then(data => {
          setSessionStatus(data);
        })
        .catch(error => {
          console.error('Error fetching session status:', error);
          toast({
            title: "Error",
            description: "Failed to verify payment status",
            variant: "destructive",
          });
        });
    }
  }, [sessionId, sessionStatus, toast]);

  const createOrderMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest("POST", "/api/orders/create-from-session", { sessionId });
      return response.json();
    },
    onSuccess: (order) => {
      setOrderCreated(true);
      toast({
        title: "Order Created Successfully!",
        description: `Your order #${order.orderNumber} has been placed.`,
      });
    },
    onError: (error: any) => {
      console.error("Error creating order:", error);
      toast({
        title: "Order Creation Failed",
        description: error.message || "Failed to create order. Please contact support.",
        variant: "destructive",
      });
    },
  });

  // Create order when payment is complete and authenticated
  useEffect(() => {
    if (
      isAuthenticated &&
      sessionId &&
      sessionStatus?.status === 'complete' &&
      !orderCreated &&
      !createOrderMutation.isPending
    ) {
      createOrderMutation.mutate(sessionId);
    }
  }, [isAuthenticated, sessionId, sessionStatus, orderCreated, createOrderMutation]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please Login",
        description: "You need to be logged in to view this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !sessionStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Verifying your payment...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const isPaymentSuccessful = sessionStatus.status === 'complete';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {isPaymentSuccessful ? (
                <CheckCircle className="w-16 h-16 text-green-500" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isPaymentSuccessful ? "Payment Successful!" : "Payment Failed"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {isPaymentSuccessful ? (
              <>
                <p className="text-muted-foreground">
                  Thank you for your purchase! We've received your payment.
                </p>
                
                {sessionStatus.customer_email && (
                  <p className="text-sm text-muted-foreground">
                    A confirmation email has been sent to {sessionStatus.customer_email}
                  </p>
                )}
                
                {createOrderMutation.isPending && (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Creating your order...</span>
                  </div>
                )}
                
                {orderCreated && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      Your order has been successfully created and is being processed.
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/orders">View Orders</Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">
                  There was an issue processing your payment. Please try again or contact support if the problem persists.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/checkout">Try Again</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}