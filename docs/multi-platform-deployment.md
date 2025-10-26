# Multi-Platform Deployment Guide

This guide explains how to deploy the PSU Rizal Academic Collaboration Platform across different platforms: **GitHub**, **Replit**, **Vercel**, **Firebase**, and **other IDEs**.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Push to GitHub](#step-1-push-to-github)
3. [Step 2A: Deploy to Replit](#step-2a-deploy-to-replit)
4. [Step 2B: Deploy to Vercel](#step-2b-deploy-to-vercel)
5. [Step 2C: Deploy to Firebase](#step-2c-deploy-to-firebase)
6. [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
7. [Step 4: Database Setup](#step-4-database-setup)
8. [Platform Comparison](#platform-comparison)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

✅ **Required:**
- GitHub account
- PostgreSQL database (Replit DB, Neon, Supabase, or any hosted PostgreSQL)
- Node.js 18+ and pnpm installed locally

✅ **Optional (based on platform):**
- Vercel account
- Firebase account with Blaze plan (for hosting Next.js)
- Google Cloud project (for Firebase)

---

## Step 1: Push to GitHub

### 1.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - PSU Rizal Platform"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `psu-rizal-platform` (or your preferred name)
3. Do NOT initialize with README (we already have one)

### 1.3 Push to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/psu-rizal-platform.git

# Push all branches
git branch -M main
git push -u origin main
```

**✅ Your code is now on GitHub!**

---

## Step 2A: Deploy to Replit

### Option 1: Import from GitHub

1. Go to https://replit.com
2. Click **"Create Repl"** → **"Import from GitHub"**
3. Paste your repository URL: `https://github.com/YOUR_USERNAME/psu-rizal-platform`
4. Replit will auto-detect Next.js and configure everything

### Option 2: Already on Replit

If you're already working on Replit, just ensure your changes are pushed to GitHub (see Step 1).

### Configure Replit Secrets

1. Open your Repl
2. Go to **Tools** → **Secrets** (lock icon in sidebar)
3. Add these secrets:

```bash
DATABASE_URL=your_replit_postgres_connection_string
JWT_SECRET=your_generated_secret_key
SESSION_SECRET=your_generated_session_key
```

### Run on Replit

```bash
pnpm dev
```

Your app will be available at the Replit preview URL.

**See:** `docs/deployment/replit-checklist.md` for detailed Replit setup.

---

## Step 2B: Deploy to Vercel

### 2.1 Install Vercel CLI (optional)

```bash
npm i -g vercel
```

### 2.2 Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Click **"Add New Project"** → **"Import Git Repository"**
3. Select your GitHub repository: `YOUR_USERNAME/psu-rizal-platform`
4. Vercel auto-detects Next.js framework
5. Click **"Deploy"**

### 2.3 Configure Environment Variables on Vercel

After importing, add these environment variables in Vercel dashboard:

**Project Settings** → **Environment Variables**:

```bash
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_generated_secret_key
SESSION_SECRET=your_generated_session_key
```

### 2.4 Redeploy

After adding variables, click **"Redeploy"** to apply changes.

**Your app will be live at:** `https://your-project-name.vercel.app`

### Database Options for Vercel

- **Vercel Postgres** (recommended) - Built-in PostgreSQL
- **Neon** - Serverless PostgreSQL
- **Supabase** - PostgreSQL with built-in auth
- **Railway** - PostgreSQL hosting

---

## Step 2C: Deploy to Firebase

### 2.1 Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 2.2 Initialize Firebase Project

```bash
# In your project directory
firebase init hosting

# Select:
# ✓ Use an existing project or create new one
# ✓ What do you want to use as your public directory? → .next/static
# ✓ Configure as single-page app? → No
# ✓ Set up automatic builds with GitHub? → Yes (optional)
```

### 2.3 Build and Deploy

```bash
# Build the Next.js app
pnpm build

# Deploy to Firebase
firebase deploy --only hosting
```

### 2.4 Configure Environment Variables

Firebase uses `.env.local` for environment variables during build. Create `.env.local`:

```bash
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_generated_secret_key
SESSION_SECRET=your_generated_session_key
```

For production secrets, use **Firebase Functions Configuration**:

```bash
firebase functions:config:set \
  database.url="your_postgres_url" \
  jwt.secret="your_jwt_secret" \
  session.secret="your_session_secret"
```

**Your app will be live at:** `https://your-project-id.web.app`

### Note: Firebase Hosting + Functions

Firebase hosting works best with static exports. For full Next.js SSR features, consider:
- **Vercel** (Next.js native platform)
- **Replit** (full Node.js runtime)
- **Firebase Functions** (requires additional setup for Next.js API routes)

---

## Step 3: Configure Environment Variables

### 3.1 Generate Secure Secrets

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate SESSION_SECRET  
openssl rand -base64 32
```

### 3.2 Platform-Specific Environment Setup

| Platform | How to Add Secrets |
|----------|-------------------|
| **Replit** | Tools → Secrets |
| **Vercel** | Project Settings → Environment Variables |
| **Firebase** | `firebase functions:config:set` or `.env.local` |
| **Local Dev** | Create `.env.local` file |
| **Other IDEs** | Create `.env.local` or use platform's secret manager |

### 3.3 Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# Security
JWT_SECRET=your-32-char-random-string
SESSION_SECRET=your-32-char-random-string

# Optional
NODE_ENV=production
PORT=5000
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Step 4: Database Setup

### Option 1: Replit PostgreSQL (Easiest on Replit)

1. In your Repl, add **PostgreSQL** from the Tools panel
2. Replit auto-generates `DATABASE_URL` in Secrets
3. Run database migration:

```bash
npm run db:push
```

### Option 2: Neon (Recommended for Vercel/Firebase)

1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string (includes `?sslmode=require`)
4. Add to your platform's environment variables
5. Run migration:

```bash
npm run db:push
```

### Option 3: Supabase

1. Go to https://supabase.com
2. Create new project
3. Get connection string from **Settings → Database**
4. Use **Pooling** connection string for serverless
5. Add to environment variables
6. Run migration

### Option 4: Railway / Render / Heroku

Similar process - create PostgreSQL database, copy connection string, add to environment.

### Database Migration Commands

```bash
# Push schema changes to database
npm run db:push

# Force push if conflicts
npm run db:push --force

# View database in Drizzle Studio
npm run db:studio
```

---

## Platform Comparison

| Feature | Replit | Vercel | Firebase | Local/Other IDE |
|---------|--------|--------|----------|-----------------|
| **Setup Difficulty** | ⭐ Easy | ⭐⭐ Moderate | ⭐⭐⭐ Advanced | ⭐⭐ Moderate |
| **Built-in Database** | ✅ PostgreSQL | ✅ Vercel Postgres | ❌ Need external | ❌ Need external |
| **Built-in File Storage** | ✅ Object Storage | ✅ Blob Storage | ✅ Firebase Storage | ❌ Local only |
| **Auto-deploys (GitHub)** | ✅ Yes | ✅ Yes | ✅ Optional | ❌ Manual |
| **Custom Domain** | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Depends |
| **WebSocket Support** | ✅ Full | ⚠️ Limited | ⚠️ Functions only | ✅ Full |
| **Cost (Free Tier)** | Generous | Generous | Limited | Free |
| **Best For** | Development | Production | Static + Functions | Development |

### Recommendations

- 🏆 **Replit**: Best for rapid development and testing
- 🏆 **Vercel**: Best for production deployment (Next.js optimized)
- 🏆 **Firebase**: Best if using Firebase Auth/Firestore
- 🏆 **Local**: Best for offline development

---

## Running on Different IDEs

### VS Code (Local Development)

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/psu-rizal-platform.git
cd psu-rizal-platform

# Install dependencies
pnpm install

# Create .env.local
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
pnpm dev

# Open http://localhost:5000
```

### GitHub Codespaces

1. Go to your GitHub repository
2. Click **Code** → **Codespaces** → **Create codespace on main**
3. VS Code opens in browser
4. Terminal opens automatically
5. Follow Local Development steps above

### GitPod

1. Prefix your repo URL: `https://gitpod.io/#https://github.com/YOUR_USERNAME/psu-rizal-platform`
2. GitPod opens with VS Code interface
3. Follow Local Development steps

### JetBrains WebStorm

1. **File** → **New** → **Project from Version Control**
2. Paste GitHub URL
3. WebStorm clones and opens project
4. Configure Node.js interpreter (Settings → Languages & Frameworks → Node.js)
5. Run `pnpm dev` in terminal

---

## Troubleshooting

### ❌ "DATABASE_URL is not defined"

**Solution:** Add `DATABASE_URL` to environment variables on your platform.

### ❌ "Cannot connect to database"

**Possible causes:**
1. Wrong connection string format
2. Missing `?sslmode=require` for hosted databases
3. Database not accepting connections (check firewall/IP allowlist)
4. Wrong credentials

**Solution:** Test connection string locally:

```bash
psql "your_database_url_here"
```

### ❌ Build fails on Vercel/Firebase

**Common issues:**
1. TypeScript errors (we have `ignoreBuildErrors: true` but still check console)
2. Missing environment variables during build
3. Import errors

**Solution:** Check build logs and add missing environment variables.

### ❌ Port already in use (Local)

**Solution:** Change port in `.env.local`:

```bash
PORT=3000
```

Or kill the process using port 5000:

```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

### ❌ Changes not reflecting on deployed site

**Solution:**
- **Vercel**: Trigger redeploy from dashboard
- **Firebase**: Run `firebase deploy --only hosting`
- **Replit**: Restart the workflow/repl

### ❌ WebSocket errors in production

**Expected behavior:** WebRTC video calls require a signaling server for cross-device connections. See `docs/VIDEO_CONFERENCING.md` for implementation options.

---

## Next Steps

After successful deployment:

1. ✅ Test all pages: `/`, `/admin`, `/guest`, `/api/health`
2. ✅ Create admin account and login
3. ✅ Test registration approval workflow
4. ✅ Verify curriculum data loaded (4 programs, 164 subjects)
5. ✅ Test guest meeting access
6. ⚠️ Implement signaling server for cross-device video calls (optional)

---

## Support & Resources

- **Project Documentation:** `replit.md`
- **Replit Guide:** `docs/deployment/replit-checklist.md`
- **Video Conferencing:** `docs/VIDEO_CONFERENCING.md`
- **Firebase Integration:** `docs/FIREBASE_VERCEL_INTEGRATION.md`

**Questions?** Check existing documentation or create an issue on GitHub.

---

**🎉 Congratulations! Your platform is now multi-platform ready!**
