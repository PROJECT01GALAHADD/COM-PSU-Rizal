# Running the PSU Rizal Platform

Complete guide for running the PSU Rizal Academic Collaboration Platform locally.

---

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **pnpm** - Package manager (recommended)
- **Git** - Version control

### Install pnpm

```bash
npm install -g pnpm
```

---

## Quick Start

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal.git
cd COM-PSU-Rizal

# Install dependencies
pnpm install
```

### 2. Setup Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
```

Required variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
```

**Get Supabase credentials:** [supabase.com](https://supabase.com) → Create Project → Settings → API

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (port 3000) |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests |

---

## Database Setup

The application uses **Supabase** for backend services.

### Option 1: Supabase Dashboard (Easiest)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project
3. Navigate to **SQL Editor**
4. Run migration files from `supabase/migrations/` in order
5. Verify tables in **Table Editor**

### Option 2: Supabase CLI

```bash
# Install Supabase CLI
pnpm dlx supabase --version

# Login to Supabase
pnpm supabase login

# Link your project
pnpm supabase link --project-ref your-project-id

# Apply migrations
pnpm supabase:migrate
```

See [setup/database-manual.md](./setup/database-manual.md) for detailed instructions.

---

## Service Ports

| Service | Port | URL |
|---------|------|-----|
| Next.js (Dev) | 3000 | http://localhost:3000 |
| Next.js (Prod) | 3000 | http://localhost:3000 |

---

## Development Workflow

### 1. Start Development

```bash
# Start dev server with hot reload
pnpm dev
```

### 2. Make Changes

Edit files in:
- `app/` - Pages and routes
- `components/` - React components
- `lib/` - Utilities and helpers
- `supabase/migrations/` - Database changes

### 3. Test Changes

```bash
# Run linter
pnpm lint

# Run tests
pnpm test

# Build to verify
pnpm build
```

---

## Common Tasks

### Access Different Dashboards

- **Homepage**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Faculty**: http://localhost:3000/faculty
- **Student**: http://localhost:3000/student
- **Guest Meeting**: http://localhost:3000/guest

### Create Test Users

Use Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Fill in email and password
4. Assign role in user metadata

### Debug Issues

```bash
# Check build errors
pnpm build

# Check linting errors
pnpm lint

# View detailed errors in browser console
# Open DevTools → Console
```

---

## Environment Variables

### Required

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# JWT (Required)
JWT_SECRET=your-random-secret
```

### Optional

```env
# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

See [env-and-secrets.md](./env-and-secrets.md) for complete guide.

---

## Troubleshooting

### Port 3000 already in use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Build fails

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Try build again
pnpm build
```

### Environment variables not loading

1. Ensure file is named `.env.local` (not `.env`)
2. Restart dev server after changing .env
3. Check variables don't have quotes unless needed
4. Verify no trailing spaces

### Database connection fails

1. Verify Supabase credentials are correct
2. Check URL starts with `https://`
3. Ensure API keys are valid
4. Test connection in Supabase Dashboard

---

## Production Build

### Build for Production

```bash
# Create optimized build
pnpm build

# Test production build locally
pnpm start
```

### Build Output

The build creates:
- `.next/` - Optimized application
- Static assets in `.next/static/`
- Server-side code in `.next/server/`

---

## Additional Resources

- **[Quick Reference](./setup/quick-reference.md)** - Common commands
- **[Database Setup](./setup/database-manual.md)** - Database configuration
- **[Deployment Guide](./deployment/guide.md)** - Deploy to production
- **[Technical Issues](./technical-issues.md)** - Known issues and fixes

---

## Next Steps

- **Deploy to Vercel**: [deployment/guide.md](./deployment/guide.md)
- **Setup Database**: [setup/database-manual.md](./setup/database-manual.md)
- **Configure Features**: [project-summary.md](./project-summary.md)

---

**Need help?** Check [technical-issues.md](./technical-issues.md) or create an issue on GitHub.
