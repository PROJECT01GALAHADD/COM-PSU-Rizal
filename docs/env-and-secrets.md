# env and secrets

Deployment-focused guidance for environment variables and secrets management.

## variables

- **browser**: `NEXT_PUBLIC_*` only.
- **server**: `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_SSL_CERT_PATH`, `JWT_SECRET`.

## rules

- do not commit real secrets; use `.env.local` (kept ignored).
- commit only `/.env.example`.
- rotate leaked keys immediately in providers.

## supabase

- browser: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- server: `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`.
- ssl: `DATABASE_URL` with `sslmode=require` and `SUPABASE_SSL_CERT_PATH=./prod-ca-2021.crt`.

## local postgres + nocodb

- compose file: `scripts/docker-compose.local.yml`.
- scripts: `pnpm db:up`, `pnpm db:down`, `pnpm db:logs`.
- local `DATABASE_URL` example (no ssl): `postgres://psu:psu@localhost:5432/psu_local?sslmode=disable`.
