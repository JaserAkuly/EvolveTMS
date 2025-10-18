'use client'

import { useAuth } from '@/app/contexts/auth-context'
import { createClient } from '@/lib/supabase'
import { useState, useEffect } from 'react'

export default function AuthDebugPage() {
  const { user, profile, loading } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>({})
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      setSessionInfo({
        session: session ? 'Active' : 'None',
        user: session?.user?.email || 'None',
        userId: session?.user?.id || 'None',
        error: error?.message || 'None'
      })
    }
    checkSession()
  }, [])

  const testLogin = async () => {
    console.log('Testing login...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@evolve.local',
      password: 'password123'
    })
    console.log('Login result:', { data, error })
    
    if (data.session) {
      console.log('Login successful, session created')
      // Manually check profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      console.log('Profile fetch:', { profileData, profileError })
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold">useAuth Hook:</h2>
          <pre className="text-sm">{JSON.stringify({
            user: user ? { email: user.email, id: user.id } : null,
            profile: profile,
            loading
          }, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold">Direct Session Check:</h2>
          <pre className="text-sm">{JSON.stringify(sessionInfo, null, 2)}</pre>
        </div>

        <button
          onClick={testLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Login (Check Console)
        </button>
      </div>
    </div>
  )
}