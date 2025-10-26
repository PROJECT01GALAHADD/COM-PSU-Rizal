#!/usr/bin/env bash
set -euo pipefail

# Helper to start NocoDB on a safe host port and follow logs.
# Usage: ./scripts/start-nocodb.sh 5435
PORT=${1:-5435}
export NOCODB_PORT=$PORT

echo "Bringing up nocodb on host port $PORT (container 8080)..."
docker compose -f scripts/docker-compose.local.yml -f scripts/docker-compose.nocodb-postgres.yml up -d --force-recreate nocodb

echo "Waiting for container to be reported by docker ps..."
for i in {1..10}; do
  docker ps --filter name=psu_local_nocodb --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}' && break || sleep 1
done

echo "Tailing logs (press Ctrl+C to exit)..."
docker logs --follow psu_local_nocodb
