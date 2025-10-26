#!/bin/bash
# Final cleanup for Vercel deployment - removes 4.2GB database folder

echo "🚀 Starting cleanup for Vercel deployment..."
echo ""

# Change to project directory
cd "$(dirname "$0")"

echo "📊 Current project size:"
du -sh .
echo ""

echo "🗑️  Removing database folders..."
echo ""

# Remove nocodb (1.5GB)
if [ -d "database/nocodb" ]; then
  echo "  Removing database/nocodb (1.5GB)..."
  rm -rf database/nocodb
  echo "  ✓ Removed database/nocodb"
else
  echo "  ⊘ database/nocodb already removed"
fi

# Remove supabase (2.7GB)
if [ -d "database/supabase" ]; then
  echo "  Removing database/supabase (2.7GB)..."
  rm -rf database/supabase
  echo "  ✓ Removed database/supabase"
else
  echo "  ⊘ database/supabase already removed"
fi

# Remove parent database folder if empty
if [ -d "database" ]; then
  if [ -z "$(ls -A database)" ]; then
    echo "  Removing empty database/ folder..."
    rmdir database
    echo "  ✓ Removed database/"
  else
    echo "  ⊘ database/ folder not empty, keeping it"
  fi
fi

echo ""
echo "🧹 Cleaning build caches..."

# Remove .next build cache
if [ -d ".next" ]; then
  rm -rf .next
  echo "  ✓ Removed .next/"
fi

# Remove .pnpm-store
if [ -d ".pnpm-store" ]; then
  rm -rf .pnpm-store
  echo "  ✓ Removed .pnpm-store/"
fi

# Remove tsbuildinfo
if [ -f "tsconfig.tsbuildinfo" ]; then
  rm -f tsconfig.tsbuildinfo
  echo "  ✓ Removed tsconfig.tsbuildinfo"
fi

echo ""
echo "📄 Handling thesis document..."

# Move thesis to docs if exists
if [ -f "PALAWAN-STATE-UNIVERSITY-COLLABORATION-ONLINE-MEET-thesis.docx" ]; then
  mkdir -p docs/thesis
  mv PALAWAN-STATE-UNIVERSITY-COLLABORATION-ONLINE-MEET-thesis.docx docs/thesis/
  echo "  ✓ Moved thesis to docs/thesis/"
fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 New project size:"
du -sh .
echo ""
echo "💾 Space saved: ~4.2GB"
echo ""
echo "🎯 Your project is now ready for Vercel deployment!"
echo ""
echo "📋 Next steps:"
echo "  1. Test build: pnpm build"
echo "  2. Commit changes: git add . && git commit -m 'Prepare for Vercel deployment'"
echo "  3. Push to GitHub: git push origin main"
echo "  4. Deploy to Vercel!"
echo ""
