# Replit Deployment Checklist

Use this checklist to deploy the PSU Rizal Academic Collaboration Platform on Replit.

## 1) Import the Repository
- In Replit, select "Create Repl" → "Import from GitHub"
- Paste: https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal
- Confirm project files exist:
  - `.replit`, `replit.nix`, `package.json`, `scripts/dev-start.sh`
  - `lib/database/connection.ts` (uses Replit PostgreSQL)

## 2) Install Dependencies
Replit auto-installs dependencies. If needed, run manually:
```bash
pnpm install
```

## 3) Environment Variables (Secrets)
Set these in Replit Secrets (left sidebar → Tools → Secrets):

**Required:**
- `DATABASE_URL` - Auto-provided by Replit PostgreSQL (includes `?sslmode=require`)
- `JWT_SECRET` - Random secret for JWT token signing (use: `openssl rand -base64 32`)
- `SESSION_SECRET` - Random secret for sessions (use: `openssl rand -base64 32`)

**Optional (already set if using Replit defaults):**
- `PGUSER`, `PGHOST`, `PGPORT`, `PGPASSWORD`, `PGDATABASE` - Auto-provided by Replit

**Notes:**
- All authentication uses JWT tokens (no Supabase)
- Replit PostgreSQL connection includes SSL by default
- Database schema managed via Drizzle ORM

## 4) Start the Dev Server
Run:
```bash
pnpm dev
```

The dev server:
- Binds to `0.0.0.0:5000` (Replit requirement)
- Accessible via Replit preview URL (top-right)
- Hot reloading enabled

## 5) Verify Setup
Test these pages in the preview:
- `/` - Landing page with registration/login
- `/api/health` - Database connectivity check (returns JSON)
- `/guest` - Guest meeting access
- `/admin` - Admin dashboard (login: `admin@psu.palawan.edu.ph` / `admin123`)

## 6) Database Setup
The database schema is already deployed. To make changes:

```bash
# Edit schema
nano lib/database/schema.ts

# Push changes to database
npm run db:push

# If conflicts, force push
npm run db:push --force
```

**NEVER manually write SQL migrations** - use Drizzle commands only.

**Current Database:**
- 4 bachelor programs (Computer Science, Agriculture, Entrepreneurship, Environmental Science)
- 164 unique subjects
- 214 curriculum mappings
- 6 user accounts (1 admin, 2 faculty, 3 students)

## 7) Features Verification

### Authentication
- Register new account (requires admin approval)
- Login with existing credentials
- JWT tokens in HTTP-only cookies

### Admin Dashboard
- `/admin/students` - Manage students
- `/admin/faculty` - Manage faculty
- `/admin/users` - User management & approval
- `/admin/curriculum` - View all programs

### Video Conferencing
- Guest access: `/guest`
- Create meeting (no registration required)
- Join meeting with meeting ID
- Post-meeting rating modal

### Curriculum System
- API: `GET /api/programs` - List all programs
- API: `GET /api/programs/[id]/curriculum` - Program curriculum

## 8) Production Deployment (Optional)
For production, use Replit's deployment feature:

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

Or use Replit's "Deploy" button for managed hosting.

## Troubleshooting

### Preview doesn't open
- Confirm `.replit` has `[[ports]] localPort = 5000`
- Check dev server is running: `pnpm dev`

### Database errors
- Verify `DATABASE_URL` is set in Secrets
- Check connection: visit `/api/health`
- Ensure SSL mode included: `?sslmode=require`

### Authentication issues
- Verify `JWT_SECRET` is set
- Clear browser cookies and try again
- Check admin has approved account (`is_active = true`)

### Video conferencing not connecting across devices
- This is expected - requires signaling server
- See `docs/VIDEO_CONFERENCING.md` for implementation options

## Platform Status

✅ **Working:**
- JWT authentication with Replit PostgreSQL
- Admin dashboard with full CRUD operations
- Registration approval workflow
- Guest meeting access (local device)
- Post-meeting rating system
- Complete curriculum management (4 programs, 164 subjects)

⚠️ **Requires Additional Setup:**
- Cross-device video calls (needs signaling server)
- Real-time chat sync (needs WebSocket backend)

## References
- Project documentation: `replit.md`
- Video conferencing guide: `docs/VIDEO_CONFERENCING.md`
- Firebase/Vercel options: `docs/FIREBASE_VERCEL_INTEGRATION.md`
- Replit SQL Database: https://docs.replit.com/cloud-services/storage-and-databases/sql-database
