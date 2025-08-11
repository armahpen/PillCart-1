import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { formatPrice } from "@/lib/currency";
import { Link } from "wouter";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    originalPrice?: string;
    dosage?: string;
    imageUrl?: string;
    stockQuantity: number;
    requiresPrescription: boolean;
    rating?: string;
    reviewCount: number;
    brand?: {
      name: string;
    };
    category?: {
      name: string;
    };
  };
  variant?: "grid" | "list";
}

export default function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please Login",
          description: "You need to be logged in to add items to cart.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Please Login",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }

    addToCartMutation.mutate();
  };

  const isInStock = product.stockQuantity > 0;
  const rating = parseFloat(product.rating || "0");

  if (variant === "list") {
    return (
      <Link href={`/product/${product.slug}`}>
        <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative flex-shrink-0">
                <img
                  src={product.imageUrl || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&h=200"}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                {!isInStock && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <Badge variant="destructive" className="text-xs">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={product.requiresPrescription ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {product.requiresPrescription ? "Rx" : "OTC"}
                    </Badge>
                    {isInStock ? (
                      <Badge variant="default" className="bg-secondary text-white text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-gray-600 text-xs ml-1">({product.reviewCount})</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-1 text-neutral line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{product.brand?.name}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-neutral">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    {product.dosage && (
                      <Badge variant="outline" className="text-xs">
                        {product.dosage}
                      </Badge>
                    )}
                  </div>
                  
                  {product.requiresPrescription ? (
                    <Button size="sm" variant="outline" disabled={!isInStock} onClick={handleAddToCart}>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Upload Rx
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleAddToCart}
                      disabled={!isInStock || addToCartMutation.isPending}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/product/${product.slug}`}>
      <Card 
        className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&h=200"}
            alt={product.name}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Stock status badge */}
          <div className="absolute top-3 right-3">
            {!isInStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>
          
          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-3 left-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-opacity ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
          </Button>

          {!isInStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <Badge 
              variant={product.requiresPrescription ? "destructive" : "secondary"}
              className="text-xs"
            >
              {product.requiresPrescription ? "Rx" : "OTC"}
            </Badge>
            {product.dosage && (
              <Badge variant="outline" className="text-xs">
                {product.dosage}
              </Badge>
            )}
          </div>
          
          <h3 className="font-semibold text-sm mb-1 text-neutral line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs mb-2">{product.brand?.name}</p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-gray-500 text-xs ml-1">({product.reviewCount})</span>
            </div>
          </div>
          
          {product.requiresPrescription ? (
            <Button
              size="sm"
              className="w-full bg-accent text-white hover:bg-red-700 text-xs"
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              <AlertCircle className="mr-1 h-3 w-3" />
              Upload Rx
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-full text-xs"
              onClick={handleAddToCart}
              disabled={!isInStock || addToCartMutation.isPending}
            >
              <ShoppingCart className="mr-1 h-3 w-3" />
              {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
