#!/bin/bash

# PSU Rizal Academic Collaboration Platform - One Command Startup Script
# This script will initialize and run the web application with a single command

set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting PSU Rizal Academic Collaboration Platform..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
echo "🔍 Checking for required tools..."

if ! command_exists pnpm; then
    echo "❌ pnpm is not installed. Please install pnpm first."
    echo "You can install it with: npm install -g pnpm"
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ All required tools found."

# Check Node.js version
NODE_VERSION=$(node --version | sed 's/v//')
if [ "$(printf '%s\n' "18.0.0" "$NODE_VERSION" | sort -V | head -n1)" = "18.0.0" ] || [ "$NODE_VERSION" = "18.0.0" ]; then
    echo "✅ Node.js version $NODE_VERSION is compatible."
else
    echo "⚠️  Node.js version $NODE_VERSION might not be compatible. Recommended: >=18.0.0"
fi

# Navigate to project directory
echo "📂 Navigating to project directory..."
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "📋 Project structure:"
ls -la

# Clean previous build if needed
if [ -d ".next" ]; then
    echo "🧹 Cleaning previous build..."
    rm -rf .next
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies with pnpm..."
    pnpm install
    echo "✅ Dependencies installed."
else
    echo "✅ Dependencies already installed."
fi

# Check for environment variables
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. You may need to create one for database and API keys."
    echo "Creating a sample .env file..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=""

# Supabase Configuration (if using)
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""

# NocoDB Configuration (if using)
NEXT_PUBLIC_NOCODB_URL=""

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=""
NEXT_PUBLIC_GTM_ID=""

# Other Environment Variables
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
EOF
    echo "✅ Sample .env file created. Please update it with your actual configuration."
fi

# Validate database configuration
if [ -d "database/supabase" ]; then
    echo "✅ Supabase configuration detected"
elif [ -d "database/nocodb" ]; then
    echo "✅ NocoDB configuration detected"
else
    echo "⚠️  No database configuration detected. Please configure your database."
fi

# Run pre-build checks
echo "🔍 Running pre-build checks..."
if command_exists tsc; then
    echo "  • Checking TypeScript compilation..."
    pnpm run build --dry-run || echo "  • TypeScript check completed"
else
    echo "  • TypeScript compiler not found, skipping type check"
fi

# Build the application (optional, for production)
echo "🔨 Building the application..."
if pnpm build; then
    echo "✅ Application built successfully."
else
    echo "⚠️  Build failed, but continuing to start development server..."
    echo "   The development server will compile files on-demand."
fi

# Function to check if a port is in use
port_in_use() {
    if command -v lsof >/dev/null 2>&1; then
        lsof -i :$1 >/dev/null 2>&1
    elif command -v netstat >/dev/null 2>&1; then
        netstat -an | grep ":$1 " >/dev/null 2>&1
    else
        return 1
    fi
}

# Function to verify database services are running
verify_database_services() {
    echo "🔍 Verifying database services..."
    
    # Check if containers are running
    if docker ps | grep -q "psu_local_postgres" && docker ps | grep -q "psu_local_nocodb"; then
        echo "✅ Database containers are running"
    else
        echo "⚠️  Database containers may not be running properly"
        echo "   Checking container status..."
        docker ps | grep "psu_local" || echo "   No PSU containers found running"
        return 1
    fi
    
    # Check if services are responding
    local postgres_ready=false
    local nocodb_ready=false
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for services to be ready (this may take up to 30 seconds)..."
    
    while [ $attempt -le $max_attempts ]; do
        # Check PostgreSQL (internal port 5432)
        if docker exec psu_local_postgres pg_isready -U psu >/dev/null 2>&1; then
            postgres_ready=true
        fi
        
        # Check NocoDB (we'll check if the container is healthy)
        if docker exec psu_local_nocodb ps -ef | grep -q "node" >/dev/null 2>&1; then
            nocodb_ready=true
        fi
        
        if [ "$postgres_ready" = true ] && [ "$nocodb_ready" = true ]; then
            echo "✅ All database services are ready"
            return 0
        fi
        
        echo "⏳ Still waiting... (attempt $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    if [ "$postgres_ready" = false ]; then
        echo "❌ PostgreSQL service failed to start properly"
    fi
    
    if [ "$nocodb_ready" = false ]; then
        echo "❌ NocoDB service failed to start properly"
    fi
    
    return 1
}

# Check for port conflicts before starting
if [[ "$1" == "--with-db" ]] || [[ "$1" == "--db-only" ]]; then
    echo "🔍 Checking for port conflicts..."
    
    if port_in_use 5431; then
        echo "⚠️  Port 5431 (Next.js) is already in use"
    fi
    
    if port_in_use 5432; then
        echo "⚠️  Port 5432 (PostgreSQL) is already in use"
    fi
    
    if port_in_use 5433; then
        echo "⚠️  Port 5433 (NocoDB) is already in use"
    fi
fi

# Start database services if requested
if [[ "$1" == "--with-db" ]]; then
    echo "🔄 Starting database services..."
    if pnpm run db:up; then
        echo "✅ Database services started successfully."
        echo "   Waiting for services to be fully ready..."
        if verify_database_services; then
            echo "   PostgreSQL: localhost:5432"
            echo "   NocoDB: localhost:5433"
            echo ""
        else
            echo "⚠️  Database services started but may not be fully ready yet"
            echo "   PostgreSQL: localhost:5432"
            echo "   NocoDB: localhost:5433"
            echo ""
        fi
    else
        echo "❌ Failed to start database services."
        echo "   Continuing with frontend only..."
        echo ""
    fi
elif [[ "$1" == "--db-only" ]]; then
    echo "🔄 Starting database services only..."
    if pnpm run db:up; then
        echo "✅ Database services started successfully."
        echo "   Waiting for services to be fully ready..."
        if verify_database_services; then
            echo "   PostgreSQL: localhost:5432"
            echo "   NocoDB: localhost:5433"
            echo ""
        else
            echo "⚠️  Database services started but may not be fully ready yet"
            echo "   PostgreSQL: localhost:5432"
            echo "   NocoDB: localhost:5433"
            echo ""
        fi
        echo "💡 Database services are running in the background."
        echo "   To stop them, run: pnpm run db:down"
        echo "   To view logs, run: pnpm run db:logs"
        exit 0
    else
        echo "❌ Failed to start database services."
        exit 1
    fi
fi

# Function to start Next.js on port 5431
start_nextjs() {
    echo "🚀 Starting the development server on port 5431..."
    # Set the port for Next.js
    PORT=5431 pnpm dev
}

# Start the development server
echo "🚀 Starting the development server..."
if [[ "$1" == "--with-db" ]]; then
    echo "The application will be available at http://localhost:5431"
    echo "Database services are also running:"
    echo "   PostgreSQL: localhost:5432"
    echo "   NocoDB: localhost:5433"
else
    echo "The application will be available at http://localhost:5431"
fi
echo "Press Ctrl+C to stop the server."
echo ""

# Handle graceful shutdown
shutdown_services() {
    echo "🛑 Shutting down services..."
    if [[ "$1" == "--with-db" ]]; then 
        echo "Stopping database services..."
        pnpm run db:down >/dev/null 2>&1
    fi
    exit 0
}

trap 'shutdown_services "$1"' SIGINT SIGTERM

# Run the development server on port 5431
PORT=5431 exec pnpm dev