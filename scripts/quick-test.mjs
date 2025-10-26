import { createClient } from '@supabase/supabase-js'

async function main() {
  console.log('Testing Supabase authentication...')

  // Initialize client
  const supabase = createClient(
    'https://xiarltiaucakojvvtvmi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpYXJsdGlhdWNha29qdnZ0dm1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNDY1OTgsImV4cCI6MjA3NjcyMjU5OH0.WAEXXoJSngPIgokTLIa_76g1u51Du8PkMuf0aNqm10k'
  )

  // Test login
  const { error } = await supabase.auth.signInWithPassword({
    email: 'admin@psu.edu',
    password: 'Password123!',
  })

  if (error) {
    console.log('Login failed:', error.message)
    process.exit(1)
  }

  console.log('Login successful!')
  process.exit(0)
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
