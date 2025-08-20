import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import Header from '@/components/layout/header';
import { useCart } from '@/hooks/useCart';

export function CartPage() {
  const [, setLocation] = useLocation();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();

  // Calculate totals using the cart hook
  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over ₵100
  const total = subtotal + shipping;

  const handleCheckout = () => {
    // Navigate to payment page
    setLocation('/payment');
  };

  const initiateWhatsAppOrder = () => {
    // Create detailed order summary
    const orderHeader = "🛒 *NEW ORDER FROM SMILE PILLS LTD*\n" + "=".repeat(35) + "\n\n";
    
    const orderDetails = cartItems.map((item, index) => {
      const itemTotal = item.price * item.quantity;
      return `${index + 1}. *${item.name}*\n` +
             `   Brand: ${item.brand}\n` +
             `   Quantity: ${item.quantity}\n` +
             `   Unit Price: ₵${item.price.toFixed(2)}\n` +
             `   Subtotal: ₵${itemTotal.toFixed(2)}\n`;
    }).join('\n');
    
    const orderSummary = "\n" + "=".repeat(35) + "\n" +
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-gray-300 dark:text-gray-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to find amazing products!
            </p>
            <Link href="/shop">
              <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-continue-shopping">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/shop">
            <Button variant="ghost" className="mb-4" data-testid="button-back-to-shop">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Shopping Cart</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.brand}</p>
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-sm">
                          ₵{item.price.toFixed(2)} each
                        </Badge>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        data-testid={`button-decrease-${item.id}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          updateQuantity(item.id, newQuantity);
                        }}
                        className="w-16 text-center"
                        min="1"
                        data-testid={`input-quantity-${item.id}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        data-testid={`button-increase-${item.id}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ₵{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 mt-1"
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span data-testid="text-subtotal">₵{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span data-testid="text-shipping">
                      {shipping === 0 ? (
                        <span className="text-green-600 font-medium">FREE</span>
                      ) : (
                        `₵${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {shipping === 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      🎉 You qualify for free shipping!
                    </p>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span data-testid="text-total">₵{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90" 
                    size="lg"
                    onClick={handleCheckout}
                    data-testid="button-checkout"
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950" 
                    size="lg"
                    onClick={initiateWhatsAppOrder}
                    data-testid="button-whatsapp-order"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Order via WhatsApp
                  </Button>
                </div>
                
                <div className="mt-4 text-center">
                  <Link href="/shop">
                    <Button variant="ghost" size="sm" data-testid="button-continue-shopping-summary">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CartPage;