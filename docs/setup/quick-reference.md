# 🚀 Quick Reference - PSU Rizal + Supabase

## ⚡ Quick Start (3 Steps)

### 1️⃣ Create Database Tables
```bash
# Option A: Via Supabase Dashboard (Recommended)
1. Go to: https://supabase.com/dashboard/project/xiarltiaucakojvvtvmi/sql/new
2. Copy contents of: drizzle/0000_uneven_may_parker.sql
3. Paste and click "Run"

# Option B: Via Command Line
cat drizzle/0000_uneven_may_parker.sql
# Then paste into Supabase SQL Editor
```

### 2️⃣ Start Development Server
```bash
pnpm dev
```

### 3️⃣ Test It Works
```bash
# Visit these URLs:
http://localhost:3000          # Homepage
http://localhost:3000/signup   # Create account
http://localhost:3000/login    # Login
```

---

## 📋 Essential Commands

```bash
# Development
pnpm dev                # Start dev server (port 3000)
pnpm build              # Build for production
pnpm start              # Start production server

# Database
pnpm supabase:test      # Test connection
cat .env.local          # View config

# Testing
pnpm test               # Run tests
pnpm lint               # Check code
```

---

## 🔑 Your Credentials

```env
Project URL:    https://xiarltiaucakojvvtvmi.supabase.co
DB Password:    MWHxW32fj57yMBwz
Dashboard:      https://supabase.com/dashboard/project/xiarltiaucakojvvtvmi
```

---

## 📊 Database Tables

After migration, you'll have:
- `users` - User accounts
- `courses` - Courses catalog
- `meetings` - Video meetings
- `participants` - Meeting participants
- `messages` - Chat messages
- `enrollments` - Student enrollments
- `assignments` - Course assignments
- `submissions` - Assignment submissions
- `announcements` - Announcements

---

## ✅ Checklist

- [x] `.env.local` configured
- [x] Database password set
- [x] Build passing
- [ ] Tables created in Supabase ← **DO THIS**
- [ ] Dev server started
- [ ] Test account created

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Already fixed ✅ |
| Can't connect to DB | Create tables first (step 1) |
| Port 3000 in use | `killall node` or use different port |
| "relation does not exist" | Tables not created - run SQL migration |

---

## 📚 Documentation

- `SUPABASE-CONFIGURATION-COMPLETE.md` - Full setup summary
- `MANUAL-DATABASE-SETUP.md` - Detailed table creation guide
- `SUPABASE-QUICKSTART.md` - Getting started guide

---

**Ready to start?** Create the database tables (step 1), then run `pnpm dev`! 🎉
