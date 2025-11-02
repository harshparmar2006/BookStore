# Render Deployment Instructions

## Current Issue
Render is trying to run `node app.js` but the actual entry point is `backend/app.js`. 

## Solution

### Option 1: Update Render Dashboard Settings (RECOMMENDED)

1. Go to your Render dashboard
2. Select your "BookStore-1" service
3. Go to **Settings** tab
4. Find **Build & Deploy** section
5. Update these fields:
   - **Root Directory**: `.` (leave empty or set to `.`)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (IMPORTANT: Change from `node app.js` to `npm start`)

6. Go to **Environment** tab and add these environment variables:
   - `MONGO_URI` - Your MongoDB connection string
   - `FRONTEND_URL` - Your frontend URL (e.g., `https://your-frontend.onrender.com`)
   - `NODE_ENV` - Set to `production`

7. Click **Save Changes** and trigger a new deployment

### Option 2: Use render.yaml (If deploying via Git)

If you're connecting via Git, Render should automatically use `render.yaml`. Make sure:
- The `render.yaml` file is in your repository root
- You're deploying from the root directory
- Render is configured to use the render.yaml file

## Required Environment Variables

Make sure these are set in Render's Environment tab:

- `MONGO_URI` - MongoDB Atlas connection string
- `FRONTEND_URL` - Your frontend URL
- `NODE_ENV` - Set to `production`
- `PORT` - Automatically provided by Render (don't need to set)

## After Deployment

Once deployed, your backend will be available at:
`https://your-service-name.onrender.com`

Test the deployment by visiting:
`https://your-service-name.onrender.com/api/v1` (should return 404 or your API response)

