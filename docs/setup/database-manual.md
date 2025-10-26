# 🎯 Supabase Database Setup - Manual Guide

## Current Status

✅ `.env.local` configured with Supabase credentials  
✅ Database password set: `MWHxW32fj57yMBwz`  
⚠️ **Tables need to be created manually**

## Why Manual Setup?

The automated migration tools (`drizzle-kit push`) require direct PostgreSQL access, which may be restricted by:
- IP allowlisting in Supabase
- Connection pooler authentication
- Network/firewall settings

**Solution**: Use the Supabase SQL Editor (web-based, always works!)

---

## 📝 Step-by-Step Setup

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/xiarltiaucakojvvtvmi
   ```

2. Click on **"SQL Editor"** in the left sidebar

3. Click **"New query"** button

### Step 2: Copy the Migration SQL

Open the file `drizzle/0000_uneven_may_parker.sql` in your project and copy ALL the SQL code.

Or run this command to print it:
```bash
cat drizzle/0000_uneven_may_parker.sql
```

### Step 3: Execute the SQL

1. Paste the entire SQL code into the Supabase SQL Editor
2. Click **"Run"** (or press `Ctrl/Cmd + Enter`)
3. Wait for completion (should take 2-5 seconds)

### Step 4: Verify Tables Created

After running the SQL, verify the tables were created:

1. Click on **"Table Editor"** in the left sidebar
2. You should see these tables:
   - `users`
   - `courses`
   - `meetings`
   - `participants`
   - `messages` (or `chat_messages`)
   - `enrollments`
   - `assignments`
   - `submissions`
   - `announcements`
   - `participants_meetings` (join table)

---

## 🚀 After Tables are Created

Once the tables are created in Supabase, you can start the application:

```bash
# Start the development server
pnpm dev
```

Then visit: **http://localhost:3000**

### Test the Database Connection

1. Go to http://localhost:3000/signup
2. Create a new account
3. If signup succeeds, your database is connected! ✅

---

## 🔧 Alternative: Use psql Command Line

If you prefer command-line tools:

### 1. Get the Direct Connection String

From Supabase Dashboard → Settings → Database, find the **Direct Connection** string (not pooler).

It should look like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 2. Apply Migrations

```bash
psql "YOUR_CONNECTION_STRING_HERE" < drizzle/0000_uneven_may_parker.sql
```

---

## 📊 Database Schema Overview

After setup, you'll have these tables:

### Core Tables
- **users** - All user accounts (students, faculty, admin, guests)
- **courses** - Course catalog and information
- **enrollments** - Student course enrollments
- **assignments** - Course assignments
- **submissions** - Student assignment submissions

### Meeting Tables
- **meetings** - Video conference meetings
- **participants** - Meeting participants
- **messages** - In-meeting chat messages

### System Tables
- **announcements** - Course and system announcements

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Tables visible in Supabase Table Editor
- [ ] `pnpm dev` starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can create an account at /signup
- [ ] Can login at /login
- [ ] Can access /dashboard

---

## 🆘 Troubleshooting

### SQL Editor shows errors
- Make sure you copied the ENTIRE SQL file
- Try running one `CREATE TABLE` statement at a time
- Check for any existing tables with the same names

### Application won't connect
- Verify .env.local has the correct DATABASE_URL
- Check that tables were created successfully
- Try restarting the dev server (`pnpm dev`)

### "relation does not exist" errors
- This means tables weren't created
- Re-run the SQL in Supabase SQL Editor
- Verify table names match (check for `chat_messages` vs `messages`)

---

## 📞 Need Help?

If you encounter issues:
1. Check Supabase Dashboard → Logs for errors
2. Verify your password is correct
3. Ensure your Supabase project is active (not paused)

---

**Next**: After tables are created, run `pnpm dev` and start building! 🎉
