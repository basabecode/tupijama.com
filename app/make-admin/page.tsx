'use client'

import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'

export default function MakeAdminPage() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const makeAdmin = async () => {
    setLoading(true)
    setStatus('Procesando...')

    try {
      const supabase = supabaseBrowser()

      // Primero verificar que el usuario esté logueado
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setStatus('Error: Usuario no autenticado')
        return
      }

      // Actualizar el metadata del usuario
      const { error: updateError } = await supabase.auth.updateUser({
        data: { role: 'admin' },
      })

      if (updateError) {
        setStatus(`Error al actualizar: ${updateError.message}`)
        return
      }

      setStatus(
        '¡Éxito! Rol admin asignado. Recarga la página en unos segundos.'
      )

      // Recargar después de 2 segundos
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      setStatus(`Error inesperado: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Asignar Rol Admin</h1>
      <p className="mb-4 text-gray-600">
        Esta página te permite asignarte el rol de administrador.
      </p>

      <button
        onClick={makeAdmin}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
      >
        {loading ? 'Procesando...' : 'Hacer Admin'}
      </button>

      {status && (
        <div
          className={`mt-4 p-3 rounded ${
            status.includes('Error')
              ? 'bg-red-100 text-red-700'
              : status.includes('Éxito')
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {status}
        </div>
      )}

      <div className="mt-6">
        <a href="/debug" className="text-blue-500 hover:underline">
          Ver estado del usuario
        </a>
        {' | '}
        <a href="/admin/products" className="text-blue-500 hover:underline">
          Ir a Admin Products
        </a>
      </div>
    </div>
  )
}
