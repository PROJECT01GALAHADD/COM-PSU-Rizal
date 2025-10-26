require('dotenv').config({ path: '.env.local' })
const { drizzle } = require('drizzle-orm/postgres-js')
const postgres = require('postgres')

async function checkLocalUsers() {
  console.log('🔍 Checking local database users...')

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('❌ DATABASE_URL not found')
    return
  }

  console.log('📡 Connecting to database...')

  try {
    const client = postgres(connectionString, {
      ssl: process.env.SUPABASE_SSL_CERT_PATH
        ? {
            ca: require('fs').readFileSync(
              process.env.SUPABASE_SSL_CERT_PATH,
              'utf8'
            ),
          }
        : 'require',
    })

    const db = drizzle(client)

    console.log('✅ Connected to database')

    // Check if users table exists and get all users
    const allUsers = await client`SELECT * FROM users`

    console.log(`\n👥 Found ${allUsers.length} users in local database:`)

    if (allUsers.length === 0) {
      console.log('❌ No users found in local database')
      console.log(
        '💡 This might be why login is failing - no local user records'
      )
    } else {
      allUsers.forEach(user => {
        console.log(
          `- ${user.email} (${user.id}) - Type: ${user.user_type}, Created: ${user.created_at}`
        )
      })
    }

    await client.end()
  } catch (error) {
    console.error('❌ Database error:', error.message)
  }
}

checkLocalUsers().catch(console.error)
