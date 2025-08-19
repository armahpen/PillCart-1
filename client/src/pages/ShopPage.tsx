import { useState, useEffect } from "react";
import { Search, Grid, List, Filter, ChevronDown, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import * as XLSX from 'xlsx';

interface Product {
  Category: string;
  'Product Name': string;
  Brand: string;
  Price: number;
  ImageURL: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

function ProductCard({ product, viewMode }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    console.log('Adding to cart:', product['Product Name']);
    // TODO: Implement add to cart functionality
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-2">
          <div className="flex gap-4">
            <div className="w-12 h-12 flex-shrink-0">
              {!imageError && product.ImageURL ? (
                <img
                  src={product.ImageURL}
                  alt={product['Product Name']}
                  className="w-full h-full object-contain rounded-md p-1"
                  onError={(e) => {
                    console.log('Image load error for:', product['Product Name'], 'URL:', product.ImageURL);
                    // Try fallback URL format
                    const img = e.target as HTMLImageElement;
                    if (img.src.includes('thumbnail?id=')) {
                      // Extract file ID and try direct uc format
                      const fileIdMatch = img.src.match(/id=([a-zA-Z0-9_-]+)/);
                      if (fileIdMatch) {
                        const fallbackUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
                        if (img.src !== fallbackUrl) {
                          img.src = fallbackUrl;
                          return;
                        }
                      }
                    }
                    setImageError(true);
                  }}
                  onLoad={() => console.log('Image loaded successfully:', product['Product Name'])}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-md flex flex-col items-center justify-center p-2">
                  <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mb-1">
                    <ShoppingCart className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="text-xs text-gray-600 text-center leading-tight">
                    {product.Brand}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
                {product['Product Name']}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {product.Brand}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-secondary">
                  ₵{product.Price.toFixed(2)}
                </span>
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="bg-secondary hover:bg-secondary/90"
                  data-testid={`button-add-cart-${product['Product Name'].toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
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
          {!imageError && product.ImageURL ? (
            <img
              src={product.ImageURL}
              alt={product['Product Name']}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200 p-4"
              onError={(e) => {
                console.log('Image load error for:', product['Product Name'], 'URL:', product.ImageURL);
                // Try fallback URL format
                const img = e.target as HTMLImageElement;
                if (img.src.includes('thumbnail?id=')) {
                  // Extract file ID and try direct uc format
                  const fileIdMatch = img.src.match(/id=([a-zA-Z0-9_-]+)/);
                  if (fileIdMatch) {
                    const fallbackUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
                    if (img.src !== fallbackUrl) {
                      img.src = fallbackUrl;
                      return;
                    }
                  }
                }
                setImageError(true);
              }}
              onLoad={() => console.log('Image loaded successfully:', product['Product Name'])}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-3">
                <ShoppingCart className="h-8 w-8 text-secondary" />
              </div>
              <span className="text-sm text-gray-600 text-center font-medium">
                {product.Brand}
              </span>
              <span className="text-xs text-gray-500 text-center mt-1">
                Product Image
              </span>
            </div>
          )}
        </div>
        <div className="p-2">
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-1 min-h-[2rem] text-xs">
            {product['Product Name']}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-1 truncate">
            {product.Brand}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-secondary">
              ₵{product.Price.toFixed(2)}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-secondary hover:bg-secondary/90 h-6 w-6 p-0"
              data-testid={`button-add-cart-${product['Product Name'].toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            >
              <ShoppingCart className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProductsFromExcel();
  }, []);

  const loadProductsFromExcel = async () => {
    try {
      console.log('Loading Excel file...');
      const response = await fetch('/product_catalog.xlsx');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Excel file: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
      
      // Get the first worksheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
      
      console.log('Raw Excel data:', jsonData.length, 'rows');
      console.log('Sample row:', jsonData[0]);

      // Helper function to convert Google Drive URLs to direct image URLs
      const convertGoogleDriveUrl = (url: string): string => {
        if (!url) return '';
        
        // Extract file ID from various Google Drive URL formats
        let fileId = '';
        
        if (url.includes('/file/d/')) {
          // Format: https://drive.google.com/file/d/FILE_ID/view
          const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
          if (match) fileId = match[1];
        } else if (url.includes('id=')) {
          // Format: https://drive.google.com/open?id=FILE_ID or uc?export=view&id=FILE_ID
          const match = url.match(/id=([a-zA-Z0-9_-]+)/);
          if (match) fileId = match[1];
        } else if (url.includes('/d/')) {
          // Format: https://drive.google.com/d/FILE_ID
          const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
          if (match) fileId = match[1];
        }
        
        // Convert to thumbnail format which works better for public access
        if (fileId) {
          // Try Google Drive thumbnail API which is more reliable for public files
          return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`;
        }
        
        return url; // Return original if no conversion possible
      };

      // Map and validate the data
      const validProducts = jsonData
        .map((row: any) => {
          const rawImageUrl = row.ImageURL || row.imageurl || row['Image URL'] || row.DirectLink || row['Direct_Link'] || '';
          
          return {
            Category: row.Category || row.category || '',
            'Product Name': row['Product Name'] || row.ProductName || row['product name'] || '',
            Brand: row.Brand || row.brand || '',
            Price: parseFloat(row.Price || row.price || row['Price(Ghc)'] || '0') || 0,
            ImageURL: convertGoogleDriveUrl(rawImageUrl)
          };
        })
        .filter((product: Product) => {
          const isValid = product['Product Name'].trim() !== '' && 
                          product.Price > 0 && 
                          product.Category.trim() !== '';
          
          if (!isValid) {
            console.log('Filtered out invalid product:', product);
          }
          return isValid;
        });

      console.log(`Loaded ${validProducts.length} valid products from Excel`);
      
      setProducts(validProducts);
      setFilteredProducts(validProducts);
      
      const uniqueCategories = Array.from(
        new Set(validProducts.map(p => p.Category).filter(Boolean))
      ) as string[];
      setCategories(uniqueCategories);
      
      console.log('Categories found:', uniqueCategories);
      setLoading(false);

    } catch (err) {
      console.error('Error loading Excel file:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
      setLoading(false);
    }
  };

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.Category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product['Product Name'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.Brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.Category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a['Product Name'].localeCompare(b['Product Name']);
        case 'price':
          return a.Price - b.Price;
        case 'brand':
          return a.Brand.localeCompare(b.Brand);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Group products by category for "All" view
  const groupedProducts = categories.reduce((acc, category) => {
    acc[category] = filteredProducts.filter(p => p.Category === category);
    return acc;
  }, {} as Record<string, Product[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading products from Excel...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <Search className="h-12 w-12 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Failed to load products
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error}
              </p>
              <Button onClick={loadProductsFromExcel}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                    {categories.map(category => (
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
              const count = products.filter(p => p.Category === category).length;
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
          </div>
        </div>



        {/* Products Grid */}
        <div>
          {filteredProducts.length === 0 ? (
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
                  {filteredProducts.length} products
                </Badge>
              </div>
              
              <div className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-4' : 'grid-cols-1'}`}>
                {filteredProducts.map((product, index) => (
                  <ProductCard key={`${product['Product Name']}-${index}`} product={product} viewMode={viewMode} />
                ))}
              </div>
            </div>
          ) : (
            /* All Categories View - Grouped */
            <div className="space-y-12">
              {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
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
                    
                    <div className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-4' : 'grid-cols-1'}`}>
                      {categoryProducts.map((product, index) => (
                        <ProductCard key={`${product['Product Name']}-${index}`} product={product} viewMode={viewMode} />
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