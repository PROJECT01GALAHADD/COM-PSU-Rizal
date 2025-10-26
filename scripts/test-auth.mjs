import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Load .env files
// Debug helper
function dumpEnv(msg) {
  console.log(`\n=== ${msg} ===`)
  const vars = process.env
  Object.keys(vars)
    .filter(k => k.includes('SUPABASE') || k.includes('DATABASE'))
    .forEach(k => console.log(`${k}: ${vars[k]}`))
  console.log('=== End ===\n')
}

function loadEnv() {
  const envPaths = ['.env.local', '.env']
  const loadedVars = []

  for (const envFile of envPaths) {
    const envPath = join(process.cwd(), envFile)
    if (existsSync(envPath)) {
      console.log(`Loading environment from ${envFile}...`)
      const envContents = readFileSync(envPath, 'utf8')
      envContents.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) return
        const eq = trimmed.indexOf('=')
        if (eq === -1) return
        const key = trimmed.slice(0, eq).trim()
        let val = trimmed.slice(eq + 1).trim()
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1)
        }
        if (!process.env[key]) {
          process.env[key] = val
          loadedVars.push(key)
        }
      })
    }
  }

  return loadedVars
}

// Main execution
async function main() {
  // Load env vars
  const loadedVars = loadEnv()
  dumpEnv('After Loading Env Files')

  // Check configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('\nEnvironment Status:')
  console.log(
    'NEXT_PUBLIC_SUPABASE_URL:',
    supabaseUrl ? '✓ Present' : '✗ Missing'
  )
  console.log(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY:',
    anonKey ? '✓ Present' : '✗ Missing'
  )
  console.log(
    'SUPABASE_SERVICE_ROLE_KEY:',
    serviceKey ? '✓ Present' : '✗ Missing'
  )

  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing required Supabase configuration')
  }

  // Create client with anon key
  console.log('\nInitializing Supabase client...')
  const supabase = createClient(supabaseUrl, anonKey)

  // Test signup
  const testEmail = 'test@example.com'
  const testPassword = 'test123456!'

  console.log('\nAttempting signup...')
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  })

  if (signupError) {
    if (signupError.message.includes('User already registered')) {
      console.log('✓ User exists (expected)')
    } else {
      console.error('✗ Signup failed:', signupError.message)
    }
  } else {
    console.log('✓ Signup successful')
    console.log('User:', signupData.user?.id)
  }

  // Test login
  console.log('\nAttempting login...')
  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    })

  if (loginError) {
    console.error('✗ Login failed:', loginError.message)
    throw loginError
  }

  console.log('✓ Login successful')
  console.log('User:', loginData.user?.id)
  console.log('Session:', loginData.session ? 'Active' : 'None')

  // Try admin login
  console.log('\nTesting admin login...')
  const { data: adminData, error: adminError } =
    await supabase.auth.signInWithPassword({
      email: 'admin@psu.edu',
      password: 'Password123!',
    })

  if (adminError) {
    console.error('✗ Admin login failed:', adminError.message)
  } else {
    console.log('✓ Admin login successful')
    console.log('User:', adminData.user?.id)
    console.log('Role:', adminData.user?.user_metadata?.role || 'unknown')
  }
}

// Debug environment
dumpEnv('Initial Environment')

// Run with error handling
main().catch(err => {
  console.error('\n❌ Test failed:', err)
  process.exit(1)
})
