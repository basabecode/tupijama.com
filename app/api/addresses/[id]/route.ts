import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabaseServerClient } from '@/lib/supabaseServer'
import { requireUser } from '@/lib/auth'
import type { Database } from '@/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireUser()
  if (!auth.ok) return auth.response
  const supabase = getSupabaseServerClient(cookies) as SupabaseClient<Database>
  const body = await request.json()
  const payload: Database['public']['Tables']['addresses']['Update'] = {
    full_name: body.full_name ?? undefined,
    phone: body.phone ?? undefined,
    address_line1: body.address_line1 ?? undefined,
    address_line2: body.address_line2 ?? undefined,
    city: body.city ?? undefined,
    region: body.region ?? undefined,
    postal_code: body.postal_code ?? undefined,
    country: body.country ?? undefined,
    is_default_shipping:
      typeof body.is_default_shipping === 'boolean'
        ? body.is_default_shipping
        : undefined,
    is_default_billing:
      typeof body.is_default_billing === 'boolean'
        ? body.is_default_billing
        : undefined,
  }
  const { data, error } = await (supabase as any)
    .from('addresses')
    .update(payload)
    .eq('id', params.id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireUser()
  if (!auth.ok) return auth.response
  const supabase = getSupabaseServerClient(cookies) as SupabaseClient<Database>
  const { error } = await (supabase as any)
    .from('addresses')
    .delete()
    .eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
