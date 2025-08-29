# Netlify Deployment Guide

## Prerequisites

1. Your backend API should be deployed and accessible via HTTPS
2. You should have your Stripe public key ready
3. Ensure you have a Netlify account

## Deployment Steps

### 1. Connect Repository to Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your GitHub/GitLab repository
4. Select this repository

### 2. Configure Build Settings

Netlify should automatically detect the `netlify.toml` configuration, but verify these settings:

- **Build command**: `npm run build:client`
- **Publish directory**: `dist/public`
- **Base directory**: (leave empty)

### 3. Set Environment Variables

In your Netlify site dashboard, go to **Site settings > Environment variables** and add:

```
VITE_API_URL=https://your-backend-api-url.com
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

**Important**: Replace the values above with your actual backend URL and Stripe public key.

### 4. Update netlify.toml

Before deploying, update the `netlify.toml` file:

1. Replace `https://your-backend-url.com` with your actual backend URL in the redirects section
2. Add any additional environment variables in the `[build.environment]` section if needed

### 5. Deploy

1. Push your changes to your repository
2. Netlify will automatically build and deploy your site
3. Your site will be available at `https://your-site-name.netlify.app`

## Important Notes

### API Calls
- All API calls in your frontend use relative paths (e.g., `/api/products`)
- The `netlify.toml` redirects these to your backend server
- Make sure your backend URL in the redirects section is correct

### Environment Variables
- Only variables prefixed with `VITE_` are available in the frontend
- These are built into the static files at build time
- Never put sensitive data in VITE_ variables as they're publicly accessible

### Static Assets
- The `attached_assets` folder should be accessible via your backend
- If you need these assets served from Netlify, copy them to the `client/public` folder

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node version compatibility (using Node 18)
- Check build logs for specific error messages

### API Calls Fail
- Verify the backend URL in `netlify.toml` redirects
- Check CORS settings on your backend
- Ensure your backend accepts requests from your Netlify domain

### Environment Variables Not Working
- Ensure variables are prefixed with `VITE_`
- Check they're set in Netlify's environment variables section
- Redeploy after adding new environment variables

## Your Netlify Team
Your Netlify user ID: https://app.netlify.com/teams/armahpen