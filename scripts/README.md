# Scripts Organization

All utility scripts are organized in this folder for better project structure and maintainability.

## 📁 Directory Structure

```
scripts/
├── deployment/          # Deployment and GitHub upload scripts
├── utilities/           # Cleanup and maintenance scripts  
└── database/           # Database-related scripts (db-init, migrations)
```

## 🚀 Deployment Scripts (`/deployment`)

### Quick Upload to GitHub
```bash
bash scripts/deployment/quick-upload.sh
```
Complete script to upload project to GitHub with proper commit message.

### RUN-THIS (Shortcut)
```bash
bash scripts/deployment/RUN-THIS.sh
```
Quick shortcut that runs `quick-upload.sh` from anywhere.

### Start Application
```bash
bash scripts/deployment/start-app.sh
bash scripts/deployment/start-app.sh --with-db    # With database
bash scripts/deployment/start-app.sh --db-only    # Database only
```
One-command startup script for local development.

### Prepare for Vercel
```bash
bash scripts/deployment/prepare-for-vercel.sh
```
Interactive cleanup and preparation for Vercel deployment.

### Cleanup for Vercel
```bash
bash scripts/deployment/cleanup-for-vercel.sh
```
Automated cleanup script (removes database folders, build caches).

### Upload to GitHub (Alternative)
```bash
bash scripts/deployment/upload-to-github.sh
```
Alternative GitHub upload script.

## 🛠 Utility Scripts (`/utilities`)

### Cleanup Unused Files
```bash
bash scripts/utilities/cleanup-unused-files.sh
```
Removes old logs, templates, and unused files to reduce project size.

## 🗄️ Database Scripts

Located in `/scripts` root:

### Initialize Database
```bash
bash scripts/init-db.ts
```

### Setup Supabase
```bash
bash scripts/setup-supabase.sh
```

### Verify Database Setup
```bash
bash scripts/verify-database-setup.sh
```

### Other Database Scripts
- `nocodb-seed.sh` - Seed NocoDB database
- `supabase-seed.sh` - Seed Supabase database
- `test-connection.mjs` - Test database connection
- `update-database-url.js` - Update DATABASE_URL in .env

## 📖 Usage Guidelines

### For First-Time Setup
1. Clone the repository
2. Run: `bash scripts/deployment/start-app.sh`
3. Follow on-screen instructions

### For Deployment
1. Run: `bash scripts/deployment/quick-upload.sh`
2. Deploy via Vercel or Replit

### For Cleanup
1. Run: `bash scripts/utilities/cleanup-unused-files.sh`
2. Or: `bash scripts/deployment/prepare-for-vercel.sh` (for deployment prep)

## ⚠️ Important Notes

- Always run scripts from the project root directory
- Review script contents before running for the first time
- Make scripts executable if needed: `chmod +x script-name.sh`
- Some scripts may require environment variables to be set

## 🔐 Script Permissions

If you encounter permission errors:

```bash
# Make all deployment scripts executable
chmod +x scripts/deployment/*.sh

# Make all utility scripts executable
chmod +x scripts/utilities/*.sh

# Make specific script executable
chmod +x scripts/deployment/quick-upload.sh
```

---

**Last Updated:** 2025-10-23  
**Maintained By:** PSU Rizal Development Team
