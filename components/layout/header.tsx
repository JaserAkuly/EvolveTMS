'use client'

import { Bell, User, Package, FileText, DollarSign, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/app/contexts/auth-context'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface HeaderProps {
  onMobileMenuOpen?: () => void
}

export function Header({ onMobileMenuOpen }: HeaderProps) {
  const { profile, signOut } = useAuth()
  const router = useRouter()
  const [notifications] = useState([
    { id: 1, type: 'shipment', message: 'Load #2024-001 has been delivered', time: '2 hours ago', icon: Package },
    { id: 2, type: 'document', message: 'POD uploaded for Load #2024-003', time: '5 hours ago', icon: FileText },
    { id: 3, type: 'payment', message: 'Invoice #INV-001 has been paid', time: '1 day ago', icon: DollarSign },
  ])

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-500'
      case 'carrier':
        return 'bg-blue-500/10 text-blue-500'
      case 'shipper':
        return 'bg-green-500/10 text-green-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 lg:px-6">
        {/* Mobile menu button - always visible on mobile */}
        <Button
          variant="outline"
          size="icon"
          className="md:hidden mr-4 h-10 w-10"
          onClick={onMobileMenuOpen}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
        
        {/* Logo/Title for mobile */}
        <div className="flex flex-1 items-center">
          <h1 className="text-lg font-semibold md:hidden">Evolve TMS</h1>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => {
                const Icon = notification.icon
                return (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex items-start space-x-2 p-3 cursor-pointer hover:bg-accent"
                    onClick={() => {
                      if (notification.type === 'shipment') router.push('/shipments')
                      else if (notification.type === 'payment') router.push('/reports')
                    }}
                  >
                    <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm leading-none">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </DropdownMenuItem>
                )
              })}
              {notifications.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No new notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    {profile?.display_name?.[0] || profile?.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profile?.display_name || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile?.email}
                  </p>
                  <Badge
                    variant="secondary"
                    className={cn('w-fit text-xs', getRoleColor(profile?.role || ''))}
                  >
                    {profile?.role?.toUpperCase()}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

// Helper function for className merging
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}