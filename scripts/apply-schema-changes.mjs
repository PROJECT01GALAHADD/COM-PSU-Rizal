#!/usr/bin/env node

import postgres from 'postgres'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env.local
function loadEnv() {
  const envPath = join(__dirname, '..', '.env.local')
  const envContent = readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const eq = trimmed.indexOf('=')
    if (eq === -1) return
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
    if (!process.env[key]) process.env[key] = val
  })
}

loadEnv()

const { DATABASE_URL } = process.env

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in env')
  process.exit(1)
}

async function applySchemaChanges() {
  const sql = postgres(DATABASE_URL)

  try {
    // First check if messages table needs to be renamed
    const hasMessagesTable = await sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'messages'
      );
    `

    if (hasMessagesTable[0].exists) {
      console.log('Renaming messages table to chat_messages...')
      await sql`ALTER TABLE messages RENAME TO chat_messages;`
    }

    // Get existing columns in courses table
    const columns = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'courses';
    `

    const existingColumns = new Set(columns.map(col => col.column_name))
    const columnsToAdd = [
      {
        name: 'credits',
        def: sql`credits integer DEFAULT 3`,
      },
      {
        name: 'semester',
        def: sql`semester text`,
      },
      {
        name: 'academic_year',
        def: sql`academic_year text`,
      },
      {
        name: 'schedule',
        def: sql`schedule text`,
      },
      {
        name: 'classroom',
        def: sql`classroom text`,
      },
      {
        name: 'syllabus_url',
        def: sql`syllabus_url text`,
      },
      {
        name: 'updated_at',
        def: sql`updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP`,
      },
      {
        name: 'is_active',
        def: sql`is_active boolean DEFAULT true`,
      },
    ]

    for (const col of columnsToAdd) {
      if (!existingColumns.has(col.name)) {
        console.log(`Adding ${col.name} column to courses table...`)
        await sql.unsafe(`ALTER TABLE courses ADD COLUMN ${col.def}`)
      }
    }

    console.log('Schema changes applied successfully')
  } catch (error) {
    console.error('Error applying schema changes:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

applySchemaChanges()
