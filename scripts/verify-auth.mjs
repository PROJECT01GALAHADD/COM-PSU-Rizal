import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xiarltiaucakojvvtvmi.supabase.co'
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpYXJsdGlhdWNha29qdnZ0dm1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNDY1OTgsImV4cCI6MjA3NjcyMjU5OH0.WAEXXoJSngPIgokTLIa_76g1u51Du8PkMuf0aNqm10k'

// Supabase client with anon key
const supabase = createClient(SUPABASE_URL, ANON_KEY)

// Test cases - using seeded accounts from supabase-seed.sh
const testUsers = [
  { email: 'admin@psu.edu', password: 'Password123!' },
  { email: 'teacher1@psu.edu', password: 'Password123!' },
  { email: 'student1@psu.edu', password: 'Password123!' },
]

async function verifyLogin(email, password) {
  try {
    console.log(`\n🔑 Testing login for ${email}...`)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.log('✗ Login failed:', error.message)
      return false
    }

    console.log('✓ Login successful')
    console.log('  User ID:', data.user?.id)
    console.log('  Email:', data.user?.email)
    console.log('  Role:', data.user?.user_metadata?.role || 'unknown')
    console.log('  Session:', data.session ? 'Active' : 'None')
    return true
  } catch (err) {
    console.log('✗ Error during login:', err)
    return false
  }
}

async function runTests() {
  console.log('🚀 Starting login verification with Supabase...')
  console.log('URL:', SUPABASE_URL)
  console.log('Key:', ANON_KEY ? '✓ Present' : '✗ Missing')
  console.log('\n🔄 Running login tests...')

  let totalTests = 0
  let passedTests = 0

  for (const user of testUsers) {
    totalTests++
    const success = await verifyLogin(user.email, user.password)
    if (success) passedTests++
  }

  console.log('\n📊 Test Summary:')
  console.log(`   ${passedTests}/${totalTests} logins successful`)
  console.log(
    '   Status:',
    passedTests === totalTests ? '✅ All passed' : '❌ Some failed'
  )
}

runTests().catch(err => {
  console.error('\n❌ Fatal error:', err)
  process.exit(1)
})
