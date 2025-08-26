import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { requireAdmin } from '@/lib/auth'
import { ProductUpdateSchema } from '@/lib/schemas'
import { isAdminRequest } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const includeAll =
    new URL(request.url).searchParams.get('includeAll') === 'true'
  const isAdmin = includeAll ? await isAdminRequest(request) : false
  let query = supabase.from('products').select('*').eq('id', id)
  if (!isAdmin) query = query.eq('status', 'active')
  const { data, error } = await query.single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request)
  if (!guard.ok) return guard.response

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Admin client not initialized.' },
      { status: 500 }
    )
  }

  const { id } = await params
  const body = await request.json()
  const validation = ProductUpdateSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.format() },
      { status: 400 }
    )
  }

  const { data, error } = await (supabaseAdmin as any)
    .from('products')
    .update(validation.data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request)
  if (!guard.ok) return guard.response

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Admin client not initialized.' },
      { status: 500 }
    )
  }

  const { id } = await params
  const { error } = await (supabaseAdmin as any)
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
