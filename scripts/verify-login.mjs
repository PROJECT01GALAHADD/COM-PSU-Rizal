import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Load .env files and set env vars
try {
  const envPaths = ['.env.local', '.env']
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
        if (val.startsWith('\"') && val.endsWith('\"')) val = val.slice(1, -1)
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
        if (!process.env[key]) process.env[key] = val
      })
    }
  }
} catch (e) {
  console.warn('Warning: Error loading .env files:', e.message)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyLogin(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login failed:', error.message)
      return false
    }

    console.log('Login successful for:', email)
    console.log('User ID:', data.user?.id)
    console.log('Session:', data.session ? 'Active' : 'None')
    return true
  } catch (err) {
    console.error('Error during login:', err)
    return false
  }
}

// Test cases
const testUsers = [
  { email: 'admin@psu.edu', password: 'Password123!' },
  { email: 'teacher1@psu.edu', password: 'Password123!' },
  { email: 'student1@psu.edu', password: 'Password123!' },
]

async function runTests() {
  console.log('Starting login verification tests...\n')

  for (const user of testUsers) {
    console.log(`Testing login for ${user.email}...`)
    const success = await verifyLogin(user.email, user.password)
    console.log(success ? '✓ Success' : '✗ Failed')
    console.log('---')
  }
}

runTests().catch(console.error)
