'use client'

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestDBPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [currentTest, setCurrentTest] = useState('')
  const supabase = createClient()

  const runTests = async () => {
    console.log('Starting tests...')
    setLoading(true)
    setResults({})
    const testResults: any = {}

    try {
      // Test 1: Check auth session
      setCurrentTest('Testing authentication...')
      console.log('Testing auth...')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('Auth result:', { session, sessionError })
      testResults.auth = {
        success: !!session,
        user: session?.user?.email || 'No user',
        error: sessionError?.message
      }

      // Test 2: Check profiles table
      setCurrentTest('Testing profiles table...')
      console.log('Testing profiles...')
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .single()
      console.log('Profiles result:', { profile, profileError })
      
      testResults.profiles = {
        success: !!profile,
        data: profile,
        error: profileError?.message
      }

      // Test 3: Check locations table
      setCurrentTest('Testing locations table...')
      console.log('Testing locations...')
      const { data: locations, error: locationsError } = await supabase
        .from('locations')
        .select('*')
        .limit(5)
      console.log('Locations result:', { locations, locationsError })
      
      testResults.locations = {
        success: !!locations,
        count: locations?.length || 0,
        error: locationsError?.message
      }

      // Test 4: Check shippers table
      const { data: shippers, error: shippersError } = await supabase
        .from('shippers')
        .select('*')
        .limit(5)
      
      testResults.shippers = {
        success: !!shippers,
        count: shippers?.length || 0,
        error: shippersError?.message
      }

      // Test 5: Check carriers table
      const { data: carriers, error: carriersError } = await supabase
        .from('carriers')
        .select('*')
        .limit(5)
      
      testResults.carriers = {
        success: !!carriers,
        count: carriers?.length || 0,
        error: carriersError?.message
      }

      // Test 6: Check loads table
      const { data: loads, error: loadsError } = await supabase
        .from('loads')
        .select('*')
        .limit(5)
      
      testResults.loads = {
        success: !!loads,
        count: loads?.length || 0,
        error: loadsError?.message
      }

      // Test 7: Check complex query (loads with relations)
      const { data: loadsWithRelations, error: complexError } = await supabase
        .from('loads')
        .select(`
          *,
          origin:locations!loads_origin_id_fkey(name, city, state),
          destination:locations!loads_destination_id_fkey(name, city, state),
          shipper:shippers(name),
          carrier:carriers(name)
        `)
        .limit(5)
      
      testResults.complexQuery = {
        success: !!loadsWithRelations,
        count: loadsWithRelations?.length || 0,
        error: complexError?.message
      }

      // Test 8: Check invoices table
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .limit(5)
      
      testResults.invoices = {
        success: !!invoices,
        count: invoices?.length || 0,
        error: invoicesError?.message
      }

    } catch (error: any) {
      console.error('General error:', error)
      testResults.generalError = error.message
    }

    console.log('All test results:', testResults)
    setResults(testResults)
    setLoading(false)
    setCurrentTest('')
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>
      
      <div className="mb-4">
        <Button onClick={runTests} disabled={loading}>
          {loading ? 'Running Tests...' : 'Re-run Tests'}
        </Button>
        {currentTest && (
          <p className="mt-2 text-sm text-muted-foreground">{currentTest}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(results).map(([key, value]: [string, any]) => (
          <Card key={key} className={value.success === false ? 'border-red-500' : ''}>
            <CardHeader>
              <CardTitle className="text-lg">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto bg-muted p-2 rounded">
                {JSON.stringify(value, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto bg-muted p-2 rounded">
              {JSON.stringify({
                NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
                NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Not Set'
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}