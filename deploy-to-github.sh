#!/bin/bash

# Deploy to GitHub Script
# Run this script after creating your GitHub repository

echo "🚀 Deploying Real-Time Sports Odds to GitHub..."

# Check if GitHub username is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your GitHub username"
    echo "Usage: ./deploy-to-github.sh YOUR_GITHUB_USERNAME"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="real-time-sports-odds"

echo "📝 Setting up remote repository..."
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

echo "🔄 Renaming branch to main..."
git branch -M main

echo "⬆️ Pushing to GitHub..."
git push -u origin main

echo "✅ Successfully deployed to GitHub!"
echo "🌐 Your repository is now available at: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "📋 Next steps:"
echo "1. Visit your repository on GitHub"
echo "2. Set up GitHub Pages or deploy to Vercel/Netlify"
echo "3. Configure any necessary secrets for deployment"
echo ""
echo "🔧 Environment Setup:"
echo "- Copy .env.example to .env and configure your variables"
echo "- Update API endpoints if needed"
echo "- Configure deployment environment variables"
