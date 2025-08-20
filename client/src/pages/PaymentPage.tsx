import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  CreditCard, 
  Lock, 
  MapPin, 
  Phone,
  Mail,
  Package,
  ArrowLeft
} from "lucide-react";

// Paystack types
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => {
        openIframe: () => void;
      };
    };
  }
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
  redirecturl: string;
}

export default function PaymentPage() {
  const [, setLocation] = useLocation();
  const { cartItems, getCartTotal, clearCart, loading } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Accra',
    region: 'Greater Accra'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  const totalAmount = getCartTotal();
  const deliveryFee = 15.00; // GHS 15 delivery fee
  const finalAmount = totalAmount + deliveryFee;

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => setPaystackLoaded(true);
    script.onerror = () => {
      toast({
        title: "Payment System Error",
        description: "Failed to load payment system. Please try again.",
        variant: "destructive"
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [toast]);

  // Redirect if cart is empty - but wait for cart to load first
  useEffect(() => {
    // Only check if cart is empty after it has had time to load
    const timer = setTimeout(() => {
      if (cartItems.length === 0) {
        console.log('Cart is empty, redirecting to shop');
        toast({
          title: "Empty Cart", 
          description: "Your cart is empty. Add items before checkout.",
          variant: "destructive"
        });
        setLocation('/shop');
      }
    }, 100); // Small delay to let cart data load

    return () => clearTimeout(timer);
  }, [cartItems, setLocation, toast]);

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateReference = () => {
    return `SMILE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address'];
    const missing = required.filter(field => !customerInfo[field as keyof typeof customerInfo]);
    
    if (missing.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missing.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    // Phone validation (Ghana format)
    const phoneRegex = /^(\+233|0)[2-9][0-9]{8}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Ghana phone number",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handlePayment = () => {
    if (!validateForm()) return;
    if (!paystackLoaded) {
      toast({
        title: "Payment System Loading",
        description: "Please wait for the payment system to load",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    const paymentConfig: PaystackConfig = {
      key: 'pk_live_95dcd63641da880d65aba9ef1f512b48d9c58ba9',
      email: customerInfo.email,
      amount: Math.round(finalAmount * 100), // Paystack amount in pesewas (GHS * 100)
      currency: 'GHS',
      ref: generateReference(),
      firstname: customerInfo.firstName,
      lastname: customerInfo.lastName,
      phone: customerInfo.phone,
      metadata: {
        custom_fields: [
          {
            display_name: "Cart Items",
            variable_name: "cart_items",
            value: JSON.stringify(cartItems.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })))
          },
          {
            display_name: "Delivery Address",
            variable_name: "delivery_address",
            value: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.region}`
          },
          {
            display_name: "Customer Phone",
            variable_name: "customer_phone",
            value: customerInfo.phone
          }
        ]
      },
      callback: (response: PaystackResponse) => {
        setIsProcessing(false);
        
        if (response.status === 'success') {
          // Create order record
          const orderData = {
            reference: response.reference,
            customerInfo,
            items: cartItems,
            totalAmount: finalAmount,
            paymentStatus: 'completed',
            deliveryStatus: 'pending'
          };

          // Store order in localStorage for now (in production, send to backend)
          const orders = JSON.parse(localStorage.getItem('orders') || '[]');
          orders.push({
            ...orderData,
            id: response.reference,
            createdAt: new Date().toISOString()
          });
          localStorage.setItem('orders', JSON.stringify(orders));

          // Clear cart
          clearCart();

          // Success alert and redirect
          alert(`Payment successful! 
Reference: ${response.reference}
Amount: GHS ${finalAmount.toFixed(2)}

Your order has been placed and you will receive a confirmation shortly.
Delivery within 24-48 hours in Accra.`);

          // Redirect to success page or home
          setLocation('/');
          
          toast({
            title: "Payment Successful!",
            description: `Order ${response.reference} placed successfully`,
          });
        } else {
          toast({
            title: "Payment Failed",
            description: "Your payment was not completed. Please try again.",
            variant: "destructive"
          });
        }
      },
      onClose: () => {
        setIsProcessing(false);
        alert('Payment cancelled. Your order has not been placed.');
      }
    };

    try {
      const paystack = window.PaystackPop.setup(paymentConfig);
      paystack.openIframe();
    } catch (error) {
      setIsProcessing(false);
      console.error('Paystack error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleWhatsAppOrder = () => {
    const orderSummary = cartItems.map(item => 
      `${item.quantity}x ${item.name} - GHS ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `🛒 *New Order from Smile Pills Ltd*

*Customer Details:*
Name: ${customerInfo.firstName} ${customerInfo.lastName}
Email: ${customerInfo.email}
Phone: ${customerInfo.phone}
Address: ${customerInfo.address}, ${customerInfo.city}

*Order Summary:*
${orderSummary}

*Total:* GHS ${totalAmount.toFixed(2)}
*Delivery:* GHS ${deliveryFee.toFixed(2)}
*Final Total:* GHS ${finalAmount.toFixed(2)}

*Payment Method:* Cash on Delivery

Please confirm this order and provide delivery time.`;

    const whatsappUrl = `https://wa.me/233209339912?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Order Sent via WhatsApp",
      description: "Your order has been sent. We'll confirm delivery details shortly."
    });
  };

  // Debug logging
  console.log('PaymentPage cartItems:', cartItems);
  console.log('PaymentPage totalAmount:', totalAmount);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Loading Cart...</h2>
            <p className="text-gray-600">Please wait while we load your cart items.</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Cart is Empty</h2>
            <p className="text-gray-600 mb-4">Your cart is empty. Add items before checkout.</p>
            <Button onClick={() => setLocation('/shop')}>Browse Products</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/cart')}
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Button>
            <h1 className="text-3xl font-bold text-neutral mb-2">Checkout</h1>
            <p className="text-gray-600">Complete your order with secure payment</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={customerInfo.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={customerInfo.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="House number, street name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={customerInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="region">Region</Label>
                      <Input
                        id="region"
                        value={customerInfo.region}
                        onChange={(e) => handleInputChange('region', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × GHS {item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold">
                          GHS {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>GHS {totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>GHS {deliveryFee.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">GHS {finalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Secure Online Payment</span>
                      <Badge variant="secondary">Recommended</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Pay securely with Mobile Money, Visa, Mastercard via Paystack
                    </p>
                    <Button 
                      onClick={handlePayment}
                      disabled={isProcessing || !paystackLoaded}
                      className="w-full flex items-center gap-2"
                      size="lg"
                    >
                      <CreditCard className="h-4 w-4" />
                      {isProcessing ? 'Processing...' : `Pay GHS ${finalAmount.toFixed(2)}`}
                    </Button>
                  </div>

                  <div className="text-center">
                    <span className="text-gray-500">or</span>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Order via WhatsApp and pay when you receive your items
                    </p>
                    <Button 
                      onClick={handleWhatsAppOrder}
                      variant="outline"
                      className="w-full flex items-center gap-2"
                      size="lg"
                    >
                      <Package className="h-4 w-4" />
                      Order via WhatsApp
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 text-center mt-4">
                    <p>🔒 Your payment information is secure and encrypted</p>
                    <p>📦 Free delivery within Accra • 24-48 hour delivery</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}