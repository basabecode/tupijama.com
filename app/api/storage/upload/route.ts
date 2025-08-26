import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.*?);base64,(.*)$/)
  if (!match) return null
  const mime = match[1]
  const base64 = match[2]
  const bytes = Buffer.from(base64, 'base64')
  return { mime, bytes }
}

export async function POST(request: Request) {
  const guard = await requireAdmin(request)
  if (!guard.ok) return guard.response
  if (!supabaseAdmin)
    return NextResponse.json({ error: 'No admin client' }, { status: 500 })

  const { file, filename } = await request.json()
  if (!file || !filename)
    return NextResponse.json(
      { error: 'file y filename requeridos' },
      { status: 400 }
    )
  const parsed = parseDataUrl(file)
  if (!parsed)
    return NextResponse.json(
      { error: 'Formato base64 inválido' },
      { status: 400 }
    )

  const bucket = 'product-images'
  const path = `${Date.now()}-${filename}`
  const { data, error } = await (supabaseAdmin as any).storage
    .from(bucket)
    .upload(path, parsed.bytes, {
      contentType: parsed.mime,
      upsert: false,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: pub } = (supabaseAdmin as any).storage
    .from(bucket)
    .getPublicUrl(path)
  return NextResponse.json({ path: data?.path, publicUrl: pub?.publicUrl })
}
