#!/bin/bash
# Cleanup script for unused files and folders
# Review this script before running: bash cleanup-unused-files.sh

echo "🧹 Cleaning up unused files and folders..."
echo ""

# Function to safely remove directory
remove_dir() {
  if [ -d "$1" ]; then
    echo "✓ Removing $1..."
    rm -rf "$1"
    return 0
  else
    echo "⊘ $1 already removed or doesn't exist"
    return 1
  fi
}

# Function to safely remove file
remove_file() {
  if [ -f "$1" ]; then
    echo "✓ Removing $1..."
    rm -f "$1"
    return 0
  else
    echo "⊘ $1 already removed or doesn't exist"
    return 1
  fi
}

echo "📁 Phase 1: Removing old logs and documentation..."
remove_dir "logs/openai"
remove_dir "DocuGenius"

echo ""
echo "📦 Phase 2: Removing template projects (now integrated)..."
# Remove the Replit template (meeting functionality is now integrated)
remove_dir "templates/v0-COM-Replit-Template-LiveMeet"

# Remove other templates (reference only, not used in production)
remove_dir "templates/v0-COM-Admin-Dashboard"
remove_dir "templates/v0-COM-AI-Documents"
remove_dir "templates/v0-COM-Authentication-Page"
remove_dir "templates/v0-COM-Electron-Loading-Page"
remove_dir "templates/v0-COM-NextJS-Electron-Matrix"
remove_dir "templates/v0-COM-Student-&-Faculty-Dashboard"

# Remove templates folder if empty
if [ -d "templates" ]; then
  if [ -z "$(ls -A templates)" ]; then
    echo "✓ Removing empty templates/ folder..."
    rm -rf templates
  else
    echo "⚠  templates/ folder not empty, keeping it"
  fi
fi

echo ""
echo "🗑️  Phase 3: Optional cleanup (commented out by default)"
echo "    Uncomment lines in the script to remove:"
echo "    - database/nocodb/ (~100MB)"
echo "    - database/supabase/ (~80MB)"

# OPTIONAL: Remove large database submodules if using Supabase client only
# WARNING: Only remove these if you're sure you don't need them
# remove_dir "database/nocodb"
# remove_dir "database/supabase"

# OPTIONAL: Remove old documentation files
# remove_file "docs/alignment-log.md"
# remove_file "docs/alignment-process.md"
# remove_file "docs/qwen-configuration-complete.md"
# remove_file "docs/qwen-setup-summary.md"
# remove_file "docs/verification-summary.md"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "   ✓ Removed old OpenAI logs"
echo "   ✓ Removed DocuGenius"
echo "   ✓ Removed Replit meeting template (functionality integrated into main app)"
echo "   ✓ Removed other reference templates"
echo ""
echo "📖 See MEETING-INTEGRATION-SUMMARY.md for details on integrated meeting functionality"
echo "📖 See PERFORMANCE-CLEANUP-SUMMARY.md for performance optimizations"
echo ""
echo "🚀 Next steps:"
echo "   1. Test the meeting functionality at /meetings/sample-guest-meeting"
echo "   2. Review integration summary: cat MEETING-INTEGRATION-SUMMARY.md"
echo "   3. Restart dev server: pnpm dev"

