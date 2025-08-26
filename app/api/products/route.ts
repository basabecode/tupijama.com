// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { ProductSchema } from '@/lib/schemas'
import { requireAdmin } from '@/lib/auth'
import { isAdminRequest } from '@/lib/auth'
import type { Database } from '@/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtiene una lista de productos activos.
 *     description: Retorna una lista de todos los productos cuyo estado es 'active'.
 *     responses:
 *       200:
 *         description: Una lista de productos.
 *       500:
 *         description: Error del servidor.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = Math.min(Number(searchParams.get('pageSize') ?? '12'), 50)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const category = searchParams.get('category')
  const q = searchParams.get('q')
  const featured = searchParams.get('featured')
  const includeAll = searchParams.get('includeAll') === 'true'

  let query = supabase.from('products').select('*', { count: 'exact' })
  // Solo productos activos para público, salvo admin con includeAll
  const isAdmin = includeAll ? await isAdminRequest(request) : false
  if (!isAdmin) {
    query = query.eq('status', 'active')
  }
  if (category) query = query.eq('category', category)
  if (featured === 'true') query = query.eq('is_featured', true)
  if (q) query = query.ilike('name', `%${q}%`)

  query = query.order('created_at', { ascending: false }).range(from, to)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: data, page, pageSize, total: count ?? 0 })
}

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto.
 *     description: Endpoint protegido para crear un nuevo producto. Requiere rol de administrador.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente.
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
export async function POST(request: Request) {
  // Protección temporal de admin mediante cabecera secreta
  const guard = await requireAdmin(request)
  if (!guard.ok) return guard.response

  if (!supabaseAdmin) {
    return NextResponse.json(
      {
        error:
          'Admin client not initialized. Check server environment variables.',
      },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const validation = ProductSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      )
    }

    const input = validation.data
    const payload: Database['public']['Tables']['products']['Insert'] = {
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      stock: input.stock,
      category: input.category ?? null,
      sizes:
        (input.sizes as unknown as Database['public']['Tables']['products']['Insert']['sizes']) ??
        null,
      colors:
        (input.colors as unknown as Database['public']['Tables']['products']['Insert']['colors']) ??
        null,
      images:
        (input.images as unknown as Database['public']['Tables']['products']['Insert']['images']) ??
        null,
      is_featured: input.is_featured,
      status: input.status,
    }

    const client = supabaseAdmin as SupabaseClient<Database>
    const { data, error } = await (client.from('products') as any)
      .insert([payload] as any)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (e) {
    const error = e as Error
    console.error('Request error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
