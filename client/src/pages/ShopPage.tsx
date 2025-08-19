import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ShoppingCart, Grid, List } from 'lucide-react';

// Google Drive URLs are already in the correct format from the Excel file

interface Product {
  Category: string;
  ProductName: string;
  Brand: string;
  'Price(Ghc)': number;
  Direct_Link: string;
}

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'brand'>('name');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load product catalog from JSON file
    fetch('/product_catalog.json')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        const uniqueCategories = Array.from(new Set(data.map((item: Product) => item.Category).filter(Boolean)));
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading product catalog:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.Category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.ProductName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.Brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.ProductName.localeCompare(b.ProductName);
        case 'price':
          return a['Price(Ghc)'] - b['Price(Ghc)'];
        case 'brand':
          return a.Brand.localeCompare(b.Brand);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, sortBy]);

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const category = product.Category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading authentic catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Smile Pills Ltd Catalog
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {filteredProducts.length} authentic pharmaceutical products
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  data-testid="button-grid-view"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  data-testid="button-list-view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </h3>
                
                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
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
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
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
              </div>

              {/* Category Summary */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Categories ({categories.length})
                </h4>
                <div className="space-y-2">
                  {categories.slice(0, 8).map(category => {
                    const count = products.filter(p => p.Category === category).length;
                    return (
                      <div
                        key={category}
                        className="flex justify-between text-sm cursor-pointer hover:text-blue-600"
                        onClick={() => setSelectedCategory(category)}
                      >
                        <span className="truncate">{category}</span>
                        <Badge variant="secondary" className="ml-2">{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {selectedCategory !== 'All' ? (
              /* Single Category View */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedCategory}
                  </h2>
                  <Badge variant="outline" data-testid="text-product-count">
                    {filteredProducts.length} products
                  </Badge>
                </div>
                
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={`${product.ProductName}-${index}`} product={product} viewMode={viewMode} />
                  ))}
                </div>
              </div>
            ) : (
              /* All Categories View - Grouped */
              <div className="space-y-12">
                {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {category}
                      </h2>
                      <Badge variant="outline" data-testid={`text-category-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}-count`}>
                        {categoryProducts.length} products
                      </Badge>
                    </div>
                    
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                      {categoryProducts.map((product, index) => (
                        <ProductCard key={`${product.ProductName}-${index}`} product={product} viewMode={viewMode} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search criteria or category filter
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

function ProductCard({ product, viewMode }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    console.log('Image failed to load:', product.Direct_Link);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', product.Direct_Link);
    setImageLoading(false);
  };

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200" data-testid={`card-product-${product.ProductName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
        <CardContent className="p-0">
          <div className="flex">
            <div className="w-32 h-32 flex-shrink-0 relative bg-gray-100 dark:bg-gray-700">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}
              {!imageError && product.Direct_Link ? (
                <img
                  src={product.Direct_Link}
                  alt={product.ProductName}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  data-testid={`img-product-${product.ProductName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
              )}
            </div>
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2" data-testid={`text-name-${product.ProductName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                  {product.ProductName}
                </h3>
                <div className="text-right ml-4">
                  <p className="text-xl font-bold text-blue-600" data-testid={`text-price-${product.ProductName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                    ₵{(product['Price(Ghc)'] || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2" data-testid={`text-brand-${product.ProductName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                {product.Brand}
              </p>
              <Badge variant="outline" className="mb-4" data-testid={`badge-category-${product.ProductName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                {product.Category}
              </Badge>
              <Button className="w-full" data-testid={`button-add-to-cart-${product.ProductName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200" data-testid={`card-product-${product.ProductName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
      <CardContent className="p-0">
        <div className="aspect-square relative bg-gray-100 dark:bg-gray-700">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          {!imageError && product.Direct_Link ? (
            <img
              src={product.Direct_Link}
              alt={product.ProductName}
              className="w-full h-full object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
              data-testid={`img-product-${product.ProductName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1" data-testid={`text-name-${product.ProductName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
              {product.ProductName}
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2" data-testid={`text-brand-${product.ProductName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
            {product.Brand}
          </p>
          <Badge variant="outline" className="mb-4" data-testid={`badge-category-${product.ProductName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
            {product.Category}
          </Badge>
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold text-blue-600" data-testid={`text-price-${product.ProductName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
              ₵{(product['Price(Ghc)'] || 0).toFixed(2)}
            </p>
            <Button size="sm" data-testid={`button-add-to-cart-${product.ProductName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}