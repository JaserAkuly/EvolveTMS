'use client'

export default function EnvTestPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const testFetch = () => {
    console.log('URL:', supabaseUrl)
    console.log('Key:', supabaseKey)
    
    if (!supabaseUrl || !supabaseKey) {
      alert('Environment variables not set!')
      return
    }

    // Direct API call to test the credentials
    fetch(`${supabaseUrl}/rest/v1/profiles?select=*&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      }
    })
    .then(res => {
      console.log('Response status:', res.status)
      return res.json()
    })
    .then(data => {
      console.log('Data:', data)
      alert(`Response: ${JSON.stringify(data, null, 2)}`)
    })
    .catch(err => {
      console.error('Error:', err)
      alert(`Error: ${err.message}`)
    })
  }

  return (
    <div className="p-8 font-mono">
      <h1 className="text-2xl font-bold mb-4">Environment Test</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong></p>
        <p className="text-sm break-all">{supabaseUrl || 'NOT SET'}</p>
      </div>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong></p>
        <p className="text-sm break-all">{supabaseKey || 'NOT SET'}</p>
      </div>

      <button 
        onClick={testFetch}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Direct API Call
      </button>

      <div className="mt-4 text-sm text-gray-600">
        <p>Open DevTools Console (F12) to see logs</p>
      </div>
    </div>
  )
}