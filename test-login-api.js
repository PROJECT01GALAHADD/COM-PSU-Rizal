const fetch = require('node-fetch')

async function testLoginAPI() {
  console.log('🧪 Testing Login API Endpoint')

  const testUsers = [
    { email: 'admin@psu.edu', password: 'password123' },
    { email: 'student1@psu.edu', password: 'password123' },
    { email: 'faculty1@psu.edu', password: 'password123' },
  ]

  for (const user of testUsers) {
    console.log(`\n🔐 Testing login for ${user.email}...`)

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
        }),
      })

      const responseText = await response.text()
      console.log(`Status: ${response.status}`)
      console.log(`Response: ${responseText}`)

      if (response.ok) {
        console.log('✅ Login successful!')

        // Check if we got a cookie
        const cookies = response.headers.get('set-cookie')
        if (cookies) {
          console.log('🍪 Cookies set:', cookies)
        }
      } else {
        console.log('❌ Login failed')
      }
    } catch (error) {
      console.error(`❌ Error testing ${user.email}:`, error.message)
    }
  }
}

testLoginAPI().catch(console.error)
