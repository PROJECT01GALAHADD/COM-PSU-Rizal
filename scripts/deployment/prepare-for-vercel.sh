#!/bin/bash
# Cleanup script for Vercel deployment preparation
# This removes heavy folders that are NOT needed for production

echo "🚀 Preparing project for Vercel deployment..."
echo ""
echo "This will remove:"
echo "  - database/ folder (4.2GB)"
echo "  - Build caches"
echo "  - Development files"
echo ""
echo "⚠️  WARNING: This will delete the database/ folder permanently!"
echo "   (But it's already in .gitignore and not used by the app)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 1
fi

echo ""
echo "📁 Phase 1: Removing database folders..."

# Function to safely remove directory
remove_dir() {
  if [ -d "$1" ]; then
    SIZE=$(du -sh "$1" 2>/dev/null | cut -f1)
    echo "  Removing $1 ($SIZE)..."
    rm -rf "$1"
    echo "  ✓ Removed"
  else
    echo "  ⊘ $1 doesn't exist or already removed"
  fi
}

# Remove database submodules (4.2GB)
remove_dir "database/nocodb"
remove_dir "database/supabase"

# Remove parent folder if empty
if [ -d "database" ]; then
  if [ -z "$(ls -A database)" ]; then
    echo "  Removing empty database/ folder..."
    rmdir database
    echo "  ✓ Removed"
  else
    echo "  ⊘ database/ folder not empty, keeping it"
  fi
fi

echo ""
echo "🗑️  Phase 2: Cleaning build caches..."

# Remove build artifacts (regenerated on build)
remove_dir ".next"
remove_dir ".pnpm-store"
rm -f tsconfig.tsbuildinfo && echo "  ✓ Removed tsconfig.tsbuildinfo" || true

echo ""
echo "📄 Phase 3: Handling documentation..."

# Move thesis to docs if it exists
if [ -f "PALAWAN-STATE-UNIVERSITY-COLLABORATION-ONLINE-MEET-thesis.docx" ]; then
  echo "  Found thesis document (10MB)"
  read -p "  Move to docs/thesis/? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    mkdir -p docs/thesis
    mv PALAWAN-STATE-UNIVERSITY-COLLABORATION-ONLINE-MEET-thesis.docx docs/thesis/
    echo "  ✓ Moved to docs/thesis/"
  else
    echo "  ⊘ Keeping in root folder"
  fi
fi

echo ""
echo "📊 Phase 4: Creating deployment files..."

# Create .vercelignore if it doesn't exist
if [ ! -f ".vercelignore" ]; then
  cat > .vercelignore << 'EOF'
# Files to exclude from Vercel deployment
/docs
/scripts/db-init
/scripts/docker-compose*
/database
*.md
README.md
AGENTS.md
*.docx
.DS_Store
EOF
  echo "  ✓ Created .vercelignore"
else
  echo "  ⊘ .vercelignore already exists"
fi

# Create .env.example if it doesn't exist
if [ ! -f ".env.example" ]; then
  cat > .env.example << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
  echo "  ✓ Created .env.example"
else
  echo "  ⊘ .env.example already exists"
fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Project size comparison:"
echo ""
CURRENT_SIZE=$(du -sh . 2>/dev/null | cut -f1)
echo "  Current size: $CURRENT_SIZE"
echo ""
echo "🎯 What was removed:"
echo "  ✓ database/nocodb/ (1.5GB)"
echo "  ✓ database/supabase/ (2.7GB)"
echo "  ✓ Build caches"
echo ""
echo "📋 Next steps for Vercel deployment:"
echo ""
echo "1. Review .env.example and create .env.local with your values"
echo "2. Test build locally: pnpm build"
echo "3. Push to GitHub: git add . && git commit -m 'Prepare for Vercel' && git push"
echo "4. Connect repository to Vercel"
echo "5. Add environment variables in Vercel dashboard"
echo "6. Deploy!"
echo ""
echo "📖 See VERCEL-DEPLOYMENT-CLEANUP.md for detailed instructions"
echo ""
