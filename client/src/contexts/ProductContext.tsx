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
}

const ProductContext = createContext<any>(undefined);
export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
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
            let imageUrl = row['ImageURL'] || '';
            
            // If it's a Google Drive URL, map to local files
            if (imageUrl && imageUrl.includes('drive.google.com')) {
              const availableImages = [
                '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.15 PM_1755031702982.jpeg',
                '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.16 PM_1755031702982.jpeg',
                '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.17 PM_1755031702983.jpeg',
                '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.18 PM_1755031702984.jpeg',
                '/attached_assets/WhatsApp Image 2025-08-11 at 1.33.19 PM_1755031702984.jpeg'
              ];
              imageUrl = availableImages[index % availableImages.length];
            }
            
            return {
              id: row.id || (index + 1),
              'Product Name': row['Product Name'] || row.name || row.Name,
              Category: row.Category || row.category,
              Brand: row.Brand || row.brand,
              Price: row.Price || row.price,
              ImageURL: imageUrl,
            };
          }).filter((product: any) => {
            // Filter out invalid products - more lenient
            const hasName = product['Product Name'] || product.name || product.Name;
            const hasPrice = product.Price || product.price || parseFloat(product.Price) > 0;
            const hasCategory = product.Category || product.category;
            const hasId = product.id;
            
            // Debug log to see what's missing
            if (!hasName || !hasPrice || !hasCategory) {
              console.log('Filtered out product:', { 
                hasName, 
                hasPrice, 
                hasCategory, 
                hasId,
                allFields: Object.keys(product),
                product: JSON.stringify(product).slice(0, 100) 
              });
            }
            
            // Only require ID - be very lenient for now to see what data we have
            return hasId;
          });
          
          console.log(`Loaded ${mappedProducts.length} valid products from Excel`);
          setProducts(mappedProducts);
          console.log("Loaded products into context:", mappedProducts);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      }
    };
    
    loadProducts();
  }, []);

  const updateProduct = (id: string | number, updatedFields: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, ...updatedFields } : product
      )
    );
    console.log("Updated product:", id, updatedFields);
  };

  const deleteProduct = (id: string | number) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    console.log("Deleted product:", id);
  };

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const productWithId = { id: Date.now(), ...newProduct };
    setProducts(prev => [...prev, productWithId]);
    console.log("Added product:", productWithId);
  };

  return (
    <ProductContext.Provider value={{ products, updateProduct, deleteProduct, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};