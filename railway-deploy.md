# 🚀 Deploy to Railway (FREE & EASY)

## Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Connect your GitHub repository

## Step 2: Deploy Backend
1. **Create new project** in Railway
2. **Add PostgreSQL database** (free tier)
3. **Deploy from GitHub** - select your repo
4. **Set environment variables:**
   - `SECRET_KEY=your-secret-key-here`
   - `DATABASE_URL=postgresql://...` (auto-generated)

## Step 3: Deploy Frontend
1. **Create another project** for frontend
2. **Deploy from GitHub** - same repo
3. **Set build command:** `npm run build`
4. **Set start command:** `npm run preview`

## Step 4: Update API URLs
Update `src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://your-backend.railway.app';
```

## Step 5: Share with Friends
- **Frontend URL:** `https://your-frontend.railway.app`
- **Works on any device, anywhere!**
- **No setup required for friends**

---

## 🎯 **RAILWAY ADVANTAGES**
- ✅ **FREE** for small projects
- ✅ **Automatic deployments** from GitHub
- ✅ **Built-in database** (PostgreSQL)
- ✅ **Custom domains** available
- ✅ **SSL certificates** included
- ✅ **Works worldwide** instantly
