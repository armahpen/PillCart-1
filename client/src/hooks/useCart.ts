import { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface Product {
  'Product Name': string;
  Brand: string;
  Price: number;
  ImageURL?: string;
}

const CART_STORAGE_KEY = 'smile-pills-cart';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = (items: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      setCartItems(items);
      
      const count = items.reduce((total, item) => total + item.quantity, 0);
      
      // Dispatch custom event for cart updates
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { 
          items, 
          count 
        } 
      }));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const productId = `${product['Product Name']}-${product.Brand}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
      // Update quantity if item already exists
      const updatedItems = cartItems.map(item =>
        item.id === productId 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      saveCart(updatedItems);
    } else {
      // Add new item
      const newItem: CartItem = {
        id: productId,
        name: product['Product Name'],
        brand: product.Brand,
        price: product.Price,
        quantity,
        imageUrl: product.ImageURL
      };
      saveCart([...cartItems, newItem]);
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    saveCart(updatedItems);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    saveCart(updatedItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const isInCart = (product: Product) => {
    const productId = `${product['Product Name']}-${product.Brand}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return cartItems.some(item => item.id === productId);
  };

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    isInCart
  };
}