import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not set properly')
    console.warn('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || 'NOT SET')
    console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '[SET]' : 'NOT SET')
    // Return a client with empty strings to avoid breaking the app completely
    // This will show connection errors but won't crash the app
  }
  
  return createBrowserClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
  )
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          role: 'admin' | 'carrier' | 'shipper' | 'viewer'
          company_name: string | null
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          role?: 'admin' | 'carrier' | 'shipper' | 'viewer'
          company_name?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          role?: 'admin' | 'carrier' | 'shipper' | 'viewer'
          company_name?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      carriers: {
        Row: {
          id: string
          name: string
          mc_number: string | null
          dot_number: string | null
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip: string | null
          country: string | null
          insurance_exp: string | null
          w9_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          mc_number?: string | null
          dot_number?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          country?: string | null
          insurance_exp?: string | null
          w9_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          mc_number?: string | null
          dot_number?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          country?: string | null
          insurance_exp?: string | null
          w9_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      shippers: {
        Row: {
          id: string
          name: string
          billing_contact: string | null
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip: string | null
          country: string | null
          payment_terms: number | null
          credit_limit: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          billing_contact?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          country?: string | null
          payment_terms?: number | null
          credit_limit?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          billing_contact?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          country?: string | null
          payment_terms?: number | null
          credit_limit?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          type: 'pickup' | 'delivery' | 'warehouse' | 'office'
          address: string
          city: string
          state: string
          zip: string
          country: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_email: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'pickup' | 'delivery' | 'warehouse' | 'office'
          address: string
          city: string
          state: string
          zip: string
          country?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'pickup' | 'delivery' | 'warehouse' | 'office'
          address?: string
          city?: string
          state?: string
          zip?: string
          country?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      loads: {
        Row: {
          id: string
          load_number: string
          origin_id: string | null
          destination_id: string | null
          shipper_id: string | null
          carrier_id: string | null
          pickup_date: string | null
          delivery_date: string | null
          weight: number | null
          pieces: number | null
          commodity: string | null
          equipment_type: string | null
          rate: number | null
          carrier_rate: number | null
          status: 'created' | 'tendered' | 'booked' | 'in_transit' | 'delivered' | 'closed'
          notes: string | null
          created_by: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          load_number: string
          origin_id?: string | null
          destination_id?: string | null
          shipper_id?: string | null
          carrier_id?: string | null
          pickup_date?: string | null
          delivery_date?: string | null
          weight?: number | null
          pieces?: number | null
          commodity?: string | null
          equipment_type?: string | null
          rate?: number | null
          carrier_rate?: number | null
          status?: 'created' | 'tendered' | 'booked' | 'in_transit' | 'delivered' | 'closed'
          notes?: string | null
          created_by?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          load_number?: string
          origin_id?: string | null
          destination_id?: string | null
          shipper_id?: string | null
          carrier_id?: string | null
          pickup_date?: string | null
          delivery_date?: string | null
          weight?: number | null
          pieces?: number | null
          commodity?: string | null
          equipment_type?: string | null
          rate?: number | null
          carrier_rate?: number | null
          status?: 'created' | 'tendered' | 'booked' | 'in_transit' | 'delivered' | 'closed'
          notes?: string | null
          created_by?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          load_id: string
          type: 'bol' | 'pod' | 'invoice' | 'rate_confirmation' | 'other'
          name: string
          url: string
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          load_id: string
          type: 'bol' | 'pod' | 'invoice' | 'rate_confirmation' | 'other'
          name: string
          url: string
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          load_id?: string
          type?: 'bol' | 'pod' | 'invoice' | 'rate_confirmation' | 'other'
          name?: string
          url?: string
          uploaded_by?: string | null
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          load_id: string | null
          shipper_id: string | null
          amount: number
          status: 'pending' | 'paid' | 'overdue' | 'cancelled'
          issued_at: string
          due_at: string | null
          paid_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          load_id?: string | null
          shipper_id?: string | null
          amount: number
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
          issued_at?: string
          due_at?: string | null
          paid_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          load_id?: string | null
          shipper_id?: string | null
          amount?: number
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
          issued_at?: string
          due_at?: string | null
          paid_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      settlements: {
        Row: {
          id: string
          load_id: string | null
          carrier_id: string | null
          carrier_payment: number
          status: 'pending' | 'paid' | 'overdue' | 'cancelled'
          paid_at: string | null
          check_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          load_id?: string | null
          carrier_id?: string | null
          carrier_payment: number
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
          paid_at?: string | null
          check_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          load_id?: string | null
          carrier_id?: string | null
          carrier_payment?: number
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
          paid_at?: string | null
          check_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          type: 'ar' | 'ap'
          reference_id: string | null
          reference_type: string | null
          amount: number
          description: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: 'ar' | 'ap'
          reference_id?: string | null
          reference_type?: string | null
          amount: number
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'ar' | 'ap'
          reference_id?: string | null
          reference_type?: string | null
          amount?: number
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'carrier' | 'shipper' | 'viewer'
      load_status: 'created' | 'tendered' | 'booked' | 'in_transit' | 'delivered' | 'closed'
      document_type: 'bol' | 'pod' | 'invoice' | 'rate_confirmation' | 'other'
      location_type: 'pickup' | 'delivery' | 'warehouse' | 'office'
      payment_status: 'pending' | 'paid' | 'overdue' | 'cancelled'
      journal_type: 'ar' | 'ap'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}