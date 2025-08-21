import { useState, useEffect } from "react";
import { Search, Grid, List, Filter, ChevronDown, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import * as XLSX from 'xlsx';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/header';
import { useProducts, type Product } from '@/contexts/ProductContext';

interface ProductCardProps {
  product: any;
  viewMode: 'grid' | 'list';
}

function ProductCard({ product, viewMode }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();

  // Safely get product details with fallbacks for both formats
  const productName = product['Product Name'] || '';
  const productBrand = product.Brand || '';
  const productCategory = product.Category || '';
  const productPrice = parseFloat(product.Price?.toString() || '0') || 0;
  const productImageUrl = product.ImageURL || '';

  const handleAddToCart = () => {
    addToCart({
      id: String(product.id),
      'Product Name': product['Product Name'],
      Category: product.Category,
      Brand: product.Brand,
      Price: product.Price,
      ImageURL: product.ImageURL,
    });
    toast({
      title: "Added to cart",
      description: `${productName} has been added to your cart.`,
    });
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-2">
          <div className="flex gap-4">
            <div className="w-12 h-12 flex-shrink-0">
              {!imageError && productImageUrl ? (
                <img
                  src={productImageUrl}
                  alt={productName}
                  className="w-full h-full object-contain rounded-md p-1"
                  onError={(e) => {
                    console.log('Image load error for:', productName, 'URL:', productImageUrl);
                    setImageError(true);
                  }}
                  onLoad={() => console.log('Image loaded successfully:', productName)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-md flex flex-col items-center justify-center p-2">
                  <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mb-1">
                    <ShoppingCart className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="text-xs text-gray-600 text-center leading-tight">
                    {productBrand}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
                {productName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {productBrand}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-secondary">
                  ₵{productPrice.toFixed(2)}
                </span>
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="bg-secondary hover:bg-secondary/90"
                  data-testid={`button-add-cart-list-${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {isInCart(product) ? 'Added' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square w-full">
          {!imageError && productImageUrl ? (
            <img
              src={productImageUrl}
              alt={productName}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200 p-8"
              onError={(e) => {
                console.log('Image load error for:', productName, 'URL:', productImageUrl);
                setImageError(true);
              }}
              onLoad={() => console.log('Image loaded successfully:', productName)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-5">
              <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-10 w-10 text-secondary" />
              </div>
              <span className="text-sm text-gray-600 text-center font-medium">
                {productBrand}
              </span>
              <span className="text-xs text-gray-500 text-center mt-1">
                Product Image
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-2 min-h-[2rem] text-sm">
            {productName}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-2 truncate">
            {productBrand}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-secondary">
              ₵{productPrice.toFixed(2)}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className={`h-7 px-3 text-xs ${
                isInCart(product) 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-secondary hover:bg-secondary/90'
              }`}
              data-testid={`button-add-cart-grid-${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              {isInCart(product) ? 'Added' : 'Add'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ShopPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'brand'>('name');
  
  // Use ProductContext for shared state management
  const { products, categories: allCategories, customCategories } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Filter products based on search and category
  const filteredProducts = products.filter((product: any) => {
    const name = product['Product Name'] || '';
    const category = product.Category || '';
    const brand = product.Brand || '';
    
    // Search filter
    const matchesSearch = !searchQuery || 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter  
    const matchesCategory = selectedCategory === 'All' || category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Use categories from context to ensure consistency - force update when context changes
  const categories: string[] = allCategories || [];
  
  // Force re-render when categories change
  useEffect(() => {
    console.log('ShopPage: Categories updated:', categories);
  }, [categories, customCategories]);

  // Apply sorting only when specifically requested, otherwise maintain context order (newest first)
  const displayProducts = sortBy === 'name' && searchQuery === '' && selectedCategory === 'All' 
    ? filteredProducts // Maintain context order for default state
    : [...filteredProducts].sort((a, b) => {
        const priceA = parseFloat(a.Price?.toString() || '0');
        const priceB = parseFloat(b.Price?.toString() || '0');
        const nameA = a['Product Name'] || '';
        const nameB = b['Product Name'] || '';
        const brandA = a.Brand || '';
        const brandB = b.Brand || '';

        switch (sortBy) {
          case 'price':
            return priceA - priceB;
          case 'brand':
            return brandA.localeCompare(brandB);
          case 'name':
          default:
            return nameA.localeCompare(nameB);
        }
      });


  // Group products by category for "All" view
  const groupedProducts: Record<string, any[]> = categories.reduce((acc: Record<string, any[]>, category: string) => {
    acc[category] = displayProducts.filter((p: any) => p.Category === category);
    return acc;
  }, {} as Record<string, any[]>);

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shop Our Products
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse our comprehensive collection of pharmaceutical products and health supplements
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <div className="min-w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((category: string) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="min-w-40">
                <Select value={sortBy} onValueChange={(value: 'name' | 'price' | 'brand') => setSortBy(value)}>
                  <SelectTrigger data-testid="select-sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Product Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-200 dark:border-gray-700 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                  data-testid="button-view-grid"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                  data-testid="button-view-list"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Summary Chips */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'All' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('All')}
              className="text-xs"
            >
              All ({products.length})
            </Button>
            {categories.slice(0, 8).map(category => {
              const count = products.filter((p: any) => p.Category === category).length;
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category} ({count})
                </Button>
              );
            })}
            {categories.length > 8 && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs opacity-50"
                disabled
              >
                +{categories.length - 8} more
              </Button>
            )}
          </div>
        </div>



        {/* Products Grid */}
        <div>
          {displayProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : selectedCategory !== 'All' ? (
            /* Single Category View */
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCategory}
                </h2>
                <Badge variant="outline" data-testid="text-product-count">
                  {displayProducts.length} products
                </Badge>
              </div>
              
              <div className={`grid gap-6 mt-6 mb-8 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'}`}>
                {displayProducts.map((product: any, index: number) => (
                  <ProductCard key={`${product.id || product.name || product['Product Name']}-${index}`} product={product} viewMode={viewMode} />
                ))}
              </div>
            </div>
          ) : (
            /* All Categories View - Grouped */
            <div className="space-y-12">
              {Object.entries(groupedProducts).map(([category, categoryProducts]: [string, any[]]) => (
                categoryProducts.length > 0 && (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {category}
                      </h2>
                      <Badge variant="outline" data-testid={`text-category-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}-count`}>
                        {categoryProducts.length} products
                      </Badge>
                    </div>
                    
                    <div className={`grid gap-6 mt-6 mb-8 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'}`}>
                      {categoryProducts.map((product: any, index: number) => (
                        <ProductCard key={`${product.id || product.name || product['Product Name']}-${index}`} product={product} viewMode={viewMode} />
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}