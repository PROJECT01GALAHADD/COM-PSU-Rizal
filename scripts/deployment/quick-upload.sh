#!/bin/bash
# PSU Rizal - Quick Upload Script
# Run this to upload your project to GitHub

echo "=================================================="
echo "  PSU Rizal - GitHub Upload Script"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "   Please run this script from the project root"
    exit 1
fi

echo "📂 Current directory: $(pwd)"
echo ""

# Step 1: Backup old .git
if [ -d ".git" ]; then
    echo "🔄 Backing up existing .git folder..."
    BACKUP_NAME=".git.backup.$(date +%Y%m%d_%H%M%S)"
    mv .git "$BACKUP_NAME"
    echo "✅ Backed up to: $BACKUP_NAME"
fi

# Step 2: Initialize fresh repository
echo ""
echo "🎬 Initializing fresh git repository..."
git init
git checkout -b main

# Step 3: Configure git user
echo ""
echo "👤 Configuring git user..."
echo "   (You can update this later with your own email)"
git config user.name "PROJECT01GALAHADD"
git config user.email "project01galahadd@users.noreply.github.com"

# Step 4: Add remote
echo ""
echo "🔗 Adding remote repository..."
git remote add origin https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal.git
git remote -v

# Step 5: Add files
echo ""
echo "📁 Staging all files..."
git add .

# Show what will be committed
echo ""
echo "📋 Files to be committed:"
git status --short | head -20
echo "   ... (showing first 20 files)"
echo ""

# Step 6: Create commit
echo "💾 Creating commit..."
git commit -m "Initial commit - PSU Rizal Academic Collaboration Platform

✨ Features:
- Video conferencing with guest access
- Academic management system (courses, assignments, grades)
- Role-based authentication (Student, Faculty, Admin)
- Real-time chat and screen sharing
- Supabase integration
- Responsive design with Tailwind CSS

🚀 Deployment:
- Ready for Vercel deployment
- Ready for Replit deployment
- Complete documentation included

📚 Tech Stack:
- Next.js 14 + React 18 + TypeScript
- Tailwind CSS 4 + Radix UI
- Supabase (PostgreSQL)
- JWT Authentication
- WebRTC for video calls"

echo "✅ Commit created"

# Step 7: Push to GitHub
echo ""
echo "=================================================="
echo "  Ready to push to GitHub!"
echo "=================================================="
echo ""
echo "⚠️  IMPORTANT:"
echo "   You will be prompted for GitHub credentials"
echo "   - Username: Your GitHub username"
echo "   - Password: Your Personal Access Token (NOT password)"
echo ""
echo "   Don't have a token? Get one at:"
echo "   https://github.com/settings/tokens/new"
echo "   (Select scope: repo - Full control of private repositories)"
echo ""
read -p "Press ENTER to continue with push, or Ctrl+C to cancel..."

echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main --force

# Check if push was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "=================================================="
    echo "  ✅ SUCCESS! Project uploaded to GitHub"
    echo "=================================================="
    echo ""
    echo "🌐 View your repository:"
    echo "   https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal"
    echo ""
    echo "🚀 Next steps:"
    echo ""
    echo "1. Deploy to Vercel:"
    echo "   https://vercel.com/new/clone?repository-url=https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal"
    echo ""
    echo "2. Deploy to Replit:"
    echo "   https://replit.com/github/PROJECT01GALAHADD/COM-PSU-Rizal"
    echo ""
    echo "3. Don't forget to:"
    echo "   - Set up Supabase database"
    echo "   - Configure environment variables"
    echo "   - Test the deployment"
    echo ""
else
    echo ""
    echo "=================================================="
    echo "  ❌ Push failed!"
    echo "=================================================="
    echo ""
    echo "Common solutions:"
    echo ""
    echo "1. Authentication failed?"
    echo "   - Use Personal Access Token, not password"
    echo "   - Get token: https://github.com/settings/tokens/new"
    echo ""
    echo "2. Repository doesn't exist?"
    echo "   - Create it first at: https://github.com/new"
    echo "   - Name: COM-PSU-Rizal"
    echo ""
    echo "3. Permission denied?"
    echo "   - Ensure you have write access to the repository"
    echo ""
    echo "Try again or check UPLOAD-GUIDE.md for manual steps"
fi
