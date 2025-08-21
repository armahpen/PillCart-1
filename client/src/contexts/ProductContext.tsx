import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as XLSX from 'xlsx';

export interface Product {
  id: string;
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
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addProduct: (newProduct: Omit<Product, 'id'>) => void;
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
  const [products, setProducts] = useState<Product[]>([]);

  // Load products once from Excel
  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('Loading products...');
        
        // Load Excel file
        const excelResponse = await fetch('/attached_assets/Merged_Product_Catalog_Cleaned_1755779630562.xlsx');
        
        if (excelResponse.ok) {
          const arrayBuffer = await excelResponse.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
          
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
          
          console.log('Excel loaded:', jsonData.length, 'rows');
          if (jsonData.length > 0) {
            console.log('Sample row keys:', Object.keys(jsonData[0]));
            console.log('Sample row:', jsonData[0]);
          }

          // Complete image mapping
          const imageMapping: Record<string, string> = {
            '1od90-JZ_KXMSF1C3pajNnFmOtAoLHKoU': '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.24 PM (1)_1755031702987.jpeg',
            '1awvX7IAxFP3Pv45BdxPciK7ofYwm3Nvl': '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.24 PM (2)_1755031702987.jpeg',
            '1geM1zrAbvqAFSM71weKsg7fPJ-fcAQnf': '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.25 PM (1)_1755031702989.jpeg',
            '1W9LF1lqEntMydtjJNcqt6TscyWCeJG-l': '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.17 PM (1)_1754947176458.jpeg',
            '1oyzoZPML9mCcDRGmJDevqUCac7qXivja': '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.19 PM (2)_1755031702975.jpeg',
            '1IXMFFcF7LftRGhj8UmITrV6X4b8K33-o': '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.15 PM_1755031702982.jpeg',
            '1F5vUsGQ-xOWGHQFLkIQ23UxBjsIj1dFE': '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.16 PM_1755031702983.jpeg',
          };

          // More flexible filtering - accept any row with some product name
          const validProducts = jsonData
            .filter((row, idx) => {
              const productName = row.ProductName || row['Product Name'] || row.name || row.Name || row.productName;
              const isValid = productName && String(productName).trim() !== '';
              if (idx < 3) {
                console.log(`Row ${idx}: productName = ${productName}, isValid = ${isValid}`);
              }
              return isValid;
            })
            .map((row, index) => {
              let imageUrl = '';
              
              // Use Direct_Link field from Excel
              const imageField = row.Direct_Link || row.ImageURL || row.imageUrl;
              if (imageField) {
                if (imageField.includes('drive.google.com')) {
                  const fileIdMatch = imageField.match(/id=([a-zA-Z0-9_-]+)/) || imageField.match(/\/d\/([a-zA-Z0-9_-]+)/);
                  if (fileIdMatch) {
                    const fileId = fileIdMatch[1];
                    imageUrl = imageMapping[fileId] || '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.15 PM_1755031702982.jpeg';
                  }
                } else if (imageField.startsWith('/attached_assets/')) {
                  imageUrl = imageField;
                }
              }
              
              // Ensure we have a fallback image
              if (!imageUrl) {
                imageUrl = '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.15 PM_1755031702982.jpeg';
              }

              const productName = row.ProductName || row['Product Name'] || row.name || row.Name || row.productName || '';
              const category = row.Category || row.category || '';
              const brand = row.Brand || row.brand || '';
              const price = parseFloat(row['Price(Ghc)'] || row.Price || row.price || '0') || 0;

              return {
                id: `excel-product-${index}`, // Unique ID for each product
                'Product Name': productName,
                name: productName, // Add both formats
                Category: category,
                category: category ? { name: category, id: category } : undefined,
                Brand: brand,
                brand: brand ? { name: brand, id: brand } : undefined,
                Price: price,
                price: price.toString(),
                ImageURL: imageUrl,
                imageUrl: imageUrl,
                ...row
              };
            });

          console.log(`Loaded ${validProducts.length} valid products from Excel`);
          setProducts(validProducts);
        }
      } catch (err) {
        console.error('Error loading products:', err);
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  // Simple synchronous CRUD operations
  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    console.log('ProductContext: Updating product', id, updatedFields);
    setProducts(prevProducts => {
      const updated = prevProducts.map(product =>
        product.id === id ? { ...product, ...updatedFields } : product
      );
      console.log('ProductContext: Update completed, new product:', updated.find(p => p.id === id));
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    console.log('ProductContext: Deleting product', id);
    setProducts(prevProducts => {
      const filtered = prevProducts.filter(product => product.id !== id);
      console.log('ProductContext: Delete completed, remaining products:', filtered.length);
      return filtered;
    });
  };

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    console.log('ProductContext: Adding product', newProduct);
    const productWithId = { id: `new-product-${Date.now()}`, ...newProduct };
    setProducts(prevProducts => {
      const updated = [...prevProducts, productWithId];
      console.log('ProductContext: Add completed, total products:', updated.length);
      return updated;
    });
  };

  return (
    <ProductContext.Provider value={{ products, updateProduct, deleteProduct, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};