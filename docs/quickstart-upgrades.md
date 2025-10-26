# Quick Start: Platform Upgrades
## Step-by-step implementation guide for production-ready features

---

## 🚀 Before You Start

**Prerequisites:**
- GitHub repository created
- Pusher account (free tier)
- Vercel account (if deploying there)
- 30-60 minutes for implementation

---

## Option 1: WebRTC Fix Only (Fastest)
**Time: 15 minutes** | **Cost: Free**

This fixes cross-device video calls using Pusher.

### Step 1: Get Pusher Credentials
1. Go to https://pusher.com/signup
2. Create free account
3. Create new app: "PSU-Rizal-Video"
4. Copy these values:
   - App ID
   - Key
   - Secret
   - Cluster

### Step 2: Install Pusher
```bash
pnpm add pusher pusher-js
```

### Step 3: Add Environment Variables
Ask the agent to add these secrets:
```env
PUSHER_APP_ID=your_app_id
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
PUSHER_SECRET=your_secret
```

### Step 4: Implementation
Tell the agent:
```
"Implement Pusher WebRTC signaling using the code from docs/PLATFORM_UPGRADE_PLAN.md section 1"
```

### Step 5: Test
1. Open meeting in Chrome
2. Open same meeting in Firefox (or different device)
3. Verify you can see each other

✅ **Done!** Video calls now work across devices.

---

## Option 2: Full Production Setup (Recommended)
**Time: 60 minutes** | **Cost: Free (development)**

Includes WebRTC + Error Monitoring + Feature Flags + Storage

### Step 1: Get API Keys

**Pusher (Required):**
- https://pusher.com/signup
- Create app, copy credentials

**Sentry (Optional but recommended):**
- https://sentry.io/signup
- Create Next.js project
- Copy DSN

### Step 2: Install All Packages
```bash
# Core upgrades
pnpm add pusher pusher-js @vercel/blob @vercel/flags

# Error monitoring
npx @sentry/wizard@latest -i nextjs

# Testing (optional)
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

### Step 3: Add All Secrets
Ask agent to add:
```env
# Pusher (required)
PUSHER_APP_ID=xxx
NEXT_PUBLIC_PUSHER_KEY=xxx
NEXT_PUBLIC_PUSHER_CLUSTER=xxx
PUSHER_SECRET=xxx

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=xxx
SENTRY_AUTH_TOKEN=xxx

# Vercel Blob (only if deploying to Vercel)
BLOB_READ_WRITE_TOKEN=xxx
```

### Step 4: Implement Features

**Tell the agent:**
```
"Implement all features from docs/PLATFORM_UPGRADE_PLAN.md in this order:
1. Pusher WebRTC signaling (Section 1)
2. Sentry error monitoring (Section 4)
3. Feature flags (Section 3)
4. Storage abstraction layer (Section 2)"
```

### Step 5: Test Everything

**WebRTC:**
- Open meeting on 2 devices
- Verify video/audio works

**Error Monitoring:**
- Check Sentry dashboard for events
- Trigger a test error

**Feature Flags:**
- Toggle a feature on/off
- Verify it updates without redeployment

✅ **Done!** Full production setup complete.

---

## Option 3: Storage Upgrade Only
**Time: 10 minutes** | **Cost: Free**

Add Vercel Blob storage alongside Replit Object Storage.

### Step 1: Install
```bash
pnpm add @vercel/blob
```

### Step 2: Implement
Tell the agent:
```
"Implement storage abstraction layer from docs/PLATFORM_UPGRADE_PLAN.md section 2"
```

### Step 3: Get Token (Vercel deployments only)
1. Go to Vercel dashboard
2. Storage → Create Blob Store
3. Copy token to secrets

✅ **Done!** Multi-storage support added.

---

## 🔍 Verification Checklist

After implementation, verify:

### WebRTC
- [ ] Meeting opens successfully
- [ ] Camera and microphone work
- [ ] Multiple participants see each other
- [ ] Screen sharing works
- [ ] Guest access works

### Error Monitoring (if implemented)
- [ ] Sentry receives errors
- [ ] Stack traces show source code
- [ ] Performance metrics visible

### Feature Flags (if implemented)
- [ ] Can toggle features via API
- [ ] Changes apply without redeploy
- [ ] Flag definitions accessible

### Storage (if implemented)
- [ ] File upload works
- [ ] Files download correctly
- [ ] Works on Replit
- [ ] Works on Vercel (if deployed)

---

## 🐛 Troubleshooting

### "Pusher connection failed"
- Check API keys in secrets
- Verify cluster matches (e.g., `us2`)
- Check browser console for errors

### "WebRTC not connecting"
- Clear browser cache
- Check STUN server access
- Verify Pusher presence channel

### "Sentry not receiving events"
- Check DSN is correct
- Verify `NEXT_PUBLIC_SENTRY_DSN` in environment
- Check Sentry project settings

### "Feature flags not updating"
- Refresh page after toggling
- Check API route `/api/flags` responds
- Verify flag definitions exported

---

## 📊 What You Get

### Free Tier Limits
- **Pusher**: 100 concurrent connections, 200k messages/day
- **Sentry**: 5,000 errors/month
- **Vercel Blob**: 500 MB storage
- **Feature Flags**: Unlimited (self-hosted)

### Upgrade Costs (if needed)
- **Pusher**: $49/month (1,000 connections)
- **Sentry**: $26/month (50k errors)
- **Vercel Blob**: $0.15/GB storage

---

## 🚀 Deployment

### Replit
All features work out of the box. No changes needed.

### Vercel
1. Push to GitHub
2. Connect to Vercel
3. Add all environment variables
4. Deploy

### Firebase
1. Build production: `npm run build`
2. Deploy: `firebase deploy`
3. Add secrets to Firebase Functions config

---

## 📝 Next Actions

**After implementation:**
1. ✅ Test all features thoroughly
2. ✅ Update README with new capabilities
3. ✅ Train users on new features
4. ✅ Monitor error rates in Sentry
5. ✅ Plan feature rollouts with flags

**For production:**
1. ✅ Set up custom domain
2. ✅ Configure TURN server (if needed)
3. ✅ Set up backups
4. ✅ Create runbooks for incidents

---

## 💡 Pro Tips

1. **Start with Option 1** - Get WebRTC working first
2. **Add monitoring early** - Catch issues before users report them
3. **Use feature flags** - Deploy safely with kill switches
4. **Test on mobile** - WebRTC behaves differently on phones
5. **Monitor costs** - Set up billing alerts on all services

---

## 🔗 Quick Links

- **Full Plan**: `docs/PLATFORM_UPGRADE_PLAN.md`
- **Deployment Guide**: `docs/MULTI_PLATFORM_DEPLOYMENT.md`
- **Video Conferencing**: `docs/VIDEO_CONFERENCING.md`
- **Quick Deploy**: `DEPLOY.md`

---

**Questions?** Check the full plan or ask the agent for help!
