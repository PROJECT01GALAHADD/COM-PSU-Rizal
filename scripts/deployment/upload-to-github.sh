#!/bin/bash

# PSU Rizal - GitHub Upload Script
# This script will upload your project to GitHub

set -e

echo "🚀 Starting GitHub upload process..."
echo ""

# Step 1: Backup current .git if it exists
if [ -d ".git" ]; then
    echo "📦 Backing up corrupted .git folder..."
    mv .git .git.backup.$(date +%s)
fi

# Step 2: Initialize new git repository
echo "📝 Initializing new git repository..."
git init

# Step 3: Configure git (update with your info)
echo "⚙️  Configuring git..."
git config user.name "PROJECT01GALAHADD"
git config user.email "your-email@example.com"

# Step 4: Add remote
echo "🔗 Adding remote repository..."
git remote add origin https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal.git

# Step 5: Create main branch
echo "🌿 Creating main branch..."
git checkout -b main

# Step 6: Add all files
echo "📁 Adding all files..."
git add .

# Step 7: Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit - PSU Rizal Collaboration Platform

Features:
- Video conferencing with guest access
- Academic management system
- Role-based authentication (Student, Faculty, Admin)
- Real-time chat and screen sharing
- Supabase integration
- Responsive design with Tailwind CSS

Ready for deployment on Vercel and Replit"

# Step 8: Push to GitHub
echo "⬆️  Pushing to GitHub..."
echo ""
echo "⚠️  You may be prompted for GitHub credentials"
echo "    If you have 2FA enabled, use a Personal Access Token as password"
echo ""

# Check if repo exists and force push if needed
if git ls-remote origin main &>/dev/null; then
    echo "⚠️  Remote repository exists. Force pushing..."
    git push -u origin main --force
else
    echo "📤 Pushing to new repository..."
    git push -u origin main
fi

echo ""
echo "✅ Upload complete!"
echo ""
echo "🌐 View your repository at:"
echo "   https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal"
echo ""
echo "🚀 Deploy to Vercel:"
echo "   https://vercel.com/new/clone?repository-url=https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal"
echo ""
echo "🔁 Deploy to Replit:"
echo "   https://replit.com/github/PROJECT01GALAHADD/COM-PSU-Rizal"
echo ""
