import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import WebSocket, { WebSocketServer } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProductSchema, insertCategorySchema, insertBrandSchema } from "@shared/schema";
import { z } from "zod";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-07-30.basil",
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
            currency: 'ghs',
            product_data: {
              name: item.product.name,
              description: item.product.shortDescription || item.product.description || undefined,
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
        shippingAddress: (session as any).shipping_details || null,
        billingAddress: (session as any).customer_details || null,
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
      // Get existing categories or create new ones
      let categories = await storage.getCategories();
      let prescriptionCategory = categories.find(c => c.slug === 'prescription-drugs');
      let otcCategory = categories.find(c => c.slug === 'over-the-counter');
      let supplementsCategory = categories.find(c => c.slug === 'health-supplements');
      let firstAidCategory = categories.find(c => c.slug === 'first-aid');
      let devicesCategory = categories.find(c => c.slug === 'medical-devices');

      if (!prescriptionCategory) {
        prescriptionCategory = await storage.createCategory({
          name: "Prescription Drugs",
          slug: "prescription-drugs",
          description: "Licensed prescription medications with professional consultation"
        });
      }

      if (!otcCategory) {
        otcCategory = await storage.createCategory({
          name: "Over-the-Counter",
          slug: "over-the-counter",
          description: "Safe, effective medicines available without prescription"
        });
      }

      if (!supplementsCategory) {
        supplementsCategory = await storage.createCategory({
          name: "Health Supplements",
          slug: "health-supplements",
          description: "Premium vitamins and supplements for optimal wellness"
        });
      }

      if (!firstAidCategory) {
        firstAidCategory = await storage.createCategory({
          name: "First Aid",
          slug: "first-aid",
          description: "Essential first aid supplies and emergency care items"
        });
      }

      if (!devicesCategory) {
        devicesCategory = await storage.createCategory({
          name: "Medical Devices",
          slug: "medical-devices",
          description: "Healthcare monitoring and diagnostic devices"
        });
      }

      // Get existing brands or create new ones
      let brands = await storage.getBrands();
      let johnsonBrand = brands.find(b => b.name === 'Johnson & Johnson');
      let pfizerBrand = brands.find(b => b.name === 'Pfizer');
      let naturesWayBrand = brands.find(b => b.name === "Nature's Way");
      let redCrossBrand = brands.find(b => b.name === 'Red Cross');
      let omronBrand = brands.find(b => b.name === 'Omron');

      if (!johnsonBrand) {
        johnsonBrand = await storage.createBrand({
          name: "Johnson & Johnson",
          description: "Leading healthcare and pharmaceutical company"
        });
      }

      if (!pfizerBrand) {
        pfizerBrand = await storage.createBrand({
          name: "Pfizer",
          description: "Global pharmaceutical corporation"
        });
      }

      if (!naturesWayBrand) {
        naturesWayBrand = await storage.createBrand({
          name: "Nature's Way",
          description: "Premium natural health supplements"
        });
      }

      if (!redCrossBrand) {
        redCrossBrand = await storage.createBrand({
          name: "Red Cross",
          description: "Trusted first aid and emergency supplies"
        });
      }

      if (!omronBrand) {
        omronBrand = await storage.createBrand({
          name: "Omron",
          description: "Healthcare technology and medical devices"
        });
      }

      // Add Centrum brand for authentic products
      let centrumBrand = await storage.getBrandByName("Centrum");
      if (!centrumBrand) {
        centrumBrand = await storage.createBrand({
          name: "Centrum",
          description: "Leading multivitamin and supplement brand"
        });
      }

      let oneADayBrand = await storage.getBrandByName("One A Day");
      if (!oneADayBrand) {
        oneADayBrand = await storage.createBrand({
          name: "One A Day",
          description: "Daily multivitamin supplements"
        });
      }

      let century21Brand = await storage.getBrandByName("21st Century");
      if (!century21Brand) {
        century21Brand = await storage.createBrand({
          name: "21st Century",
          description: "Quality health and wellness supplements"
        });
      }

      // Create products with authentic Ghana pricing from Upstand Trading catalog
      const products = [
        {
          name: "Centrum Adult Multivitamin/Multimineral 200ct",
          slug: "centrum-adult-200ct",
          description: "Complete multivitamin and multimineral supplement with antioxidants for daily wellness support. Essential nutrients for adults.",
          shortDescription: "Complete daily multivitamin, 200 tablets",
          price: "348.76",
          originalPrice: "380.00",
          dosage: "Daily",
          categoryId: supplementsCategory.id,
          brandId: centrumBrand.id,
          imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400&h=300",
          stockQuantity: 120,
          requiresPrescription: false,
          rating: "4.8",
          reviewCount: 456,
        },
        {
          name: "Centrum Kids Multivitamin Gummies 150ct",
          slug: "centrum-kids-gummies-150ct",
          description: "Tropical punch flavored gummies made with natural flavors for kids daily nutrition. 150 days supply of essential vitamins.",
          shortDescription: "Kids multivitamin gummies, tropical punch flavor",
          price: "380.87",
          originalPrice: "420.00",
          dosage: "Daily",
          categoryId: supplementsCategory.id,
          brandId: centrumBrand.id,
          imageUrl: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=400&h=300",
          stockQuantity: 85,
          requiresPrescription: false,
          rating: "4.6",
          reviewCount: 234,
        },
        {
          name: "Centrum Multivitamin for Women 100ct",
          slug: "centrum-women-100ct",
          description: "Complete multivitamin tailored for women's health and wellness needs. Essential nutrients for daily vitality.",
          shortDescription: "Women's complete daily multivitamin",
          price: "258.86",
          originalPrice: "290.00",
          dosage: "Daily",
          categoryId: supplementsCategory.id,
          brandId: centrumBrand.id,
          imageUrl: "https://images.unsplash.com/photo-1550572017-1244dc7b3c82?auto=format&fit=crop&w=400&h=300",
          stockQuantity: 110,
          requiresPrescription: false,
          rating: "4.8",
          reviewCount: 287,
        },
        {
          name: "Ester-C Vitamin C 500mg - 225 Tablets",
          slug: "ester-c-500mg-225ct",
          description: "Ester-C Vitamin C 500mg Coated Tablets, gentle on stomach, non-acidic formula. Premium vitamin C supplement for immune system support and antioxidant protection.",
          shortDescription: "Non-acidic vitamin C, 225 coated tablets",
          price: "515.49",
          originalPrice: "580.00",
          dosage: "500mg",
          categoryId: supplementsCategory.id,
          brandId: naturesWayBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.20%20PM_1754947176453.jpeg",
          stockQuantity: 95,
          requiresPrescription: false,
          rating: "4.7",
          reviewCount: 387,
        },
        {
          name: "Centrum Adult Multivitamin - 200 Count",
          slug: "centrum-adult-200ct",
          description: "Centrum Adult Multivitamin/Multimineral Supplement with Antioxidants. Complete daily nutrition with essential vitamins and minerals for adult health.",
          shortDescription: "Complete daily multivitamin with antioxidants, 200 count",
          price: "348.76",
          originalPrice: "390.00",
          dosage: "Daily tablet",
          categoryId: supplementsCategory.id,
          brandId: naturesWayBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.23%20PM_1754947176460.jpeg",
          stockQuantity: 120,
          requiresPrescription: false,
          rating: "4.5",
          reviewCount: 567,
        },
        {
          name: "Benadryl Allergy Plus Congestion - 24ct",
          slug: "benadryl-allergy-congestion-24ct",
          description: "Benadryl Allergy Plus Congestion Ultratabs for comprehensive allergy relief. Treats nasal congestion, runny nose, sneezing, and itchy eyes.",
          shortDescription: "Complete allergy and congestion relief, 24 tablets",
          price: "180.06",
          originalPrice: "210.00",
          dosage: "25mg + decongestant",
          categoryId: otcCategory.id,
          brandId: johnsonBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.24%20PM_1754947176449.jpeg",
          stockQuantity: 95,
          requiresPrescription: false,
          rating: "4.4",
          reviewCount: 178,
        },
        {
          name: "Johnson & Johnson First Aid Kit - 80pc",
          slug: "jj-first-aid-kit-80pc",
          description: "Johnson & Johnson Travel Ready Portable Emergency First Aid Kit with 80 pieces. Complete emergency care for home, office, travel, and auto use.",
          shortDescription: "Portable emergency first aid kit, 80 pieces",
          price: "246.51",
          originalPrice: "280.00",
          dosage: "80 piece kit",
          categoryId: firstAidCategory.id,
          brandId: johnsonBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.25%20PM_1754947176452.jpeg",
          stockQuantity: 65,
          requiresPrescription: false,
          rating: "4.6",
          reviewCount: 245,
        },
        {
          name: "CURAD Assorted Bandages - 300 Pieces",
          slug: "curad-assorted-bandages-300pc",
          description: "CURAD Assorted Bandages including Antibacterial, Heavy Duty, Fabric, and Waterproof bandages. Complete wound care solution for all needs.",
          shortDescription: "Assorted antibacterial and waterproof bandages, 300 pieces",
          price: "300.85",
          originalPrice: "340.00",
          dosage: "300 piece assortment",
          categoryId: firstAidCategory.id,
          brandId: redCrossBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.17%20PM%20(1)_1754947176458.jpeg",
          stockQuantity: 120,
          requiresPrescription: false,
          rating: "4.7",
          reviewCount: 389,
        },
        {
          name: "Calcium & Magnesium Supplement",
          slug: "calcium-magnesium",
          description: "Essential bone health support with calcium and magnesium. Supports strong bones and teeth, muscle function, and nerve transmission. Enhanced with Vitamin D3 for better absorption.",
          shortDescription: "Bone health calcium and magnesium supplement",
          price: "28.99",
          dosage: "500mg Ca + 250mg Mg",
          categoryId: supplementsCategory.id,
          brandId: naturesWayBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.18%20PM%20(1)_1754947176457.jpeg",
          stockQuantity: 112,
          requiresPrescription: false,
          rating: "4.4",
          reviewCount: 89,
        },
        {
          name: "Respiratory Health Inhaler",
          slug: "respiratory-inhaler",
          description: "Bronchodilator inhaler for asthma and respiratory conditions. Provides quick relief from breathing difficulties and bronchospasm. Prescription medication requiring proper medical supervision.",
          shortDescription: "Quick-relief respiratory inhaler",
          price: "65.00",
          dosage: "Metered dose",
          categoryId: prescriptionCategory.id,
          brandId: pfizerBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.18%20PM%20(2)_1754947176456.jpeg",
          stockQuantity: 58,
          requiresPrescription: true,
          rating: "4.9",
          reviewCount: 74,
        },
        {
          name: "Antihistamine Allergy Relief",
          slug: "antihistamine-allergy",
          description: "Fast-acting antihistamine for allergy symptoms. Provides 24-hour relief from hay fever, pet allergies, dust mite allergies, and skin reactions like urticaria.",
          shortDescription: "24-hour allergy symptom relief",
          price: "19.50",
          originalPrice: "23.99",
          dosage: "10mg tablets",
          categoryId: otcCategory.id,
          brandId: johnsonBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.19%20PM%20(1)_1754947176455.jpeg",
          stockQuantity: 195,
          requiresPrescription: false,
          rating: "4.5",
          reviewCount: 211,
        },
        {
          name: "Probiotic Digestive Support",
          slug: "probiotic-digestive",
          description: "Multi-strain probiotic supplement for digestive health. Contains 10 billion CFU of beneficial bacteria to support gut health, immune function, and digestive comfort.",
          shortDescription: "Multi-strain probiotic for digestive health",
          price: "42.99",
          dosage: "10 billion CFU",
          categoryId: supplementsCategory.id,
          brandId: naturesWayBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.19%20PM%20(2)_1754947176454.jpeg",
          stockQuantity: 76,
          requiresPrescription: false,
          rating: "4.3",
          reviewCount: 132,
        },
        {
          name: "Thermometer & Health Monitor",
          slug: "digital-thermometer",
          description: "Digital thermometer with fever alarm and memory function. Non-contact infrared technology for safe and hygienic temperature measurement. Includes health monitoring features.",
          shortDescription: "Digital non-contact thermometer",
          price: "55.00",
          originalPrice: "69.99",
          dosage: "Digital device",
          categoryId: devicesCategory.id,
          brandId: omronBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.23%20PM%20(1)_1754947176460.jpeg",
          stockQuantity: 67,
          requiresPrescription: false,
          rating: "4.6",
          reviewCount: 98,
        },
        {
          name: "Eye Care Solution",
          slug: "eye-care-solution",
          description: "Sterile eye drops for dry eyes and irritation. Provides long-lasting moisture and comfort for tired, dry, or irritated eyes. Preservative-free formula safe for frequent use.",
          shortDescription: "Moisturizing eye drops for dry eyes",
          price: "16.25",
          dosage: "10ml bottle",
          categoryId: otcCategory.id,
          brandId: johnsonBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.23%20PM%20(2)_1754947176459.jpeg",
          stockQuantity: 134,
          requiresPrescription: false,
          rating: "4.4",
          reviewCount: 156,
        },
        {
          name: "Heart Health Omega-3",
          slug: "omega-3-heart",
          description: "Premium fish oil supplement for cardiovascular health. High concentration EPA and DHA omega-3 fatty acids support heart health, brain function, and reduce inflammation.",
          shortDescription: "Premium omega-3 for heart and brain health",
          price: "38.75",
          originalPrice: "44.99",
          dosage: "1200mg fish oil",
          categoryId: supplementsCategory.id,
          brandId: naturesWayBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.24%20PM%20(1)_1754947176463.jpeg",
          stockQuantity: 102,
          requiresPrescription: false,
          rating: "4.7",
          reviewCount: 178,
        },
        {
          name: "Complete Wound Dressing Kit",
          slug: "wound-dressing-kit",
          description: "Professional wound dressing supplies for healthcare facilities and home care. Includes sterile gauze, medical tape, wound pads, and antiseptic wipes for proper wound management.",
          shortDescription: "Professional wound dressing supplies",
          price: "29.99",
          originalPrice: "35.99",
          dosage: "Complete kit",
          categoryId: firstAidCategory.id,
          brandId: redCrossBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.24%20PM%20(2)_1754947176462.jpeg",
          stockQuantity: 91,
          requiresPrescription: false,
          rating: "4.5",
          reviewCount: 143,
        },
        {
          name: "Blood Pressure Monitor",
          slug: "bp-monitor-digital",
          description: "Automatic digital blood pressure monitor with large LCD display. Clinically validated accuracy with irregular heartbeat detection. Stores up to 120 readings for two users.",
          shortDescription: "Automatic digital blood pressure monitor",
          price: "89.99",
          originalPrice: "109.99",
          dosage: "Digital device",
          categoryId: devicesCategory.id,
          brandId: omronBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.24%20PM%20(3)_1754947176461.jpeg",
          stockQuantity: 52,
          requiresPrescription: false,
          rating: "4.8",
          reviewCount: 267,
        },
        {
          name: "AZO Cranberry Urinary Health - 100 Softgels",
          slug: "azo-cranberry-100ct",
          description: "AZO Cranberry Urinary Tract Health Supplement with 100 softgels. Natural cranberry concentrate for urinary tract health and infection prevention.",
          shortDescription: "Natural urinary tract health supplement, 100 softgels",
          price: "298.87",
          originalPrice: "330.00",
          dosage: "500mg cranberry",
          categoryId: supplementsCategory.id,
          brandId: naturesWayBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.25%20PM%20(1)_1754947176451.jpeg",
          stockQuantity: 85,
          requiresPrescription: false,
          rating: "4.5",
          reviewCount: 234,
        },
        {
          name: "Goli Apple Cider Vinegar Gummies - 60ct",
          slug: "goli-acv-gummies-60ct",
          description: "Goli Nutrition Apple Cider Vinegar Gummies with Apple Cider Vinegar Powder. Natural weight management and digestive health support in delicious gummy form.",
          shortDescription: "Apple cider vinegar gummies for weight management, 60 count",
          price: "370.01",
          originalPrice: "420.00",
          dosage: "500mg ACV per gummy",
          categoryId: supplementsCategory.id,
          brandId: naturesWayBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.24%20PM%20(3)_1754947176461.jpeg",
          stockQuantity: 75,
          requiresPrescription: false,
          rating: "4.3",
          reviewCount: 412,
        },
        {
          name: "HALLS Relief Honey Lemon - 20 Packs",
          slug: "halls-honey-lemon-20packs",
          description: "HALLS Relief Honey Lemon Cough Drops, 20 packs of 9 drops each. Soothing throat relief with natural honey and lemon flavor for cough and sore throat.",
          shortDescription: "Honey lemon cough drops, 20 packs of 9 drops",
          price: "644.18",
          originalPrice: "720.00",
          dosage: "180 drops total",
          categoryId: otcCategory.id,
          brandId: johnsonBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.24%20PM%20(2)_1754947176462.jpeg",
          stockQuantity: 45,
          requiresPrescription: false,
          rating: "4.6",
          reviewCount: 156,
        },
        {
          name: "21st Century Folic Acid 800mcg - 180ct",
          slug: "21st-folic-acid-800mcg-180ct",
          description: "21st Century 800 mcg Folic Acid Tablets for prenatal health and red blood cell formation. Essential supplement for pregnant women and general health.",
          shortDescription: "Essential folic acid supplement, 180 tablets",
          price: "95.10",
          originalPrice: "110.00",
          dosage: "800mcg",
          categoryId: supplementsCategory.id,
          brandId: naturesWayBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.23%20PM%20(2)_1754947176459.jpeg",
          stockQuantity: 140,
          requiresPrescription: false,
          rating: "4.4",
          reviewCount: 98,
        }
      ];

      let createdCount = 0;
      let skippedCount = 0;
      
      for (const product of products) {
        try {
          // Check if product exists first
          const existingProduct = await storage.getProductBySlug(product.slug);
          if (existingProduct) {
            skippedCount++;
            continue;
          }
          
          await storage.createProduct(product);
          createdCount++;
        } catch (error: any) {
          if (error.code === '23505') { // Duplicate key error
            skippedCount++;
            continue;
          }
          throw error;
        }
      }
      
      console.log(`Seeding completed: ${createdCount} created, ${skippedCount} skipped`);

      res.json({ message: "Database seeded successfully" });
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ message: "Failed to seed database" });
    }
  });

  // Prescription routes
  app.post('/api/prescriptions/submit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const prescriptionData = {
        id: Math.random().toString(36).substring(7),
        userId,
        patientName: req.body.patientName,
        doctorName: req.body.doctorName,
        doctorContact: req.body.doctorContact,
        prescriptionDate: req.body.prescriptionDate,
        medications: req.body.medications,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        files: [], // In a real implementation, handle file uploads here
      };

      // Store prescription (in real app, save to database)
      res.json({ id: prescriptionData.id, success: true });
    } catch (error) {
      console.error('Error submitting prescription:', error);
      res.status(500).json({ error: 'Failed to submit prescription' });
    }
  });

  app.get('/api/prescriptions/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // In real implementation, fetch from database
      const mockHistory: any[] = [];
      res.json(mockHistory);
    } catch (error) {
      console.error('Error fetching prescription history:', error);
      res.status(500).json({ error: 'Failed to fetch prescription history' });
    }
  });

  app.get('/api/prescriptions/view/:id', async (req, res) => {
    try {
      const prescriptionId = req.params.id;
      // In real implementation, fetch from database and verify access
      const mockPrescription = {
        id: prescriptionId,
        patientName: 'Sample Patient',
        doctorName: 'Sample Doctor',
        doctorContact: '+233 20 123 4567',
        prescriptionDate: new Date().toISOString(),
        medications: 'Sample medications',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        files: []
      };
      
      res.json(mockPrescription);
    } catch (error) {
      console.error('Error fetching prescription:', error);
      res.status(500).json({ error: 'Failed to fetch prescription' });
    }
  });

  const httpServer = createServer(app);
  
  // Initialize WebSocket server for chat
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws/chat'
  });
  
  // Chat system state
  interface ChatSession {
    id: string;
    userId: string;
    userName: string;
    staffId?: string;
    staffName?: string;
    staffRole?: string;
    status: 'waiting' | 'connected' | 'ended';
    startedAt: Date;
    queuePosition?: number;
  }
  
  interface ChatMessage {
    id: string;
    sessionId: string;
    text: string;
    sender: 'user' | 'staff';
    senderName: string;
    timestamp: Date;
    type: 'message' | 'system';
  }
  
  interface ConnectedClient {
    ws: WebSocket;
    userId?: string;
    userName?: string;
    isStaff: boolean;
    staffId?: string;
    staffName?: string;
    staffRole?: string;
    sessionId?: string;
  }
  
  const connectedClients = new Map<WebSocket, ConnectedClient>();
  const activeSessions = new Map<string, ChatSession>();
  const waitingQueue: string[] = [];
  const sessionMessages = new Map<string, ChatMessage[]>();
  
  // Mock staff members (in production, this would come from a database)
  const availableStaff = [
    { id: 'staff-1', name: 'Dr. Sarah Mensah', role: 'Senior Pharmacist' },
    { id: 'staff-2', name: 'James Asante', role: 'Pharmacy Technician' },
    { id: 'staff-3', name: 'Mary Osei', role: 'Certified Pharmacist' },
  ];
  
  const getOnlineStaffCount = () => {
    return Array.from(connectedClients.values())
      .filter(client => client.isStaff).length || 3; // Always show at least 3 staff online
  };
  
  const findAvailableStaff = () => {
    // In production, find actual available staff
    // For demo, return a random staff member
    return availableStaff[Math.floor(Math.random() * availableStaff.length)];
  };
  
  const generateId = () => Math.random().toString(36).substr(2, 9);
  
  const broadcastToSession = (sessionId: string, data: any, excludeWs?: WebSocket) => {
    connectedClients.forEach((client, ws) => {
      if (ws !== excludeWs && client.sessionId === sessionId && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  };
  
  const sendToUser = (userId: string, data: any) => {
    connectedClients.forEach((client, ws) => {
      if (client.userId === userId && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  };
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');
    
    // Initialize client
    connectedClients.set(ws, {
      ws,
      isStaff: false
    });
    
    // Send initial staff status
    ws.send(JSON.stringify({
      type: 'staff_status',
      onlineCount: getOnlineStaffCount()
    }));
    
    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        const client = connectedClients.get(ws);
        
        if (!client) return;
        
        switch (message.type) {
          case 'join':
            // User joins the chat system
            client.userId = message.userId;
            client.userName = message.userName;
            console.log(`User ${client.userName} joined chat system`);
            break;
            
          case 'start_chat':
            // User wants to start a new chat session
            if (!client.userId) {
              ws.send(JSON.stringify({
                type: 'error',
                message: 'User not authenticated'
              }));
              return;
            }
            
            // Create new chat session
            const sessionId = generateId();
            const session: ChatSession = {
              id: sessionId,
              userId: client.userId,
              userName: client.userName || 'Anonymous',
              status: 'waiting',
              startedAt: new Date(),
            };
            
            activeSessions.set(sessionId, session);
            client.sessionId = sessionId;
            sessionMessages.set(sessionId, []);
            
            // Add to waiting queue
            waitingQueue.push(sessionId);
            session.queuePosition = waitingQueue.length;
            
            // Send session update
            ws.send(JSON.stringify({
              type: 'session_update',
              session: session
            }));
            
            // Try to connect to staff immediately (simulate instant connection)
            setTimeout(() => {
              const staff = findAvailableStaff();
              if (staff && activeSessions.has(sessionId)) {
                const currentSession = activeSessions.get(sessionId)!;
                currentSession.status = 'connected';
                currentSession.staffId = staff.id;
                currentSession.staffName = staff.name;
                currentSession.staffRole = staff.role;
                
                // Remove from waiting queue
                const queueIndex = waitingQueue.indexOf(sessionId);
                if (queueIndex > -1) {
                  waitingQueue.splice(queueIndex, 1);
                }
                
                // Update session
                activeSessions.set(sessionId, currentSession);
                
                // Notify user that staff connected
                sendToUser(client.userId!, {
                  type: 'session_update',
                  session: currentSession
                });
                
                console.log(`Staff ${staff.name} connected to session ${sessionId}`);
              }
            }, Math.random() * 3000 + 1000); // 1-4 seconds delay
            
            break;
            
          case 'message':
            // Send chat message
            if (!client.sessionId || !client.userId) {
              ws.send(JSON.stringify({
                type: 'error',
                message: 'No active chat session'
              }));
              return;
            }
            
            const currentSession = activeSessions.get(client.sessionId);
            if (!currentSession || currentSession.status !== 'connected') {
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Chat session not connected'
              }));
              return;
            }
            
            // Create message
            const chatMessage: ChatMessage = {
              id: generateId(),
              sessionId: client.sessionId,
              text: message.text,
              sender: 'user',
              senderName: client.userName || 'User',
              timestamp: new Date(),
              type: 'message'
            };
            
            // Store message
            const messages = sessionMessages.get(client.sessionId) || [];
            messages.push(chatMessage);
            sessionMessages.set(client.sessionId, messages);
            
            // Broadcast to session participants
            broadcastToSession(client.sessionId, {
              ...chatMessage
            });
            
            // Simulate staff response after a delay
            setTimeout(() => {
              if (activeSessions.has(client.sessionId!) && currentSession.status === 'connected') {
                const staffResponses = [
                  "Thank you for your question. Let me help you with that.",
                  "I understand your concern. Based on what you've described, I'd recommend...",
                  "That's a great question about your medication. Here's what I can tell you...",
                  "For safety reasons, I need to ask a few more questions about your medical history.",
                  "I can definitely help you with that prescription question.",
                  "Let me check our current stock for that medication.",
                  "That medication interaction is something we need to be careful about.",
                  "I'd recommend speaking with your doctor about adjusting the dosage.",
                ];
                
                const staffResponse: ChatMessage = {
                  id: generateId(),
                  sessionId: client.sessionId!,
                  text: staffResponses[Math.floor(Math.random() * staffResponses.length)],
                  sender: 'staff',
                  senderName: currentSession.staffName || 'Pharmacist',
                  timestamp: new Date(),
                  type: 'message'
                };
                
                // Store staff message
                const currentMessages = sessionMessages.get(client.sessionId!) || [];
                currentMessages.push(staffResponse);
                sessionMessages.set(client.sessionId!, currentMessages);
                
                // Send to session participants
                broadcastToSession(client.sessionId!, {
                  ...staffResponse
                });
              }
            }, Math.random() * 4000 + 2000); // 2-6 seconds delay
            
            break;
            
          case 'typing':
            // Handle typing indicators
            if (client.sessionId) {
              broadcastToSession(client.sessionId, {
                type: 'typing',
                isTyping: message.isTyping,
                sender: client.isStaff ? 'staff' : 'user'
              }, ws);
            }
            break;
            
          case 'end_chat':
            // End chat session
            if (client.sessionId) {
              const session = activeSessions.get(client.sessionId);
              if (session) {
                session.status = 'ended';
                activeSessions.delete(client.sessionId);
                sessionMessages.delete(client.sessionId);
                
                // Remove from queue if still waiting
                const queueIndex = waitingQueue.indexOf(client.sessionId);
                if (queueIndex > -1) {
                  waitingQueue.splice(queueIndex, 1);
                }
                
                console.log(`Chat session ${client.sessionId} ended`);
              }
              client.sessionId = undefined;
            }
            break;
        }
        
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      const client = connectedClients.get(ws);
      
      if (client?.sessionId) {
        // Clean up session if user disconnects
        const session = activeSessions.get(client.sessionId);
        if (session && session.status !== 'ended') {
          session.status = 'ended';
          activeSessions.delete(client.sessionId);
          sessionMessages.delete(client.sessionId);
          
          // Remove from queue
          const queueIndex = waitingQueue.indexOf(client.sessionId);
          if (queueIndex > -1) {
            waitingQueue.splice(queueIndex, 1);
          }
        }
      }
      
      connectedClients.delete(ws);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      connectedClients.delete(ws);
    });
  });
  
  console.log('Chat WebSocket server initialized on /ws/chat');

  return httpServer;
}
