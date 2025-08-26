import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabaseServerClient } from '@/lib/supabaseServer'
import { requireUser } from '@/lib/auth'
import type { Database } from '@/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function GET() {
  const auth = await requireUser()
  if (!auth.ok) return auth.response
  const supabase = getSupabaseServerClient(cookies) as SupabaseClient<Database>
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const auth = await requireUser()
  if (!auth.ok) return auth.response
  const supabase = getSupabaseServerClient(cookies) as SupabaseClient<Database>
  const body = await request.json()
  const payload = {
    full_name: body.full_name ?? null,
    phone: body.phone ?? null,
    address_line1: body.address_line1 ?? null,
    address_line2: body.address_line2 ?? null,
    city: body.city ?? null,
    region: body.region ?? null,
    postal_code: body.postal_code ?? null,
    country: body.country ?? 'CO',
    is_default_shipping: !!body.is_default_shipping,
    is_default_billing: !!body.is_default_billing,
  }
  const { data, error } = await (supabase as any)
    .from('addresses')
    .insert(payload as Database['public']['Tables']['addresses']['Insert'])
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
