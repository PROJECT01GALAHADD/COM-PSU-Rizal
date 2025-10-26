# database

This document describes the database setup for both cloud (Supabase) and local (Postgres + NocoDB).

## drizzle orm

- config: `drizzle.config.ts` → schema at `lib/db/schema/index.ts`, output at `./drizzle`.
- connection: `lib/db/connection.ts` using `postgres` driver and optional SSL CA.
- scripts: `pnpm init-db` (generate and push migrations).

## supabase (cloud)

- `DATABASE_URL` uses `sslmode=require`.
- SSL CA path: `SUPABASE_SSL_CERT_PATH=./prod-ca-2021.crt` to enforce TLS.
- Admin client: `lib/supabase/server.ts` (service role key).
- Browser client: `lib/supabase/client.ts` (anon key).

## local postgres + nocodb

- docker compose: `scripts/docker-compose.local.yml`.
- start/stop: `pnpm db:up` / `pnpm db:down`.
- NocoDB available on `http://localhost:8080` after first boot.

## schema (initial)

- `users` table with roles enum: `admin`, `faculty`, `student`, `guest`.
- Extend with meetings, courses, enrollments, assignments, etc., then run `pnpm init-db`.
