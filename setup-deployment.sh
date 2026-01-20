#!/bin/bash

echo "🚀 Sili Spaces - Free Deployment Setup"
echo "======================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

echo "📦 Step 1: Setup Backend Repository"
echo "-----------------------------------"
cd /app/backend

# Initialize git if not already
if [ ! -d .git ]; then
    git init
    echo "✅ Git initialized in backend"
else
    echo "✅ Git already initialized in backend"
fi

# Add all files
git add .
git status

echo ""
echo "📝 Next steps for Backend:"
echo "1. Create a new GitHub repository (e.g., 'sili-spaces-backend')"
echo "2. Run these commands:"
echo "   git commit -m 'Initial backend commit'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo "   git push -u origin main"
echo ""

read -p "Press Enter when you've created GitHub repo and pushed backend..."

echo ""
echo "📦 Step 2: Setup Frontend Repository"
echo "------------------------------------"
cd /app/frontend

# Initialize git if not already
if [ ! -d .git ]; then
    git init
    echo "✅ Git initialized in frontend"
else
    echo "✅ Git already initialized in frontend"
fi

# Add all files
git add .
git status

echo ""
echo "📝 Next steps for Frontend:"
echo "1. Create a new GitHub repository (e.g., 'sili-spaces-frontend')"
echo "2. Run these commands:"
echo "   git commit -m 'Initial frontend commit'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo "   git push -u origin main"
echo ""

echo "✅ Git setup complete!"
echo ""
echo "📖 Next: Follow DEPLOYMENT_GUIDE.md for full deployment steps"
echo "   Location: /app/DEPLOYMENT_GUIDE.md"
