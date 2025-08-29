# 🚀 Complete Deployment Guide

## Overview
This guide will walk you through deploying your PillCart application across three services:
- **Frontend**: Netlify (React/Vite app)
- **Backend**: Render (Node.js/Express API)
- **Database**: Neon Postgres (Serverless PostgreSQL)

## Prerequisites
- GitHub account with your code pushed
- Netlify account
- Render account
- Neon account

---

## Phase 1: Database Setup (Neon Postgres)

### 1. Create Neon Database
1. Go to [Neon Console](https://console.neon.tech/)
2. Click "Create Project"
3. Choose:
   - **Project name**: `pillcart-db`
   - **Database name**: `pillcart`
   - **Region**: Choose closest to your users
4. Click "Create Project"

### 2. Get Database Connection String
1. In your Neon dashboard, go to "Connection Details"
2. Copy the connection string (it looks like):
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/pillcart?sslmode=require
   ```
3. **Save this** - you'll need it for Render

### 3. Run Database Migrations (Optional)
If you have migrations, run them locally first:
```bash
# Set your DATABASE_URL temporarily
export DATABASE_URL="your_neon_connection_string"
npm run db:push
```

---

## Phase 2: Backend Deployment (Render)

### 1. Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `pillcart-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Starter for production)

### 2. Set Environment Variables
In Render dashboard, go to "Environment" and add:

```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=your_neon_connection_string_from_step_1
SESSION_SECRET=your_super_secure_random_string_here
FRONTEND_URL=https://your-frontend-name.netlify.app
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**Important**: 
- Replace `your_neon_connection_string_from_step_1` with actual Neon URL
- Generate a secure SESSION_SECRET (or let Render auto-generate)
- You'll update FRONTEND_URL after deploying to Netlify

### 3. Deploy Backend
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://your-backend-name.onrender.com`
4. Test health check: `https://your-backend-name.onrender.com/api/health`

---

## Phase 3: Frontend Deployment (Netlify)

### 1. Create Netlify Site
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build:client`
   - **Publish directory**: `dist/public`
   - **Base directory**: (leave empty)

### 2. Set Environment Variables
In Netlify dashboard, go to "Site settings" → "Environment variables":

```bash
VITE_API_URL=https://your-backend-name.onrender.com
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

**Important**: Replace `your-backend-name.onrender.com` with your actual Render URL from Phase 2

### 3. Update netlify.toml
Before deploying, update the redirect URL in `netlify.toml`:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-actual-backend-name.onrender.com/api/:splat"
  status = 200
  force = true
```

### 4. Deploy Frontend
1. Click "Deploy site"
2. Wait for deployment (2-5 minutes)
3. Note your frontend URL: `https://your-frontend-name.netlify.app`

---

## Phase 4: Connect Frontend and Backend

### 1. Update Backend CORS
1. Go back to Render dashboard
2. Update the `FRONTEND_URL` environment variable:
   ```bash
   FRONTEND_URL=https://your-actual-frontend-name.netlify.app
   ```
3. Redeploy the backend service

### 2. Test the Connection
1. Visit your frontend URL
2. Try to:
   - Load the homepage
   - View products
   - Register/login
   - Make API calls

---

## Phase 5: Verification Checklist

### ✅ Database (Neon)
- [ ] Database created and accessible
- [ ] Connection string copied
- [ ] Tables created (if using migrations)

### ✅ Backend (Render)
- [ ] Service deployed successfully
- [ ] Health check responds: `/api/health`
- [ ] Environment variables set correctly
- [ ] Database connection working
- [ ] CORS configured for frontend

### ✅ Frontend (Netlify)
- [ ] Site deployed successfully
- [ ] Environment variables set
- [ ] API calls work (check browser network tab)
- [ ] Authentication flow works
- [ ] Static assets load correctly

### ✅ Integration
- [ ] Frontend can communicate with backend
- [ ] Database operations work through API
- [ ] CORS allows frontend requests
- [ ] Authentication persists across requests

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors
**Symptoms**: Browser console shows CORS errors
**Solution**: 
- Verify `FRONTEND_URL` is set correctly in Render
- Check that your frontend URL matches exactly (including https://)
- Redeploy backend after changing CORS settings

#### 2. Database Connection Fails
**Symptoms**: Backend logs show database connection errors
**Solution**:
- Verify `DATABASE_URL` is correct in Render
- Check Neon database is running
- Ensure connection string includes `?sslmode=require`

#### 3. API Calls Fail
**Symptoms**: Frontend can't reach backend APIs
**Solution**:
- Verify `VITE_API_URL` is set correctly in Netlify
- Check backend is deployed and health check works
- Update `netlify.toml` redirect URL

#### 4. Build Failures
**Frontend Build Fails**:
- Check for TypeScript errors
- Verify all dependencies are in package.json
- Check build command is `npm run build:client`

**Backend Build Fails**:
- Check for TypeScript compilation errors
- Verify build command is `npm install && npm run build`
- Check all environment variables are set

### Debug Commands

**Test Backend Locally**:
```bash
# Set environment variables
export DATABASE_URL="your_neon_url"
export NODE_ENV="development"

# Test database connection
npm run db:test

# Start server
npm run dev
```

**Test Frontend Locally**:
```bash
# Set environment variables
export VITE_API_URL="https://your-backend.onrender.com"

# Build and test
npm run build:client
npm run preview
```

---

## Post-Deployment

### 1. Set Up Monitoring
- Monitor Render logs for backend errors
- Monitor Netlify deploy logs for frontend issues
- Set up Neon monitoring for database performance

### 2. Configure Custom Domains (Optional)
- **Netlify**: Add custom domain in site settings
- **Render**: Add custom domain in service settings
- Update CORS and API URLs accordingly

### 3. Set Up SSL/HTTPS
- Both Netlify and Render provide free SSL certificates
- Ensure all URLs use HTTPS in production

### 4. Performance Optimization
- Enable Netlify's asset optimization
- Configure Render's auto-scaling (paid plans)
- Monitor Neon connection pooling

---

## Environment Variables Summary

### Netlify (Frontend)
```bash
VITE_API_URL=https://your-backend.onrender.com
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### Render (Backend)
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
SESSION_SECRET=...
FRONTEND_URL=https://your-frontend.netlify.app
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Neon (Database)
- No environment variables needed
- Just provide the connection string to Render

---

## 🎉 Success!

If all steps are completed successfully, you should have:
- ✅ A fully deployed full-stack application
- ✅ Frontend hosted on Netlify with CDN
- ✅ Backend API hosted on Render
- ✅ PostgreSQL database on Neon
- ✅ Secure HTTPS connections
- ✅ Proper CORS configuration
- ✅ Environment-based configuration

Your application is now live and ready for users! 🚀