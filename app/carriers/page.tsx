'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Truck, Plus, Search, Phone, Mail } from 'lucide-react'

interface Carrier {
  id: string
  name: string
  mc_number: string | null
  dot_number: string | null
  email: string | null
  phone: string | null
  city: string | null
  state: string | null
  is_active: boolean
}

export default function CarriersPage() {
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchCarriers()
  }, [])

  const fetchCarriers = async () => {
    try {
      const { data, error } = await supabase
        .from('carriers')
        .select('*')
        .order('name')

      if (error) throw error
      setCarriers(data || [])
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load carriers',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredCarriers = carriers.filter(carrier =>
    carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.mc_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.dot_number?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex-1 p-8">
            <div>Loading carriers...</div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="flex-1 space-y-6 p-8 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Carriers</h2>
              <p className="text-muted-foreground">
                Manage your transportation providers
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Carrier
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search carriers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCarriers.map((carrier) => (
              <Card key={carrier.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{carrier.name}</CardTitle>
                    </div>
                    <Badge variant={carrier.is_active ? "default" : "secondary"}>
                      {carrier.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(carrier.mc_number || carrier.dot_number) && (
                    <div className="flex space-x-4 text-sm text-muted-foreground">
                      {carrier.mc_number && (
                        <span>MC: {carrier.mc_number}</span>
                      )}
                      {carrier.dot_number && (
                        <span>DOT: {carrier.dot_number}</span>
                      )}
                    </div>
                  )}
                  
                  {(carrier.city || carrier.state) && (
                    <div className="text-sm text-muted-foreground">
                      {carrier.city}{carrier.city && carrier.state && ", "}{carrier.state}
                    </div>
                  )}

                  <div className="space-y-2">
                    {carrier.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-3 w-3" />
                        <span>{carrier.phone}</span>
                      </div>
                    )}
                    {carrier.email && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-3 w-3" />
                        <span>{carrier.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Loads
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCarriers.length === 0 && (
            <div className="text-center py-12">
              <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No carriers found</h3>
              <p className="mt-2 text-muted-foreground">
                {searchTerm ? "Try adjusting your search" : "Get started by adding your first carrier"}
              </p>
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}