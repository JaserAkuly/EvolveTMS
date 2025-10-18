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
import { MapPin, Plus, Search, Phone, Mail, Building } from 'lucide-react'

interface Location {
  id: string
  name: string
  type: 'pickup' | 'delivery' | 'warehouse' | 'office'
  address: string
  city: string
  state: string
  zip: string
  contact_name: string | null
  contact_phone: string | null
  contact_email: string | null
  notes: string | null
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name')

      if (error) throw error
      setLocations(data || [])
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load locations',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pickup':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'delivery':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'warehouse':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'office':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex-1 p-8">
            <div>Loading locations...</div>
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
              <h2 className="text-3xl font-bold tracking-tight">Locations</h2>
              <p className="text-muted-foreground">
                Manage pickup, delivery, and warehouse locations
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLocations.map((location) => (
              <Card key={location.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                    </div>
                    <Badge className={getTypeColor(location.type)}>
                      {location.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div className="flex items-start space-x-2">
                      <Building className="h-3 w-3 mt-1 text-muted-foreground" />
                      <div>
                        <div>{location.address}</div>
                        <div>{location.city}, {location.state} {location.zip}</div>
                      </div>
                    </div>
                  </div>

                  {location.contact_name && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Contact Information</h4>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{location.contact_name}</div>
                        {location.contact_phone && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-3 w-3" />
                            <span>{location.contact_phone}</span>
                          </div>
                        )}
                        {location.contact_email && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-3 w-3" />
                            <span>{location.contact_email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {location.notes && (
                    <div className="p-2 bg-muted rounded text-sm">
                      <strong>Notes:</strong> {location.notes}
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Shipments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No locations found</h3>
              <p className="mt-2 text-muted-foreground">
                {searchTerm ? "Try adjusting your search" : "Get started by adding your first location"}
              </p>
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}