'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/app/contexts/auth-context'
import { Plus, Search, Download, Filter, Calendar, X } from 'lucide-react'
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
  const [carrierFilter, setCarrierFilter] = useState<string>('all')
  const [shipperFilter, setShipperFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [carriers, setCarriers] = useState<{id: string, name: string}[]>([])
  const [shippers, setShippers] = useState<{id: string, name: string}[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchLoads()
    fetchCarriers()
    fetchShippers()
  }, [])

  const fetchCarriers = async () => {
    const { data } = await supabase.from('carriers').select('id, name').order('name')
    if (data) setCarriers(data)
  }

  const fetchShippers = async () => {
    const { data } = await supabase.from('shippers').select('id, name').order('name')
    if (data) setShippers(data)
  }

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
    const matchesCarrier = carrierFilter === 'all' || load.carrier?.name === carrierFilter
    const matchesShipper = shipperFilter === 'all' || load.shipper?.name === shipperFilter
    
    let matchesDate = true
    if (dateFilter !== 'all' && load.pickup_date) {
      const pickupDate = new Date(load.pickup_date)
      const today = new Date()
      const daysDiff = Math.floor((pickupDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      switch (dateFilter) {
        case 'today':
          matchesDate = daysDiff === 0
          break
        case 'week':
          matchesDate = daysDiff >= 0 && daysDiff <= 7
          break
        case 'month':
          matchesDate = daysDiff >= 0 && daysDiff <= 30
          break
        case 'past':
          matchesDate = daysDiff < 0
          break
      }
    }

    return matchesSearch && matchesStatus && matchesCarrier && matchesShipper && matchesDate
  }).sort((a, b) => {
    let aValue: any = a[sortBy as keyof Load]
    let bValue: any = b[sortBy as keyof Load]
    
    if (sortBy === 'shipper') {
      aValue = a.shipper?.name || ''
      bValue = b.shipper?.name || ''
    }
    if (sortBy === 'carrier') {
      aValue = a.carrier?.name || ''
      bValue = b.carrier?.name || ''
    }
    if (sortBy === 'origin') {
      aValue = `${a.origin?.city}, ${a.origin?.state}` || ''
      bValue = `${b.origin?.city}, ${b.origin?.state}` || ''
    }
    if (sortBy === 'destination') {
      aValue = `${a.destination?.city}, ${a.destination?.state}` || ''
      bValue = `${b.destination?.city}, ${b.destination?.state}` || ''
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
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
    
    if (!isAdmin) return []

    switch (load.status) {
      case 'created':
        return ['tender']
      case 'tendered':
        return ['book', 'decline']
      case 'booked':
        return ['in_transit']
      case 'in_transit':
        return ['delivered']
      case 'delivered':
        return ['closed']
      default:
        return []
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <h2 className="text-3xl font-bold tracking-tight">Shipments</h2>
            </div>
            <div className="grid gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4 sm:p-6">
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
        <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <h2 className="text-3xl font-bold tracking-tight">Shipments</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportToCSV} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              {(
                <Button asChild size="sm" className="w-full sm:w-auto">
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
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle className="text-lg">Filters</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by load #, shipper, carrier, or commodity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {/* Status Filter */}
                  <div className="space-y-1">
                    <Label className="text-xs">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Statuses" />
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
                  
                  {/* Carrier Filter */}
                  <div className="space-y-1">
                    <Label className="text-xs">Carrier</Label>
                    <Select value={carrierFilter} onValueChange={setCarrierFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Carriers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Carriers</SelectItem>
                        {carriers.map(carrier => (
                          <SelectItem key={carrier.id} value={carrier.name}>
                            {carrier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Shipper Filter */}
                  <div className="space-y-1">
                    <Label className="text-xs">Shipper</Label>
                    <Select value={shipperFilter} onValueChange={setShipperFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Shippers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Shippers</SelectItem>
                        {shippers.map(shipper => (
                          <SelectItem key={shipper.id} value={shipper.name}>
                            {shipper.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Date Range Filter */}
                  <div className="space-y-1">
                    <Label className="text-xs">Date Range</Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Dates" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Dates</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Next 7 Days</SelectItem>
                        <SelectItem value="month">Next 30 Days</SelectItem>
                        <SelectItem value="past">Past Due</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Sort By */}
                  <div className="space-y-1">
                    <Label className="text-xs">Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created_at">Date Created</SelectItem>
                        <SelectItem value="pickup_date">Pickup Date</SelectItem>
                        <SelectItem value="delivery_date">Delivery Date</SelectItem>
                        <SelectItem value="load_number">Load Number</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="rate">Rate</SelectItem>
                        <SelectItem value="shipper">Shipper</SelectItem>
                        <SelectItem value="carrier">Carrier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {/* Active Filters Display */}
              {(statusFilter !== 'all' || carrierFilter !== 'all' || shipperFilter !== 'all' || dateFilter !== 'all') && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {statusFilter !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Status: {statusFilter}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter('all')} />
                    </Badge>
                  )}
                  {carrierFilter !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Carrier: {carrierFilter}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setCarrierFilter('all')} />
                    </Badge>
                  )}
                  {shipperFilter !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Shipper: {shipperFilter}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setShipperFilter('all')} />
                    </Badge>
                  )}
                  {dateFilter !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Date: {dateFilter}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setDateFilter('all')} />
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStatusFilter('all')
                      setCarrierFilter('all')
                      setShipperFilter('all')
                      setDateFilter('all')
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredLoads.length} of {loads.length} shipments
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'} Sort
            </Button>
          </div>

          {/* Shipments List */}
          <div className="grid gap-4">
            {filteredLoads.map((load) => (
              <Card key={load.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col space-y-3">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{load.load_number}</h3>
                        <Badge className={getStatusColor(load.status)}>
                          {load.status.replace('_', ' ')}
                        </Badge>
                        {load.rate && (
                          <span className="sm:hidden text-sm font-semibold">{formatCurrency(load.rate)}</span>
                        )}
                      </div>
                      {load.rate && (
                        <p className="hidden sm:block text-lg font-semibold">{formatCurrency(load.rate)}</p>
                      )}
                    </div>
                    
                    {/* Details Section */}
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="flex flex-col sm:block">
                        <span className="font-medium">Route:</span>
                        <span className="sm:ml-1">{load.origin?.city}, {load.origin?.state} → {load.destination?.city}, {load.destination?.state}</span>
                      </p>
                      <p className="flex flex-col sm:block">
                        <span className="font-medium">Shipper:</span>
                        <span className="sm:ml-1">{load.shipper?.name}</span>
                        <span className="sm:ml-1">• <span className="font-medium">Carrier:</span> {load.carrier?.name || 'Unassigned'}</span>
                      </p>
                      {load.pickup_date && (
                        <p className="flex flex-col sm:block">
                          <span className="font-medium">Pickup:</span>
                          <span className="sm:ml-1">{formatDate(load.pickup_date)}</span>
                          {load.delivery_date && (
                            <span className="sm:ml-1">• <span className="font-medium">Delivery:</span> {formatDate(load.delivery_date)}</span>
                          )}
                        </p>
                      )}
                      {load.commodity && (
                        <p className="flex flex-col sm:block">
                          <span className="font-medium">Commodity:</span>
                          <span className="sm:ml-1">{load.commodity}</span>
                        </p>
                      )}
                    </div>
                    
                    {/* Actions Section */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t">
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
                          <Link href={`/shipments/${load.id}`}>View Details</Link>
                        </Button>
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
                  {!searchTerm && statusFilter === 'all' && (
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