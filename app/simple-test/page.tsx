'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function SimpleTestPage() {
  const [results, setResults] = useState<string>('')
  const supabase = createClient()

  const testConnection = async () => {
    setResults('Testing...\n')
    
    try {
      // Test 1: Simple auth check
      setResults(prev => prev + '\n1. Checking auth...\n')
      const { data: { session } } = await supabase.auth.getSession()
      setResults(prev => prev + `   User: ${session?.user?.email || 'Not logged in'}\n`)
      
      // Test 2: Simple query
      setResults(prev => prev + '\n2. Testing simple query to profiles...\n')
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
      
      if (error) {
        setResults(prev => prev + `   Error: ${error.message}\n`)
        setResults(prev => prev + `   Code: ${error.code}\n`)
        setResults(prev => prev + `   Details: ${JSON.stringify(error.details)}\n`)
      } else {
        setResults(prev => prev + `   Success! Found ${data?.length || 0} profiles\n`)
      }
      
      // Test 3: Check Supabase URL
      setResults(prev => prev + '\n3. Environment check...\n')
      setResults(prev => prev + `   URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`)
      setResults(prev => prev + `   Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}\n`)
      
    } catch (err: any) {
      setResults(prev => prev + `\nUnexpected error: ${err.message}\n`)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Database Test</h1>
      <button 
        onClick={testConnection}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
      >
        Test Connection
      </button>
      <pre className="bg-black text-green-400 p-4 rounded font-mono text-sm">
        {results || 'Click "Test Connection" to start'}
      </pre>
    </div>
  )
}