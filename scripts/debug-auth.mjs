import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xiarltiaucakojvvtvmi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpYXJsdGlhdWNha29qdnZ0dm1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNDY1OTgsImV4cCI6MjA3NjcyMjU5OH0.WAEXXoJSngPIgokTLIa_76g1u51Du8PkMuf0aNqm10k'
)

// Test user credentials
const TEST_USERS = [
  { email: 'admin@psu.edu', password: 'Password123!' },
  { email: 'student1@psu.edu', password: 'Password123!' },
]

// Helper to print response details
function debugResponse(data, error) {
  console.log('\nResponse Details:')
  if (error) {
    console.log('Error:', {
      message: error.message,
      status: error.status,
      name: error.name,
      ...(error.cause && { cause: error.cause }),
    })
  }
  if (data) {
    console.log('Data:', {
      session: data.session ? 'Present' : 'None',
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
            metadata: data.user.user_metadata,
          }
        : 'None',
    })
  }
}

async function testAuth() {
  console.log('🔍 Testing Supabase Authentication')
  console.log('URL: https://xiarltiaucakojvvtvmi.supabase.co')

  // First try to get session
  console.log('\n1. Checking current session...')
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession()
  debugResponse(sessionData, sessionError)

  // Then try sign in
  for (const user of TEST_USERS) {
    console.log(`\n2. Testing login for ${user.email}...`)
    const { data, error } = await supabase.auth.signInWithPassword(user)
    debugResponse(data, error)

    if (!error && data.session) {
      // If login worked, try getting user
      console.log('\n3. Getting user details...')
      const { data: userData, error: userError } = await supabase.auth.getUser()
      debugResponse(userData, userError)

      // Sign out
      console.log('\n4. Signing out...')
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) {
        console.log('Sign out error:', signOutError)
      } else {
        console.log('Successfully signed out')
      }
    }

    console.log('\n---')
  }
}

import { writeFileSync } from 'fs'
import { join } from 'path'

// Run tests with error handling
console.log('Starting auth verification...\n')

// Create a buffer for output
const output = []
const log = (...args) => {
  const msg = args.join(' ')
  output.push(msg)
  console.log(msg)
}

// Override console methods to capture output
const originalLog = console.log
const originalError = console.error
console.log = (...args) => log(...args)
console.error = (...args) => log('ERROR:', ...args)

// Run tests and save output
testAuth()
  .then(() => {
    log('\n✅ Verification complete')
    // Write results to file
    const results = output.join('\n')
    const outPath = join(process.cwd(), 'logs', 'auth-debug.log')
    writeFileSync(outPath, results, 'utf8')
    log(`\nResults written to: ${outPath}`)
  })
  .catch(err => {
    log('\n❌ Fatal error:', err)
    process.exit(1)
  })
  .finally(() => {
    // Restore console methods
    console.log = originalLog
    console.error = originalError
  })
