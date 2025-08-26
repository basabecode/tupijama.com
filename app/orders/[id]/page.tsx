'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type OrderItem = {
  id: string
  product_id: string
  quantity: number
  price: number
  size: string | null
  color: string | null
}

type Order = {
  id: string
  created_at: string
  total: number
  status: string
  order_items: OrderItem[]
  shipping_address?: any | null
  billing_address?: any | null
}

function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(value)
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`, {
          cache: 'no-store',
        })
        if (res.status === 401) {
          router.replace(`/login?next=/orders/${params.id}`)
          return
        }
        if (res.status === 404) {
          setError('Orden no encontrada')
          return
        }
        if (!res.ok) {
          setError('No se pudo cargar la orden.')
          return
        }
        const data = (await res.json()) as Order
        if (!active) return
        setOrder(data)
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
  }, [params.id, router])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Confirmación de pedido</h1>
        <p className="text-gray-600">Cargando tu orden…</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Confirmación de pedido</h1>
        <p className="text-red-600">{error || 'Orden no disponible.'}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-4 py-2 rounded-full border text-rose-600 border-rose-300 hover:bg-rose-50"
        >
          Volver a la tienda
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">¡Gracias por tu compra!</h1>
        <p className="text-gray-600 mt-1">
          Pedido #{order.id} •{' '}
          {new Date(order.created_at).toLocaleString('es-CO')}
        </p>
        <p className="mt-2 text-sm text-green-700">
          Pago seguro • Envío gratis • Devoluciones fáciles
        </p>
      </div>

      <div className="bg-white shadow rounded-2xl divide-y">
        <div className="p-4 flex justify-between">
          <span className="text-gray-600">Estado</span>
          <span className="font-semibold capitalize">{order.status}</span>
        </div>
        {(order.shipping_address || order.billing_address) && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.shipping_address && (
              <div>
                <h3 className="font-semibold mb-2">Envío</h3>
                <pre className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap break-words">
                  {JSON.stringify(order.shipping_address, null, 2)}
                </pre>
              </div>
            )}
            {order.billing_address && (
              <div>
                <h3 className="font-semibold mb-2">Facturación</h3>
                <pre className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap break-words">
                  {JSON.stringify(order.billing_address, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
        <div className="p-4">
          <h2 className="font-semibold mb-3">Artículos</h2>
          <div className="space-y-3">
            {order.order_items.map(it => (
              <div key={it.id} className="flex justify-between text-sm">
                <div className="text-gray-700">
                  <div className="font-medium">Producto #{it.product_id}</div>
                  <div className="text-gray-500">
                    Cantidad: {it.quantity}
                    {it.size ? ` • Talla: ${it.size}` : ''}
                    {it.color ? ` • Color: ${it.color}` : ''}
                  </div>
                </div>
                <div className="font-semibold">
                  {formatCOP(Number(it.price) * it.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 flex justify-between text-lg">
          <span className="font-semibold">Total</span>
          <span className="text-rose-600 font-bold">
            {formatCOP(Number(order.total))}
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => router.push('/')}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold hover:from-rose-600 hover:to-pink-600"
        >
          Seguir comprando
        </button>
        <button
          onClick={() => router.push('/orders')}
          className="px-5 py-3 rounded-full border border-rose-300 text-rose-600 hover:bg-rose-50"
        >
          Ver mis pedidos
        </button>
      </div>
    </div>
  )
}
