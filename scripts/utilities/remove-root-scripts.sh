#!/bin/bash
# Cleanup script to remove old .sh files from root folder
# All scripts have been moved to /scripts/deployment/ and /scripts/utilities/

echo "🧹 Removing old .sh files from root folder..."
echo ""
echo "Scripts have been reorganized to:"
echo "  - /scripts/deployment/"
echo "  - /scripts/utilities/"
echo ""

cd /Users/ORDEROFCODE/v0-COM-PSU-Rizal

# Remove old scripts from root
rm -f quick-upload.sh
rm -f upload-to-github.sh
rm -f prepare-for-vercel.sh
rm -f cleanup-for-vercel.sh
rm -f start-app.sh
rm -f cleanup-unused-files.sh
rm -f RUN-THIS.sh

echo "✅ Cleanup complete!"
echo ""
echo "📂 Use scripts from their new locations:"
echo "  bash scripts/deployment/quick-upload.sh"
echo "  bash scripts/deployment/start-app.sh"
echo "  bash scripts/utilities/cleanup-unused-files.sh"
echo ""
