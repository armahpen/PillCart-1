# Frontend Environment Variables Setup Guide

## Overview

Your frontend has been updated to use environment variables for API calls, making it easy to switch between local development and production environments.

## ✅ **What's Been Updated:**

### **1. API Configuration System**
- **`client/src/lib/api.ts`** - Centralized API configuration
- **`client/src/lib/queryClient.ts`** - Updated to use environment-based URLs
- **Key files updated** - LoginPage, UserDashboard, Header, ProductContext, and more

### **2. Environment Variable Support**
- **`VITE_API_URL`** - Backend API base URL
- **`VITE_STRIPE_PUBLIC_KEY`** - Stripe public key (already used)
- **Automatic fallback** - Uses relative URLs if no environment variable is set

### **3. Smart URL Handling**
- **Development**: Can use relative URLs (`/api/products`) or full URLs
- **Production**: Uses full URLs from environment variables
- **Static assets**: Properly handles `/attached_assets` paths

## 🚀 **Setup Instructions:**

### **For Local Development:**

1. **Create environment file:**
   ```bash
   # In the project root, create .env.local
   cp client/.env.example .env.local
   ```

2. **Configure for local development:**
   ```bash
   # .env.local
   VITE_API_URL=http://localhost:5000
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   ```

3. **Test the setup:**
   ```bash
   npm run dev
   ```

### **For Production (Netlify):**

1. **In Netlify Dashboard:**
   - Go to Site settings → Environment variables
   - Add these variables:
   ```
   VITE_API_URL=https://your-render-backend.onrender.com
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   ```

2. **Update netlify.toml:**
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://your-render-backend.onrender.com/api/:splat"
   ```

## 🔧 **How It Works:**

### **API URL Resolution:**
```typescript
// In development with VITE_API_URL=http://localhost:5000
getApiUrl('/api/products') → 'http://localhost:5000/api/products'

// In development without VITE_API_URL
getApiUrl('/api/products') → '/api/products' (relative)

// In production with VITE_API_URL=https://backend.onrender.com
getApiUrl('/api/products') → 'https://backend.onrender.com/api/products'
```

### **Updated Files:**
- ✅ **LoginPage.tsx** - Login and registration API calls
- ✅ **UserDashboard.tsx** - Orders and prescriptions API calls  
- ✅ **Header.tsx** - Logout API call
- ✅ **ProductContext.tsx** - Static asset loading
- ✅ **queryClient.ts** - All TanStack Query API calls
- ✅ **All components using apiRequest()** - Automatically updated

## 🧪 **Testing Different Configurations:**

### **Test 1: Local Development (Relative URLs)**
```bash
# .env.local (or no .env file)
# VITE_API_URL= (empty or commented out)

npm run dev
# API calls will use relative URLs like /api/products
```

### **Test 2: Local Development (Full URLs)**
```bash
# .env.local
VITE_API_URL=http://localhost:5000

npm run dev
# API calls will use full URLs like http://localhost:5000/api/products
```

### **Test 3: Production Simulation**
```bash
# .env.local
VITE_API_URL=https://your-backend.onrender.com

npm run dev
# API calls will use production URLs
```

## 🔍 **Debugging:**

### **Check API Configuration:**
Open browser console and run:
```javascript
// This will show your current API configuration
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
```

### **Debug API Calls:**
The system includes helpful logging:
```javascript
// In api.ts, you can call:
debugApiConfig();
// This shows all environment variables and configuration
```

### **Common Issues:**

#### **1. API calls fail in production**
- ✅ Check `VITE_API_URL` is set in Netlify
- ✅ Verify backend URL is correct and accessible
- ✅ Check CORS settings on backend

#### **2. Environment variables not working**
- ✅ Ensure variables start with `VITE_`
- ✅ Restart development server after changing .env
- ✅ Check .env.local is in project root (not client folder)

#### **3. Static assets not loading**
- ✅ Check `/attached_assets` paths are correct
- ✅ Verify assets exist in backend or CDN

## 📁 **File Structure:**
```
PillCart-1/
├── .env.local                    # Your local environment variables
├── client/
│   ├── .env.example             # Template for environment variables
│   └── src/
│       ├── lib/
│       │   ├── api.ts           # ✅ API configuration system
│       │   └── queryClient.ts   # ✅ Updated for environment URLs
│       ├── pages/
│       │   ├── LoginPage.tsx    # ✅ Updated API calls
│       │   └── UserDashboard.tsx # ✅ Updated API calls
│       ├── components/
│       │   └── layout/
│       │       └── header.tsx   # ✅ Updated API calls
│       └── contexts/
│           └── ProductContext.tsx # ✅ Updated asset loading
├── netlify.toml                 # ✅ Netlify configuration
└── FRONTEND_ENV_SETUP.md        # This guide
```

## 🎯 **Best Practices:**

### **Environment Variables:**
- ✅ Use `VITE_` prefix for all frontend variables
- ✅ Never put sensitive data in `VITE_` variables (they're public)
- ✅ Use `.env.local` for local development (ignored by git)
- ✅ Use `.env.example` for documentation

### **API Calls:**
- ✅ Always use `getApiUrl()` for API endpoints
- ✅ Use `getAssetUrl()` for static assets
- ✅ Use `apiRequest()` for authenticated requests
- ✅ Handle both relative and absolute URLs gracefully

### **Deployment:**
- ✅ Set environment variables in hosting platform
- ✅ Update redirect rules to match backend URL
- ✅ Test API calls after deployment
- ✅ Monitor for CORS issues

Your frontend is now fully configured to work with environment variables and can seamlessly switch between local development and production environments! 🚀