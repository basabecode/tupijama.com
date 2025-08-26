import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getSupabaseServerClient } from '@/lib/supabaseServer'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const supabase = await getSupabaseServerClient(() => cookieStore)
  const { data } = await supabase.auth.getUser()
  const role =
    (data.user?.app_metadata as any)?.role ||
    (data.user?.user_metadata as any)?.role
  if (role !== 'admin') redirect('/login?next=/admin')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">Panel de administración</div>
          <nav className="flex items-center gap-2">
            <Link
              href="/admin/products"
              className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50"
            >
              Productos
            </Link>
            <Link
              href="/admin/products/new"
              className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50"
            >
              Nuevo
            </Link>
            <Link
              href="/"
              className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50"
            >
              Ver tienda
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
