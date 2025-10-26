## Connecting the Next app to the hosted Supabase project

This document explains how to point the app at a hosted Supabase project and run quick smoke tests.

1. Add credentials

Create a `.env.local` in the repository root containing these variables (DO NOT commit):

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_JWT_SECRET
- SUPABASE_ACCESS_TOKEN (optional)

Example (do not commit):

NEXT_PUBLIC_SUPABASE_URL="https://<PROJECT_REF>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<PUBLIC_ANON_KEY>"
SUPABASE_SERVICE_ROLE_KEY="<SERVICE_ROLE_KEY>"

2. Restart Next dev server

If you're running the Next app locally with pnpm/npm, restart it so environment variables are picked up:

pnpm dev

or

npm run dev

3. Quick smoke test (server-side)

Run the following Node script to check your service role key can make a simple call. Save the snippet below into `scripts/supabase-smoke.js` and run it with `node`.

```js
// scripts/supabase-smoke.js
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing env; ensure .env.local is sourced')
  process.exit(1)
}

const supabase = createClient(url, key)

async function run() {
  const { data, error } = await supabase.from('roles').select('*').limit(1)
  if (error) {
    console.error('Error from Supabase:', error)
    process.exit(2)
  }
  console.log('Sample rows from roles:', data)
}

run()
```

Ensure `scripts/supabase-smoke.js` is executable and run:
node scripts/supabase-smoke.js

4. Troubleshooting

- If you get auth errors, confirm the service role key is copied exactly and not wrapped with extra quotes.
- Ensure `NEXT_PUBLIC_SUPABASE_URL` matches the project's `supabase.co` URL (project ref). If you are behind a proxy, ensure Node/Next can reach the URL.

5. Quick app debug page

After starting the Next dev server (`pnpm dev`), open:

http://localhost:3000/debug

This page renders the `roles` table server-side using the service role key and also provides a client-side component if you inspect the page in the browser. There's also an API at `/api/debug/roles` that returns JSON for automated checks.

# Local database setup (Postgres + NocoDB)

This project includes a Docker Compose configuration and helper scripts to run a local Postgres database and a NocoDB admin interface. The compose file maps the services to ports expected by the application.

## Quick start

1. Start the stack:

   pnpm run db:up

2. Seed the Postgres database (seed is applied automatically on first init, but you can re-run):

   pnpm run db:seed

3. Seed NocoDB (best-effort; requires NocoDB admin credentials if your instance is secured):

   pnpm run db:seed-nocodb

4. Verify the running services:

   pnpm run db:verify-running

## Where to visit

- PostgreSQL: host=localhost port=5432 (connect with psql or a GUI)
- NocoDB: http://localhost:5433

## Optional: run local Supabase (recommended for full feature parity)

If your app uses Supabase Auth, Storage, or Realtime, run the Supabase local dev stack. You can install the CLI globally or run it via pnpm/npx:

```bash
# Install the supabase CLI globally (optional)
npm install -g supabase

# Or use pnpm/npx to invoke the CLI without installing globally
pnpm dlx supabase start
# or
npx supabase start

# Start supabase local dev (this will spin up a local Postgres + services)
supabase start
```

After `supabase start` completes it will print local URLs and the project keys. Copy the printed values into your `.env.local` like this (replace the placeholders with the values shown by the CLI):

```env
NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<ANON_KEY_FROM_OUTPUT>"
SUPABASE_SERVICE_ROLE_KEY="<SERVICE_ROLE_KEY_FROM_OUTPUT>"
```

Then start your Next.js app and verify `lib/supabase/client.ts` and `lib/supabase/server.ts` can create clients.

## Optional: Attach NocoDB to the same Postgres

If you want NocoDB to operate on the same Postgres database used by Supabase (so the same tables are visible in NocoDB), run the compose override we added:

```bash
# Start the Postgres + NocoDB where NocoDB uses Postgres as its backend
docker compose -f scripts/docker-compose.local.yml -f scripts/docker-compose.nocodb-postgres.yml up -d
```

This uses the environment variables from the base compose file to point NocoDB at `psu_local`.

Notes about data and conflicts:

- When attaching NocoDB to Postgres, NocoDB will create its own metadata tables in the Postgres database. Be careful when sharing a Postgres instance with Supabase in production — for dev it's fine.
- If you re-run with SQLite (default), NocoDB will keep a separate database file and won't share rows with Postgres.

## MCP helper

You can open the MCP connection to your local NocoDB instance using the helper npm script:

```bash
pnpm run mcp:open-nocodb
```

This runs the `mcp-remote` command with the token you provided to connect to the project.

## Notes

- The Postgres init SQL `scripts/db-init/seed.sql` runs during the first container initialization (placed in `docker-entrypoint-initdb.d`). If you need to re-run the SQL after the first startup, use `pnpm run db:seed` which executes psql against the running container and applies the SQL file.
- The NocoDB seeding uses the public REST API at `/api` and may require admin auth depending on how your NocoDB starts. For secured NocoDB, set `NOCODB_ADMIN_EMAIL` and `NOCODB_ADMIN_PASSWORD` environment variables before running `pnpm run db:seed-nocodb`.
