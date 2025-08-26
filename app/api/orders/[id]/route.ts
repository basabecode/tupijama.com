import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireUser()
  if (!auth.ok) return auth.response
  const user = auth.user!
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}
