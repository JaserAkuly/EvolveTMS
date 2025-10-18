const { createClient } = require('@supabase/supabase-js')

// Use your service role key for admin operations
const supabaseUrl = 'https://dmccydifdtkjlpmfgphg.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtY2N5ZGlmZHRramxwbWZncGhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg5MzYxOCwiZXhwIjoyMDc1NDY5NjE4fQ.0vW78QS4XWu9f_m3gZRJEF9ioePFUreht5qvx6b1JpE'

// Create admin client
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const demoUsers = [
  { email: 'admin@evolve.local', password: 'password123', role: 'admin' },
  { email: 'carrier@evolve.local', password: 'password123', role: 'carrier' },
  { email: 'shipper@evolve.local', password: 'password123', role: 'shipper' },
  { email: 'viewer@evolve.local', password: 'password123', role: 'viewer' },
]

async function createDemoUsers() {
  console.log('Creating demo users with admin API...')
  
  for (const user of demoUsers) {
    try {
      // Delete user if exists
      console.log(`Checking for existing user: ${user.email}`)
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = existingUsers.users.find(u => u.email === user.email)
      
      if (existingUser) {
        console.log(`Deleting existing user: ${user.email}`)
        await supabaseAdmin.auth.admin.deleteUser(existingUser.id)
      }
      
      // Create new user with admin API
      console.log(`Creating user: ${user.email}`)
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          role: user.role
        }
      })
      
      if (error) {
        console.error(`Error creating user ${user.email}:`, error.message)
      } else {
        console.log(`✓ Created user: ${user.email} (ID: ${data.user.id})`)
      }
    } catch (error) {
      console.error(`Error processing user ${user.email}:`, error)
    }
  }
  
  console.log('\nDemo users creation completed!')
  
  // List all users to verify
  try {
    const { data } = await supabaseAdmin.auth.admin.listUsers()
    console.log('\nAll users in system:')
    data.users.forEach(user => {
      console.log(`- ${user.email} (${user.id}) - Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`)
    })
  } catch (error) {
    console.error('Error listing users:', error)
  }
}

createDemoUsers()