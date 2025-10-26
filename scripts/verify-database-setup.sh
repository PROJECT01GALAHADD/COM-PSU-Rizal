#!/bin/bash

# Script to verify that PostgreSQL and NocoDB database services are properly built and running

echo "🔍 Verifying Database Services Setup..."
echo "======================================"

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is installed and running"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker Compose is available"

# Check if required images are available or can be pulled
echo "🔍 Checking required Docker images..."

# Check PostgreSQL image
echo "   Checking PostgreSQL image..."
if docker image inspect postgres:15-alpine &> /dev/null; then
    echo "   ✅ PostgreSQL image is available locally"
else
    echo "   ⏳ PostgreSQL image not found locally, it will be pulled when needed"
fi

# Check NocoDB image
echo "   Checking NocoDB image..."
if docker image inspect nocodb/nocodb:latest &> /dev/null; then
    echo "   ✅ NocoDB image is available locally"
else
    echo "   ⏳ NocoDB image not found locally, it will be pulled when needed"
fi

# Check if services are already running
echo "🔍 Checking if services are already running..."

if docker ps | grep -q "psu_local_postgres"; then
    echo "⚠️  PostgreSQL service is already running"
else
    echo "✅ PostgreSQL service is not running"
fi

if docker ps | grep -q "psu_local_nocodb"; then
    echo "⚠️  NocoDB service is already running"
else
    echo "✅ NocoDB service is not running"
fi

# Check for port conflicts
echo "🔍 Checking for port conflicts..."

PORTS_IN_USE=()

if lsof -i :5431 &> /dev/null; then
    echo "⚠️  Port 5431 (Next.js) is already in use"
    PORTS_IN_USE+=("5431")
fi

if lsof -i :5432 &> /dev/null; then
    echo "⚠️  Port 5432 (PostgreSQL) is already in use"
    PORTS_IN_USE+=("5432")
fi

if lsof -i :5433 &> /dev/null; then
    echo "⚠️  Port 5433 (NocoDB) is already in use"
    PORTS_IN_USE+=("5433")
fi

if [ ${#PORTS_IN_USE[@]} -eq 0 ]; then
    echo "✅ All required ports are available"
fi

# Test Docker Compose file syntax
echo "🔍 Validating Docker Compose configuration..."

if docker-compose -f scripts/docker-compose.local.yml config &> /dev/null; then
    echo "✅ Docker Compose file syntax is valid"
else
    echo "❌ Docker Compose file has syntax errors"
    docker-compose -f scripts/docker-compose.local.yml config
    exit 1
fi

# Check environment variables
echo "🔍 Checking environment configuration..."

if [ -f ".env" ]; then
    echo "✅ .env file found"
    
    # Check if required variables are set
    if grep -q "DATABASE_URL" .env; then
        echo "✅ DATABASE_URL is configured"
    else
        echo "⚠️  DATABASE_URL is not configured in .env file"
    fi
else
    echo "⚠️  .env file not found (will be created when needed)"
fi

echo "======================================"
echo "✅ Database setup verification completed"
echo ""
echo "To start the database services, run:"
echo "   pnpm run db:up"
echo ""
echo "To verify services after starting:"
echo "   scripts/verify-running-services.sh"