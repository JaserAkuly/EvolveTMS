'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/app/contexts/auth-context'
import { Plus, Search, Download } from 'lucide-react'
import Link from 'next/link'

interface Load {
  id: string
  load_number: string
  status: 'created' | 'tendered' | 'booked' | 'in_transit' | 'delivered' | 'closed'
  pickup_date: string | null
  delivery_date: string | null
  weight: number | null
  commodity: string | null
  rate: number | null
  origin: { name: string; city: string; state: string } | null
  destination: { name: string; city: string; state: string } | null
  shipper: { name: string } | null
  carrier: { name: string } | null
  created_at: string
}

export default function ShipmentsPage() {
  const { profile } = useAuth()
  const { toast } = useToast()
  const [loads, setLoads] = useState<Load[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    fetchLoads()
  }, [])

  const fetchLoads = async () => {
    try {
      const query = supabase
        .from('loads')
        .select(`
          *,
          origin:locations!loads_origin_id_fkey(name, city, state),
          destination:locations!loads_destination_id_fkey(name, city, state),
          shipper:shippers(name),
          carrier:carriers(name)
        `)
        .order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch shipments',
          variant: 'destructive',
        })
        return
      }

      setLoads(data || [])
    } catch (error) {
      console.error('Error fetching loads:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const updateLoadStatus = async (loadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('loads')
        .update({ status: newStatus })
        .eq('id', loadId)

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update shipment status',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Success',
        description: `Shipment status updated to ${newStatus}`,
      })

      // Refresh the loads
      fetchLoads()
    } catch (error) {
      console.error('Error updating load status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'tendered':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'booked':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'in_transit':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'delivered':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'closed':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const filteredLoads = loads.filter((load) => {
    const matchesSearch = 
      load.load_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.shipper?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.carrier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.commodity?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || load.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const exportToCSV = () => {
    const csvData = [
      ['Load Number', 'Status', 'Shipper', 'Carrier', 'Origin', 'Destination', 'Pickup Date', 'Delivery Date', 'Weight', 'Rate'],
      ...filteredLoads.map(load => [
        load.load_number,
        load.status,
        load.shipper?.name || '',
        load.carrier?.name || 'Unassigned',
        `${load.origin?.city}, ${load.origin?.state}`,
        `${load.destination?.city}, ${load.destination?.state}`,
        load.pickup_date || '',
        load.delivery_date || '',
        load.weight?.toString() || '',
        load.rate?.toString() || ''
      ])
    ]

    const csvContent = csvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shipments-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const getAvailableActions = (load: Load) => {
    const isAdmin = profile?.role === 'admin'
    const isCarrier = profile?.role === 'carrier'
    
    if (!isAdmin && !isCarrier) return []

    switch (load.status) {
      case 'created':
        return isAdmin ? ['tender'] : []
      case 'tendered':
        return isCarrier ? ['book', 'decline'] : []
      case 'booked':
        return isAdmin ? ['in_transit'] : []
      case 'in_transit':
        return isAdmin ? ['delivered'] : []
      case 'delivered':
        return isAdmin ? ['closed'] : []
      default:
        return []
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Shipments</h2>
            </div>
            <div className="grid gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
                      <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                      <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Shipments</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              {profile?.role === 'admin' && (
                <Button asChild>
                  <Link href="/shipments/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Shipment
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search shipments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="created">Created</SelectItem>
                    <SelectItem value="tendered">Tendered</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Shipments List */}
          <div className="grid gap-4">
            {filteredLoads.map((load) => (
              <Card key={load.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{load.load_number}</h3>
                        <Badge className={getStatusColor(load.status)}>
                          {load.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          <strong>Route:</strong> {load.origin?.city}, {load.origin?.state} → {load.destination?.city}, {load.destination?.state}
                        </p>
                        <p>
                          <strong>Shipper:</strong> {load.shipper?.name} • <strong>Carrier:</strong> {load.carrier?.name || 'Unassigned'}
                        </p>
                        {load.pickup_date && (
                          <p>
                            <strong>Pickup:</strong> {formatDate(load.pickup_date)}
                            {load.delivery_date && <> • <strong>Delivery:</strong> {formatDate(load.delivery_date)}</>}
                          </p>
                        )}
                        {load.commodity && (
                          <p><strong>Commodity:</strong> {load.commodity}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      {load.rate && (
                        <p className="text-lg font-semibold">{formatCurrency(load.rate)}</p>
                      )}
                      <div className="flex space-x-2">
                        {getAvailableActions(load).map((action) => (
                          <Button
                            key={action}
                            size="sm"
                            variant={action === 'decline' ? 'destructive' : 'default'}
                            onClick={() => {
                              if (action === 'decline') {
                                // For now, just set back to created
                                updateLoadStatus(load.id, 'created')
                              } else if (action === 'book') {
                                updateLoadStatus(load.id, 'booked')
                              } else if (action === 'tender') {
                                updateLoadStatus(load.id, 'tendered')
                              } else {
                                updateLoadStatus(load.id, action)
                              }
                            }}
                          >
                            {action === 'book' ? 'Accept' : action === 'tender' ? 'Tender' : action}
                          </Button>
                        ))}
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/shipments/${load.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredLoads.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No shipments match your search criteria.' 
                      : 'No shipments found. Create your first shipment to get started.'}
                  </p>
                  {profile?.role === 'admin' && !searchTerm && statusFilter === 'all' && (
                    <Button className="mt-4" asChild>
                      <Link href="/shipments/new">Create First Shipment</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}