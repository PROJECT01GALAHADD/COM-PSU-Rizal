# Project Roadmap

A living roadmap for the PSU Rizal Academic Collaboration Platform. Designed to be clear for humans, developers, and LLMs. Each phase includes milestones, acceptance criteria, and progress signals.

## Phase 0 — Foundations (Done/In-progress)

- UI stack ready (Next.js 14, React 18, TS 5, Tailwind, shadcn/ui)
- Core pages: landing, login, signup, guest meet, dashboard, admin
- Video meeting UX: layout, chat, controls (WebRTC/WebSocket hooks placeholder)
- Repo hygiene: Prettier, ESLint ignore, tsconfig tuning, VS Code settings
- Legal placeholders: `/privacy-policy`, `/acceptable-use`
- About page: platform intro and CTAs

Acceptance: app boots, core nav works, formatting on save works.

## Phase 1 — Type Health & Flow (Current)

- Fix middleware header types, client prop serialization (completed)
- Clean TS errors in `app/admin/page.tsx`
- Align auth component props (`AuthForm`, `SocialLogin`)
- Verify forwardRef types in `components/ui/*`
- Flow sanity pass: landing → (login/signup/guest) → dashboards

Acceptance: `pnpm typecheck` shows no blocking errors; core user journeys function.

## Phase 2 — Data & Auth

- Supabase integration
  - Use `DATABASE_URL` with `sslmode=require`
  - `SUPABASE_SSL_CERT_PATH=./prod-ca-2021.crt`
  - Wire `lib/supabase/client.ts`, `lib/supabase/server.ts`
- Minimal user/meeting schema
- JWT claims shape formalized
- Role-based access end-to-end

Acceptance: login → role dashboard; meeting metadata persisted; protected APIs.

## Phase 3 — Meetings End-to-end

- Real signaling & peer management
- Persisted chat messages
- Participant presence & roles (host/participant)
- Invites (shareable link/ID) 

Acceptance: two browsers can meet, chat persists, host controls work.

## Phase 4 — Admin CMS & NocoDB

- Define CMS scope for admin content
- Bridge endpoints to NocoDB for admin-only modules
- Auditing/logging for admin changes

Acceptance: admin creates/edits content via CMS; changes visible in applicable pages.

## Phase 5 — UX Polish & Performance

- Mobile nav polish
- Loading/skeleton states, progressive hydration
- Bundle & route profiling, critical CSS

Acceptance: Lighthouse target ≥ 90 on mobile; no major layout shifts.

## KPIs & Quality Gates

- TypeScript: zero critical diagnostics
- E2E: core flows pass in CI
- Performance: TTI < 2.5s on mid-tier device
- Security: no secrets leaked; headers sane

---

## Status Summary (Rolling)

- Foundations ✅
- Type health & flow ▶ (in progress)
- Data & Auth ⏳ (next)
- Meetings E2E ⏳
- Admin CMS & NocoDB ⏳
- UX & Perf ⏳
