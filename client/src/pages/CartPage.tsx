import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import Header from '@/components/layout/header';

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export function CartPage() {
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('smile-pills-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem('smile-pills-cart');
      }
    }
    setLoading(false);
  }, []);

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem('smile-pills-cart', JSON.stringify(items));
    setCartItems(items);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedItems);
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    saveCart(updatedItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over ₵100
  const total = subtotal + shipping;

  const handleCheckout = () => {
    // Navigate to payment page
    setLocation('/payment');
  };

  const initiateWhatsAppOrder = () => {
    // Create detailed order summary
    const orderHeader = "🛒 *NEW ORDER FROM SMILE PILLS LTD*\n" + "=" .repeat(35) + "\n\n";
    
    const orderDetails = cartItems.map((item, index) => {
      const itemTotal = item.price * item.quantity;
      return `${index + 1}. *${item.name}*\n` +
             `   Brand: ${item.brand}\n` +
             `   Quantity: ${item.quantity}\n` +
             `   Unit Price: ₵${item.price.toFixed(2)}\n` +
             `   Subtotal: ₵${itemTotal.toFixed(2)}\n`;
    }).join('\n');
    
    const orderSummary = "\n" + "=" .repeat(35) + "\n" +
                        `*ORDER SUMMARY*\n` +
                        `Subtotal: ₵${subtotal.toFixed(2)}\n` +
                        `Shipping: ${shipping === 0 ? 'FREE' : `₵${shipping.toFixed(2)}`}\n` +
                        `*TOTAL: ₵${total.toFixed(2)}*\n\n`;
    
    const customerNote = "📱 *CUSTOMER DETAILS NEEDED:*\n" +
                        "• Full Name\n" +
                        "• Phone Number\n" +
                        "• Delivery Address\n" +
                        "• Preferred delivery time\n\n" +
                        "Please confirm availability and provide delivery details. Thank you! 🙏";
    
    const fullMessage = orderHeader + orderDetails + orderSummary + customerNote;
    
    const whatsappUrl = `https://wa.me/233209339912?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/shop">
            <Button variant="ghost" size="sm" className="mr-4" data-testid="button-back-shop">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shopping Cart
          </h1>
          <Badge variant="secondary" className="ml-4" data-testid="text-cart-count">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-12">
            <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any medical supplies to your cart yet. 
              Browse our pharmaceutical products to get started.
            </p>
            <Link href="/shop">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90" data-testid="button-browse-products">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Cart Items
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      data-testid="button-clear-cart"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cart
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        {/* Product Image */}
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.brand}
                          </p>
                          <p className="text-lg font-bold text-secondary mt-1">
                            ₵{item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center h-8"
                            min="1"
                            data-testid={`input-quantity-${item.id}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white">
                            ₵{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 flex-shrink-0"
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span data-testid="text-subtotal">₵{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Shipping</span>
                      <span data-testid="text-shipping">
                        {shipping === 0 ? 'FREE' : `₵${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {subtotal < 100 && shipping > 0 && (
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Add ₵{(100 - subtotal).toFixed(2)} more for free shipping
                      </p>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span data-testid="text-total">₵{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-secondary hover:bg-secondary/90"
                      size="lg"
                      data-testid="button-checkout"
                    >
                      Proceed to Checkout
                    </Button>
                    <Button
                      onClick={initiateWhatsAppOrder}
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                      size="lg"
                      data-testid="button-whatsapp-order"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Order via WhatsApp
                    </Button>
                  </div>

                  {/* WhatsApp Order Info */}
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
                      📱 WhatsApp Ordering
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                      Order directly via WhatsApp for faster processing and personal service.
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Your order details will be automatically formatted and sent to our WhatsApp business line.
                    </p>
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                      <p>✓ Secure payment processing</p>
                      <p>✓ Licensed pharmaceutical distributor</p>
                      <p>✓ Fast delivery across Ghana</p>
                      <p>✓ 24/7 customer support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}