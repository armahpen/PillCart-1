import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';

export function CartBadge() {
  const { cartItems, getCartCount } = useCart();
  const [count, setCount] = useState(0);

  // Update count whenever cartItems changes
  useEffect(() => {
    const newCount = getCartCount();
    console.log('CartBadge: Updating count to:', newCount);
    setCount(newCount);
  }, [cartItems, getCartCount]);

  useEffect(() => {
    // Listen for cart updates as backup
    const handleCartUpdate = (event: CustomEvent) => {
      const newCount = event.detail.count;
      console.log('CartBadge: Received cartUpdated event with count:', newCount);
      setCount(newCount);
    };

    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
    };
  }, []);

  if (count === 0) return null;

  return (
    <Badge 
      variant="destructive" 
      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
      data-testid="badge-cart-count"
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
}