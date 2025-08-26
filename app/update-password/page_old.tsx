'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabaseBrowser'

export default function UpdatePasswordPage() {
  const supabase = supabaseBrowser()
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/'

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Verificar que exista una sesión de recuperación (llega desde el enlace del correo)
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setMessage(
          'Enlace inválido o expirado. Solicita otro correo de recuperación.'
        )
      }
      setReady(true)
    })
  }, [supabase])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6)
      return setMessage('La contraseña debe tener al menos 6 caracteres')
    if (password !== confirm) return setMessage('Las contraseñas no coinciden')
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) return setMessage(error.message)
    router.replace(next)
  }

  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <div className="w-full max-w-sm border rounded-lg p-6 shadow-sm bg-white">
        <h1 className="text-xl font-semibold mb-4">Actualizar contraseña</h1>
        {!ready ? (
          <p className="text-sm text-gray-600">Verificando enlace…</p>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-3">
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Nueva contraseña"
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Confirmar contraseña"
              className="w-full border rounded px-3 py-2"
            />
            <button
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded"
            >
              {loading ? 'Guardando…' : 'Guardar'}
            </button>
            {message && <p className="text-sm text-rose-600">{message}</p>}
          </form>
        )}
      </div>
    </div>
  )
}
