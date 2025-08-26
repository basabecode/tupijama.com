import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  const checks: Record<string, any> = {}

  // Variables de entorno
  checks.env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  // Conexión básica a BD (tabla products)
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1)
    checks.db = {
      ok: !error,
      error: error?.message ?? null,
      sampleCount: data?.length ?? 0,
    }
  } catch (e: any) {
    checks.db = { ok: false, error: e?.message || String(e) }
  }

  // Buckets de storage
  try {
    if (!supabaseAdmin) throw new Error('No admin client')
    const { data: buckets, error } = await supabaseAdmin.storage.listBuckets()
    const hasProductImages = (buckets || []).some(
      b => b.name === 'product-images'
    )
    checks.storage = {
      ok: !error,
      error: error?.message ?? null,
      hasProductImages,
    }
  } catch (e: any) {
    checks.storage = { ok: false, error: e?.message || String(e) }
  }

  // Auth Admin (requiere service_role)
  try {
    if (!supabaseAdmin) throw new Error('No admin client')
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    })
    checks.authAdmin = {
      ok: !error,
      error: error?.message ?? null,
      userSample: data?.users?.length ?? 0,
    }
  } catch (e: any) {
    checks.authAdmin = { ok: false, error: e?.message || String(e) }
  }

  return NextResponse.json({ ok: true, checks })
}
