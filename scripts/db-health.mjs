import postgres from 'postgres'
import fs from 'node:fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import * as dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Attempt to load local env file for non-Replit environments
try {
  const envPath = join(__dirname, '..', '.env.local')
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
  }
} catch {}

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  let ssl
  const caPath = process.env.SUPABASE_SSL_CERT_PATH
  if (caPath && fs.existsSync(caPath)) {
    ssl = { ca: fs.readFileSync(caPath, 'utf8'), rejectUnauthorized: true }
  }

  const sql = postgres(url, { ssl, max: 1, prepare: true })
  try {
    const rows = await sql`select now() as now`
    const now = rows?.[0]?.now ?? null
    console.log(JSON.stringify({ ok: true, now }, null, 2))
    await sql.end()
    process.exit(0)
  } catch (err) {
    console.error(JSON.stringify({ ok: false, error: err?.message || 'Unknown error' }, null, 2))
    try { await sql.end() } catch {}
    process.exit(1)
  }
}

main()