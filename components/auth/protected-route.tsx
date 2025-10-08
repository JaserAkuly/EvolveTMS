'use client'

import { useAuth } from '@/app/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'carrier' | 'shipper' | 'viewer'
  allowedRoles?: ('admin' | 'carrier' | 'shipper' | 'viewer')[]
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  allowedRoles 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (!loading && user && profile) {
      // Check role-based access
      if (requiredRole && profile.role !== requiredRole) {
        router.push('/dashboard')
        return
      }

      if (allowedRoles && !allowedRoles.includes(profile.role)) {
        router.push('/dashboard')
        return
      }
    }
  }, [user, profile, loading, router, requiredRole, allowedRoles])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex h-16 items-center px-4">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return <>{children}</>
}