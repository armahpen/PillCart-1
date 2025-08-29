# Render Backend Deployment Guide

## Prerequisites

1. A Render account (sign up at [render.com](https://render.com))
2. Your repository pushed to GitHub/GitLab
3. Environment variables ready (database URL, API keys, etc.)

## Deployment Options

### Option 1: Using render.yaml (Recommended)

The `render.yaml` file is already configured for automatic deployment.

1. **Connect Repository to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub/GitLab repository
   - Select this repository
   - Render will automatically detect the `render.yaml` file

2. **Configure Environment Variables**
   
   The following environment variables will be automatically set:
   - `NODE_ENV=production`
   - `DATABASE_URL` (from the PostgreSQL database)
   
   **Add these manually in Render dashboard:**
   - `STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key`
   - `GOOGLE_CLOUD_PROJECT_ID=your_project_id`
   - `GOOGLE_CLOUD_STORAGE_BUCKET=your_bucket_name`
   - Any other environment variables your app needs

3. **Deploy**
   - Click "Apply" to create the services
   - Render will create both the web service and PostgreSQL database
   - Your backend will be available at `https://your-service-name.onrender.com`

### Option 2: Manual Setup

If you prefer manual setup:

1. **Create PostgreSQL Database**
   - Go to Render Dashboard
   - Click "New" → "PostgreSQL"
   - Choose your plan (Free tier available)
   - Note the connection string

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your repository
   - Configure:
     - **Build Command**: `npm run build`
     - **Start Command**: `npm start`
     - **Environment**: Node
     - **Plan**: Free (or higher for production)

3. **Set Environment Variables**
   - In your web service settings, add:
     ```
     NODE_ENV=production
     DATABASE_URL=postgresql://username:password@host:port/database
     STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
     GOOGLE_CLOUD_PROJECT_ID=your_project_id
     GOOGLE_CLOUD_STORAGE_BUCKET=your_bucket_name
     ```

## Important Configuration Details

### CORS Setup
The backend is configured to allow requests from:
- `https://mysite.netlify.app` (replace with your actual Netlify URL)
- `http://localhost:5173` (for local development)
- `http://localhost:3000` (for local development)
- `http://localhost:5000` (for local development)

**Update CORS origins**: Edit `server/index.ts` and replace `https://mysite.netlify.app` with your actual Netlify URL.

### Database Configuration
- ✅ DATABASE_URL is already configured in `server/db.ts`
- ✅ Uses Neon serverless PostgreSQL driver
- ✅ Supports connection pooling

### Build Process
- **Build Command**: `npm run build`
  - Builds both frontend (Vite) and backend (esbuild)
  - Output: `dist/index.js` (server) and `dist/public/` (client)
- **Start Command**: `npm start`
  - Runs the built server from `dist/index.js`

## Post-Deployment Steps

1. **Update Netlify Configuration**
   - Update your `netlify.toml` file
   - Replace `https://your-backend-url.com` with your Render URL
   - Example: `https://pillcart-backend.onrender.com`

2. **Update Frontend Environment Variables**
   - In Netlify dashboard, set:
     ```
     VITE_API_URL=https://your-render-app.onrender.com
     ```

3. **Test the Connection**
   - Visit `https://your-render-app.onrender.com/api/products`
   - Should return JSON response with products

## Environment Variables Reference

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV=production`

### Optional (depending on features used)
- `STRIPE_SECRET_KEY` - For payment processing
- `GOOGLE_CLOUD_PROJECT_ID` - For Google Cloud Storage
- `GOOGLE_CLOUD_STORAGE_BUCKET` - For file uploads
- `SESSION_SECRET` - For session management (auto-generated if not set)

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation

### Database Connection Issues
- Verify DATABASE_URL is correctly set
- Check database is running and accessible
- Run database migrations if needed: `npm run db:push`

### CORS Errors
- Update allowed origins in `server/index.ts`
- Ensure your Netlify URL is in the allowedOrigins array
- Check that credentials are being sent with requests

### 503 Service Unavailable
- Check if the service is sleeping (free tier)
- Verify the health check endpoint `/api/products` is working
- Check server logs for startup errors

## Free Tier Limitations

- **Web Service**: 750 hours/month, sleeps after 15 minutes of inactivity
- **PostgreSQL**: 1GB storage, 1 month retention
- **Bandwidth**: 100GB/month

For production, consider upgrading to paid plans for:
- Always-on services
- More storage and bandwidth
- Better performance
- Longer database retention

## Your Backend URL
After deployment, your backend will be available at:
`https://your-service-name.onrender.com`

Remember to update this URL in your Netlify frontend configuration!