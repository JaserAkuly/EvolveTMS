'use client'

export default function EnvDebugPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Debug</h1>
      <div className="space-y-2 font-mono text-sm">
        <p>
          <strong>SUPABASE_URL:</strong> {supabaseUrl || 'NOT SET'}
        </p>
        <p>
          <strong>SUPABASE_KEY:</strong> {supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET'}
        </p>
        <p>
          <strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'NOT SET'}
        </p>
      </div>
    </div>
  )
}