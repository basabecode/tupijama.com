// types/database.ts
// Este archivo se puede autogenerar en el futuro con `supabase gen types typescript > types/database.ts`
// Por ahora, lo definimos manualmente basado en schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          price: number
          stock: number
          category: string | null
          sizes: Json | null
          colors: Json | null
          images: Json | null
          is_featured: boolean
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          price: number
          stock?: number
          category?: string | null
          sizes?: Json | null
          colors?: Json | null
          images?: Json | null
          is_featured?: boolean
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          price?: number
          stock?: number
          category?: string | null
          sizes?: Json | null
          colors?: Json | null
          images?: Json | null
          is_featured?: boolean
          status?: string
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          user_id: string
          total: number
          status: string
          shipping_address: Json | null
          billing_address: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          total: number
          status?: string
          shipping_address?: Json | null
          billing_address?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          total?: number
          status?: string
          shipping_address?: Json | null
          billing_address?: Json | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          size: string | null
          color: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          size?: string | null
          color?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          size?: string | null
          color?: string | null
        }
      }
      addresses: {
        Row: {
          id: string
          created_at: string
          user_id: string
          full_name: string | null
          phone: string | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          region: string | null
          postal_code: string | null
          country: string | null
          is_default_shipping: boolean
          is_default_billing: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string
          full_name?: string | null
          phone?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          region?: string | null
          postal_code?: string | null
          country?: string | null
          is_default_shipping?: boolean
          is_default_billing?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          full_name?: string | null
          phone?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          region?: string | null
          postal_code?: string | null
          country?: string | null
          is_default_shipping?: boolean
          is_default_billing?: boolean
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
