'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Location {
  id: string
  name: string
  city: string
  state: string
}

interface Shipper {
  id: string
  name: string
}

interface Carrier {
  id: string
  name: string
}

export default function NewShipmentPage() {
  const [formData, setFormData] = useState({
    loadNumber: '',
    originId: '',
    destinationId: '',
    shipperId: '',
    carrierId: '',
    pickupDate: '',
    deliveryDate: '',
    weight: '',
    pieces: '',
    commodity: '',
    equipmentType: '',
    rate: '',
    carrierRate: '',
    notes: ''
  })
  
  const [locations, setLocations] = useState<Location[]>([])
  const [shippers, setShippers] = useState<Shipper[]>([])
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      // Generate load number
      const loadNumber = `TMS-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
      setFormData(prev => ({ ...prev, loadNumber }))

      // Fetch locations, shippers, carriers
      const [locationsRes, shippersRes, carriersRes] = await Promise.all([
        supabase.from('locations').select('id, name, city, state'),
        supabase.from('shippers').select('id, name'),
        supabase.from('carriers').select('id, name')
      ])

      if (locationsRes.data) setLocations(locationsRes.data)
      if (shippersRes.data) setShippers(shippersRes.data)
      if (carriersRes.data) setCarriers(carriersRes.data)
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('loads').insert({
        load_number: formData.loadNumber,
        origin_id: formData.originId || null,
        destination_id: formData.destinationId || null,
        shipper_id: formData.shipperId || null,
        carrier_id: formData.carrierId || null,
        pickup_date: formData.pickupDate || null,
        delivery_date: formData.deliveryDate || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        pieces: formData.pieces ? parseInt(formData.pieces) : null,
        commodity: formData.commodity || null,
        equipment_type: formData.equipmentType || null,
        rate: formData.rate ? parseFloat(formData.rate) : null,
        carrier_rate: formData.carrierRate ? parseFloat(formData.carrierRate) : null,
        notes: formData.notes || null,
        status: 'created'
      })

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Shipment created successfully!'
      })

      router.push('/shipments')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
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

          <div>
            <h2 className="text-3xl font-bold tracking-tight">Create New Shipment</h2>
            <p className="text-muted-foreground">
              Add a new shipment to the system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="loadNumber">Load Number</Label>
                    <Input
                      id="loadNumber"
                      value={formData.loadNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, loadNumber: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="shipper">Shipper</Label>
                    <Select value={formData.shipperId} onValueChange={(value) => setFormData(prev => ({ ...prev, shipperId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shipper" />
                      </SelectTrigger>
                      <SelectContent>
                        {shippers.map((shipper) => (
                          <SelectItem key={shipper.id} value={shipper.id}>
                            {shipper.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="carrier">Carrier</Label>
                    <Select value={formData.carrierId} onValueChange={(value) => setFormData(prev => ({ ...prev, carrierId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select carrier (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {carriers.map((carrier) => (
                          <SelectItem key={carrier.id} value={carrier.id}>
                            {carrier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Route Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="origin">Origin</Label>
                    <Select value={formData.originId} onValueChange={(value) => setFormData(prev => ({ ...prev, originId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select origin" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name} - {location.city}, {location.state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Select value={formData.destinationId} onValueChange={(value) => setFormData(prev => ({ ...prev, destinationId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name} - {location.city}, {location.state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pickupDate">Pickup Date</Label>
                      <Input
                        id="pickupDate"
                        type="date"
                        value={formData.pickupDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, pickupDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryDate">Delivery Date</Label>
                      <Input
                        id="deliveryDate"
                        type="date"
                        value={formData.deliveryDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cargo Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Weight (lbs)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pieces">Pieces</Label>
                      <Input
                        id="pieces"
                        type="number"
                        value={formData.pieces}
                        onChange={(e) => setFormData(prev => ({ ...prev, pieces: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="commodity">Commodity</Label>
                    <Input
                      id="commodity"
                      value={formData.commodity}
                      onChange={(e) => setFormData(prev => ({ ...prev, commodity: e.target.value }))}
                      placeholder="e.g., Electronics, Automotive Parts"
                    />
                  </div>

                  <div>
                    <Label htmlFor="equipmentType">Equipment Type</Label>
                    <Select value={formData.equipmentType} onValueChange={(value) => setFormData(prev => ({ ...prev, equipmentType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dry Van">Dry Van</SelectItem>
                        <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                        <SelectItem value="Flatbed">Flatbed</SelectItem>
                        <SelectItem value="Step Deck">Step Deck</SelectItem>
                        <SelectItem value="Lowboy">Lowboy</SelectItem>
                        <SelectItem value="Tanker">Tanker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rate">Customer Rate ($)</Label>
                      <Input
                        id="rate"
                        type="number"
                        step="0.01"
                        value={formData.rate}
                        onChange={(e) => setFormData(prev => ({ ...prev, rate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="carrierRate">Carrier Rate ($)</Label>
                      <Input
                        id="carrierRate"
                        type="number"
                        step="0.01"
                        value={formData.carrierRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, carrierRate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Special instructions, handling requirements, etc."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/shipments">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Shipment'}
              </Button>
            </div>
          </form>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}