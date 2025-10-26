import { createClient } from '@supabase/supabase-js'

// For debugging env loading
const envVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
}

console.log('\nEnvironment Variables:')
Object.entries(envVars).forEach(([key, value]) => {
  console.log(`${key}: ${value ? '✓ Set' : '✗ Missing'}`)
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing required Supabase configuration')
  process.exit(1)
}

console.log('\nTesting Supabase connection...')
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
})

async function testConnection() {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      throw error
    }
    console.log('✓ Successfully connected to Supabase')
    console.log('URL:', supabaseUrl)
    return true
  } catch (err) {
    console.error('❌ Connection failed:', err.message)
    return false
  }
}

testConnection().catch(console.error)
