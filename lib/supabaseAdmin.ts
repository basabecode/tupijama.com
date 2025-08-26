// lib/supabaseAdmin.ts
// Este cliente se usa en el backend (API routes, server actions) para operaciones que requieren privilegios de administrador.
// Utiliza la service_role_key para saltar las políticas de RLS.

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  // No lanzamos un error aquí para no romper el build en entornos donde la clave no está presente (ej. el navegador).
  // En su lugar, las funciones que lo usen deben manejar el caso de que `supabaseAdmin` sea null.
  console.warn(
    'Supabase admin client not initialized. Service Role Key is missing.'
  )
}

export const supabaseAdmin = supabaseServiceKey
  ? createClient<Database>(supabaseUrl!, supabaseServiceKey)
  : null
