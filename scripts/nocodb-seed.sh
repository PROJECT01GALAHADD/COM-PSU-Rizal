#!/usr/bin/env bash
set -euo pipefail

# Seed NocoDB with a simple users table and initial rows using the NocoDB REST API.
# This script waits for NocoDB to be available on the configured port and then
# creates a project/table if not present and inserts rows.

NOCODB_HOST=${NOCODB_HOST:-"http://localhost:${NOCODB_PORT:-5433}"}
ADMIN_EMAIL=${NOCODB_ADMIN_EMAIL:-}
ADMIN_PASSWORD=${NOCODB_ADMIN_PASSWORD:-}

echo "⏳ Waiting for NocoDB at ${NOCODB_HOST}..."
for i in {1..30}; do
  if curl -sSf --max-time 2 "${NOCODB_HOST}" >/dev/null 2>&1; then
    echo "✅ NocoDB is responding"
    break
  fi
  sleep 2
done

# Authenticate if admin credentials are provided
TOKEN=""
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
  echo "🔐 Logging in to NocoDB as admin"
  resp=$(curl -sS -X POST "${NOCODB_HOST}/login" -H "Content-Type: application/json" -d "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\"}")
  TOKEN=$(echo "$resp" | jq -r '.token' 2>/dev/null || true)
  if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo "✅ Obtained auth token from NocoDB"
  else
    echo "⚠️ Could not obtain auth token; proceeding without token (NocoDB may be in open mode)"
    TOKEN=""
  fi
fi

AUTH_HEADER=()
if [ -n "$TOKEN" ]; then
  AUTH_HEADER=( -H "xc-auth: ${TOKEN}" )
fi

echo "🔎 Checking if 'users' table exists via NocoDB API..."
# NocoDB uses a project/collection model; for simplicity we'll create a new project named 'psu_project' using the Admin API
PROJECT_NAME="psu_project"

if [ -n "$TOKEN" ]; then
  project_exists=$(curl -sS "${NOCODB_HOST}/api/v1/projects" "${AUTH_HEADER[@]}" | jq -r --arg name "$PROJECT_NAME" '.[] | select(.name==$name) | .name' 2>/dev/null || true)
else
  project_exists=""
fi

if [ -n "$project_exists" ]; then
  echo "✅ Project '$PROJECT_NAME' already exists"
else
  echo "➕ Creating project '$PROJECT_NAME' (if endpoint supports it)"
  if [ -n "$TOKEN" ]; then
    curl -sS -X POST "${NOCODB_HOST}/api/v1/projects" "${AUTH_HEADER[@]}" -H "Content-Type: application/json" -d "{\"name\":\"${PROJECT_NAME}\"}" >/dev/null || true
  else
    echo "ℹ️ Skipping project creation because no auth token available"
  fi
fi

echo "➕ Inserting sample rows into NocoDB via REST (if available)"
# NocoDB exposes tables under /api/v1/db/{project}/{table}
TABLE_NAME="users"
PAYLOADS=(
  '{"email":"admin@psu.edu","full_name":"System Admin","role":"admin"}'
  '{"email":"teacher1@psu.edu","full_name":"Faculty One","role":"faculty"}'
  '{"email":"student1@psu.edu","full_name":"Student One","role":"student"}'
)

for p in "${PAYLOADS[@]}"; do
  # Try to insert into the project's table endpoint
  if [ -n "$TOKEN" ]; then
    curl -sS -X POST "${NOCODB_HOST}/api/v1/db/${PROJECT_NAME}/${TABLE_NAME}" "${AUTH_HEADER[@]}" -H "Content-Type: application/json" -d "$p" >/dev/null || true
  else
    # No token: best-effort attempt to POST (may fail on secured instances)
    curl -sS -X POST "${NOCODB_HOST}/api/v1/db/${PROJECT_NAME}/${TABLE_NAME}" -H "Content-Type: application/json" -d "$p" >/dev/null || true
  fi
done

echo "✅ NocoDB seed script completed (best-effort)."
