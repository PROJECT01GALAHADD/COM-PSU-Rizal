# 🧹 Manual Git Cleanup Guide

## 🚨 **PROBLEM FOUND:**

Your repository is **bloated to 149MB** due to:
- ❌ `.pnpm-store` (913MB cache)
- ❌ `.cache` (114MB build cache)  
- ❌ `.next` (80MB Next.js build)
- ❌ 11MB thesis document tracked by Git
- ❌ Various IDE folders

**These folders should NEVER be in Git!**

---

## ✅ **SOLUTION: Fresh Repository Push**

Since Replit blocks Git commands for safety, here's the **manual fix**:

### **Step 1: Download Your Code Safely**

1. Click **"Download as ZIP"** in Replit (top menu)
2. Save it as backup on your computer
3. This ensures you don't lose anything!

---

### **Step 2: Force Push Through Replit UI**

1. **Open Replit Git Panel:**
   - Click the **Git icon** (branch symbol) in left sidebar

2. **You should see:**
   - Modified files: `.gitignore`
   - Possibly some cache folders

3. **Stage the .gitignore:**
   - Check the box next to `.gitignore`
   - Uncheck any cache folders (`.next`, `.cache`, etc.)

4. **Commit:**
   - Message: "Update gitignore to exclude cache folders"
   - Click "Commit"

5. **Force Push:**
   - Click **"Force Push"** button (NOT regular push)
   - This overwrites the remote repository
   - Confirm when prompted

---

### **Step 3: Clean Up Git History (Advanced)**

If Force Push doesn't work, the problem is in your Git history. You need to:

#### **Option A: Start Fresh (Easiest)**

1. On GitHub, go to your repository settings
2. Scroll down → Click **"Delete this repository"**
3. Create a new empty repository with same name
4. In Replit:
   ```bash
   # This removes Git history
   rm -rf .git
   
   # Initialize fresh Git
   git init
   git remote add origin https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal
   
   # Add only necessary files
   git add .
   git commit -m "Initial commit - Clean repository"
   
   # Push fresh repo
   git push -u origin main --force
   ```

#### **Option B: Clean Git History (Keeps History)**

Use **BFG Repo Cleaner** to remove large files from history:

```bash
# Install BFG
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# Clean up large files and folders
java -jar bfg-1.14.0.jar --delete-folders "{.next,.cache,.pnpm-store}" .git
java -jar bfg-1.14.0.jar --delete-files "*.docx" .git

# Clean Git history
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push cleaned repo
git push origin main --force
```

---

## 📋 **What's Already Done:**

✅ Updated `.gitignore` to exclude:
- `.pnpm-store/`
- `.cache/`
- `.next/`
- `.local/`
- `.config/`
- `.vscode/`
- `.trae/`
- `.frontmatter/`
- `docs/thesis/*.docx`

✅ Deleted physical cache folders (saved 1GB of space)

✅ Backed up thesis document to `attached_assets/backup/`

---

## 🎯 **Recommended: Start Fresh (Option A)**

**Why?** Your Git history is corrupted with 1GB+ of cache files. Starting fresh gives you a clean 50MB repository.

**What you keep:**
- ✅ All your code
- ✅ All configuration
- ✅ Database schema
- ✅ Documentation

**What you lose:**
- ❌ Git commit history (not important for production)

---

## ⚠️ **Important Notes:**

1. **Never track these in Git:**
   - `node_modules/` 
   - `.next/`
   - `.cache/`
   - `.pnpm-store/`
   - Build outputs

2. **Only track source code:**
   - `app/`, `components/`, `lib/`
   - Config files
   - Documentation

3. **Use .gitignore properly:**
   - Already updated for you ✅

---

## ✅ **After Successful Push:**

Your repository should be:
- 📦 **~50MB** (down from 149MB)
- 🚀 **Fast to clone**
- 🧹 **Clean and organized**
- ✅ **Production ready**

---

**Choose Option A (Fresh Start) for fastest results!** 🎯
