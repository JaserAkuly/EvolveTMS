'use client'

import { useAuth } from '@/app/contexts/auth-context'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import {
  Package,
  Truck,
  Building2,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

interface Load {
  id: string
  load_number: string
  status: string
  rate: number | null
  origin: { city: string; state: string } | null
  destination: { city: string; state: string } | null
  shipper: { name: string } | null
  carrier: { name: string } | null
}

interface DashboardStats {
  totalLoads: number
  activeLoads: number
  completedLoads: number
  pendingInvoices: number
  totalRevenue: number
  outstandingAR: number
  recentLoads: Load[]
}

export default function DashboardPage() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalLoads: 0,
    activeLoads: 0,
    completedLoads: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
    outstandingAR: 0,
    recentLoads: [],
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch loads data
        const { data: loads } = await supabase
          .from('loads')
          .select(`
            *,
            origin:locations!loads_origin_id_fkey(name, city, state),
            destination:locations!loads_destination_id_fkey(name, city, state),
            shipper:shippers(name),
            carrier:carriers(name)
          `)
          .order('created_at', { ascending: false })

        // Fetch invoices data
        const { data: invoices } = await supabase
          .from('invoices')
          .select('*')

        if (loads) {
          const activeLoads = loads.filter(load => 
            ['created', 'tendered', 'booked', 'in_transit'].includes(load.status)
          ).length
          
          const completedLoads = loads.filter(load => 
            ['delivered', 'closed'].includes(load.status)
          ).length

          const totalRevenue = loads
            .filter(load => load.status === 'closed' && load.rate)
            .reduce((sum, load) => sum + (load.rate || 0), 0)

          setStats({
            totalLoads: loads.length,
            activeLoads,
            completedLoads,
            pendingInvoices: invoices?.filter(inv => inv.status === 'pending').length || 0,
            totalRevenue,
            outstandingAR: invoices?.filter(inv => inv.status === 'pending')
              .reduce((sum, inv) => sum + inv.amount, 0) || 0,
            recentLoads: loads.slice(0, 5),
          })
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
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
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                {getGreeting()}, {profile?.display_name || profile?.email?.split('@')[0]}!
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button asChild>
                <Link href="/shipments/new">Create Shipment</Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLoads}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeLoads} active, {stats.completedLoads} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Loads</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeLoads}</div>
                <p className="text-xs text-muted-foreground">
                  In progress shipments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  From closed shipments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding A/R</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.outstandingAR)}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingInvoices} pending invoices
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Shipments */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Shipments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentLoads.map((load) => (
                    <Link key={load.id} href={`/shipments/${load.id}`}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{load.load_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {load.origin?.city}, {load.origin?.state} → {load.destination?.city}, {load.destination?.state}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {load.shipper?.name} • {load.carrier?.name || 'Unassigned'}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge className={getStatusColor(load.status)}>
                            {load.status.replace('_', ' ')}
                          </Badge>
                          {load.rate && (
                            <p className="text-sm font-medium">{formatCurrency(load.rate)}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {stats.recentLoads.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No shipments found. Create your first shipment to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/shipments/new">
                    <Package className="mr-2 h-4 w-4" />
                    Create New Shipment
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/carriers">
                    <Truck className="mr-2 h-4 w-4" />
                    Manage Carriers
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/shippers">
                    <Building2 className="mr-2 h-4 w-4" />
                    Manage Shippers
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/reports">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Reports
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}