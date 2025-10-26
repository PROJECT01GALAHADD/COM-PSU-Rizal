# Sync to GitHub & Firebase - Complete Guide

## 🎯 What You Need to Do

Your Replit code has all the latest production upgrades (Pusher, Storage, Feature Flags). Let's get this synced to GitHub and deployed to Firebase.

---

## 📋 Pre-Flight Check

Your current status:
- ✅ **Replit**: 71 commits ahead with all production features
- ⚠️ **GitHub**: 1 commit behind (needs force push)
- 🔧 **Firebase**: Ready to receive the update

---

## Step 1: Sync Replit → GitHub (Force Push)

### Option A: Using Replit Shell (Recommended)

1. **Open Replit Shell** (bottom of screen, or Tools → Shell)

2. **Run these commands one by one:**

```bash
# Check current status
git status

# Force push to GitHub (overwrites GitHub with Replit)
git push origin main --force

# Verify success
git status
```

3. **Expected output:**
```
✅ Your branch is up to date with 'origin/main'
✅ Nothing to commit, working tree clean
```

---

### Option B: Using Replit Git UI

1. Click **Version Control** icon (left sidebar)
2. Click **"Push"** button
3. If it shows conflict, click **"Force Push"**
4. Wait for sync to complete

---

## Step 2: Deploy to Firebase

### A. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### B. Login to Firebase

```bash
firebase login
```

This will open a browser - sign in with your Google account.

### C. Initialize Firebase (if first time)

```bash
firebase init
```

Select:
- ✅ Hosting
- ✅ Functions (if you want API routes)
- Choose existing project or create new one
- Build directory: `.next` (for Next.js)
- Single-page app: Yes
- GitHub auto-deploy: Optional

### D. Build for Production

```bash
npm run build
```

This creates optimized production files in `.next/` folder.

### E. Deploy to Firebase

```bash
firebase deploy
```

Wait for deployment (usually 2-5 minutes).

### F. Get Your Firebase URL

After deployment completes, you'll see:
```
✅ Deploy complete!
🌐 Hosting URL: https://your-project.firebaseapp.com
```

---

## Step 3: Configure Firebase Environment Variables

Your app needs these environment variables on Firebase:

### Critical Variables (MUST HAVE):

```bash
firebase functions:config:set \
  database.url="YOUR_DATABASE_URL" \
  jwt.secret="YOUR_JWT_SECRET" \
  pusher.app_id="2068782" \
  pusher.key="fc61e1ae10110979ad99" \
  pusher.secret="4d6dabc0702a333a13b1" \
  pusher.cluster="ap1"
```

### Optional Variables:

```bash
firebase functions:config:set \
  sentry.dsn="YOUR_SENTRY_DSN" \
  blob.token="YOUR_VERCEL_BLOB_TOKEN"
```

### Verify Configuration:

```bash
firebase functions:config:get
```

---

## Step 4: Update Firebase Configuration Files

I've already created these files for you:
- ✅ `firebase.json` - Firebase hosting config
- ✅ `.firebaserc` - Firebase project config

### Update `.firebaserc` with your project ID:

1. Open `.firebaserc` file
2. Replace `"default": "your-project-id"` with your actual Firebase project ID
3. Save the file

---

## Step 5: Test Firebase Deployment

### A. Test Locally First:

```bash
# Build production version
npm run build

# Serve locally to test
firebase serve
```

Open: http://localhost:5000

### B. Check These Features:

- [ ] Homepage loads correctly
- [ ] Can log in
- [ ] Database connection works
- [ ] Video conferencing loads
- [ ] Pusher connects (check browser console)

### C. Fix Common Issues:

**Issue: "Database connection failed"**
```bash
# Add database URL to Firebase config
firebase functions:config:set database.url="YOUR_POSTGRES_URL"
firebase deploy --only functions
```

**Issue: "Pusher connection failed"**
```bash
# Verify Pusher keys are public
# NEXT_PUBLIC_* vars must be in .env.production
echo "NEXT_PUBLIC_PUSHER_KEY=fc61e1ae10110979ad99" >> .env.production
echo "NEXT_PUBLIC_PUSHER_CLUSTER=ap1" >> .env.production
npm run build
firebase deploy
```

**Issue: "API routes return 404"**
```bash
# Firebase needs Cloud Functions for API routes
firebase init functions
# Select: JavaScript/TypeScript
# Install dependencies: Yes
firebase deploy --only functions
```

---

## Step 6: Verify Everything Works

### On Firebase URL:

1. **Homepage**: https://your-project.firebaseapp.com
   - [ ] Loads correctly
   - [ ] No console errors

2. **Authentication**: /login
   - [ ] Can log in
   - [ ] JWT works
   - [ ] Redirects to dashboard

3. **Video Conferencing**: /meeting/test-001
   - [ ] Camera/mic permissions work
   - [ ] Pusher connects (green indicator)
   - [ ] Can join as guest
   - [ ] Video calls work across devices

4. **API Routes**: /api/flags
   - [ ] Returns JSON response
   - [ ] No 404 errors

---

## 🔄 Quick Reference: Common Commands

### For GitHub:
```bash
# Check status
git status

# Force push (sync Replit → GitHub)
git push origin main --force

# Pull from GitHub
git pull origin main
```

### For Firebase:
```bash
# Login
firebase login

# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions

# View logs
firebase functions:log

# Open Firebase console
firebase open
```

---

## 📊 Deployment Checklist

Before going live:

### Code Quality:
- [x] All features implemented
- [x] Pusher WebRTC working
- [x] Storage abstraction ready
- [x] Feature flags configured
- [x] Environment validation added

### GitHub:
- [ ] All code pushed to GitHub
- [ ] No merge conflicts
- [ ] README updated
- [ ] .env.example has all variables

### Firebase:
- [ ] Project created
- [ ] Environment variables set
- [ ] Database connected
- [ ] Hosting configured
- [ ] Functions deployed (if using API routes)

### Testing:
- [ ] Homepage loads
- [ ] Login works
- [ ] Video calls work
- [ ] API routes work
- [ ] Mobile responsive
- [ ] No console errors

---

## 🚨 Important: Database Setup on Firebase

Your app uses PostgreSQL. Firebase doesn't provide PostgreSQL, so you need:

### Option 1: Use Neon (Recommended)
```bash
# Your current DATABASE_URL already uses Neon
# Just add it to Firebase config:
firebase functions:config:set database.url="postgresql://..."
```

### Option 2: Use Supabase
```bash
# Get Postgres URL from Supabase
# Add to Firebase:
firebase functions:config:set database.url="postgresql://..."
```

### Option 3: Keep Replit Database
```bash
# Use Replit's database (already configured)
# Just ensure it's accessible from Firebase
# May need to whitelist Firebase IPs
```

---

## 📝 Firebase-Specific Files Already Created

I've set these up for you:

1. **`firebase.json`** - Hosting & functions config
   - Rewrites for Next.js routing
   - Public directory settings
   - Build ignore patterns

2. **`.firebaserc`** - Project configuration
   - Default project ID (update this!)
   - Deployment targets

3. **`scripts/deploy-firebase.sh`** - Deployment script
   - Auto-builds and deploys
   - Handles environment variables

4. **`.env.production`** - Production environment vars
   - Create this file with your production values

---

## 🎉 Once Deployed Successfully

Your app will be live at:
```
https://YOUR-PROJECT-ID.web.app
https://YOUR-PROJECT-ID.firebaseapp.com
```

You can also add a custom domain:
```bash
firebase hosting:channel:deploy production --only hosting
```

---

## 🆘 Need Help?

### Check Firebase Logs:
```bash
firebase functions:log --only functions
```

### Check Build Errors:
```bash
npm run build 2>&1 | tee build-log.txt
```

### Check Deployment Status:
```bash
firebase projects:list
firebase deploy --debug
```

---

## 🔗 Useful Links

- **Firebase Console**: https://console.firebase.google.com
- **Firebase Docs**: https://firebase.google.com/docs/hosting
- **Next.js + Firebase**: https://github.com/vercel/next.js/tree/canary/examples/with-firebase-hosting
- **Your GitHub Repo**: https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal

---

**Ready to deploy?** Start with Step 1 above! 🚀
