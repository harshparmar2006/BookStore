# CRITICAL FIXES NEEDED IN RENDER DASHBOARD

## Issue 1: Root Directory (MOST IMPORTANT)
The error shows Render is looking for `package.json` in `/opt/render/project/src/` but your file is in the root.

**FIX:**
1. Go to Render Dashboard → BookStore-1 → **Settings**
2. Under **Build & Deploy** section
3. Find **Root Directory** field
4. **Change it from `src` to `.` (or leave it EMPTY/BLANK)**
5. This tells Render to use the repository root, not a `src` subdirectory

## Issue 2: Environment Variables (CRITICAL)

### ❌ Current MONGO_URI is WRONG:
```
MONGO_URI: mongodb://127.0.0.1:27017/bookStore
```
This is a **localhost** connection that will NOT work on Render!

### ✅ Fix MONGO_URI:
1. Go to **Environment** tab in Render
2. Update `MONGO_URI` to your **MongoDB Atlas** connection string:
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/bookStore?retryWrites=true&w=majority`
   - Or use Render's MongoDB service if you have one
   - **DO NOT use localhost!**

### ✅ Add Missing Environment Variables:
Add these in the **Environment** tab:

1. **FRONTEND_URL**
   - Key: `FRONTEND_URL`
   - Value: Your frontend URL (e.g., `https://your-frontend.onrender.com` or `http://localhost:5173` for development)

2. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

## Summary of Settings to Check:

### Settings → Build & Deploy:
- **Root Directory**: `.` (or blank/empty) ⚠️ CRITICAL
- **Build Command**: `npm install`
- **Start Command**: `npm start` (NOT `node app.js`)

### Environment Variables:
- `MONGO_URI`: MongoDB Atlas connection string (NOT localhost!)
- `FRONTEND_URL`: Your frontend URL
- `NODE_ENV`: `production`
- `PORT`: (Auto-provided by Render, but you can leave it as is)

## After Making Changes:
1. Click **Save Changes**
2. Go to **Events** tab
3. Click **Manual Deploy** → **Deploy latest commit**
4. Watch the logs - it should now find `package.json` correctly!

