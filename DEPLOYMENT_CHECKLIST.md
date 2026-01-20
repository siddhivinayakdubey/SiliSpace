# 🚀 Free Deployment Checklist

Use this checklist to deploy Sili Spaces for FREE!

## ✅ Pre-Deployment Checklist

- [ ] Read `/app/DEPLOYMENT_GUIDE.md` completely
- [ ] Have GitHub account ready
- [ ] Have credit/debit card for verification (won't be charged on free tiers)

---

## 📦 Step 1: MongoDB Atlas Setup

- [ ] Created MongoDB Atlas account
- [ ] Created free M0 cluster
- [ ] Added database user with password
- [ ] Allowed network access (0.0.0.0/0)
- [ ] Copied connection string
- [ ] Saved connection string securely

**Connection String Format:**
```
mongodb+srv://username:PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority
```

---

## 🖥️ Step 2: Backend Deployment (Render)

- [ ] Created GitHub account
- [ ] Created new GitHub repository for backend
- [ ] Pushed `/app/backend` to GitHub
- [ ] Created Render account
- [ ] Connected GitHub to Render
- [ ] Created new Web Service
- [ ] Set Build Command: `pip install -r requirements.txt`
- [ ] Set Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- [ ] Selected **Free** instance type
- [ ] Added environment variables:
  - [ ] `MONGO_URL` = (your MongoDB connection string)
  - [ ] `DB_NAME` = `sili_spaces`
  - [ ] `JWT_SECRET` = (random string, 32+ characters)
  - [ ] `CORS_ORIGINS` = (will update after frontend)
- [ ] Deployed and verified service is running
- [ ] Copied backend URL (e.g., `https://xxx.onrender.com`)

**Backend URL:** ___________________________________

---

## 🎨 Step 3: Frontend Deployment (Vercel)

- [ ] Updated `/app/frontend/.env.production` with backend URL
- [ ] Created new GitHub repository for frontend
- [ ] Pushed `/app/frontend` to GitHub
- [ ] Created Vercel account
- [ ] Imported frontend repository
- [ ] Set Framework: Create React App
- [ ] Set Build Command: `yarn build`
- [ ] Set Output Directory: `build`
- [ ] Added environment variable:
  - [ ] `REACT_APP_BACKEND_URL` = (your Render backend URL)
- [ ] Deployed and verified site loads
- [ ] Copied frontend URL (e.g., `https://xxx.vercel.app`)

**Frontend URL:** ___________________________________

---

## 🔄 Step 4: Update Backend CORS

- [ ] Went back to Render dashboard
- [ ] Updated `CORS_ORIGINS` environment variable with Vercel URL
- [ ] Saved changes (auto-redeploys)
- [ ] Waited for redeployment to complete

---

## ✅ Step 5: Testing

- [ ] Opened frontend URL in browser
- [ ] Clicked "Get Started"
- [ ] Created test account
- [ ] Created a test space
- [ ] Verified room code generated
- [ ] Tested sending a flower
- [ ] Tested sending a love note
- [ ] Tested valentine cards
- [ ] Tested games (Truth or Dare)
- [ ] Tested countdown timer
- [ ] Tested bucket list
- [ ] Tested virtual hugs
- [ ] Logged out
- [ ] Logged back in
- [ ] Verified spaces persisted

---

## 🎉 Deployment Complete!

Your app is now live and FREE!

### Your Live URLs:
- **Frontend (Public URL):** ___________________________________
- **Backend API:** ___________________________________
- **Database:** MongoDB Atlas (managed)

### Share with Users:
Share your frontend Vercel URL with couples to start using the app!

---

## 🔧 Common Issues & Solutions

### Backend not responding (30-60 sec delay)
- ✅ **Normal!** Free tier sleeps after 15 min inactivity
- First request takes time to wake up
- Subsequent requests are fast

### CORS Error
- Check `CORS_ORIGINS` matches Vercel URL exactly
- Include `https://` prefix
- No trailing slash
- Redeploy backend after changing

### Database Connection Failed
- Verify MongoDB network access allows 0.0.0.0/0
- Check password in connection string (no special URL characters)
- Verify database user has read/write permissions

### Build Failed on Vercel
- Check that `.env.production` has correct backend URL
- Verify `package.json` has all dependencies
- Check Vercel build logs for specific error

---

## 📊 Monitor Your App

### Render Dashboard
- View backend logs
- Check service status
- Monitor usage

### Vercel Dashboard
- View deployment history
- Check build logs
- Monitor traffic

### MongoDB Atlas
- View database size
- Check connections
- Monitor queries

---

## 🎊 Success!

You've successfully deployed Sili Spaces for FREE! 

Enjoy and share with couples around the world! 💕

---

**Questions?** Check `/app/DEPLOYMENT_GUIDE.md` for detailed explanations!
