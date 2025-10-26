#!/bin/bash

# Script to verify that database services are running properly

echo "🔍 Verifying Running Database Services..."
echo "========================================"

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Check if required containers are running
echo "🔍 Checking container status..."

POSTGRES_RUNNING=false
NOCODB_RUNNING=false

if docker ps | grep -q "psu_local_postgres"; then
    echo "✅ PostgreSQL container is running"
    POSTGRES_RUNNING=true
else
    echo "❌ PostgreSQL container is not running"
fi

if docker ps | grep -q "psu_local_nocodb"; then
    echo "✅ NocoDB container is running"
    NOCODB_RUNNING=true
else
    echo "❌ NocoDB container is not running"
fi

if [ "$POSTGRES_RUNNING" = false ] || [ "$NOCODB_RUNNING" = false ]; then
    echo "❌ Some required services are not running"
    exit 1
fi

# Check if services are responding
echo "🔍 Checking if services are responding..."

# Check PostgreSQL
echo "   Testing PostgreSQL connection..."
if docker exec psu_local_postgres pg_isready -U psu &> /dev/null; then
    echo "   ✅ PostgreSQL is accepting connections"
else
    echo "   ❌ PostgreSQL is not responding to connections"
    exit 1
fi

# Check NocoDB by seeing if the process is running
echo "   Testing NocoDB process..."
if docker exec psu_local_nocodb ps -ef | grep -q "node" &> /dev/null; then
    echo "   ✅ NocoDB process is running"
else
    echo "   ⚠️  NocoDB process may not be fully started yet"
fi

# Check if we can access the services via ports
echo "🔍 Checking port accessibility..."

# Check PostgreSQL port
if nc -z localhost 5432 2>/dev/null; then
    echo "✅ PostgreSQL port (5432) is accessible"
else
    echo "⚠️  PostgreSQL port (5432) is not accessible from localhost"
fi

# Check NocoDB port
if nc -z localhost 5433 2>/dev/null; then
    echo "✅ NocoDB port (5433) is accessible"
else
    echo "⚠️  NocoDB port (5433) is not accessible from localhost"
fi

echo "========================================"
echo "✅ Database services verification completed"
echo ""
echo "PostgreSQL: localhost:5432"
echo "NocoDB: http://localhost:5433"
echo ""
echo "To stop the services, run:"
echo "   pnpm run db:down"