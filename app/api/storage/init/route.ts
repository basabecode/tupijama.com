import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: Request) {
  const guard = await requireAdmin(request)
  if (!guard.ok) return guard.response
  if (!supabaseAdmin)
    return NextResponse.json({ error: 'No admin client' }, { status: 500 })
  // Nota: La creación de bucket vía API de storage admin no está disponible en supabase-js 2 directamente.
  // En producción, crea el bucket `product-images` desde el dashboard.
  return NextResponse.json({
    ok: true,
    note: 'Crea bucket product-images en dashboard si no existe',
  })
}
