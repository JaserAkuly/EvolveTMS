'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Truck, 
  Building2, 
  Calendar, 
  Weight, 
  DollarSign,
  FileText,
  Edit,
  Download
} from 'lucide-react'
import Link from 'next/link'

interface LoadDetail {
  id: string
  load_number: string
  status: string
  pickup_date: string | null
  delivery_date: string | null
  weight: number | null
  pieces: number | null
  commodity: string | null
  equipment_type: string | null
  rate: number | null
  carrier_rate: number | null
  notes: string | null
  created_at: string
  updated_at: string
  origin: {
    id: string
    name: string
    address: string
    city: string
    state: string
    zip: string
    contact_name: string | null
    contact_phone: string | null
  } | null
  destination: {
    id: string
    name: string
    address: string
    city: string
    state: string
    zip: string
    contact_name: string | null
    contact_phone: string | null
  } | null
  shipper: {
    id: string
    name: string
    email: string | null
    phone: string | null
  } | null
  carrier: {
    id: string
    name: string
    email: string | null
    phone: string | null
    mc_number: string | null
    dot_number: string | null
  } | null
}

export default function ShipmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [load, setLoad] = useState<LoadDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (params.id) {
      fetchLoadDetail(params.id as string)
    }
  }, [params.id])

  const fetchLoadDetail = async (loadId: string) => {
    try {
      const { data, error } = await supabase
        .from('loads')
        .select(`
          *,
          origin:locations!loads_origin_id_fkey(*),
          destination:locations!loads_destination_id_fkey(*),
          shipper:shippers(*),
          carrier:carriers(*)
        `)
        .eq('id', loadId)
        .single()

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load shipment details',
          variant: 'destructive'
        })
        router.push('/shipments')
        return
      }

      setLoad(data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
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

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex-1 p-8">
            <div>Loading shipment details...</div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    )
  }

  if (!load) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex-1 p-8">
            <div>Shipment not found</div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="flex-1 space-y-6 p-8 pt-6">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/shipments">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Shipments
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-3xl font-bold tracking-tight">{load.load_number}</h2>
                <Badge className={getStatusColor(load.status)}>
                  {load.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Created {formatDate(load.created_at)}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Route Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Route Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-green-600 mb-2">ORIGIN</h4>
                  {load.origin ? (
                    <div className="space-y-1">
                      <div className="font-medium">{load.origin.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {load.origin.address}<br/>
                        {load.origin.city}, {load.origin.state} {load.origin.zip}
                      </div>
                      {load.origin.contact_name && (
                        <div className="text-sm">
                          <strong>Contact:</strong> {load.origin.contact_name}
                          {load.origin.contact_phone && ` • ${load.origin.contact_phone}`}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Not assigned</div>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm text-red-600 mb-2">DESTINATION</h4>
                  {load.destination ? (
                    <div className="space-y-1">
                      <div className="font-medium">{load.destination.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {load.destination.address}<br/>
                        {load.destination.city}, {load.destination.state} {load.destination.zip}
                      </div>
                      {load.destination.contact_name && (
                        <div className="text-sm">
                          <strong>Contact:</strong> {load.destination.contact_name}
                          {load.destination.contact_phone && ` • ${load.destination.contact_phone}`}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Not assigned</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Parties Involved */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Parties Involved</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">SHIPPER</h4>
                  {load.shipper ? (
                    <div className="space-y-1">
                      <div className="font-medium">{load.shipper.name}</div>
                      {load.shipper.email && (
                        <div className="text-sm text-muted-foreground">{load.shipper.email}</div>
                      )}
                      {load.shipper.phone && (
                        <div className="text-sm text-muted-foreground">{load.shipper.phone}</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Not assigned</div>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-2">CARRIER</h4>
                  {load.carrier ? (
                    <div className="space-y-1">
                      <div className="font-medium">{load.carrier.name}</div>
                      {(load.carrier.mc_number || load.carrier.dot_number) && (
                        <div className="text-sm text-muted-foreground">
                          {load.carrier.mc_number && `MC: ${load.carrier.mc_number}`}
                          {load.carrier.mc_number && load.carrier.dot_number && ' • '}
                          {load.carrier.dot_number && `DOT: ${load.carrier.dot_number}`}
                        </div>
                      )}
                      {load.carrier.email && (
                        <div className="text-sm text-muted-foreground">{load.carrier.email}</div>
                      )}
                      {load.carrier.phone && (
                        <div className="text-sm text-muted-foreground">{load.carrier.phone}</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Not assigned</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cargo & Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Cargo & Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Pickup Date</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(load.pickup_date)}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Delivery Date</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(load.delivery_date)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Commodity:</span>
                    <span className="text-sm font-medium">{load.commodity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Equipment:</span>
                    <span className="text-sm font-medium">{load.equipment_type || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Weight:</span>
                    <span className="text-sm font-medium">
                      {load.weight ? `${load.weight.toLocaleString()} lbs` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pieces:</span>
                    <span className="text-sm font-medium">{load.pieces || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Financial Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Customer Rate:</span>
                    <span className="text-lg font-semibold">{formatCurrency(load.rate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Carrier Cost:</span>
                    <span className="text-lg font-semibold">{formatCurrency(load.carrier_rate)}</span>
                  </div>
                  
                  {load.rate && load.carrier_rate && (
                    <>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Gross Margin:</span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(load.rate - load.carrier_rate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Margin %:</span>
                        <span className="text-sm font-medium">
                          {((load.rate - load.carrier_rate) / load.rate * 100).toFixed(1)}%
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {load.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Notes & Instructions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{load.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex space-x-2">
                <Button>Update Status</Button>
                <Button variant="outline">Add Document</Button>
                <Button variant="outline">Send Update</Button>
                <Button variant="outline">Create Invoice</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}