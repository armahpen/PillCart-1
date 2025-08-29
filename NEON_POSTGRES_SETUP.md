# Neon Postgres Setup Guide

## Overview

Your backend is configured to use **Neon Postgres** with **Drizzle ORM** and the **@neondatabase/serverless** driver. This setup is optimized for serverless environments and provides excellent performance.

## Current Configuration

### ✅ **Already Configured:**
- **Drizzle ORM** with Neon serverless driver
- **Connection pooling** with proper timeouts
- **Error handling** and validation
- **Graceful shutdown** handling
- **Database connection testing**

### 🛠 **Database Stack:**
- **Database**: Neon Postgres (serverless)
- **ORM**: Drizzle ORM
- **Driver**: @neondatabase/serverless
- **Schema**: Comprehensive e-commerce schema with users, products, orders, etc.

## Setup Steps

### 1. Get Your Neon Database URL

1. **Sign up/Login to Neon**: Go to [neon.tech](https://neon.tech)
2. **Create a Database**: 
   - Click "Create Project"
   - Choose a name (e.g., "pillcart-db")
   - Select a region close to your users
3. **Get Connection String**:
   - Go to your project dashboard
   - Click "Connection Details"
   - Copy the connection string (it looks like):
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Set Environment Variables

Create a `.env` file in your project root:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# Other environment variables
NODE_ENV=development
PORT=5000
```

**Important**: Replace the DATABASE_URL with your actual Neon connection string.

### 3. Push Database Schema

Run the following command to create tables in your Neon database:

```bash
npm run db:push
```

This will create all the tables defined in your `shared/schema.ts` file.

## Testing the Database Connection

### Method 1: Test Connection Only
```bash
npm run db:test
```

This will test the database connection without starting the server.

### Method 2: Start Development Server
```bash
npm run dev
```

This will:
1. Test the database connection
2. Start the development server if connection succeeds
3. Show connection status in the console

### Method 3: Start Production Server
```bash
# First build the project
npm run build

# Then start the server
npm start
```

## Expected Output

### ✅ **Successful Connection:**
```
🔗 Connecting to Neon Postgres...
🧪 Testing database connection...
✅ Database connection successful!
🚀 Starting server...
✅ Server running on port 5000
🌐 API available at http://localhost:5000/api
📊 Health check: http://localhost:5000/api/products
```

### ❌ **Failed Connection:**
```
🔗 Connecting to Neon Postgres...
🧪 Testing database connection...
❌ Database connection test failed: [error details]
❌ Failed to connect to database. Server will not start.
```

## Troubleshooting

### Common Issues:

#### 1. **DATABASE_URL not set**
```
Error: DATABASE_URL must be set. Did you forget to provision a database?
```
**Solution**: Add DATABASE_URL to your `.env` file

#### 2. **Invalid DATABASE_URL format**
```
Error: DATABASE_URL must be a valid PostgreSQL connection string
```
**Solution**: Ensure your URL starts with `postgresql://` or `postgres://`

#### 3. **Connection timeout**
```
❌ Database connection test failed: Connection timeout
```
**Solutions**:
- Check your internet connection
- Verify the Neon database is running
- Check if your IP is whitelisted (Neon allows all IPs by default)

#### 4. **Authentication failed**
```
❌ Database connection test failed: password authentication failed
```
**Solutions**:
- Verify your username and password in the connection string
- Reset your database password in Neon dashboard
- Ensure the connection string is copied correctly

#### 5. **SSL/TLS issues**
```
❌ Database connection test failed: SSL connection error
```
**Solution**: Ensure your connection string includes `?sslmode=require`

## Database Schema

Your database includes these tables:
- **users** - User accounts and authentication
- **products** - Product catalog
- **categories** - Product categories
- **brands** - Product brands
- **orders** - Customer orders
- **order_items** - Order line items
- **cart_items** - Shopping cart items
- **prescriptions** - Prescription uploads
- **admin_permissions** - Admin role permissions
- **sessions** - User sessions

## Environment Variables Reference

### Required:
```bash
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
```

### Optional:
```bash
NODE_ENV=development
PORT=5000
SESSION_SECRET=your_session_secret
```

## Connection Pool Configuration

The connection pool is configured with:
- **Max connections**: 20
- **Idle timeout**: 30 seconds
- **Connection timeout**: 2 seconds

These settings are optimized for serverless environments and can handle concurrent requests efficiently.

## Health Check Endpoint

Test your database connection via HTTP:
```bash
curl http://localhost:5000/api/products
```

This endpoint will return products from your database, confirming the connection works.

## Production Deployment

For production (Render, Railway, etc.), set the DATABASE_URL environment variable in your hosting platform's dashboard. The same connection string from Neon will work in production.

## Neon Features Used

- **Serverless driver** - Optimized for serverless environments
- **Connection pooling** - Efficient connection management  
- **WebSocket support** - For real-time features
- **SSL encryption** - Secure connections
- **Auto-scaling** - Handles traffic spikes automatically

Your Neon Postgres setup is production-ready and optimized for performance!