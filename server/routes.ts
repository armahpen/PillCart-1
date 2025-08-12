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

  // Authentic Smile Pills Ltd catalog seeding endpoint
  app.post('/api/seed', async (req, res) => {
    try {
      // Clear all existing data in correct order
      await storage.clearAllData();

      // Create categories matching your exact catalog structure
      const vitaminsCategory = await storage.createCategory({
        name: "Vitamins & Multivitamins",
        slug: "vitamins-multivitamins", 
        description: "Complete multivitamins and essential vitamin supplements for all ages"
      });

      const mineralsCategory = await storage.createCategory({
        name: "Minerals & Trace Elements",
        slug: "minerals-trace-elements",
        description: "Essential minerals including zinc, magnesium, calcium, and iron supplements"
      });

      const herbalCategory = await storage.createCategory({
        name: "Herbal & Natural Supplements", 
        slug: "herbal-natural-supplements",
        description: "Natural herbal remedies including cranberry, turmeric, garlic, and botanical extracts"
      });

      const otcCategory = await storage.createCategory({
        name: "Over-the-Counter",
        slug: "over-the-counter",
        description: "Pain relievers, allergy medicines, and other non-prescription medications"
      });

      const firstAidCategory = await storage.createCategory({
        name: "First Aid & Personal Care",
        slug: "first-aid-personal-care",
        description: "Bandages, topical treatments, and personal health care items"
      });

      // Create authentic brands from your catalog
      const century21Brand = await storage.createBrand({
        name: "21st Century", 
        description: "Quality health and wellness supplements"
      });

      const centrumBrand = await storage.createBrand({
        name: "Centrum",
        description: "Leading multivitamin and supplement brand"
      });

      const advilBrand = await storage.createBrand({
        name: "Advil",
        description: "Trusted pain relief and fever reduction"
      });

      const americanHealthBrand = await storage.createBrand({
        name: "American Health",
        description: "Premium vitamin and supplement manufacturer"
      });

      const appliedNutritionBrand = await storage.createBrand({
        name: "Applied Nutrition",
        description: "Sports nutrition and wellness supplements"
      });

      const azoBrand = await storage.createBrand({
        name: "AZO",
        description: "Urinary tract health and women's wellness"
      });

      const benadrylBrand = await storage.createBrand({
        name: "Benadryl",
        description: "Allergy relief and antihistamine medications"
      });

      const braggBrand = await storage.createBrand({
        name: "Bragg",
        description: "Apple cider vinegar and health products"
      });

      const curadBrand = await storage.createBrand({
        name: "Curad",
        description: "Medical bandages and first aid supplies"
      });

      const equateBrand = await storage.createBrand({
        name: "Equate",
        description: "Quality generic healthcare and wellness products"
      });

      // Authentic products from your Smile Pills Ltd catalog with exact prices
      const products = [
        // 21st Century Products
        {
          name: "21st Century 800mcg Folic Acid Tablets, 180 Count",
          slug: "21st-century-folic-acid-800mcg-180ct",
          description: "Essential folic acid supplement for reproductive health and red blood cell formation.",
          shortDescription: "Folic acid 800mcg, 180 tablets",
          price: "95.10",
          dosage: "180 tablets",
          categoryId: vitaminsCategory.id,
          brandId: century21Brand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.17%20PM_1755031702979.jpeg",
          stockQuantity: 120,
          requiresPrescription: false,
          rating: "4.2",
          reviewCount: 89
        },
        {
          name: "21st Century Acidophilus Capsules, 100 Count",
          slug: "21st-century-acidophilus-100ct",
          description: "Probiotic supplement supporting digestive health and immune system.",
          shortDescription: "Acidophilus probiotic, 100 capsules",
          price: "177.59",
          dosage: "100 capsules",
          categoryId: herbalCategory.id,
          brandId: century21Brand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.18%20PM_1755031702978.jpeg",
          stockQuantity: 95,
          requiresPrescription: false,
          rating: "4.4",
          reviewCount: 156
        },
        {
          name: "21st Century Arthri-Flex Advantage Plus Vitamin D3 Joint Support, 120 Tablets",
          slug: "21st-century-arthri-flex-advantage-plus-120ct",
          description: "Advanced joint support supplement with glucosamine, chondroitin, and Vitamin D3.",
          shortDescription: "Joint support with Vitamin D3, 120 tablets",
          price: "444.85",
          dosage: "120 tablets",
          categoryId: herbalCategory.id,
          brandId: century21Brand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.19%20PM_1755031702977.jpeg",
          stockQuantity: 75,
          requiresPrescription: false,
          rating: "4.3",
          reviewCount: 203
        },
        {
          name: "21st Century B12 2500mcg Sublingual Tablets, 110 Count",
          slug: "21st-century-b12-2500mcg-sublingual-110ct",
          description: "High-potency Vitamin B12 sublingual tablets for energy and nerve function support.",
          shortDescription: "B12 2500mcg sublingual, 110 tablets",
          price: "177.59",
          dosage: "110 tablets",
          categoryId: vitaminsCategory.id,
          brandId: century21Brand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.20%20PM_1755031702992.jpeg",
          stockQuantity: 110,
          requiresPrescription: false,
          rating: "4.5",
          reviewCount: 287
        },
        {
          name: "21st Century CoQ10 30mg Capsules, 45 Count",
          slug: "21st-century-coq10-30mg-45ct",
          description: "Coenzyme Q10 supplement for heart health and cellular energy production.",
          shortDescription: "CoQ10 30mg, 45 capsules",
          price: "222.55",
          dosage: "45 capsules",
          categoryId: herbalCategory.id,
          brandId: century21Brand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.23%20PM_1755031702985.jpeg",
          stockQuantity: 85,
          requiresPrescription: false,
          rating: "4.1",
          reviewCount: 124
        },

        // Centrum Products
        {
          name: "Centrum Adult Multivitamin/Multimineral Supplement with Antioxidants, 200ct",
          slug: "centrum-adult-multivitamin-200ct",
          description: "Complete multivitamin and multimineral supplement with antioxidants for adult nutritional support.",
          shortDescription: "Adult multivitamin with antioxidants, 200ct",
          price: "348.76",
          dosage: "200 tablets",
          categoryId: vitaminsCategory.id,
          brandId: centrumBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.24%20PM_1755031702988.jpeg",
          stockQuantity: 150,
          requiresPrescription: false,
          rating: "4.6",
          reviewCount: 542
        },
        {
          name: "Centrum Kid's Multivitamin Gummies, Tropical Punch Flavors, 150ct",
          slug: "centrum-kids-gummies-150ct",
          description: "Children's multivitamin gummies with natural tropical punch flavors, 150 days supply.",
          shortDescription: "Kids multivitamin gummies, 150ct",
          price: "380.87",
          dosage: "150 gummies",
          categoryId: vitaminsCategory.id,
          brandId: centrumBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.25%20PM_1755031702990.jpeg",
          stockQuantity: 95,
          requiresPrescription: false,
          rating: "4.4",
          reviewCount: 298
        },
        {
          name: "Centrum Multivitamin for Men, 100ct",
          slug: "centrum-men-multivitamin-100ct",
          description: "Specially formulated multivitamin for men's nutritional needs.",
          shortDescription: "Men's multivitamin, 100ct",
          price: "258.86",
          dosage: "100 tablets",
          categoryId: vitaminsCategory.id,
          brandId: centrumBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.17%20PM%20(1)_1755031702979.jpeg",
          stockQuantity: 125,
          requiresPrescription: false,
          rating: "4.3",
          reviewCount: 187
        },
        {
          name: "Centrum Multivitamin for Women, 100ct",
          slug: "centrum-women-multivitamin-100ct",
          description: "Complete multivitamin formulated specifically for women's health needs.",
          shortDescription: "Women's multivitamin, 100ct",
          price: "258.86",
          dosage: "100 tablets",
          categoryId: vitaminsCategory.id,
          brandId: centrumBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.18%20PM%20(1)_1755031702978.jpeg",
          stockQuantity: 140,
          requiresPrescription: false,
          rating: "4.5",
          reviewCount: 324
        },
        {
          name: "Centrum Silver Adults 50+ Multivitamin Tablet, 125ct",
          slug: "centrum-silver-50-plus-125ct",
          description: "Age-adjusted multivitamin for adults 50+ with nutrients to support heart, brain, and eye health.",
          shortDescription: "Silver 50+ multivitamin, 125ct",
          price: "278.12",
          dosage: "125 tablets",
          categoryId: vitaminsCategory.id,
          brandId: centrumBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.19%20PM%20(1)_1755031702976.jpeg",
          stockQuantity: 105,
          requiresPrescription: false,
          rating: "4.4",
          reviewCount: 256
        },

        // Advil Products  
        {
          name: "Advil Liquid-Gel Pain Reliever and Fever Reducer, Ibuprofen 200mg, 240ct",
          slug: "advil-liquid-gel-200mg-240ct",
          description: "Fast-acting liquid gel capsules for effective pain relief and fever reduction.",
          shortDescription: "Liquid-gel ibuprofen 200mg, 240ct",
          price: "518.21",
          dosage: "240 capsules",
          categoryId: otcCategory.id,
          brandId: advilBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.23%20PM%20(1)_1755031702985.jpeg",
          stockQuantity: 85,
          requiresPrescription: false,
          rating: "4.7",
          reviewCount: 432
        },
        {
          name: "Advil Pain Reliever and Fever Reducer, Ibuprofen 200mg, 24ct",
          slug: "advil-ibuprofen-200mg-24ct",
          description: "Trusted ibuprofen tablets for fast, effective pain relief and fever reduction.",
          shortDescription: "Ibuprofen 200mg tablets, 24ct",
          price: "122.76",
          dosage: "24 tablets",
          categoryId: otcCategory.id,
          brandId: advilBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.24%20PM%20(1)_1755031702987.jpeg",
          stockQuantity: 200,
          requiresPrescription: false,
          rating: "4.6",
          reviewCount: 189
        },
        {
          name: "Advil PM Pain Reliever and Nighttime Sleep Aid, 120 Coated Caplets",
          slug: "advil-pm-sleep-aid-120ct",
          description: "Combination pain reliever and sleep aid for nighttime pain relief.",
          shortDescription: "PM pain reliever with sleep aid, 120ct",
          price: "320.85",
          dosage: "120 caplets",
          categoryId: otcCategory.id,
          brandId: advilBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.25%20PM%20(1)_1755031702989.jpeg",
          stockQuantity: 110,
          requiresPrescription: false,
          rating: "4.3",
          reviewCount: 276
        },

        // American Health Products
        {
          name: "American Health Ester-C with Citrus Bioflavonoids, 500mg, 120 Count",
          slug: "american-health-ester-c-500mg-120ct",
          description: "Gentle, non-acidic Vitamin C with citrus bioflavonoids for enhanced absorption.",
          shortDescription: "Ester-C 500mg with bioflavonoids, 120ct",
          price: "375.19",
          dosage: "120 capsules",
          categoryId: vitaminsCategory.id,
          brandId: americanHealthBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.16%20PM_1755031702981.jpeg",
          stockQuantity: 90,
          requiresPrescription: false,
          rating: "4.4",
          reviewCount: 167
        },

        // Applied Nutrition Products
        {
          name: "Applied Nutrition Green Tea Weight Loss Supplement, 90 Count Capsules",
          slug: "applied-nutrition-green-tea-90ct",
          description: "Green tea extract supplement to support healthy weight management and metabolism.",
          shortDescription: "Green tea weight loss supplement, 90ct",
          price: "246.01",
          dosage: "90 capsules",
          categoryId: herbalCategory.id,
          brandId: appliedNutritionBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.16%20PM%20(3)_1755031702980.jpeg",
          stockQuantity: 130,
          requiresPrescription: false,
          rating: "4.0",
          reviewCount: 143
        },

        // AZO Products
        {
          name: "AZO Cranberry Urinary Tract Health Supplement, 100 Soft Gels",
          slug: "azo-cranberry-100-softgels",
          description: "Cranberry supplement to help maintain urinary tract health and cleansing.",
          shortDescription: "Cranberry urinary health, 100 soft gels",
          price: "298.87",
          dosage: "100 soft gels",
          categoryId: herbalCategory.id,
          brandId: azoBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.15%20PM_1755031702982.jpeg",
          stockQuantity: 95,
          requiresPrescription: false,
          rating: "4.2",
          reviewCount: 234
        },
        {
          name: "AZO Urinary Pain Relief Maximum Strength, 99.5mg, 24 Tablets",
          slug: "azo-urinary-pain-relief-24ct",
          description: "Maximum strength urinary pain relief for UTI symptoms and discomfort.",
          shortDescription: "Urinary pain relief 99.5mg, 24ct",
          price: "199.82",
          dosage: "24 tablets",
          categoryId: otcCategory.id,
          brandId: azoBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.19%20PM%20(2)_1755031702975.jpeg",
          stockQuantity: 150,
          requiresPrescription: false,
          rating: "4.1",
          reviewCount: 178
        },

        // Benadryl Products
        {
          name: "Benadryl Allergy Plus Congestion Ultra Tabs, 24ct",
          slug: "benadryl-allergy-congestion-24ct",
          description: "Antihistamine and decongestant combination for allergy and congestion relief.",
          shortDescription: "Allergy plus congestion relief, 24ct",
          price: "180.06",
          dosage: "24 tablets",
          categoryId: otcCategory.id,
          brandId: benadrylBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.18%20PM%20(1)_1754947176457.jpeg",
          stockQuantity: 125,
          requiresPrescription: false,
          rating: "4.0",
          reviewCount: 92
        },
        {
          name: "Benadryl Ultra Tabs Antihistamine Allergy Relief with Diphenhydramine HCl, 24ct",
          slug: "benadryl-ultra-tabs-24ct",
          description: "Fast-acting antihistamine tablets for effective allergy symptom relief.",
          shortDescription: "Ultra antihistamine tablets, 24ct",
          price: "147.71",
          dosage: "24 tablets",
          categoryId: otcCategory.id,
          brandId: benadrylBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.17%20PM%20(1)_1754947176458.jpeg",
          stockQuantity: 175,
          requiresPrescription: false,
          rating: "4.3",
          reviewCount: 156
        },

        // Curad Products
        {
          name: "Curad Assorted Bandages - Antibacterial, Heavy Duty, Fabric & Waterproof, 300 Pieces",
          slug: "curad-assorted-bandages-300pc",
          description: "Complete assortment of bandages including antibacterial, heavy duty, fabric, and waterproof varieties.",
          shortDescription: "Assorted bandages 300 pieces",
          price: "300.85",
          dosage: "300 pieces",
          categoryId: firstAidCategory.id,
          brandId: curadBrand.id,
          imageUrl: "/assets/WhatsApp%20Image%202025-08-11%20at%201.33.24%20PM%20(3)_1755031702986.jpeg",
          stockQuantity: 120,
          requiresPrescription: false,
          rating: "4.4",
          reviewCount: 234
        }
      ];

      // Create all products from authentic catalog
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
        message: "Database seeded successfully with authentic Smile Pills Ltd catalog", 
        categories: 5,
        brands: 10,
        products: createdProducts.length
      });
    } catch (error) {
      console.error("Seeding error:", error);
      res.status(500).json({ message: "Failed to seed database", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
