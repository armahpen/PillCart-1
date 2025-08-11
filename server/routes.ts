import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProductSchema, insertCategorySchema, insertBrandSchema } from "@shared/schema";
import { z } from "zod";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-01-27.acacia",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Brand routes
  app.get('/api/brands', async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  app.post('/api/brands', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(validatedData);
      res.json(brand);
    } catch (error) {
      console.error("Error creating brand:", error);
      res.status(500).json({ message: "Failed to create brand" });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const {
        categoryId,
        brandId,
        search,
        minPrice,
        maxPrice,
        inStock,
        limit = 12,
        offset = 0,
      } = req.query;

      const filters = {
        categoryId: categoryId as string,
        brandId: brandId as string,
        search: search as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        inStock: inStock === 'true',
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      };

      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get('/api/products/slug/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const product = await storage.getProductBySlug(slug);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Cart routes
  app.get('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { productId, quantity } = req.body;
      
      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid product ID or quantity" });
      }

      const cartItem = await storage.addToCart(userId, productId, quantity);
      res.json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put('/api/cart/:productId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { productId } = req.params;
      const { quantity } = req.body;
      
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const cartItem = await storage.updateCartItem(userId, productId, quantity);
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete('/api/cart/:productId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { productId } = req.params;
      
      await storage.removeFromCart(userId, productId);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.clearCart(userId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Order routes
  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Stripe embedded checkout route
  app.post("/api/create-checkout-session", isAuthenticated, async (req: any, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }

      const userId = req.user.claims.sub;
      
      // Get cart items to create line items
      const cartItems = await storage.getCartItems(userId);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Calculate total amount for the session
      const totalAmount = cartItems.reduce((total, item) => {
        return total + (parseFloat(item.product.price) * item.quantity);
      }, 0);

      const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        line_items: cartItems.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.product.name,
              description: item.product.shortDescription || item.product.description,
              images: item.product.imageUrl ? [item.product.imageUrl] : undefined,
            },
            unit_amount: Math.round(parseFloat(item.product.price) * 100), // Convert to cents
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        return_url: `${req.protocol}://${req.get('host')}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          userId,
        },
      });

      res.json({ clientSecret: session.client_secret });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Error creating checkout session: " + error.message });
    }
  });

  // Get session status
  app.get("/api/session-status", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }

      const sessionId = req.query.session_id as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      res.json({
        status: session.status,
        customer_email: session.customer_details?.email,
      });
    } catch (error: any) {
      console.error("Error fetching session status:", error);
      res.status(500).json({ message: "Error fetching session status: " + error.message });
    }
  });

  // Create order after successful checkout session
  app.post("/api/orders/create-from-session", isAuthenticated, async (req: any, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }

      const userId = req.user.claims.sub;
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      // Retrieve the session to get payment details
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.status !== 'complete') {
        return res.status(400).json({ message: "Payment not completed" });
      }

      if (session.metadata?.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Get cart items (they should still exist until order is created)
      const cartItems = await storage.getCartItems(userId);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Calculate total
      const totalAmount = cartItems.reduce((total, item) => {
        return total + (parseFloat(item.product.price) * item.quantity);
      }, 0);

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create order
      const orderData = {
        userId,
        orderNumber,
        status: 'confirmed',
        totalAmount: totalAmount.toString(),
        shippingAddress: session.shipping_details || null,
        billingAddress: session.customer_details || null,
        paymentStatus: 'paid',
        stripePaymentIntentId: session.payment_intent as string,
      };

      const orderItems = cartItems.map((item) => ({
        orderId: '', // This will be filled by the storage layer
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const order = await storage.createOrder(orderData, orderItems);
      
      // Clear cart after successful order
      await storage.clearCart(userId);
      
      res.json(order);
    } catch (error: any) {
      console.error("Error creating order from session:", error);
      res.status(500).json({ message: "Failed to create order: " + error.message });
    }
  });

  // Seed data endpoint (for development)
  app.post('/api/seed', async (req, res) => {
    try {
      // Create categories
      const prescriptionCategory = await storage.createCategory({
        name: "Prescription Drugs",
        slug: "prescription-drugs",
        description: "Licensed prescription medications with professional consultation"
      });

      const otcCategory = await storage.createCategory({
        name: "Over-the-Counter",
        slug: "over-the-counter",
        description: "Safe, effective medicines available without prescription"
      });

      const supplementsCategory = await storage.createCategory({
        name: "Health Supplements",
        slug: "health-supplements",
        description: "Premium vitamins and supplements for optimal wellness"
      });

      const firstAidCategory = await storage.createCategory({
        name: "First Aid",
        slug: "first-aid",
        description: "Essential first aid supplies and emergency care items"
      });

      const devicesCategory = await storage.createCategory({
        name: "Medical Devices",
        slug: "medical-devices",
        description: "Healthcare monitoring and diagnostic devices"
      });

      // Create brands
      const johnsonBrand = await storage.createBrand({
        name: "Johnson & Johnson",
        description: "Leading healthcare and pharmaceutical company"
      });

      const pfizerBrand = await storage.createBrand({
        name: "Pfizer",
        description: "Global pharmaceutical corporation"
      });

      const naturesWayBrand = await storage.createBrand({
        name: "Nature's Way",
        description: "Premium natural health supplements"
      });

      const redCrossBrand = await storage.createBrand({
        name: "Red Cross",
        description: "Trusted first aid and emergency supplies"
      });

      const omronBrand = await storage.createBrand({
        name: "Omron",
        description: "Healthcare technology and medical devices"
      });

      // Create products
      const products = [
        {
          name: "Advanced Pain Relief",
          slug: "advanced-pain-relief",
          description: "Fast-acting pain relief for headaches, muscle pain, and arthritis. 200mg tablets provide effective relief from minor aches and pains.",
          shortDescription: "Fast-acting pain relief for headaches, muscle pain, and arthritis",
          price: "12.99",
          originalPrice: "15.99",
          dosage: "200mg",
          categoryId: otcCategory.id,
          brandId: johnsonBrand.id,
          imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          stockQuantity: 150,
          requiresPrescription: false,
          rating: "4.5",
          reviewCount: 124,
        },
        {
          name: "Vitamin D3 + K2",
          slug: "vitamin-d3-k2",
          description: "High-potency vitamin D3 with K2 for bone health and immune support. 60 capsules of premium quality supplements.",
          shortDescription: "High-potency vitamin D3 with K2 for bone health and immune support",
          price: "24.99",
          dosage: "5000 IU",
          categoryId: supplementsCategory.id,
          brandId: naturesWayBrand.id,
          imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          stockQuantity: 89,
          requiresPrescription: false,
          rating: "4.2",
          reviewCount: 89,
        },
        {
          name: "Complete First Aid Kit",
          slug: "complete-first-aid-kit",
          description: "Comprehensive first aid kit with 150+ pieces for home, office, or travel emergencies. Includes bandages, antiseptics, and emergency supplies.",
          shortDescription: "Comprehensive first aid kit with 150+ pieces for emergencies",
          price: "39.99",
          originalPrice: "49.99",
          dosage: "150+ pieces",
          categoryId: firstAidCategory.id,
          brandId: redCrossBrand.id,
          imageUrl: "https://images.unsplash.com/photo-1603398938785-81dd9b45de34?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          stockQuantity: 25,
          requiresPrescription: false,
          rating: "4.8",
          reviewCount: 203,
        },
        {
          name: "Blood Pressure Medication",
          slug: "blood-pressure-medication",
          description: "Effective blood pressure control medication. Prescription required from licensed physician. Consult with our pharmacists for proper dosage.",
          shortDescription: "Effective blood pressure control medication",
          price: "45.99",
          dosage: "30 tablets",
          categoryId: prescriptionCategory.id,
          brandId: pfizerBrand.id,
          imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          stockQuantity: 50,
          requiresPrescription: true,
          rating: "4.1",
          reviewCount: 67,
        },
        {
          name: "Digital BP Monitor",
          slug: "digital-bp-monitor",
          description: "Clinically accurate digital blood pressure monitor with large display and memory storage. FDA approved for home use.",
          shortDescription: "Clinically accurate digital blood pressure monitor",
          price: "79.99",
          originalPrice: "99.99",
          dosage: "FDA Approved",
          categoryId: devicesCategory.id,
          brandId: omronBrand.id,
          imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          stockQuantity: 35,
          requiresPrescription: false,
          rating: "4.7",
          reviewCount: 312,
        },
        {
          name: "Omega-3 Fish Oil",
          slug: "omega-3-fish-oil",
          description: "Premium omega-3 supplement for heart health and brain function. 120 softgels of pure fish oil with high EPA and DHA content.",
          shortDescription: "Premium omega-3 supplement for heart health and brain function",
          price: "32.99",
          dosage: "1000mg",
          categoryId: supplementsCategory.id,
          brandId: naturesWayBrand.id,
          imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          stockQuantity: 120,
          requiresPrescription: false,
          rating: "4.3",
          reviewCount: 156,
        },
      ];

      for (const product of products) {
        await storage.createProduct(product);
      }

      res.json({ message: "Database seeded successfully" });
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ message: "Failed to seed database" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
