# 🧹 Repository Cleanup Checklist

## Files to Remove from Git (Already in .gitignore)

These files are currently tracked by Git but should be removed:

```bash
# Run these commands in the Shell:
git rm --cached start-app.bat
git rm --cached v0-COM-PSU-Rizal.code-workspace
git rm --cached DEPLOY_NOW.sh
git rm --cached files
git rm --cached generated-icon.png
git commit -m "Remove unnecessary files from repository"
```

**Why remove these?**
- `start-app.bat` - Windows batch file (not needed on Linux/Replit)
- `v0-COM-PSU-Rizal.code-workspace` - VS Code workspace file (IDE-specific)
- `DEPLOY_NOW.sh` - Old deployment script (use Replit's Publish button)
- `files` - Temporary file with no extension
- `generated-icon.png` - Icon file (should be in public/icons)

---

## Optional: Nix Packages to Remove

Remove these through **Dependencies > System packages**:

- ❌ `nix-direnv` (not needed)
- ❌ `nix-prefetch-git` (not needed)
- ❌ `nix-prefetch-github` (not needed)
- ❌ `nixFlakes` (not needed)
- ❌ `nixpacks` (not needed)
- ❌ `nixpkgs-fmt` (not needed)
- ❌ `nixpkgs-lint` (not needed)

✅ Keep: `nix`, `nixStable` (required)

---

## Environment Variables to Delete

Delete these through **Secrets** tool:

- ❌ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ❌ `NEXT_PUBLIC_SUPABASE_URL`
- ❌ `SUPABASE_JWT_SECRET`
- ❌ `SUPABASE_SERVICE_ROLE_KEY`

✅ Keep all other variables (DATABASE_URL, JWT_SECRET, etc.)

---

## After Cleanup

1. Run the git commands above
2. Use Replit's Git UI to push changes
3. Remove Nix packages (optional)
4. Delete Supabase secrets
5. Done! 🎉
