#!/usr/bin/env node

/**
 * Apply migrations using Supabase Client (via SQL over HTTP)
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
function loadEnv() {
  const envPath = join(__dirname, '..', '.env.local')
  const envContent = readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim()
      }
    }
  })
}

async function main() {
  loadEnv()

  console.log('\n🚀 Applying database migrations using Supabase Client...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    console.error(
      '   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY'
    )
    process.exit(1)
  }

  console.log('📡 Connecting to Supabase via REST API...')

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  try {
    // Read the migration SQL file
    const migrationPath = join(
      __dirname,
      '..',
      'drizzle',
      '0000_uneven_may_parker.sql'
    )
    console.log('📄 Reading migration file...')
    const migrationSQL = readFileSync(migrationPath, 'utf8')

    // Split by statement breakpoint
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements\n`)

    console.log(
      '⚠️  Note: Supabase REST API has limitations for executing raw SQL.'
    )
    console.log(
      '    Please apply migrations manually via Supabase SQL Editor:\n'
    )
    console.log(
      `    1. Go to: ${supabaseUrl.replace('.co', '.co/project/' + supabaseUrl.split('//')[1].split('.')[0] + '/sql')}`
    )
    console.log('    2. Copy the SQL from: drizzle/0000_uneven_may_parker.sql')
    console.log('    3. Paste and execute in the SQL Editor\n')

    // Try to create at least one table to verify access
    console.log('🧪 Testing table creation via Supabase client...\n')

    const testSQL = `
      CREATE TABLE IF NOT EXISTS test_connection (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: testSQL,
    })

    if (error) {
      console.log('❌ Direct SQL execution not available via REST API')
      console.log(`   Error: ${error.message}\n`)
      console.log('📋 Manual Setup Required:\n')
      console.log('   Option 1: Use Supabase Dashboard SQL Editor')
      console.log(
        `     → https://supabase.com/dashboard/project/xiarltiaucakojvvtvmi/sql/new\n`
      )
      console.log('   Option 2: Use psql command line:')
      console.log('     → Get connection string from Supabase dashboard')
      console.log(
        '     → Run: psql "YOUR_CONNECTION_STRING" < drizzle/0000_uneven_may_parker.sql\n'
      )
    } else {
      console.log('✅ SQL execution successful!')
      console.log('   Applying migrations...\n')

      for (let i = 0; i < statements.length; i++) {
        const { error: execError } = await supabase.rpc('exec_sql', {
          sql_query: statements[i],
        })
        if (execError) {
          if (execError.message.includes('already exists')) {
            console.log(
              `⏭️  Statement ${i + 1}/${statements.length} skipped (already exists)`
            )
          } else {
            console.log(
              `❌ Statement ${i + 1}/${statements.length} failed: ${execError.message}`
            )
          }
        } else {
          console.log(`✅ Statement ${i + 1}/${statements.length} executed`)
        }
      }
    }
  } catch (error) {
    console.error('\n❌ Error:')
    console.error(error.message)
  }
}

main()
