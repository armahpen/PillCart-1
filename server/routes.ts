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

      // Add Minerals category for proper categorization
      let mineralCategory = await storage.getCategories().then(cats => 
        cats.find(c => c.name === "Minerals")
      );
      if (!mineralCategory) {
        mineralCategory = await storage.createCategory({
          name: "Minerals",
          slug: "minerals",
          description: "Essential mineral supplements for health"
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

      // Add more authentic brands from your catalog
      let twentyFirstBrand = await storage.getBrandByName("21st Century");
      if (!twentyFirstBrand) {
        twentyFirstBrand = await storage.createBrand({
          name: "21st Century",
          description: "Quality health and wellness supplements"
        });
      }

      let naturesBrand = await storage.getBrandByName("Nature Made");
      if (!naturesBrand) {
        naturesBrand = await storage.createBrand({
          name: "Nature Made",
          description: "Premium vitamins and nutritional supplements"
        });
      }

      let naturesBountyBrand = await storage.getBrandByName("Nature's Bounty");
      if (!naturesBountyBrand) {
        naturesBountyBrand = await storage.createBrand({
          name: "Nature's Bounty",
          description: "Natural health and wellness supplements"
        });
      }

      let advilesBrand = await storage.getBrandByName("Advil");
      if (!advilesBrand) {
        advilesBrand = await storage.createBrand({
          name: "Advil",
          description: "Trusted pain relief medication"
        });
      }

      let equateBrand = await storage.getBrandByName("Equate");
      if (!equateBrand) {
        equateBrand = await storage.createBrand({
          name: "Equate",
          description: "Affordable quality healthcare products"
        });
      }

      let goliBrand = await storage.getBrandByName("Goli");
      if (!goliBrand) {
        goliBrand = await storage.createBrand({
          name: "Goli",
          description: "Nutritious wellness gummies and supplements"
        });
      }

      let nowFoodsBrand = await storage.getBrandByName("NOW Foods");
      if (!nowFoodsBrand) {
        nowFoodsBrand = await storage.createBrand({
          name: "NOW Foods",
          description: "Natural health products and supplements"
        });
      }

      // Create comprehensive products with authentic Ghana pricing from your catalog
      const products = [
        // 21st Century Products - First Section from catalog
        {
          name: "21st century 800 mcg folic acid tablets, Assorted 180 Count",
          slug: "21st-century-folic-acid-800mcg-180ct",
          description: "Essential folic acid supplement for pregnant women and overall health. Supports red blood cell formation and DNA synthesis.",
          shortDescription: "Folic acid supplement for health",
          price: "95.10",
          dosage: "800mcg",
          categoryId: vitaminCategory.id,
          brandId: twentyFirstBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.15%20PM_1755031702982.jpeg",
          stockQuantity: 180,
          requiresPrescription: false,
          rating: "4.3",
          reviewCount: 89,
        },
        {
          name: "21st century acidophilus capsules, 100 Count",
          slug: "21st-century-acidophilus-100ct",
          description: "Probiotic supplement containing acidophilus to support digestive health and immune system function.",
          shortDescription: "Probiotic digestive support",
          price: "177.59",
          dosage: "100 capsules",
          categoryId: digestiveCategory.id,
          brandId: twentyFirstBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.16%20PM_1755031702981.jpeg",
          stockQuantity: 100,
          requiresPrescription: false,
          rating: "4.4",
          reviewCount: 125,
        },
        {
          name: "21st arthric -flex Advantage Plus vitamin D3 joint support supplement (120 Tablets)",
          slug: "21st-century-arthric-flex-120ct",
          description: "Advanced joint support formula with Vitamin D3 for bone and joint health, flexibility, and mobility.",
          shortDescription: "Joint support with Vitamin D3",
          price: "444.85",
          dosage: "120 tablets",
          categoryId: vitaminCategory.id,
          brandId: twentyFirstBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.16%20PM%20(3)_1755031702980.jpeg",
          stockQuantity: 60,
          requiresPrescription: false,
          rating: "4.5",
          reviewCount: 89,
        },
        {
          name: "21st century B12 2500mcg sublingual tablets, 110 Count",
          slug: "21st-century-b12-2500mcg-110ct",
          description: "High-potency sublingual B12 for energy metabolism, nervous system health, and red blood cell formation.",
          shortDescription: "High-potency B12 sublingual tablets",
          price: "177.59",
          dosage: "2500mcg",
          categoryId: vitaminCategory.id,
          brandId: twentyFirstBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.17%20PM_1755031702979.jpeg",
          stockQuantity: 110,
          requiresPrescription: false,
          rating: "4.6",
          reviewCount: 234,
        },
        {
          name: "21st century CoQ10 30 mg capsules, 45 Count",
          slug: "21st-century-coq10-30mg-45ct",
          description: "Coenzyme Q10 supplement for heart health, cellular energy production, and antioxidant support.",
          shortDescription: "CoQ10 heart health supplement",
          price: "222.55",
          dosage: "30mg",
          categoryId: vitaminCategory.id,
          brandId: twentyFirstBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.17%20PM%20(1)_1755031702979.jpeg",
          stockQuantity: 45,
          requiresPrescription: false,
          rating: "4.4",
          reviewCount: 156,
        },
        {
          name: "21st century cranberry plus probiotic tablet, 60 Count",
          slug: "21st-century-cranberry-probiotic-60ct",
          description: "Cranberry extract with probiotics for urinary tract health and digestive support.",
          shortDescription: "Cranberry plus probiotics",
          price: "199.82",
          dosage: "60 tablets",
          categoryId: digestiveCategory.id,
          brandId: twentyFirstBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.18%20PM_1755031702978.jpeg",
          stockQuantity: 60,
          requiresPrescription: false,
          rating: "4.3",
          reviewCount: 98,
        },
        {
          name: "21st century Gelatine 600mg dietary supplement (100 Count)",
          slug: "21st-century-gelatine-600mg-100ct",
          description: "Gelatine supplement for joint health, skin, hair, and nail support.",
          shortDescription: "Gelatine for joint and skin health",
          price: "172.65",
          dosage: "600mg",
          categoryId: vitaminCategory.id,
          brandId: twentyFirstBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.18%20PM%20(1)_1755031702978.jpeg",
          stockQuantity: 100,
          requiresPrescription: false,
          rating: "4.2",
          reviewCount: 87,
        },
        {
          name: "21st century glucosamine chondroitin 250/200mg original strength, 60 Count",
          slug: "21st-century-glucosamine-chondroitin-60ct",
          description: "Joint support formula with glucosamine and chondroitin for cartilage health and mobility.",
          shortDescription: "Glucosamine chondroitin joint support",
          price: "207.73",
          dosage: "250/200mg",
          categoryId: vitaminCategory.id,
          brandId: twentyFirstBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.19%20PM_1755031702977.jpeg",
          stockQuantity: 60,
          requiresPrescription: false,
          rating: "4.5",
          reviewCount: 145,
        },
        {
          name: "21st century hair, skin and nails extra strength tablets, 90 count",
          slug: "21st-century-hair-skin-nails-90ct",
          description: "Beauty supplement with biotin, vitamins, and minerals for healthy hair, skin, and nails.",
          shortDescription: "Hair, skin, and nails support",
          price: "223.04",
          dosage: "90 tablets",
          categoryId: vitaminCategory.id,
          brandId: twentyFirstBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.19%20PM%20(1)_1755031702976.jpeg",
          stockQuantity: 90,
          requiresPrescription: false,
          rating: "4.4",
          reviewCount: 198,
        },
        {
          name: "21st century healthcare, B complex plus vitamin C, tablet 100count",
          slug: "21st-century-b-complex-vitamin-c-100ct",
          description: "Complete B-complex vitamins with added vitamin C for energy metabolism and immune support.",
          shortDescription: "B-complex with Vitamin C",
          price: "207.48",
          dosage: "100 tablets",
          categoryId: vitaminCategory.id,
          brandId: twentyFirstBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.19%20PM%20(2)_1755031702975.jpeg",
          stockQuantity: 100,
          requiresPrescription: false,
          rating: "4.6",
          reviewCount: 267,
        },
        // Advil Products from catalog
        {
          name: "Advil liquid-gel pain reliever and fever reducer, Ibuprofen 200mg capsules 240ct",
          slug: "advil-liquid-gel-240ct",
          description: "Fast-acting liquid gel capsules with ibuprofen 200mg for effective pain relief and fever reduction.",
          shortDescription: "Liquid gel pain reliever 240ct",
          price: "518.21",
          dosage: "200mg",
          categoryId: otcCategory.id,
          brandId: advilesBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.20%20PM_1755031702992.jpeg",
          stockQuantity: 75,
          requiresPrescription: false,
          rating: "4.7",
          reviewCount: 342,
        },
        {
          name: "Advil pain reliever and fever reducer, Ibuprofen 200mg capsules 24ct",
          slug: "advil-pain-reliever-24ct",
          description: "Trusted ibuprofen pain relief for headaches, muscle aches, and fever.",
          shortDescription: "Ibuprofen pain reliever 24ct",
          price: "122.76",
          dosage: "200mg",
          categoryId: otcCategory.id,
          brandId: advilesBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.21%20PM_1755031702991.jpeg",
          stockQuantity: 120,
          requiresPrescription: false,
          rating: "4.6",
          reviewCount: 189,
        },
        {
          name: "Advil liqui-gel pain reliever and fever reducer, Ibuprofen 200mg capsules 10ct",
          slug: "advil-liqui-gel-10ct",
          description: "Fast-acting liquid gel formula for quick pain relief in a convenient 10-count package.",
          shortDescription: "Liqui-gel pain relief 10ct",
          price: "76.32",
          dosage: "200mg",
          categoryId: otcCategory.id,
          brandId: advilesBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.22%20PM_1755031702990.jpeg",
          stockQuantity: 150,
          requiresPrescription: false,
          rating: "4.5",
          reviewCount: 98,
        },
        {
          name: "Advil PM pain reliever and nighttime sleep aid, Ibuprofen sleep aid -120 coated caplets",
          slug: "advil-pm-120ct",
          description: "Combines ibuprofen pain relief with diphenhydramine sleep aid for nighttime pain relief.",
          shortDescription: "PM pain reliever with sleep aid",
          price: "320.85",
          dosage: "200mg + sleep aid",
          categoryId: otcCategory.id,
          brandId: advilesBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.23%20PM_1755031702985.jpeg",
          stockQuantity: 85,
          requiresPrescription: false,
          rating: "4.4",
          reviewCount: 234,
        },
        // Centrum Products from catalog
        {
          name: "Centrum adult multivitamin/multimineral supplement with antioxidants -200ct",
          slug: "centrum-adult-200ct",
          description: "Complete daily multivitamin and multimineral supplement with antioxidants for adult wellness.",
          shortDescription: "Complete adult multivitamin 200ct",
          price: "348.76",
          dosage: "Daily",
          categoryId: vitaminCategory.id,
          brandId: centrumBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.23%20PM%20(1)_1755031702985.jpeg",
          stockQuantity: 120,
          requiresPrescription: false,
          rating: "4.8",
          reviewCount: 456,
        },
        {
          name: "Centrum kid's multivitamin gummies, stocking stuffer, tropical punch Flavors made with natural flavors,150ct ,150 days' supply",
          slug: "centrum-kids-gummies-150ct",
          description: "Tropical punch flavored gummies made with natural flavors for kids daily nutrition. 150 days supply.",
          shortDescription: "Kids multivitamin gummies 150ct",
          price: "380.87",
          dosage: "Daily",
          categoryId: vitaminCategory.id,
          brandId: centrumBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.23%20PM%20(2)_1755031702983.jpeg",
          stockQuantity: 85,
          requiresPrescription: false,
          rating: "4.6",
          reviewCount: 234,
        },
        {
          name: "Centrum multivitamin for women -100ct",
          slug: "centrum-women-100ct",
          description: "Complete multivitamin tailored for women's health and wellness needs.",
          shortDescription: "Women's multivitamin 100ct",
          price: "258.86",
          dosage: "Daily",
          categoryId: vitaminCategory.id,
          brandId: centrumBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.24%20PM_1755031702988.jpeg",
          stockQuantity: 110,
          requiresPrescription: false,
          rating: "4.8",
          reviewCount: 287,
        },
        {
          name: "Centrum silver adults 50+ multivitamin tablet 125ct",
          slug: "centrum-silver-50plus-125ct",
          description: "Age-adjusted multivitamin for adults 50+ with key nutrients for healthy aging.",
          shortDescription: "Silver 50+ multivitamin 125ct",
          price: "278.12",
          dosage: "Daily",
          categoryId: vitaminCategory.id,
          brandId: centrumBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.24%20PM%20(1)_1755031702987.jpeg",
          stockQuantity: 90,
          requiresPrescription: false,
          rating: "4.7",
          reviewCount: 198,
        },
        // Nature Made Products from catalog
        {
          name: "Nature made fish oil 2400mg, omega 3 fish oil supplements,134ct",
          slug: "nature-made-fish-oil-134ct",
          description: "High-potency omega-3 fish oil supplement for heart health and brain function.",
          shortDescription: "Omega-3 fish oil 2400mg",
          price: "335.18",
          dosage: "2400mg",
          categoryId: vitaminCategory.id,
          brandId: naturesBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.24%20PM%20(2)_1755031702987.jpeg",
          stockQuantity: 85,
          requiresPrescription: false,
          rating: "4.6",
          reviewCount: 267,
        },
        {
          name: "Nature made magnesium oxide 400mg softgels 150ct",
          slug: "nature-made-magnesium-150ct",
          description: "Essential magnesium supplement for muscle and nerve function, bone health, and energy metabolism.",
          shortDescription: "Magnesium oxide 400mg",
          price: "357.66",
          dosage: "400mg",
          categoryId: mineralCategory.id,
          brandId: naturesBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.24%20PM%20(3)_1755031702986.jpeg",
          stockQuantity: 110,
          requiresPrescription: false,
          rating: "4.5",
          reviewCount: 234,
        },
        {
          name: "Nature made super b complex with vitamin c and folic acid ,140 tablets",
          slug: "nature-made-super-b-complex-140ct",
          description: "Complete B-vitamin complex with vitamin C and folic acid for energy and nervous system support.",
          shortDescription: "Super B-complex with Vitamin C",
          price: "239.34",
          dosage: "140 tablets",
          categoryId: vitaminCategory.id,
          brandId: naturesBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.25%20PM_1755031702990.jpeg",
          stockQuantity: 95,
          requiresPrescription: false,
          rating: "4.7",
          reviewCount: 189,
        },
        // Goli Products from catalog
        {
          name: "Goli Nutrition apple cider vinegar gummies ,60 CT",
          slug: "goli-acv-gummies-60ct",
          description: "Apple cider vinegar gummies with organic ingredients for digestive health and wellness support.",
          shortDescription: "Apple cider vinegar gummies",
          price: "370.01",
          dosage: "60 gummies",
          categoryId: digestiveCategory.id,
          brandId: goliBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.25%20PM%20(1)_1755031702989.jpeg",
          stockQuantity: 75,
          requiresPrescription: false,
          rating: "4.4",
          reviewCount: 312,
        },
        // Ester-C Products from catalog
        {
          name: "Ester-c vitamin c 500mg coated tablets ,225 count",
          slug: "ester-c-500mg-225ct",
          description: "Gentle, non-acidic Ester-C vitamin C formula that's easy on the stomach with enhanced absorption.",
          shortDescription: "Non-acidic Vitamin C 500mg",
          price: "515.49",
          dosage: "500mg",
          categoryId: vitaminCategory.id,
          brandId: naturesWayBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.26%20PM_1755031702988.jpeg",
          stockQuantity: 95,
          requiresPrescription: false,
          rating: "4.8",
          reviewCount: 456,
        },
        // HALLS Products from catalog  
        {
          name: "Halls relief honey lemon cough drops, 20 Packs of 9 Drops",
          slug: "halls-honey-lemon-20packs",
          description: "Soothing honey lemon cough drops for throat relief. Bulk pack with 20 individual packs of 9 drops each.",
          shortDescription: "Honey lemon cough drops 20 packs",
          price: "644.18",
          dosage: "180 drops total",
          categoryId: otcCategory.id,
          brandId: pfizerBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.27%20PM_1755031702987.jpeg",
          stockQuantity: 45,
          requiresPrescription: false,
          rating: "4.6",
          reviewCount: 234,
        },
        // AZO Products from catalog
        {
          name: "Azo cranberry urinary tract health supplement ,100 soft gels",
          slug: "azo-cranberry-100ct",
          description: "Cranberry concentrate supplement for urinary tract health and cleansing support.",
          shortDescription: "Cranberry urinary health 100ct",
          price: "298.87",
          dosage: "100 softgels",
          categoryId: vitaminCategory.id,
          brandId: johnsonBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.28%20PM_1755031702986.jpeg",
          stockQuantity: 85,
          requiresPrescription: false,
          rating: "4.5",
          reviewCount: 198,
        },
        // First Aid Products from catalog
        {
          name: "Johnson & Johnson travel ready portable emergency first aid kit, 80 pc",
          slug: "jj-first-aid-kit-80pc",
          description: "Complete portable first aid kit with 80 essential pieces for home, travel, office, auto, and school.",
          shortDescription: "Portable first aid kit 80 pieces",
          price: "246.51",
          dosage: "80 pieces",
          categoryId: firstAidCategory.id,
          brandId: johnsonBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.29%20PM_1755031702985.jpeg",
          stockQuantity: 65,
          requiresPrescription: false,
          rating: "4.7",
          reviewCount: 156,
        },
        {
          name: "Curad Assorted bandages including antibacterial, heavy duty, fabric, and waterproof bandages ,300pieces",
          slug: "curad-assorted-bandages-300pc",
          description: "Complete assortment of bandages including antibacterial, heavy duty, fabric, and waterproof varieties.",
          shortDescription: "Assorted bandages 300 pieces",
          price: "300.85",
          dosage: "300 pieces",
          categoryId: firstAidCategory.id,
          brandId: redCrossBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.30%20PM_1755031702984.jpeg",
          stockQuantity: 120,
          requiresPrescription: false,
          rating: "4.4",
          reviewCount: 234,
        }
      ];

      // Remove existing products to prevent duplicates
      await storage.deleteAllProducts();

      // Create all products
      const createdProducts = [];
      for (const productData of products) {
        try {
          const product = await storage.createProduct(productData);
          createdProducts.push(product);
          console.log(`Created product: ${productData.name}`);
        } catch (error) {
          console.error(`Failed to create product ${productData.name}:`, error);
        }
      }

      res.json({ 
        message: "Database seeded successfully", 
        categories: categories.length,
        brands: brands.length + 7, // Added 7 new brands
        products: createdProducts.length,
        skipped: products.length - createdProducts.length
      });
    } catch (error) {
      console.error("Seeding error:", error);
      res.status(500).json({ message: "Failed to seed database", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
