#!/usr/bin/env bash
set -euo pipefail

# Load .env.local or .env into the shell for scripts that need env vars
if [ -f .env.local ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local || true
  set +a
elif [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env || true
  set +a
fi

# Flexible port and host configuration
DEV_PORT="${PORT:-5000}"
DEV_HOST="${HOST:-0.0.0.0}"

# Detect platform
if [ -n "${REPL_ID:-}" ]; then
  PLATFORM="Replit"
elif [ -n "${VERCEL:-}" ]; then
  PLATFORM="Vercel"
elif [ -n "${FIREBASE_CONFIG:-}" ]; then
  PLATFORM="Firebase"
else
  PLATFORM="Local"
fi

echo "🌐 Starting Next.js dev server on port $DEV_PORT (host $DEV_HOST)..."
echo "🚀 Platform: $PLATFORM"
echo "🔗 Using PostgreSQL database"

exec next dev -H "$DEV_HOST" -p "$DEV_PORT"