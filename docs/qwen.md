# Qwen Context File

This file contains context information for Qwen's interactions with this project.

## Project Information

This is the root directory of the project located at `/Users/ORDEROFCODE/v0-COM-PSU-Rizal`.

Project Name: PSU Rizal | Academic Collaboration Platform
Description: A unified platform for Palawan State University (PSU) Rizal, enabling seamless virtual interaction, academic management, and collaboration for students and faculty.

## Project Overview

This is a Next.js application built with the following key technologies:

- Next.js 14.2.4 with React 18.2.0
- TypeScript 5.2.2
- Tailwind CSS for styling
- shadcn/ui components
- Lucide React for icons

The application is designed as an academic collaboration platform for Palawan State University (PSU) Rizal campus. It includes features such as:

- Dashboard for academic management
- Meeting functionality with video conferencing
- User authentication with role-based access control
- Academic tracking and collaboration tools

## Project Structure

The project follows a Next.js 13+ app directory structure:

- `app/` - Contains all route handlers and page components
- `components/` - Reusable UI components including shadcn/ui components
- `database/` - Contains both NocoDB and Supabase configurations
- `public/` - Static assets and media files

Key app routes include:

- `/` - Main landing page
- `/admin` - Administrative dashboard
- `/dashboard` - User dashboard
- `/meetings` - Meeting functionality
- `/login` and `/signup` - Authentication pages

## Notable Features

- Responsive design with mobile navigation
- Glass morphism UI effects
- Video integration for demonstrating features
- SEO optimization with structured data
- Authentication middleware for role-based access control
- Integration with Google Analytics and Tag Manager
- Real-time video conferencing using WebRTC
- Academic management system for courses and assignments

## Deployment

The project supports multiple deployment options:

### Cloud Deployment

The project is configured for deployment on Vercel, with automatic synchronization from v0.app.

### Local Deployment

The application can be run entirely on localhost with full functionality:

- Frontend: Next.js development server
- Backend: Local PostgreSQL database via Docker
- Database: PostgreSQL with Drizzle ORM
- Authentication: Full JWT-based authentication system
- Video Conferencing: WebRTC capabilities

This flexibility makes the platform accessible to institutions with varying infrastructure requirements.

---

## AI Collaboration Workflow (Qwen CLI + Cascade in IDE)

This project is developed collaboratively by two AIs:

- Cascade (IDE assistant): edits code in the workspace, plans integrations, updates docs.
- Qwen (CLI agent): reads from `templates/` and copies only minimal required resources into the live app.

### Templates usage policy

- Source templates live in `templates/` and are treated as a read-only library of resources.
- The live app reads from `app/`, `components/`, `lib/`, `public/`, etc.
- Copy only the minimal files needed from templates into the live app; do not import from templates directly at runtime.

### Tooling guardrails (do not change)

- `tsconfig.json` excludes `templates/**` from TypeScript checks.
- `.vscode/settings.json` excludes `templates/**` from search and file watchers.
- `.eslintignore` excludes `templates/**` from linting.

These ensure templates do not break builds while remaining available as resources for Qwen.

### Coordination rules

- Cascade defines target locations and minimal file lists; Qwen performs copies from `templates/` into those targets.
- Prefer reuse of existing primitives under `components/ui/` and `components/auth/` before copying new ones.
- Avoid changing project-level configs unless coordinated via Cascade.

### Current integration scope

1. Authentication (role-based): use `templates/v0-COM-Authentication-Page` resources minimally.

- Targets:
  - `app/admin/login/page.tsx` (exists; keep)
  - `app/faculty/login/page.tsx` (to add)
  - `app/student/login/page.tsx` (to add)
- Allowed copies (only if missing in live app):
  - `templates/v0-COM-Authentication-Page/components/auth/sign-in-form.tsx`
  - Optional: `social-login.tsx`, `password-strength.tsx`
- Reuse live app UI:
  - `components/ui/*`
  - `components/auth/auth-card.tsx`

2. Admin dashboard: use `templates/v0-COM-Admin-Dashboard` as reference/resources.

- Targets:
  - `app/admin/` and `components/dashboard/`
- Copy only modules/widgets actually used by pages.

3. Student & faculty dashboards: use `templates/v0-COM-Student-&-Faculty-Dashboard` minimally.

- Targets:
  - `app/student/` and `app/faculty/`
- Copy only required sections/components.

4. LiveMeet core with Guest support: use `templates/v0-COM-Replit-Template-LiveMeet`.

- Targets:
  - `features/meet/` (new) and `app/meet/`
- Copy only core meeting modules and create a Guest join route.

### Workflow steps (repeatable)

1. Cascade proposes file list and destinations in the IDE.
2. Qwen copies those files from `templates/` into targets, preserving relative imports.
3. Cascade adapts imports to project paths and verifies build.
4. Commit with clear messages, e.g., `feat(auth): add faculty/student login pages using template resources`.

### Do / Don't

- Do treat `templates/` as read-only source assets.
- Do copy only what's necessary; prefer reuse of existing UI.
- Don't import code directly from `templates/` at runtime.

### Status

- Templates are excluded from TypeScript, ESLint, and VSCode watchers.
- Ready for Qwen to perform minimal copies per the scope above without disrupting the build.

---

## Thesis Project

This repository is part of a formal academic thesis project.

- Title document: `PALAWAN-STATE-UNIVERSITY-COLLABORATION-ONLINE-MEET-thesis.docx`
- Path: `/Users/ORDEROFCODE/v0-COM-PSU-Rizal/PALAWAN-STATE-UNIVERSITY-COLLABORATION-ONLINE-MEET-thesis.docx`

Usage for Qwen and contributors:

- Treat the thesis document as the authoritative reference for objectives, scope, and requirements.
- When in doubt about features or terminology, consult the thesis before making architectural or UX decisions.
- Do not commit edits to the DOCX; if updates are needed, coordinate via Cascade and maintain a changelog.

---

## Supabase & Local Database Integration

This project supports both Supabase Cloud and a local Postgres + NocoDB stack. Use environment variables to switch modes without code changes.

### Environment variables

- Browser-only
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server-only
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_JWT_SECRET`
  - `DATABASE_URL` (e.g. `postgres://user:pass@host:5432/db?sslmode=require`)
  - `DIRECT_URL` (optional)
  - `SUPABASE_SSL_CERT_PATH` (e.g. `./prod-ca-2021.crt`)

See `/.env.example` and never commit real secrets.

### SSL certificate

- File: `prod-ca-2021.crt` at repository root
- For Supabase Postgres, set `sslmode=require` in `DATABASE_URL` and set `SUPABASE_SSL_CERT_PATH`.
- Server DB client (`lib/db/connection.ts`) reads the CA and enables strict SSL.

### Runtime clients

- Browser Supabase client: `lib/supabase/client.ts` (uses public anon key; optional if running local-only).
- Server Supabase admin: `lib/supabase/server.ts` (requires service role key; never exposed to browser).
- Postgres/Drizzle connection: `lib/db/connection.ts` (uses `DATABASE_URL`, optional SSL CA).

### Local stack

- Compose file: `scripts/docker-compose.local.yml`
- Commands (package.json)
  - `pnpm run db:up` → start local Postgres + NocoDB
  - `pnpm run db:down` → stop stack
  - `pnpm run db:logs` → follow logs
  - `pnpm run init-db` → placeholder for schema migrations (replace with drizzle-kit when schema is ready)

### LLM/MCP access boundaries

- Qwen/LLMs may read and use only browser env (`NEXT_PUBLIC_*`).
- Server secrets (`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `DATABASE_URL`) are IDE/server-only and must not be printed to logs.
- Cascade handles DB migrations and secret-bound tasks; Qwen may copy schema files on request.
