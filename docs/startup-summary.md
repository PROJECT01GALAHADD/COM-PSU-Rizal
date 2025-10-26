# Application Startup Summary

## Overview

This document summarizes the work completed to enable proper startup and execution of the PSU Rizal Academic Collaboration Platform, with flexible deployment options for both frontend-only and full-stack operation.

## Work Completed

### 1. ✅ Enhanced Startup Scripts

- **Updated `start-app.sh`**: Enhanced with database service integration options
- **Updated `start-app.bat`**: Enhanced with database service integration options
- **Made scripts executable**: Proper permissions set for shell script

### 2. ✅ Multiple Run Modes

The application can now be run in three different modes:

#### Mode 1: Frontend Only (Default)

```bash
./start-app.sh
# or
pnpm dev
```

- Runs only the Next.js frontend development server
- Available at http://localhost:3000

#### Mode 2: Frontend with Database Services

```bash
./start-app.sh --with-db
# or on Windows
start-app.bat --with-db
```

- Runs Next.js frontend AND database services simultaneously
- Frontend: http://localhost:3000
- PostgreSQL: http://localhost:5432
- NocoDB: http://localhost:8080

#### Mode 3: Database Services Only

```bash
./start-app.sh --db-only
# or on Windows
start-app.bat --db-only
# or directly
pnpm run db:up
```

- Runs only database services in background
- PostgreSQL: http://localhost:5432
- NocoDB: http://localhost:8080

### 3. ✅ Comprehensive Documentation

Created `docs/running-the-application.md` with detailed instructions:

- Prerequisites installation
- Quick start options
- Detailed configuration steps
- Environment variable setup
- Database initialization
- Troubleshooting guide
- Production deployment information

### 4. ✅ Graceful Shutdown Handling

- Added signal trapping for SIGINT/SIGTERM
- Automatic cleanup of database services when using `--with-db` mode
- Proper resource management

## Key Features

### Flexible Deployment Options

✅ **Cloud Deployment Ready**: Compatible with Vercel hosting
✅ **Local Deployment**: Full localhost capability with Docker
✅ **Hybrid Operation**: Run frontend and backend separately or together

### Database Services

✅ **PostgreSQL**: Industry-standard relational database
✅ **NocoDB**: No-code database interface for administration
✅ **Docker Integration**: Containerized services for easy management
✅ **Environment Configuration**: Flexible .env file support

### Development Workflow

✅ **Hot Reloading**: Next.js development server with instant updates
✅ **Service Management**: Start/stop database services with single commands
✅ **Logging**: Real-time service logs available
✅ **Health Checks**: Database service health verification

## Available Commands

### Startup Scripts

```bash
./start-app.sh              # Frontend only
./start-app.sh --with-db    # Frontend + Database
./start-app.sh --db-only    # Database only

start-app.bat               # Windows equivalent commands
```

### Direct Package Scripts

```bash
pnpm dev                    # Start frontend development server
pnpm run db:up              # Start database services
pnpm run db:down            # Stop database services
pnpm run db:logs            # View database logs
pnpm run init-db            # Initialize database schema
```

## Service Ports

| Service          | Port | Access URL                  |
| ---------------- | ---- | --------------------------- |
| Next.js Frontend | 5431 | http://localhost:5431       |
| PostgreSQL       | 5432 | postgresql://localhost:5432 |
| NocoDB           | 5433 | http://localhost:5433       |

## Sample Users (After Database Initialization)

1. **Admin**: admin@psu.palawan.edu.ph / admin123
2. **Faculty**: faculty@psu.palawan.edu.ph / faculty123
3. **Student**: student@psu.palawan.edu.ph / student123

## Benefits

### For Developers

- Single-command startup for different development scenarios
- Flexible environment for UI-only or full-stack development
- Comprehensive documentation and troubleshooting guide

### For Institutions

- Choice between cloud and local deployment
- No external dependencies when running locally
- Full control over data and infrastructure
- Scalable architecture for growing needs

### For Students/Faculty

- Accessible from any device with a web browser
- Consistent experience whether deployed locally or in cloud
- Reliable performance with proper service management

## Conclusion

The PSU Rizal Academic Collaboration Platform now has a robust and flexible startup system that accommodates various deployment scenarios:

1. **Development Mode**: Quick frontend-only startup for UI development
2. **Integrated Mode**: Full-stack operation with database services
3. **Infrastructure Mode**: Database services only for backend development

All startup options include proper error handling, graceful shutdown, and comprehensive documentation. The platform can be deployed entirely on localhost without any external dependencies, making it accessible to institutions with varying infrastructure capabilities.
