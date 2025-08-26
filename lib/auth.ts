// lib/auth.ts
// Guard temporal de administrador basado en un secreto en cabecera.
// Reemplazar luego por Supabase Auth (roles en app_metadata o tabla profiles).

import { cookies } from 'next/headers'
import { getSupabaseServerClient } from './supabaseServer'

export async function isAdminRequest(request: Request): Promise<boolean> {
  // 1) Intentar con sesión Supabase
  try {
    const cookieStore = await cookies()
    const supabase = getSupabaseServerClient(() => cookieStore)
    const { data } = await supabase.auth.getUser()
    const role =
      (data.user?.app_metadata as any)?.role ||
      (data.user?.user_metadata as any)?.role
    if (role === 'admin') return true
  } catch {}

  // 2) Fallback por cabecera secreta
  const headerSecret = request.headers.get('x-admin-secret')
  const adminSecret = process.env.ADMIN_SECRET
  if (adminSecret && headerSecret === adminSecret) return true

  return false
}

export async function requireAdmin(request: Request) {
  const ok = await isAdminRequest(request)
  if (!ok) {
    return {
      ok: false as const,
      response: new Response(
        JSON.stringify({ error: 'No autorizado: admin requerido.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      ),
    }
  }
  return { ok: true as const }
}

export async function requireUser() {
  const cookieStore = await cookies()
  const supabase = getSupabaseServerClient(() => cookieStore)
  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    return {
      ok: false as const,
      response: new Response(JSON.stringify({ error: 'No autenticado.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    }
  }
  return { ok: true as const, user: data.user }
}
