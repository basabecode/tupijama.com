import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  const auth = await requireUser()
  if (!auth.ok) return auth.response
  const user = auth.user!
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const auth = await requireUser()
  if (!auth.ok) return auth.response
  const user = auth.user!
  const body = await request.json()
  const items = Array.isArray(body.items) ? body.items : []
  const shipping_address = body.shipping_address ?? null
  const billing_address = body.billing_address ?? null
  if (!items.length)
    return NextResponse.json({ error: 'Items requeridos' }, { status: 400 })

  // Llamada a la función SQL atómica
  const { data, error } = await (supabase as any).rpc(
    'create_order_with_items',
    {
      p_user_id: user.id,
      p_items: items,
      p_shipping_address: shipping_address,
      p_billing_address: billing_address,
    }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ order_id: data })
}
