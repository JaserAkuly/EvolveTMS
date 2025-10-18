'use client'

import { useState, useEffect } from 'react'

export default function APITestPage() {
  const [results, setResults] = useState<any>({})
  
  useEffect(() => {
    // Immediately show environment variables
    setResults({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      timestamp: new Date().toISOString()
    })
  }, [])

  const testDirectAPI = async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setResults((prev: any) => ({
      ...prev,
      testing: true,
      testStarted: new Date().toISOString()
    }))

    if (!url || !key) {
      setResults((prev: any) => ({
        ...prev,
        error: 'Environment variables not set',
        testing: false
      }))
      return
    }

    try {
      // Test 1: Simple fetch to check if API is reachable
      const response = await fetch(`${url}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
        }
      })

      setResults((prev: any) => ({
        ...prev,
        apiStatus: response.status,
        apiStatusText: response.statusText,
      }))

      // Test 2: Try to get profiles
      const profilesResponse = await fetch(`${url}/rest/v1/profiles?select=*&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
        }
      })

      const profilesData = await profilesResponse.text()
      
      setResults((prev: any) => ({
        ...prev,
        profilesStatus: profilesResponse.status,
        profilesData: profilesData,
        testing: false,
        testCompleted: new Date().toISOString()
      }))

    } catch (error: any) {
      setResults((prev: any) => ({
        ...prev,
        error: error.message,
        testing: false
      }))
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Direct API Test</h1>
      
      <button
        onClick={testDirectAPI}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
        disabled={results.testing}
      >
        {results.testing ? 'Testing...' : 'Test API Connection'}
      </button>

      <div className="bg-black text-green-400 p-4 rounded font-mono text-xs">
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div>

      <div className="mt-4">
        <h2 className="font-bold mb-2">Manual Check:</h2>
        <p className="text-sm mb-2">Try this URL in your browser:</p>
        <code className="bg-gray-100 p-2 block break-all text-xs">
          {process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/
        </code>
      </div>
    </div>
  )
}