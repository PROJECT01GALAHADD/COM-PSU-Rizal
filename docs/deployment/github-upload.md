# 📤 Upload to GitHub - Step-by-Step Guide

## Prerequisites

1. **GitHub Account**: Make sure you have access to https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal
2. **Git Installed**: Check with `git --version`
3. **GitHub Authentication**: Either:
   - Personal Access Token (recommended)
   - SSH keys set up

## 🔑 Get GitHub Personal Access Token (if needed)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "PSU Rizal Upload"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** - you won't see it again!

## 🚀 Upload Steps

### Step 1: Open Terminal

Navigate to your project directory:

```bash
cd /Users/ORDEROFCODE/v0-COM-PSU-Rizal
```

### Step 2: Fix Git Repository

Since the git repository is corrupted, we need to reinitialize:

```bash
# Backup the old .git folder
mv .git .git.backup

# Initialize fresh repository
git init

# Configure git (update with your actual email)
git config user.name "PROJECT01GALAHADD"
git config user.email "your-email@example.com"

# Create main branch
git checkout -b main
```

### Step 3: Add Remote Repository

```bash
git remote add origin https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal.git
```

### Step 4: Stage All Files

```bash
# Add all files
git add .

# Verify what will be committed
git status
```

### Step 5: Create Commit

```bash
git commit -m "Initial commit - PSU Rizal Platform

Features:
- Video conferencing with guest access
- Academic management system
- Role-based authentication
- Real-time chat and collaboration
- Supabase integration
- Vercel & Replit ready"
```

### Step 6: Push to GitHub

```bash
# First time push (may require force if repo exists)
git push -u origin main

# If the above fails (repository already has content):
git push -u origin main --force
```

**Authentication Prompt:**
- Username: Your GitHub username
- Password: Your Personal Access Token (NOT your GitHub password)

## ✅ Verify Upload

After pushing, visit:
- Repository: https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal
- You should see all your files!

## 🚀 Deploy to Platforms

### Vercel Deployment

1. Go to https://vercel.com
2. Click "New Project"
3. Import from GitHub: `PROJECT01GALAHADD/COM-PSU-Rizal`
4. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
5. Click "Deploy"

### Replit Deployment

1. Go to https://replit.com
2. Click "Create Repl"
3. Select "Import from GitHub"
4. Enter: `PROJECT01GALAHADD/COM-PSU-Rizal`
5. Add Secrets (environment variables)
6. Click "Run"

## 📋 Files Included

The repository includes:
- ✅ Source code (app, components, lib, etc.)
- ✅ Configuration files (next.config.mjs, tailwind.config.ts, etc.)
- ✅ Deployment configs (vercel.json, .replit, replit.nix)
- ✅ Documentation (DEPLOYMENT.md, README files)
- ✅ Environment templates (.env.example)
- ✅ Database scripts and migrations

## ❌ Files Excluded (in .gitignore)

- `.env*` (sensitive data)
- `node_modules/` (dependencies)
- `.next/` (build files)
- `database/` (local data)
- `.git.backup/` (old git folder)

## 🔧 Troubleshooting

### "Permission denied"
```bash
# Check remote URL
git remote -v

# Update to HTTPS (easier for tokens)
git remote set-url origin https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal.git
```

### "Repository not found"
- Make sure the repository exists on GitHub
- Verify you have access to the repository
- Check spelling: `PROJECT01GALAHADD/COM-PSU-Rizal`

### "Authentication failed"
- Use Personal Access Token, not password
- Token needs `repo` scope
- Try: `git config --global credential.helper store`

### Files too large
```bash
# Check file sizes
find . -type f -size +100M

# Large files should be in .gitignore:
# - Videos, large images
# - Database dumps
# - Build artifacts
```

## 📞 Need Help?

If you encounter issues:
1. Check GitHub repository exists
2. Verify you have write access
3. Ensure Personal Access Token has correct permissions
4. Try HTTPS instead of SSH

---

**Ready to deploy!** 🎉
