# 🚀 Quick Deploy Reference

## 📋 Pre-Deployment Checklist

### Code Ready?
- [ ] All code pushed to GitHub
- [ ] `netlify.toml` configured
- [ ] `render.yaml` configured  
- [ ] Environment variable templates created
- [ ] Database configuration verified

### Accounts Ready?
- [ ] GitHub account
- [ ] Netlify account
- [ ] Render account
- [ ] Neon account

---

## 🗄️ Phase 1: Database (Neon) - 5 minutes

1. **Create Project**: [console.neon.tech](https://console.neon.tech/) → "Create Project"
2. **Settings**: 
   - Name: `pillcart-db`
   - Database: `pillcart`
3. **Copy Connection String**: Save for Render
   ```
   postgresql://user:pass@host/db?sslmode=require
   ```

---

## 🖥️ Phase 2: Backend (Render) - 10 minutes

1. **Create Service**: [dashboard.render.com](https://dashboard.render.com/) → "New +" → "Web Service"
2. **Settings**:
   - Name: `pillcart-backend`
   - Build: `npm install && npm run build`
   - Start: `npm start`
3. **Environment Variables**:
   ```bash
   NODE_ENV=production
   DATABASE_URL=<neon_connection_string>
   SESSION_SECRET=<generate_secure_string>
   FRONTEND_URL=https://your-site.netlify.app
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. **Deploy** → Note backend URL: `https://your-app.onrender.com`

---

## 🌐 Phase 3: Frontend (Netlify) - 5 minutes

1. **Create Site**: [app.netlify.com](https://app.netlify.com/) → "Add new site"
2. **Settings**:
   - Build: `npm run build:client`
   - Publish: `dist/public`
3. **Environment Variables**:
   ```bash
   VITE_API_URL=https://your-backend.onrender.com
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   ```
4. **Update netlify.toml**: Replace backend URL
5. **Deploy** → Note frontend URL: `https://your-site.netlify.app`

---

## 🔗 Phase 4: Connect (2 minutes)

1. **Update Render**: Set `FRONTEND_URL` to actual Netlify URL
2. **Redeploy Backend**
3. **Test**: Visit frontend, try API calls

---

## 🧪 Testing Checklist

### Quick Tests
- [ ] Frontend loads: `https://your-site.netlify.app`
- [ ] Backend health: `https://your-backend.onrender.com/api/health`
- [ ] API works: Try login/register
- [ ] Database: Check data persistence

### Debug URLs
- **Netlify Logs**: Site dashboard → "Deploys"
- **Render Logs**: Service dashboard → "Logs"
- **Neon Monitoring**: Project dashboard → "Monitoring"

---

## 🆘 Quick Fixes

### CORS Error?
```bash
# In Render, check:
FRONTEND_URL=https://exact-netlify-url.netlify.app
```

### API Not Found?
```bash
# In Netlify, check:
VITE_API_URL=https://exact-render-url.onrender.com
```

### Database Error?
```bash
# In Render, verify:
DATABASE_URL=postgresql://...?sslmode=require
```

### Build Failed?
- Check GitHub code is pushed
- Verify package.json scripts
- Check environment variables

---

## 📝 URLs to Update

After deployment, update these in your notes:

```bash
# Replace these placeholders:
your-backend-name.onrender.com → ________________
your-frontend-name.netlify.app → ________________

# Update in:
- netlify.toml (redirect URL)
- Render FRONTEND_URL
- Netlify VITE_API_URL
```

---

## ⚡ One-Command Deploy Check

After everything is deployed, test with:

```bash
# Test backend
curl https://your-backend.onrender.com/api/health

# Test frontend (should return HTML)
curl https://your-frontend.netlify.app

# Test API through frontend
curl https://your-frontend.netlify.app/api/products
```

---

## 🎯 Success Indicators

✅ **All Green**:
- Netlify deploy badge: ✅ Published
- Render service: �� Live  
- Neon database: ✅ Active
- Frontend loads without errors
- API calls work in browser network tab
- Authentication flow works

🎉 **You're Live!** 🎉