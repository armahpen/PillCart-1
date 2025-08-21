import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

  // Fetch products from API
  const { data: apiResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products?limit=1000');
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      return response.json();
    },
  });

  const products: Product[] = apiResponse?.products || [];

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

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (newProduct: Omit<Product, 'id'>) => {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newProduct),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
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