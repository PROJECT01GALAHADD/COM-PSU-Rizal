# collaboration

This document defines how Cascade (IDE), Qwen (CLI), and other LLM agents collaborate on the PSU Rizal Academic Collaboration Platform.

## roles

- **cascade (ide)**: edits code, plans integrations, updates docs, runs secure tasks with server secrets.
- **qwen (cli)**: copies minimal resources from `templates/`, runs safe refactors, does not handle secrets.
- **other llms**: follow the same constraints as qwen unless explicitly permitted.

## boundaries

- **browser env only for llms**: may read/use `NEXT_PUBLIC_*` variables.
- **server secrets**: `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `DATABASE_URL`, etc. are IDE/server-only and must not be printed to logs.
- **templates**: treat `templates/` as read-only resources; copy only what is necessary into live app paths.

## workflow

1. **plan** (cascade): propose file list, targets, and minimal copies.
2. **copy** (qwen): copy from `templates/` into targets as instructed.
3. **adapt** (cascade): fix imports/paths, wire env, verify build.
4. **migrate** (cascade): run `pnpm init-db` for schema changes.
5. **commit**: clear message, e.g. `feat(auth): add faculty/student login pages`.

## file naming

- all markdown docs in `docs/` use lowercase filenames.

## contact points

- templates policy: `docs/templates-policy.md`
- env and secrets: `docs/env-and-secrets.md`
- database and migrations: `docs/database.md`
- development workflow: `docs/development-workflow.md`
