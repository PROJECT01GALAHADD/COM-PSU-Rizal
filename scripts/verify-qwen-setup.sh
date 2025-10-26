#!/bin/bash

# Script to verify Qwen-code CLI setup for this project

echo "Verifying Qwen-code CLI setup for PSU Rizal Collaboration Platform..."

# Check if required files exist
echo "Checking required files..."
REQUIRED_FILES=(
  ".qwen/settings.json"
  "qwen.config.mjs"
  "scripts/init-qwen.sh"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "/Users/ORDEROFCODE/v0-COM-PSU-Rizal/$file" ]; then
    echo "✓ $file exists"
  else
    echo "✗ $file is missing"
    exit 1
  fi
done

# Check if init-qwen script is in package.json
echo "Checking package.json scripts..."
if grep -q "init-qwen" "/Users/ORDEROFCODE/v0-COM-PSU-Rizal/package.json"; then
  echo "✓ init-qwen script is configured in package.json"
else
  echo "✗ init-qwen script is missing from package.json"
  exit 1
fi

# Check documentation files are lowercase
echo "Checking documentation files..."
MD_FILES=$(find /Users/ORDEROFCODE/v0-COM-PSU-Rizal/docs -name "*.md" -type f)
ALL_LOWERCASE=true

for file in $MD_FILES; do
  BASENAME=$(basename "$file")
  if [[ "$BASENAME" =~ [A-Z] ]]; then
    echo "✗ $BASENAME contains uppercase letters"
    ALL_LOWERCASE=false
  fi
done

if [ "$ALL_LOWERCASE" = true ]; then
  echo "✓ All documentation files use lowercase naming"
else
  echo "✗ Some documentation files use uppercase naming"
  exit 1
fi

# Check MCP server configuration
echo "Checking MCP server configuration..."
if grep -q "mcp-shell" "/Users/ORDEROFCODE/v0-COM-PSU-Rizal/.qwen/settings.json" && grep -q "mcp-filesystem-server" "/Users/ORDEROFCODE/v0-COM-PSU-Rizal/.qwen/settings.json"; then
  echo "✓ MCP servers are configured"
else
  echo "✗ MCP servers are not properly configured"
  exit 1
fi

echo "All verification checks passed! Qwen-code CLI is properly configured."