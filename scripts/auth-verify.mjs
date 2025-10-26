import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'

// User test cases based on seeded accounts
const TEST_USERS = [
  { email: 'admin@psu.edu', role: 'admin' },
  { email: 'faculty1@psu.edu', role: 'faculty' },
  { email: 'faculty2@psu.edu', role: 'faculty' },
  { email: 'faculty3@psu.edu', role: 'faculty' },
  { email: 'student1@psu.edu', role: 'student' },
  { email: 'student2@psu.edu', role: 'student' },
  { email: 'student3@psu.edu', role: 'student' },
  { email: 'student4@psu.edu', role: 'student' },
  { email: 'student5@psu.edu', role: 'student' },
  { email: 'student6@psu.edu', role: 'student' },
].map(user => ({ ...user, password: 'Password123!' }))

// Load environment
function loadEnv() {
  const envFiles = ['.env.local', '.env']
  let loaded = false

  for (const file of envFiles) {
    const envPath = join(process.cwd(), file)
    if (existsSync(envPath)) {
      console.log(`Loading ${file}...`)
      const envContent = readFileSync(envPath, 'utf8')

      envContent.split('\n').forEach(line => {
        const matches = line.match(/^([^=:#]+?)[=:](.*)/)
        if (!matches) return

        const key = matches[1].trim()
        let value = matches[2].trim()

        // Remove quotes
        value = value.replace(/^["'](.*)["']$/, '$1')

        if (!process.env[key]) {
          process.env[key] = value
          loaded = true
        }
      })
    }
  }

  return loaded
}

async function verifyAuth() {
  // Load environment variables
  if (!loadEnv()) {
    console.error('❌ No environment files found!')
    return false
  }

  // Check required configuration
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.error('❌ Missing Supabase configuration!')
    console.error(
      'Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY'
    )
    return false
  }

  console.log('🔑 Testing auth with service role...')
  console.log(`URL: ${url}`)

  // Initialize Supabase client
  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  })

  let results = []
  let success = 0
  let failed = 0

  // Test each user
  for (const user of TEST_USERS) {
    try {
      console.log(`\n👤 Testing ${user.email} (${user.role})...`)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      })

      if (error) {
        console.error(`✗ Login failed: ${error.message}`)
        results.push({ ...user, status: 'failed', error: error.message })
        failed++
        continue
      }

      console.log('✓ Login successful')
      console.log(`  ID: ${data.user?.id}`)
      console.log(
        `  Email Verified: ${data.user?.user_metadata?.email_verified ?? false}`
      )
      console.log(`  Session: ${data.session ? 'Active' : 'None'}`)

      results.push({
        ...user,
        status: 'success',
        userId: data.user?.id,
        emailVerified: data.user?.user_metadata?.email_verified ?? false,
        sessionActive: !!data.session,
      })
      success++
    } catch (err) {
      console.error(`✗ Error testing ${user.email}:`, err)
      results.push({ ...user, status: 'error', error: err.message })
      failed++
    }
  }

  // Write results to file
  const summary = {
    timestamp: new Date().toISOString(),
    total: TEST_USERS.length,
    success,
    failed,
    results,
  }

  writeFileSync(
    join(process.cwd(), 'logs', 'auth-verification.json'),
    JSON.stringify(summary, null, 2)
  )

  // Print summary
  console.log('\n📊 Verification Summary')
  console.log('───────────────────────')
  console.log(`Total Tests: ${TEST_USERS.length}`)
  console.log(`Successful: ${success}`)
  console.log(`Failed: ${failed}`)
  console.log(
    `Success Rate: ${((success / TEST_USERS.length) * 100).toFixed(1)}%`
  )
  console.log('\nDetailed results saved to logs/auth-verification.json')

  return failed === 0
}

// Create logs directory if it doesn't exist
const logsDir = join(process.cwd(), 'logs')
if (!existsSync(logsDir)) {
  console.log('📁 Creating logs directory...')
  require('fs').mkdirSync(logsDir, { recursive: true })
}

// Run verification
verifyAuth()
  .then(success => {
    if (!success) {
      console.error('\n❌ Verification failed!')
      process.exit(1)
    }
    console.log('\n✅ All verifications passed!')
  })
  .catch(err => {
    console.error('\n❌ Fatal error:', err)
    process.exit(1)
  })
