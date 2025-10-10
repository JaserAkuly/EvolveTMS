'use client'

export default function DebugPage() {
  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Environment Debug</h1>
        
        <div className="bg-card p-4 rounded-lg border">
          <h2 className="font-semibold mb-2">Environment Variables:</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <span className="text-muted-foreground">NEXT_PUBLIC_SUPABASE_URL:</span>
              <br />
              <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-500' : 'text-red-500'}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'}
              </span>
            </div>
            
            <div>
              <span className="text-muted-foreground">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              <br />
              <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-500' : 'text-red-500'}>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '[SET - HIDDEN]' : 'NOT SET'}
              </span>
            </div>
            
            <div>
              <span className="text-muted-foreground">NEXT_PUBLIC_APP_URL:</span>
              <br />
              <span className={process.env.NEXT_PUBLIC_APP_URL ? 'text-green-500' : 'text-red-500'}>
                {process.env.NEXT_PUBLIC_APP_URL || 'NOT SET'}
              </span>
            </div>
            
            <div>
              <span className="text-muted-foreground">NODE_ENV:</span>
              <br />
              <span className="text-blue-500">
                {process.env.NODE_ENV}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h2 className="font-semibold mb-2">Expected Values:</h2>
          <div className="space-y-2 font-mono text-sm text-muted-foreground">
            <p>NEXT_PUBLIC_SUPABASE_URL = https://dmccydifdtkjlpmfgphg.supabase.co</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY = [Your anon key]</p>
            <p>NEXT_PUBLIC_APP_URL = [Your Vercel URL]</p>
          </div>
        </div>
        
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
          <p className="text-sm">
            <strong>Note:</strong> If variables show as &quot;NOT SET&quot;, they need to be added in Vercel Project Settings → Environment Variables
          </p>
        </div>
      </div>
    </div>
  )
}