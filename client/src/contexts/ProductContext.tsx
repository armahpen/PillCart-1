import React, { createContext, useContext, useState, useEffect } from "react";
import * as XLSX from 'xlsx';

export interface Product {
  id?: string | number;
  name?: string;
  'Product Name'?: string;
  Category?: string;
  Brand?: string;
  Price?: number;
  ImageURL?: string;
  category?: { name: string };
  brand?: { name: string };
  price?: string;
  imageUrl?: string;
  slug?: string;
  stockQuantity?: number;
  requiresPrescription?: boolean;
  rating?: string;
  reviewCount?: number;
  trackingId?: string;
}

const ProductContext = createContext<any>(undefined);
export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Load user-added products and categories from localStorage
  const loadUserData = () => {
    try {
      const savedProducts = localStorage.getItem('smile-pills-user-products');
      const savedCategories = localStorage.getItem('smile-pills-user-categories');
      
      if (savedProducts) {
        const userProducts = JSON.parse(savedProducts);
        console.log('Loaded user products from storage:', userProducts.length);
        return { userProducts, userCategories: savedCategories ? JSON.parse(savedCategories) : [] };
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
    }
    return { userProducts: [], userCategories: [] };
  };

  // Save user-added products to localStorage
  const saveUserProducts = (allProducts: Product[]) => {
    try {
      // Only save products with ID > SP-0252 (user-added products)
      const userProducts = allProducts.filter(p => {
        const id = p.id?.toString() || '';
        if (id.startsWith('SP-')) {
          const num = parseInt(id.replace('SP-', ''));
          return num > 252; // Excel products are SP-0001 to SP-0252
        }
        return false;
      });
      localStorage.setItem('smile-pills-user-products', JSON.stringify(userProducts));
    } catch (error) {
      console.error('Error saving user products:', error);
    }
  };

  // Save user categories to localStorage
  const saveUserCategories = (categories: string[]) => {
    try {
      localStorage.setItem('smile-pills-user-categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving user categories:', error);
    }
  };

  useEffect(() => {
    // Load user data first
    const { userProducts, userCategories } = loadUserData();
    
    // Only load products from Excel if we don't have any products yet
    if (products.length > 0) {
      console.log('Skipping Excel load - products already exist:', products.length);
      return;
    }
    
    // Load products from Excel file
    const loadProducts = async () => {
      try {
        console.log('Loading products from Excel...');
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
          console.log('First row sample:', JSON.stringify(jsonData[0]));
          console.log('Available columns:', Object.keys(jsonData[0] || {}));

          // Map products with IDs and clean up image URLs
          const mappedProducts = jsonData.map((row: any, index: number) => {
            let imageUrl = row['Direct_Link'] || row['ImageURL'] || '';
            
            // If it's a Google Drive URL, map to local files
            if (imageUrl && imageUrl.includes('drive.google.com')) {
              const availableImages = [
                '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.15 PM_1755031702982.jpeg',
                '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.16 PM_1755031702981.jpeg',
                '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.17 PM_1755031702979.jpeg',
                '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.18 PM_1755031702978.jpeg',
                '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.19 PM_1755031702977.jpeg'
              ];
              imageUrl = availableImages[index % availableImages.length];
            }
            
            const productName = row['ProductName'] || row['Product Name'] || row.name || row.Name;
            const brandName = row.Brand || row.brand;
            const categoryName = row.Category || row.category;
            const price = parseFloat(row['Price(Ghc)']) || row.Price || row.price || 0;
            
            const productId = `SP-${String(index + 1).padStart(4, '0')}`; // Format: SP-0001, SP-0002, etc.
            
            return {
              id: productId,
              // Keep original names for backward compatibility  
              'Product Name': productName,
              Category: categoryName,
              Brand: brandName,
              Price: price,
              ImageURL: imageUrl,
              // Add ProductCard-compatible names
              name: productName,
              imageUrl: imageUrl,
              price: price.toString(),
              slug: productName?.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').substring(0, 50) || `product-${index + 1}`,
              stockQuantity: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
              requiresPrescription: false, // Default to OTC
              rating: (Math.random() * 2 + 3).toFixed(1), // Random rating 3-5
              reviewCount: Math.floor(Math.random() * 50) + 5, // Random reviews 5-55
              brand: { name: brandName },
              category: { name: categoryName },
              trackingId: productId // Dedicated tracking ID
            };
          }).filter((product: any) => {
            // Filter out invalid products - more lenient
            const hasName = product['Product Name'];
            const hasPrice = product.Price;
            const hasCategory = product.Category;
            if (!hasName || !hasPrice || !hasCategory) {
              console.log('Filtered out product:', { hasName, hasPrice, hasCategory, product: JSON.stringify(product).slice(0, 200) });
            }
            return hasName && hasPrice && hasCategory;
          });
          
          console.log(`Loaded ${mappedProducts.length} valid products from Excel`);
          
          // Combine Excel products with user-added products (user products first for newest-first order)
          const { userProducts, userCategories } = loadUserData();
          const combinedProducts = [...userProducts, ...mappedProducts];
          
          setProducts(combinedProducts);
          setCustomCategories(userCategories);
          
          console.log("Loaded products into context:", combinedProducts.length, 'total products');
          console.log("User products:", userProducts.length);
          console.log("Excel products:", mappedProducts.length);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      }
    };
    
    loadProducts();
  }, []);

  const updateProduct = (id: string | number, updatedFields: Partial<Product>) => {
    setProducts(prev => {
      const updated = prev.map(product =>
        product.id === id ? { ...product, ...updatedFields } : product
      );
      saveUserProducts(updated); // Persist changes
      return updated;
    });
    
    // If the updated product has a new category, add it to categories
    const categoryName = updatedFields.Category || updatedFields.category?.name;
    if (categoryName && !customCategories.includes(categoryName)) {
      setCustomCategories(prev => {
        const updated = [...prev, categoryName];
        saveUserCategories(updated); // Persist categories
        return updated;
      });
    }
    
    console.log("Updated product:", id, updatedFields);
  };

  const deleteProduct = (id: string | number) => {
    setProducts(prev => {
      const filtered = prev.filter(product => product.id !== id);
      saveUserProducts(filtered); // Persist changes
      return filtered;
    });
    console.log("Deleted product:", id);
  };

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    // Generate ID based on existing products count (including Excel products)
    const nextId = products.length + 253; // Start after Excel products
    const productId = `SP-${String(nextId).padStart(4, '0')}`;    
    
    // Process the new product the same way as Excel products
    const productName = newProduct['Product Name'] || newProduct.name || '';
    const brandName = newProduct.Brand || '';
    const categoryName = newProduct.Category || '';
    const price = parseFloat(newProduct.Price?.toString() || '0');
    const imageUrl = newProduct.ImageURL || '';
    
    const processedProduct = {
      id: productId,
      // Keep original names for backward compatibility  
      'Product Name': productName,
      Category: categoryName,
      Brand: brandName,
      Price: price,
      ImageURL: imageUrl,
      // Add ProductCard-compatible names
      name: productName,
      imageUrl: imageUrl,
      price: price.toString(),
      slug: productName?.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').substring(0, 50) || `product-${nextId}`,
      stockQuantity: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
      requiresPrescription: false, // Default to OTC
      rating: (Math.random() * 2 + 3).toFixed(1), // Random rating 3-5
      reviewCount: Math.floor(Math.random() * 50) + 5, // Random reviews 5-55
      brand: { name: brandName },
      category: { name: categoryName },
      trackingId: productId // Dedicated tracking ID
    };
    
    // Add new products to the beginning of the array (newest first)
    setProducts(prev => {
      const updated = [processedProduct, ...prev];
      saveUserProducts(updated); // Persist new product
      return updated;
    });
    
    // Add category to custom categories if it doesn't exist
    if (categoryName && !customCategories.includes(categoryName)) {
      setCustomCategories(prev => {
        const updated = [...prev, categoryName];
        saveUserCategories(updated); // Persist categories
        return updated;
      });
    }
    
    console.log("Added processed product:", processedProduct);
  };

  const addCategory = (categoryName: string) => {
    if (!customCategories.includes(categoryName)) {
      setCustomCategories(prev => {
        const updated = [...prev, categoryName];
        saveUserCategories(updated); // Persist categories
        return updated;
      });
      console.log('Added new category:', categoryName);
    }
  };

  const updateCategory = (oldCategory: string, newCategory: string) => {
    // Update all products using the old category
    setProducts(prev =>
      prev.map(product => {
        const currentCategory = product.Category || product.category?.name;
        if (currentCategory === oldCategory) {
          return {
            ...product,
            Category: newCategory,
            category: { name: newCategory }
          };
        }
        return product;
      })
    );
    
    // Update the categories list
    setCustomCategories(prev => {
      const updated = prev.map(category => category === oldCategory ? newCategory : category);
      saveUserCategories(updated); // Persist categories
      return updated;
    });
    
    // Also save updated products
    setProducts(prev => {
      saveUserProducts(prev);
      return prev;
    });
    
    console.log('Updated category:', oldCategory, 'to', newCategory);
  };

  const deleteCategory = (categoryToRemove: string) => {
    // Remove all products in this category
    setProducts(prev =>
      prev.filter(product => {
        const productCategory = product.Category || product.category?.name;
        return productCategory !== categoryToRemove;
      })
    );
    
    // Remove from categories list
    setCustomCategories(prev => {
      const updated = prev.filter(category => category !== categoryToRemove);
      saveUserCategories(updated); // Persist categories
      return updated;
    });
    
    // Also save updated products  
    setProducts(prev => {
      saveUserProducts(prev);
      return prev;
    });
    
    console.log('Deleted category and all products:', categoryToRemove);
  };

  // Extract categories from products AND custom categories
  const allCategories = Array.from(
    new Set([
      ...products.map((p: any) => p.Category).filter(Boolean),
      ...customCategories
    ])
  );

  return (
    <ProductContext.Provider value={{ 
      products, 
      updateProduct, 
      deleteProduct, 
      addProduct, 
      customCategories, 
      addCategory, 
      updateCategory, 
      deleteCategory,
      categories: allCategories
    }}>
      {children}
    </ProductContext.Provider>
  );
};