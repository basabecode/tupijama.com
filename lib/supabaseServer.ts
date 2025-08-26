// lib/supabaseServer.ts
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function getSupabaseServerClient(
  getCookies: () =>
    | {
        get: (name: string) => { value?: string } | undefined
        set: (name: string, value: string, options: any) => void
      }
    | any
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local (server)'
    )
  }
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async get(name: string) {
        const c = getCookies()
        return c.get(name)?.value
      },
      async set(name: string, value: string, opts: any) {
        const c = getCookies()
        c.set(name, value, opts)
      },
      async remove(name: string, opts: any) {
        const c = getCookies()
        c.set(name, '', { ...opts, expires: new Date(0) })
      },
    },
  })
}
