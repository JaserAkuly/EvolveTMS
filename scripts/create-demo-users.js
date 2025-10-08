const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dmccydifdtkjlpmfgphg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtY2N5ZGlmZHRramxwbWZncGhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTM2MTgsImV4cCI6MjA3NTQ2OTYxOH0.v1CjyBUfJ-XRgdLJffRN6o6dRZypM_qM_lVruj7N1dM'

const supabase = createClient(supabaseUrl, supabaseKey)

const demoUsers = [
  { email: 'admin@evolve.local', password: 'password123', role: 'admin' },
  { email: 'carrier@evolve.local', password: 'password123', role: 'carrier' },
  { email: 'shipper@evolve.local', password: 'password123', role: 'shipper' },
  { email: 'viewer@evolve.local', password: 'password123', role: 'viewer' },
]

async function createDemoUsers() {
  console.log('Creating demo users...')
  
  for (const user of demoUsers) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
      })
      
      if (error) {
        console.error(`Error creating user ${user.email}:`, error.message)
      } else {
        console.log(`✓ Created user: ${user.email}`)
      }
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error)
    }
  }
  
  console.log('Demo users creation completed!')
}

createDemoUsers()