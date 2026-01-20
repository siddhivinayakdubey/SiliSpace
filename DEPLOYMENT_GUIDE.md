# Free Deployment Guide for Sili Spaces

## 📋 Overview
Deploy your app for **FREE** using:
- **Frontend**: Vercel (Free tier)
- **Backend**: Render (Free tier)
- **Database**: MongoDB Atlas (Free tier)

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose **FREE** M0 tier
   - Select region closest to you
   - Click "Create"

3. **Setup Database Access**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Username: `sili_admin` (or your choice)
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<password>` with your actual password
   - **Save this connection string!**

---

## 🚀 Step 2: Deploy Backend to Render

1. **Push to GitHub**
   - Create a new GitHub repository
   - Push your `/app/backend` folder to it
   ```bash
   cd /app/backend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Create Render Account**
   - Go to https://render.com/
   - Sign up with GitHub (free)

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `sili-spaces-backend` (or your choice)
     - **Region**: Select closest to you
     - **Branch**: `main`
     - **Root Directory**: Leave empty (or type `.` if needed)
     - **Runtime**: `Python 3`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
     - **Instance Type**: **Free**

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   ```
   MONGO_URL = your-mongodb-atlas-connection-string
   DB_NAME = sili_spaces
   JWT_SECRET = your-super-secret-key-change-this-to-random-string
   CORS_ORIGINS = https://your-app.vercel.app
   ```
   
   **Note**: You'll update `CORS_ORIGINS` after deploying frontend

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Copy your backend URL (e.g., `https://sili-spaces-backend.onrender.com`)
   - **Save this URL!**

---

## 🎨 Step 3: Deploy Frontend to Vercel

1. **Update Frontend Environment**
   - Edit `/app/frontend/.env.production`
   - Replace `REACT_APP_BACKEND_URL` with your Render backend URL:
   ```
   REACT_APP_BACKEND_URL=https://sili-spaces-backend.onrender.com
   ```

2. **Push Frontend to GitHub**
   - Create another GitHub repository for frontend
   - Push your `/app/frontend` folder
   ```bash
   cd /app/frontend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/FRONTEND_REPO.git
   git push -u origin main
   ```

3. **Create Vercel Account**
   - Go to https://vercel.com/signup
   - Sign up with GitHub (free)

4. **Deploy Frontend**
   - Click "Add New..." → "Project"
   - Import your frontend GitHub repository
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: Leave as `.`
     - **Build Command**: `yarn build`
     - **Output Directory**: `build`
   
5. **Add Environment Variable**
   - Under "Environment Variables":
   ```
   REACT_APP_BACKEND_URL = https://sili-spaces-backend.onrender.com
   ```

6. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `https://your-app.vercel.app`
   - **Save this URL!**

---

## 🔄 Step 4: Update Backend CORS

1. **Go back to Render Dashboard**
   - Open your backend service
   - Go to "Environment" tab
   - Update `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS = https://your-app.vercel.app
   ```
   - Click "Save Changes"
   - Service will automatically redeploy

---

## ✅ Step 5: Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Click "Get Started"
3. Create an account
4. Create a space
5. Test all features!

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide for **FREE**!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
- Database: MongoDB Atlas (managed)

---

## ⚠️ Free Tier Limitations

1. **Render Free Tier**:
   - Service sleeps after 15 minutes of inactivity
   - Takes 30-60 seconds to wake up on first request
   - 750 hours/month (enough for one service 24/7)

2. **MongoDB Atlas Free Tier**:
   - 512 MB storage
   - Shared RAM
   - Perfect for small-medium apps

3. **Vercel Free Tier**:
   - 100 GB bandwidth/month
   - Unlimited projects
   - Automatic HTTPS

---

## 🔧 Troubleshooting

**Backend not responding:**
- Check Render logs in dashboard
- Verify environment variables are set
- Wait 30-60 seconds (free tier wakes up slowly)

**CORS errors:**
- Verify `CORS_ORIGINS` matches your Vercel URL exactly
- Include `https://` in the URL
- No trailing slash

**Database connection failed:**
- Check MongoDB Atlas network access (0.0.0.0/0)
- Verify connection string has correct password
- Make sure user has read/write permissions

---

## 🚀 Future Upgrades

When your app grows, you can upgrade:
- Render: $7/month (always-on, no sleep)
- MongoDB Atlas: $9/month (more storage)
- Vercel: Free tier is usually sufficient

---

## 📝 Quick Commands Reference

**Update Backend:**
```bash
cd /app/backend
git add .
git commit -m "Update backend"
git push
# Render auto-deploys
```

**Update Frontend:**
```bash
cd /app/frontend
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys
```

---

## 🎊 Congratulations!

Your Sili Spaces app is now live and free! Share your Vercel URL with users and enjoy! 💕
