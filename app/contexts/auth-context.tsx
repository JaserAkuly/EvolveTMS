'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

interface Profile {
  id: string
  email: string
  display_name: string | null
  role: 'admin' | 'carrier' | 'shipper' | 'viewer'
  company_name: string | null
  phone: string | null
  is_active: boolean
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('Profile fetch result:', { data, error })

      if (error || !data) {
        console.error('Error fetching profile or no data:', error)
        // Return a default profile structure if fetch fails
        return {
          id: userId,
          email: '',
          display_name: null,
          role: 'admin' as const,
          company_name: null,
          phone: null,
          is_active: true
        }
      }

      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Return a default profile structure if fetch fails
      return {
        id: userId,
        email: '',
        display_name: null,
        role: 'admin' as const,
        company_name: null,
        phone: null,
        is_active: true
      }
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }

  useEffect(() => {
    const getSession = async () => {
      try {
        console.log('Getting initial session...')
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Initial session:', session?.user?.email || 'No user')
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('Fetching profile for initial session...')
          const profileData = await fetchProfile(session.user.id)
          console.log('Profile data received:', profileData)
          setProfile(profileData)
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }

    getSession()

    // Backup timeout to ensure loading never stays true forever
    const loadingTimeout = setTimeout(() => {
      console.log('Forcing loading to false after timeout')
      setLoading(false)
    }, 3000) // Reduced to 3 seconds for better UX

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No user')
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('Fetching profile for auth state change...')
          const profileData = await fetchProfile(session.user.id)
          console.log('Profile data from auth change:', profileData)
          setProfile(profileData)
        } else {
          setProfile(null)
        }
        
        console.log('Setting loading to false from auth change')
        setLoading(false)
        clearTimeout(loadingTimeout)
      }
    )

    return () => {
      subscription.unsubscribe()
      clearTimeout(loadingTimeout)
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const value = {
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}