# Sili Spaces 💕

A beautiful, minimalistic platform for long-distance couples to stay connected.

## 🌟 Features

- 🌸 **Virtual Garden** - Send beautiful flowers with heartfelt messages
- 💌 **Love Notes** - Share sweet messages anytime, anywhere
- 💝 **Valentine Cards** - Send adorable valentine cards
- 🎮 **Fun Games** - Truth or Dare, Questions, Memory Match, Drawing Board
- ⏰ **Countdown Timer** - Count down to your next meetup
- ✅ **Bucket List** - Plan your dreams together
- 🤗 **Virtual Hugs** - Send warm hugs across the distance

## 🏗️ Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, Python
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt

## 🚀 Deployment

This app is configured for **FREE** deployment:

- **Frontend**: Vercel (Free tier)
- **Backend**: Render (Free tier)
- **Database**: MongoDB Atlas (Free tier)

### Quick Start

1. Read the complete deployment guide:
   ```
   /app/DEPLOYMENT_GUIDE.md
   ```

2. Or run the setup script:
   ```bash
   bash /app/setup-deployment.sh
   ```

### Deployment Steps Summary

1. **MongoDB Atlas**: Create free database cluster
2. **Render**: Deploy backend Python API
3. **Vercel**: Deploy React frontend
4. **Configure**: Update CORS and environment variables

Full detailed instructions in `DEPLOYMENT_GUIDE.md`

## 💻 Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

### Frontend
```bash
cd frontend
yarn install
yarn start
```

## 📝 Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=sili_spaces
JWT_SECRET=your-secret-key
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 🎨 Design

- **Style**: Minimalistic, cute, beautiful
- **Colors**: Love Coral (#FF8FA3), Garden Sage (#A0C49D), Warm Cream (#FFF9F5)
- **Fonts**: Nunito (headings), Outfit (body)

## 📱 Features Walkthrough

1. **Sign Up/Login** - Create account or login
2. **My Spaces** - View all your couple spaces
3. **Create Space** - Generate unique room code
4. **Share Code** - Partner joins with code
5. **Stay Connected** - Use all 7 features together!

## 🔐 Security

- Passwords hashed with bcrypt
- JWT authentication with 30-day expiry
- Protected API endpoints
- Secure database connections

## 📄 License

MIT License - feel free to use and modify!

## 💖 Made with Love

Built for couples who want to stay close, no matter the distance.

---

**Need Help?** Check `DEPLOYMENT_GUIDE.md` for detailed instructions!
