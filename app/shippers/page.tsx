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
import { Building2, Plus, Search, Phone, Mail, DollarSign, Calendar, Edit2, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Shipper {
  id: string
  name: string
  billing_contact: string | null
  email: string | null
  phone: string | null
  city: string | null
  state: string | null
  payment_terms: number | null
  credit_limit: number | null
  is_active: boolean
}

export default function ShippersPage() {
  const [shippers, setShippers] = useState<Shipper[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchShippers()
  }, [])

  const fetchShippers = async () => {
    try {
      const { data, error } = await supabase
        .from('shippers')
        .select('*')
        .order('name')

      if (error) throw error
      setShippers(data || [])
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load shippers',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const filteredShippers = shippers.filter(shipper =>
    shipper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipper.billing_contact?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex-1 p-8">
            <div>Loading shippers...</div>
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
              <h2 className="text-3xl font-bold tracking-tight">Shippers</h2>
              <p className="text-muted-foreground">
                Manage your customers and shipping clients
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Shipper
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shippers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredShippers.map((shipper) => (
              <Card key={shipper.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{shipper.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={shipper.is_active ? "default" : "secondary"}>
                        {shipper.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast({ title: "Edit", description: `Edit functionality for ${shipper.name} coming soon!` })}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={async () => {
                              const { error } = await supabase
                                .from('shippers')
                                .update({ is_active: !shipper.is_active })
                                .eq('id', shipper.id)
                              
                              if (error) {
                                toast({ 
                                  title: 'Error',
                                  description: 'Failed to update shipper status',
                                  variant: 'destructive'
                                })
                              } else {
                                toast({ 
                                  title: 'Success',
                                  description: `${shipper.name} status updated`
                                })
                                fetchShippers()
                              }
                            }}
                          >
                            {shipper.is_active ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {shipper.billing_contact && (
                    <p className="text-sm text-muted-foreground">
                      Contact: {shipper.billing_contact}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {(shipper.city || shipper.state) && (
                    <div className="text-sm text-muted-foreground">
                      {shipper.city}{shipper.city && shipper.state && ", "}{shipper.state}
                    </div>
                  )}

                  <div className="space-y-2">
                    {shipper.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-3 w-3" />
                        <span>{shipper.phone}</span>
                      </div>
                    )}
                    {shipper.email && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-3 w-3" />
                        <span>{shipper.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {shipper.payment_terms && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{shipper.payment_terms} days</span>
                      </div>
                    )}
                    {shipper.credit_limit && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span>{formatCurrency(shipper.credit_limit)}</span>
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

          {filteredShippers.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No shippers found</h3>
              <p className="mt-2 text-muted-foreground">
                {searchTerm ? "Try adjusting your search" : "Get started by adding your first shipper"}
              </p>
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}