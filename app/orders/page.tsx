'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Order = {
  id: string
  created_at: string
  total: number
  status: string
}

function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(value)
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' })
        if (res.status === 401) {
          router.replace('/login?next=/orders')
          return
        }
        if (!res.ok) {
          setError('No se pudieron cargar tus pedidos.')
          return
        }
        const data = (await res.json()) as any[]
        if (!active) return
        setOrders(data)
      } catch (e) {
        if (!active) return
        setError('Error de red. Intenta nuevamente.')
      } finally {
        if (!active) return
        setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [router])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Mis pedidos</h1>
        <p className="text-gray-600">Cargando…</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mis pedidos</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 shadow">
          <p className="text-gray-600">Aún no tienes pedidos.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 rounded-full bg-rose-500 text-white hover:bg-rose-600"
          >
            Ir a comprar
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <button
              key={o.id}
              onClick={() => router.push(`/orders/${o.id}`)}
              className="w-full text-left bg-white rounded-2xl p-4 shadow hover:shadow-md transition"
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">Pedido #{o.id}</div>
                  <div className="text-gray-600 text-sm">
                    {new Date(o.created_at).toLocaleString('es-CO')} • Estado:{' '}
                    {o.status}
                  </div>
                </div>
                <div className="text-rose-600 font-bold">
                  {formatCOP(Number(o.total))}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
