# Database Services Verification

This document explains how to verify that the PostgreSQL and NocoDB database services are properly configured and running for the PSU Rizal Academic Collaboration Platform.

## Sequential Port Configuration

The database services now use sequential ports to avoid conflicts and provide a logical ordering:

| Service             | Port | URL/Connection              |
| ------------------- | ---- | --------------------------- |
| Next.js Frontend    | 5431 | http://localhost:5431       |
| PostgreSQL Database | 5432 | postgresql://localhost:5432 |
| NocoDB Interface    | 5433 | http://localhost:5433       |

## Verification Scripts

Two new verification scripts have been added to ensure proper database setup:

### 1. Initial Setup Verification

```bash
# Run the setup verification script
pnpm run db:verify-setup

# Or run directly
./scripts/verify-database-setup.sh
```

This script checks:

- Docker installation and running status
- Docker Compose availability
- Required Docker images (will be pulled if needed)
- Port conflicts
- Docker Compose file syntax
- Environment configuration

### 2. Running Services Verification

```bash
# Run the running services verification script
pnpm run db:verify-running

# Or run directly
./scripts/verify-running-services.sh
```

This script checks:

- Container status (running/not running)
- Service responsiveness
- Port accessibility

## Database Services Management

### Starting Services

```bash
# Start database services in background
pnpm run db:up

# Verify services are running
pnpm run db:verify-running
```

### Stopping Services

```bash
# Stop database services
pnpm run db:down
```

### Viewing Logs

```bash
# View database service logs
pnpm run db:logs
```

## Environment Configuration

Ensure your `.env` file has the correct database URL:

```env
DATABASE_URL="postgresql://psu:psu@localhost:5432/psu_local?sslmode=disable"
NEXTAUTH_URL="http://localhost:5431"
```

## Troubleshooting

### Common Issues

#### 1. Port Conflicts

If you see port conflicts:

```bash
# Check which processes are using the ports
lsof -i :5431  # Next.js
lsof -i :5432  # PostgreSQL
lsof -i :5433  # NocoDB

# Kill the processes if needed
kill -9 <PID>
```

#### 2. Docker Permission Issues

On Linux, you might need to run Docker with sudo:

```bash
# Add your user to the docker group
sudo usermod -aG docker $USER

# Log out and back in for changes to take effect
```

#### 3. Services Not Starting

If services fail to start:

1. Check Docker logs: `pnpm run db:logs`
2. Verify Docker has enough resources (4GB+ RAM recommended)
3. Ensure no port conflicts exist
4. Check firewall settings

### Manual Verification

You can manually verify services are running:

```bash
# Check container status
docker ps | grep psu_local

# Check PostgreSQL directly
docker exec psu_local_postgres pg_isready -U psu

# Check if ports are accessible
nc -z localhost 5431 && echo "Next.js port accessible"
nc -z localhost 5432 && echo "PostgreSQL port accessible"
nc -z localhost 5433 && echo "NocoDB port accessible"
```

## Sample Users

After database initialization (`pnpm run init-db`), the following sample users will be available:

1. **Admin User**
   - Email: `admin@psu.palawan.edu.ph`
   - Password: `admin123`

2. **Faculty User**
   - Email: `faculty@psu.palawan.edu.ph`
   - Password: `faculty123`

3. **Student User**
   - Email: `student@psu.palawan.edu.ph`
   - Password: `student123`

## Integration with Application

The database services are automatically integrated with the startup scripts:

```bash
# Start everything together
./start-app.sh --with-db

# Start database services only
./start-app.sh --db-only

# Start frontend only (default)
./start-app.sh
```

## Conclusion

The database services are now properly configured with sequential ports and comprehensive verification tools. The PostgreSQL and NocoDB services are essential for the full functionality of the PSU Rizal Academic Collaboration Platform, providing the data persistence layer for user accounts, courses, meetings, and academic records.
