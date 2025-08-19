import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';

export function CartBadge() {
  const { getCartCount } = useCart();
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCartCount());
    
    // Listen for cart updates
    const handleCartUpdate = (event: CustomEvent) => {
      setCount(event.detail.count);
    };

    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
    };
  }, [getCartCount]);

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