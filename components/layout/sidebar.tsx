'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/contexts/auth-context'
import {
  LayoutDashboard,
  Truck,
  Building2,
  Package,
  BarChart3,
  Settings,
  MapPin,
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: ('admin' | 'viewer')[]
}

interface SidebarProps {
  onNavigate?: () => void
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin'],
  },
  {
    title: 'Shipments',
    href: '/shipments',
    icon: Package,
    roles: ['admin'],
  },
  {
    title: 'Carriers',
    href: '/carriers',
    icon: Truck,
    roles: ['admin'],
  },
  {
    title: 'Shippers',
    href: '/shippers',
    icon: Building2,
    roles: ['admin'],
  },
  {
    title: 'Locations',
    href: '/locations',
    icon: MapPin,
    roles: ['admin'],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['admin'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['admin'],
  },
]

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const { profile } = useAuth()

  const filteredNavItems = navItems

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Evolve TMS
            </h2>
          </div>
          <div className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-secondary/80'
                  )}
                  asChild
                >
                  <Link href={item.href} onClick={onNavigate}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}