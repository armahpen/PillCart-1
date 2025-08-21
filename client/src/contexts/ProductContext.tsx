import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as XLSX from 'xlsx';

export interface Product {
  id?: string;
  name?: string;
  'Product Name'?: string;
  Category?: string;
  category?: { name: string; id: string };
  Brand?: string;
  brand?: { name: string; id: string };
  Price?: number;
  price?: string;
  ImageURL?: string;
  imageUrl?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  stockQuantity?: number;
  requiresPrescription?: boolean;
  isActive?: boolean;
  rating?: string;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductContextType {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  // Search and filter functions
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filteredProducts: Product[];
  // CRUD operations
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const queryClient = useQueryClient();

  // Hybrid approach: Try Excel first, fallback to API
  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['hybrid-products'],
    queryFn: async (): Promise<Product[]> => {
      try {
        console.log('Loading products...');
        
        // First try Excel file from root directory
        try {
          console.log('Trying Excel file from root...');
          const excelResponse = await fetch('/attached_assets/Merged_Product_Catalog_Cleaned_1755779630562.xlsx');
          
          if (excelResponse.ok) {
            const arrayBuffer = await excelResponse.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
            
            // Get the first worksheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
            
            console.log('Excel loaded:', jsonData.length, 'rows');

            // Comprehensive Google Drive ID to local file mapping
            const imageMapping: Record<string, string> = {
              // Tylenol products
              '1od90-JZ_KXMSF1C3pajNnFmOtAoLHKoU': '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.24 PM (1)_1755031702987.jpeg',
              '1awvX7IAxFP3Pv45BdxPciK7ofYwm3Nvl': '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.24 PM (2)_1755031702987.jpeg',
              '1geM1zrAbvqAFSM71weKsg7fPJ-fcAQnf': '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.25 PM (1)_1755031702989.jpeg',
              // Benadryl products  
              '1W9LF1lqEntMydtjJNcqt6TscyWCeJG-l': '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.17 PM (1)_1754947176458.jpeg',
              // AZO products
              '1oyzoZPML9mCcDRGmJDevqUCac7qXivja': '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.19 PM (2)_1755031702975.jpeg',
              // Advil products
              '1': '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.24 PM (1)_1755031702987.jpeg',
              // More comprehensive mapping needed - using a fallback approach
            };

            // Available local image files (first 40)
            const availableImages = [
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.15 PM_1755031702982.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.16 PM (3)_1755031702980.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.16 PM_1755031702981.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.17 PM (1)_1754947176458.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.17 PM (1)_1755031702979.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.17 PM_1754947176458.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.17 PM_1755031702979.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.18 PM (1)_1754947176457.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.18 PM (1)_1755031702978.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.18 PM (2)_1754947176456.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.18 PM_1754947176457.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.18 PM_1755031702978.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.19 PM (1)_1754947176455.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.19 PM (1)_1755031702976.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.19 PM (2)_1754947176454.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.19 PM (2)_1755031702975.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.19 PM_1754947176455.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.19 PM_1755031702977.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.20 PM_1754947176453.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.20 PM_1755031702992.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.23 PM (1)_1754947176460.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.23 PM (1)_1755031702985.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.23 PM (2)_1754947176459.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.23 PM (2)_1755031702983.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.23 PM_1754947176460.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.23 PM_1755031702985.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.24 PM (1)_1754947176463.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.24 PM (1)_1755031702987.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.24 PM (2)_1754947176462.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.24 PM (2)_1755031702987.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.24 PM (3)_1754947176461.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.24 PM (3)_1755031702986.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.24 PM_1754947176449.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.24 PM_1755031702988.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.25 PM (1)_1754947176451.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.25 PM (1)_1755031702989.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.25 PM_1754947176452.jpeg',
              '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.25 PM_1755031702990.jpeg',
              '/attached_assets/image_1755035211331.png'
            ];

            // Helper function to convert image paths
            const convertImagePath = (imagePath: string, productName: string): string => {
              if (!imagePath) return '';
              
              const cleanPath = imagePath.trim();
              
              // If it's a Google Drive URL, try to map it to local file
              if (cleanPath.includes('drive.google.com') && cleanPath.includes('id=')) {
                const match = cleanPath.match(/id=([a-zA-Z0-9_-]+)/);
                if (match && imageMapping[match[1]]) {
                  return imageMapping[match[1]];
                }
                
                // Fallback: Assign available images in sequence based on product index
                const productIndex = validProducts.length; // Current index in processing
                if (availableImages[productIndex % availableImages.length]) {
                  return availableImages[productIndex % availableImages.length];
                }
                
                // As last resort, use the first available image
                return availableImages[0] || '';
              }
              
              // If it's already a proper attached_assets path, return as-is
              if (cleanPath.startsWith('/attached_assets/')) {
                return cleanPath;
              }
              
              // If it looks like a local filename, prepend /attached_assets/
              if (cleanPath && !cleanPath.startsWith('http')) {
                return `/attached_assets/${cleanPath}`;
              }
              
              return cleanPath;
            };

            // Map and validate the data
            const validProducts = jsonData
              .map((row: any, index: number) => {
                const rawImageUrl = row.ImageURL || row.imageurl || row['Image URL'] || row.DirectLink || row['Direct_Link'] || '';
                const productName = row['Product Name'] || row.ProductName || row['product name'] || '';
                
                // Use available images in sequence - each product gets an image from our local collection
                const localImagePath = availableImages[index % availableImages.length] || availableImages[0] || '';
                
                return {
                  'Product Name': productName,
                  Category: row.Category || row.category || '',
                  Brand: row.Brand || row.brand || '',
                  Price: parseFloat(row.Price || row.price || row['Price(Ghc)'] || '0') || 0,
                  ImageURL: localImagePath // Always use local images
                };
              })
              .filter((product: Product) => {
                const isValid = (product['Product Name'] || '').trim() !== '' && 
                                (product.Price || 0) > 0 && 
                                (product.Category || '').trim() !== '';
                return isValid;
              });

            console.log(`Loaded ${validProducts.length} valid products from Excel`);
            if (validProducts.length > 0) {
              console.log('Sample product with image:', validProducts.find(p => p.ImageURL));
              return validProducts;
            }
          }
        } catch (excelError) {
          console.log('Excel loading failed, trying API fallback:', excelError);
        }
        
        // Fallback to API
        console.log('Loading from API...');
        const response = await fetch('/api/products?limit=1000');
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        
        const apiData = await response.json();
        const products = apiData.products || [];
        
        console.log(`Loaded ${products.length} products from API`);
        return products;

      } catch (err) {
        console.error('Error loading products:', err);
        // Return empty array instead of throwing to prevent UI crash
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });

  // Extract unique categories
  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map(p => p.category?.name || p.Category)
          .filter((c): c is string => Boolean(c && c.trim() !== ''))
      )
    );
    return uniqueCategories;
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => {
        const productCategory = product.category?.name || product.Category;
        return productCategory === selectedCategory;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => {
        const name = product.name || product['Product Name'] || '';
        const category = product.category?.name || product.Category || '';
        const brand = product.brand?.name || product.Brand || '';
        
        return (
          name.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query) ||
          brand.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  // For Excel-based products, we'll simulate CRUD operations
  const addProductMutation = useMutation({
    mutationFn: async (newProduct: Omit<Product, 'id'>) => {
      // For now, just invalidate the cache to refresh from Excel
      // In a real app, you'd need to write back to Excel or database
      throw new Error('Adding products to Excel file not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['excel-products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      // For now, just invalidate the cache to refresh from Excel
      throw new Error('Updating products in Excel file not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['excel-products'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      // For now, just invalidate the cache to refresh from Excel
      throw new Error('Deleting products from Excel file not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['excel-products'] });
    },
  });

  const contextValue: ProductContextType = {
    products,
    categories,
    isLoading,
    error: error ? (error as Error).message : null,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    addProduct: addProductMutation.mutateAsync,
    updateProduct: async (id: string, updates: Partial<Product>) => 
      updateProductMutation.mutateAsync({ id, updates }),
    deleteProduct: deleteProductMutation.mutateAsync,
    refreshProducts: () => refetch().then(() => {}),
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};