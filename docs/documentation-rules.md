# Documentation Rules for PSU Rizal Project

## 📋 Core Rules

### 1. File Location
**All `.md` files MUST be placed in the `/docs` folder**

**Exceptions:**
- `README.md` (root) - Main project README only

### 2. File Naming Convention
**All `.md` files MUST use lowercase letters only**

✅ **Correct:**
- `project-summary.md`
- `deployment-guide.md`
- `database-setup.md`
- `running-the-application.md`

❌ **Incorrect:**
- `Project-Summary.md`
- `DEPLOYMENT-GUIDE.md`
- `Database_Setup.md`
- `Running-The-Application.md`

### 3. File Format
**All documentation MUST use `.md` (Markdown) format**

✅ **Correct:** `.md`  
❌ **Incorrect:** `.txt`, `.doc`, `.pdf`

### 4. Organization Structure

```
/docs/
├── README.md                  # Main documentation index
├── archive/                   # Historical/outdated docs
├── deployment/                # Deployment guides
│   ├── checklist.md
│   ├── guide.md
│   └── github-upload.md
├── setup/                     # Setup & configuration
│   ├── database-manual.md
│   └── quick-reference.md
└── thesis/                    # Thesis-related docs
```

## 🔄 When Adding New Documentation

1. **Create the file in `/docs` folder**
   ```bash
   touch docs/new-feature-guide.md
   ```

2. **Use lowercase naming with hyphens**
   - Use hyphens (`-`) to separate words
   - No spaces, underscores, or capital letters

3. **Add to appropriate subfolder if applicable**
   - Deployment-related → `docs/deployment/`
   - Setup/config → `docs/setup/`
   - Historical → `docs/archive/`

4. **Update `docs/README.md` index**
   - Add new file to the table of contents

## 🚫 What NOT to Do

1. ❌ Don't create `.md` files in the root directory
2. ❌ Don't use uppercase letters in filenames
3. ❌ Don't use `.txt` for documentation (use `.md`)
4. ❌ Don't use spaces in filenames (use hyphens)
5. ❌ Don't forget to update the documentation index

## ✅ Checklist for New Documentation

Before committing new documentation:

- [ ] File is in `/docs` folder (or appropriate subfolder)
- [ ] Filename uses only lowercase letters
- [ ] Filename uses hyphens for word separation
- [ ] File format is `.md` (Markdown)
- [ ] File is added to `docs/README.md` index
- [ ] Content is clear and well-formatted
- [ ] Cross-references are updated if needed

## 📝 Markdown Best Practices

### Formatting
- Use `#` for headers (H1, H2, H3, etc.)
- Use code blocks with language tags: \`\`\`typescript
- Use lists for better readability
- Add links to related documentation

### Content
- Write clear, concise descriptions
- Include examples where applicable
- Add table of contents for long documents
- Update date of last revision

## 🔍 Automated Checks

To verify documentation rules, run:
```bash
# Check for .md files in root (except README.md)
find . -maxdepth 1 -name "*.md" ! -name "README.md"

# Check for uppercase letters in docs filenames
find docs/ -name "*[A-Z]*.md"

# Check for .txt files that should be .md
find docs/ -name "*.txt"
```

## 🎯 Examples

### Good Example
```
docs/
├── database-setup.md
├── deployment/
│   └── vercel-guide.md
└── setup/
    └── environment-variables.md
```

### Bad Example
```
Root/
├── Database-Setup.md        ❌ Wrong location & naming
├── DEPLOYMENT.txt           ❌ Wrong format
└── docs/
    └── Setup_Guide.MD       ❌ Wrong naming
```

---

**Last Updated:** 2025-10-23  
**Maintained By:** PSU Rizal Development Team
