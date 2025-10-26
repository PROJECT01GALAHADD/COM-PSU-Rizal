#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

async function run() {
  console.log('=== Checking Database State ===\n')
  
  // Check public.users table
  const { data: publicUsers, error: publicError } = await supabase
    .from('users')
    .select('*')
    .order('role')
  
  if (publicError) {
    console.error('Error fetching public.users:', publicError)
  } else {
    console.log(`Public users table: ${publicUsers.length} users`)
    publicUsers.forEach(u => {
      console.log(`  - ${u.email} (${u.role})`)
    })
  }
  
  // Check auth.users table
  console.log('\n=== Checking Auth Users ===\n')
  try {
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('Error fetching auth.users:', authError)
    } else {
      const authUsers = authData?.users || []
      console.log(`Auth users: ${authUsers.length} users`)
      authUsers.forEach(u => {
        console.log(`  - ${u.email} (confirmed: ${u.email_confirmed_at ? 'yes' : 'no'})`)
      })
      
      // Find mismatches
      console.log('\n=== Checking Sync ===\n')
      const publicEmails = new Set(publicUsers.map(u => u.email))
      const authEmails = new Set(authUsers.map(u => u.email))
      
      const inPublicNotAuth = publicUsers.filter(u => !authEmails.has(u.email))
      const inAuthNotPublic = authUsers.filter(u => !publicEmails.has(u.email))
      
      if (inPublicNotAuth.length > 0) {
        console.log('⚠️  Users in public.users but NOT in auth.users:')
        inPublicNotAuth.forEach(u => console.log(`  - ${u.email}`))
      }
      
      if (inAuthNotPublic.length > 0) {
        console.log('⚠️  Users in auth.users but NOT in public.users:')
        inAuthNotPublic.forEach(u => console.log(`  - ${u.email}`))
      }
      
      if (inPublicNotAuth.length === 0 && inAuthNotPublic.length === 0) {
        console.log('✅ All users are synced between auth and public tables')
      }
    }
  } catch (e) {
    console.error('Error checking auth users:', e.message)
  }
}

run().catch(console.error)
