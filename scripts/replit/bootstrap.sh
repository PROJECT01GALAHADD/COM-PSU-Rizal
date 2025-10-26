#!/usr/bin/env bash
set -euo pipefail

# Prepare local bin directory
mkdir -p ./bin

# Install UPM (Universal Package Manager) if not present
if ! command -v upm >/dev/null 2>&1 && [ ! -x ./bin/upm ]; then
  echo "Installing UPM binary..."
  # Try to download the latest release for linux-amd64
  UPM_URL="https://github.com/replit/upm/releases/latest/download/upm-linux-amd64"
  if curl -fsSL "$UPM_URL" -o ./bin/upm; then
    chmod +x ./bin/upm
    echo "UPM installed to ./bin/upm"
  else
    echo "Warning: Could not download UPM binary. Please install manually from https://github.com/replit/upm/releases"
  fi
fi

# Install Prybar (optional) if not present
if ! command -v prybar-python311 >/dev/null 2>&1 && [ ! -x ./bin/prybar-python311 ]; then
  echo "Attempting to build Prybar python311 (requires go, gcc, python311)..."
  if [ ! -d ./scripts/replit/prybar ]; then
    git clone --depth=1 https://github.com/replit/prybar.git ./scripts/replit/prybar || true
  fi
  (cd ./scripts/replit/prybar && make prybar-python311) || echo "Prybar build failed; please build manually per repo instructions."
  if [ -f ./scripts/replit/prybar/result/bin/prybar-python311 ]; then
    mkdir -p ./bin
    cp ./scripts/replit/prybar/result/bin/prybar-python311 ./bin/
    chmod +x ./bin/prybar-python311
    echo "Prybar python311 installed to ./bin/prybar-python311"
  fi
fi

# Ensure pnpm is available
if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found in PATH. Ensure replit.nix includes pkgs.nodePackages.pnpm."
fi

# Install project dependencies
pnpm install --frozen-lockfile || pnpm install

# Build if necessary
if [ -f package.json ]; then
  if jq -r '.scripts.build // empty' package.json >/dev/null 2>&1; then
    pnpm build || true
  fi
fi

echo "Bootstrap complete. You can now run pnpm dev to start the server on port 3001."