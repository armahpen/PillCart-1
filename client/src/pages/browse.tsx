import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Search, Filter, ChevronUp, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

interface Product {
  id: string;
  name: string;
  slug: string;
  brand?: { name: string };
  category?: { name: string; slug: string };
  price: string;
  originalPrice?: string;
  imageUrl: string;
  stockQuantity: number;
  requiresPrescription: boolean;
  rating: string;
  reviewCount: number;
  shortDescription?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Brand {
  id: string;
  name: string;
}

type SortOption = 'relevant' | 'name' | 'price-low' | 'price-high' | 'rating';
type ViewMode = 'grid' | 'list';

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>('relevant');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Fetch brands
  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        product.category?.slug === selectedCategory;
      
      const matchesBrand = selectedBrand === 'all' || 
        product.brand?.name === selectedBrand;
        
      const matchesStock = !showInStockOnly || product.stockQuantity > 0;
      
      return matchesSearch && matchesCategory && matchesBrand && matchesStock;
    });

    // Sort products
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, selectedBrand, sortBy, showInStockOnly]);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    filteredProducts.forEach(product => {
      const categoryName = product.category?.name || 'Uncategorized';
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(product);
    });
    return grouped;
  }, [filteredProducts]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCategory = (categorySlug: string) => {
    const element = document.getElementById(`category-${categorySlug}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-blue-900">
                Browse All Products
              </h1>
              <Badge variant="secondary">
                {filteredProducts.length} products
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products or brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
              
              {/* View mode toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">Refine your search</h2>
              
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        selectedCategory === category.slug
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick category links */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Quick Links</h3>
                <div className="space-y-1">
                  {Object.keys(productsByCategory).slice(0, 8).map((categoryName) => {
                    const category = categories.find(c => c.name === categoryName);
                    return (
                      <button
                        key={categoryName}
                        onClick={() => category && scrollToCategory(category.slug)}
                        className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {categoryName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Brands</h3>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.name}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Availability */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Availability</h3>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">In stock only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort Controls */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {filteredProducts.length} products
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevant">Most Relevant</SelectItem>
                        <SelectItem value="name">A - Z</SelectItem>
                        <SelectItem value="rating">Best Rating</SelectItem>
                        <SelectItem value="price-high">Price High - Low</SelectItem>
                        <SelectItem value="price-low">Price Low - High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Products by Category */}
            <div className="space-y-8">
              {Object.entries(productsByCategory).map(([categoryName, products]) => {
                const category = categories.find(c => c.name === categoryName);
                return (
                  <div key={categoryName} id={`category-${category?.slug || 'uncategorized'}`}>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{categoryName}</h2>
                      <div className="h-1 w-20 bg-blue-600 rounded"></div>
                    </div>

                    <div className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                    }`}>
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          viewMode={viewMode}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedBrand("all");
                  setShowInStockOnly(false);
                }}>
                  Clear all filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 p-0"
          size="sm"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  viewMode: ViewMode;
}

function ProductCard({ product, viewMode }: ProductCardProps) {
  const isOutOfStock = product.stockQuantity === 0;
  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&h=300";
                  }}
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Out of Stock</span>
                  </div>
                )}
                {hasDiscount && (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    Sale
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  {!isOutOfStock && (
                    <Badge variant="secondary" className="mb-2 bg-green-100 text-green-800">
                      In stock
                    </Badge>
                  )}
                  <Link
                    href={`/product/${product.slug}`}
                    className="block font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2"
                  >
                    {product.name}
                  </Link>
                  {product.brand && (
                    <p className="text-sm text-gray-500 mb-2">{product.brand.name}</p>
                  )}
                  {product.shortDescription && (
                    <p className="text-sm text-gray-600 line-clamp-2">{product.shortDescription}</p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-500">From</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">₵{product.price}</span>
                      {hasDiscount && (
                        <span className="text-lg text-gray-500 line-through">
                          ₵{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i < Math.floor(parseFloat(product.rating))
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
                {product.requiresPrescription && (
                  <Badge variant="outline" className="text-xs">
                    Prescription Required
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow group">
      <CardContent className="p-0">
        <div className="aspect-square bg-gray-100 relative overflow-hidden rounded-t-lg">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&h=300";
            }}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
          {hasDiscount && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              Sale
            </Badge>
          )}
          {!isOutOfStock && (
            <Badge variant="secondary" className="absolute top-2 left-2 bg-green-100 text-green-800">
              In stock
            </Badge>
          )}
        </div>
        <div className="p-4">
          <Link
            href={`/product/${product.slug}`}
            className="block font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2"
          >
            {product.name}
          </Link>
          {product.brand && (
            <p className="text-sm text-gray-500 mb-3">{product.brand.name}</p>
          )}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    i < Math.floor(parseFloat(product.rating))
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviewCount})
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">From</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">₵{product.price}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ₵{product.originalPrice}
                </span>
              )}
            </div>
          </div>
          {product.requiresPrescription && (
            <Badge variant="outline" className="text-xs mt-2">
              Prescription Required
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}