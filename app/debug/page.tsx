import { cookies } from 'next/headers'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

export default async function DebugPage() {
  const cookieStore = await cookies()
  const supabase = getSupabaseServerClient(() => cookieStore)

  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Debug - Usuario</h1>
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      )
    }

    if (!data.user) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Debug - Usuario</h1>
          <p className="text-yellow-500">No hay usuario logueado</p>
        </div>
      )
    }

    const role =
      (data.user?.app_metadata as any)?.role ||
      (data.user?.user_metadata as any)?.role

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Debug - Usuario</h1>
        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {data.user.id}
          </p>
          <p>
            <strong>Email:</strong> {data.user.email}
          </p>
          <p>
            <strong>Role:</strong> {role || 'No definido'}
          </p>
          <p>
            <strong>Created:</strong> {data.user.created_at}
          </p>
          <details className="mt-4">
            <summary className="cursor-pointer font-semibold">
              App Metadata
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 text-sm overflow-auto">
              {JSON.stringify(data.user.app_metadata, null, 2)}
            </pre>
          </details>
          <details className="mt-4">
            <summary className="cursor-pointer font-semibold">
              User Metadata
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 text-sm overflow-auto">
              {JSON.stringify(data.user.user_metadata, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    )
  } catch (err) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Debug - Usuario</h1>
        <p className="text-red-500">Error inesperado: {String(err)}</p>
      </div>
    )
  }
}
