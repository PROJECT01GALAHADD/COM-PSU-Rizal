# 🚀 Deploy PSU Rizal Platform to GitHub & Firebase

## ✅ What's Ready

Your platform now has:
- ✅ **Pusher WebRTC** - Cross-device video calls working
- ✅ **Storage Abstraction** - Works on Replit, Vercel, Firebase
- ✅ **Feature Flags** - Toggle features without redeployment
- ✅ **Multi-Platform** - Ready for Replit, Vercel, Firebase
- ✅ **Production-Ready** - Environment validation, error handling

---

## 🎯 Deploy in 3 Simple Steps

### Step 1: Push to GitHub (1 minute)

Open **Replit Shell** and run:

```bash
git push origin main --force
```

This syncs all your production upgrades to GitHub.

---

### Step 2: Update Firebase Project ID (30 seconds)

1. Go to Firebase Console: https://console.firebase.google.com
2. Get your project ID (or create new project)
3. Update `.firebaserc` file - replace `psu-rizal-platform` with your project ID

---

### Step 3: Deploy to Firebase (2 minutes)

Run the automated script:

```bash
bash DEPLOY_NOW.sh
```

This will:
- Build production version
- Deploy to Firebase
- Give you the live URL

---

## 🔧 After Deployment

### Set Environment Variables in Firebase Console

Go to: **Firebase Console → Functions → Configuration**

Add these required variables:

```
DATABASE_URL = your-production-postgres-url
JWT_SECRET = your-secure-jwt-secret
PUSHER_APP_ID = 2068782
PUSHER_KEY = fc61e1ae10110979ad99
PUSHER_SECRET = 4d6dabc0702a333a13b1
PUSHER_CLUSTER = ap1
```

**Or** use Firebase CLI:

```bash
firebase functions:config:set \
  database.url="YOUR_POSTGRES_URL" \
  jwt.secret="YOUR_JWT_SECRET" \
  pusher.app_id="2068782" \
  pusher.key="fc61e1ae10110979ad99" \
  pusher.secret="4d6dabc0702a333a13b1" \
  pusher.cluster="ap1"

firebase deploy --only functions
```

---

## ✅ Test Your Live App

After deployment, test at: `https://YOUR-PROJECT.web.app`

**Test Video Conferencing:**
1. Open `/meeting/test-001` in Chrome
2. Open same URL in Firefox (or phone)
3. Verify you can see each other!

---

## 📚 Complete Documentation

- **Quick Deploy**: `deployment-guides/DEPLOY_INSTRUCTIONS.md`
- **Full Guide**: `deployment-guides/SYNC_TO_GITHUB_FIREBASE.md`
- **Test Video**: `deployment-guides/QUICK_TEST.md`
- **Implementation**: `docs/IMPLEMENTATION_SUMMARY.md`

---

## 🆘 Need Help?

**Common Issues:**

1. **Build fails**: Run `rm -rf .next && npm run build`
2. **Video calls don't work**: Check Pusher keys in browser console
3. **Database errors**: Verify DATABASE_URL in Firebase config
4. **404 errors**: Re-run `firebase init` and select Functions

---

## 🎉 You're Ready!

Just run:

```bash
git push origin main --force
bash DEPLOY_NOW.sh
```

Your app will be live in minutes! 🚀

---

**Questions?** Check the guides in `deployment-guides/` folder.
