'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

const CartSidebar: React.FC = () => {
  const {
    items,
    isOpen,
    total,
    itemCount,
    removeItem,
    updateQuantity,
    clearCart,
    closeCart,
  } = useCart()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  // Ya no se crean direcciones desde el carrito; se usan las guardadas
  const router = useRouter()
  // Cargar direcciones al abrir el carrito
  useEffect(() => {
    if (!isOpen) return
    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/addresses', { cache: 'no-store' })
        if (!active) return
        if (res.status === 401) return // invitado: se pedirá login en checkout
        const list = await res.json()
        setAddresses(Array.isArray(list) ? list : [])
        const def = (list || []).find((a: any) => a.is_default_shipping)
        if (def) setSelectedAddressId(def.id)
      } catch {}
    })()
    return () => {
      active = false
    }
  }, [isOpen])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(price)
  }

  const handleCheckout = async () => {
    if (!items.length || isProcessing) return
    setIsProcessing(true)

    try {
      const selected = addresses.find(a => a.id === selectedAddressId) || null
      if (!selected) {
        setIsProcessing(false)
        toast({
          title: 'Falta dirección',
          description: 'Selecciona o crea una dirección de envío.',
        })
        return
      }
      const payload: any = {
        items: items.map(i => ({
          product_id: i.id,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
        shipping_address: selected,
      }
      // Si en el futuro tenemos dirección seleccionada en UI, se puede adjuntar:
      // payload.shipping_address = { ... }
      // payload.billing_address = { ... }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.status === 401) {
        toast({
          title: 'Inicia sesión para continuar',
          description: 'Necesitas estar autenticado para finalizar la compra.',
        })
        // Opcional: redirigir al login
        setTimeout(() => {
          window.location.href = '/login'
        }, 800)
        return
      }

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const message = data?.error || 'No se pudo crear la orden.'
        toast({ title: 'Error en la compra', description: message })
        return
      }

      const orderId = data?.order_id
      clearCart()
      closeCart()
      toast({
        title: '¡Orden creada!',
        description: orderId
          ? `Tu pedido #${orderId} fue creado correctamente.`
          : 'Tu pedido fue creado correctamente.',
      })
      if (orderId) {
        setTimeout(() => {
          router.push(`/orders/${orderId}`)
        }, 400)
      }
    } catch (err) {
      toast({
        title: 'Error inesperado',
        description: 'Intenta nuevamente en unos segundos.',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleContinueShopping = () => {
    closeCart()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="text-rose-500" size={24} />
            <h2 className="text-xl font-bold text-gray-800">
              Mi Carrito ({itemCount})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-rose-100 rounded-full transition-colors duration-200"
            aria-label="Cerrar carrito"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            /* Carrito vacío */
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <ShoppingBag size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500 mb-6">
                Agrega algunos productos hermosos para comenzar
              </p>
              <button
                onClick={handleContinueShopping}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Seguir Comprando
              </button>
            </div>
          ) : (
            /* Items del carrito */
            <div className="p-4 space-y-4">
              {items.map(item => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="bg-gray-50 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-start space-x-3">
                    {/* Imagen del producto */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Detalles del producto */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {item.name}
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          Talla:{' '}
                          <span className="font-medium">{item.size}</span>
                        </p>
                        <p>
                          Color:{' '}
                          <span className="font-medium">{item.color}</span>
                        </p>
                        <p className="font-bold text-rose-600">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Controles de cantidad */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                `${item.id}-${item.size}-${item.color}`,
                                item.quantity - 1
                              )
                            }
                            className="p-1 hover:bg-rose-100 rounded-full transition-colors duration-200"
                            disabled={item.quantity <= 1}
                          >
                            <Minus
                              size={16}
                              className={
                                item.quantity <= 1
                                  ? 'text-gray-300'
                                  : 'text-rose-500'
                              }
                            />
                          </button>

                          <span className="w-8 text-center font-semibold text-gray-800">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                `${item.id}-${item.size}-${item.color}`,
                                item.quantity + 1
                              )
                            }
                            className="p-1 hover:bg-rose-100 rounded-full transition-colors duration-200"
                            disabled={item.quantity >= item.maxStock}
                          >
                            <Plus
                              size={16}
                              className={
                                item.quantity >= item.maxStock
                                  ? 'text-gray-300'
                                  : 'text-rose-500'
                              }
                            />
                          </button>
                        </div>

                        {/* Botón eliminar */}
                        <button
                          onClick={() =>
                            removeItem(`${item.id}-${item.size}-${item.color}`)
                          }
                          className="p-1 hover:bg-red-100 rounded-full transition-colors duration-200"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="mt-2 text-right">
                        <span className="text-sm text-gray-600">
                          Subtotal:{' '}
                        </span>
                        <span className="font-bold text-gray-800">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Botón limpiar carrito */}
              {items.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={clearCart}
                    className="w-full text-red-600 hover:text-red-700 text-sm font-medium py-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    Vaciar Carrito
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Total y Checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-white">
            {/* Dirección de envío */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Dirección de envío</h3>
                <a
                  href="/account/addresses"
                  className="text-sm text-rose-600 hover:underline"
                >
                  Gestionar direcciones
                </a>
              </div>
              <div className="space-y-2">
                {addresses.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No tienes direcciones guardadas.
                  </p>
                ) : (
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedAddressId}
                    onChange={e => setSelectedAddressId(e.target.value)}
                  >
                    <option value="">Selecciona una dirección…</option>
                    {addresses.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.full_name || 'Sin nombre'} • {a.address_line1},{' '}
                        {a.city}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            {/* Resumen del total */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal:</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío:</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span className="text-rose-600">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-4 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <CreditCard size={20} />
                <span>{isProcessing ? 'Procesando…' : 'Finalizar Compra'}</span>
              </button>

              <button
                onClick={handleContinueShopping}
                className="w-full border-2 border-rose-300 text-rose-600 py-3 px-4 rounded-full font-semibold hover:bg-rose-50 transition-all duration-300"
              >
                Seguir Comprando
              </button>
            </div>

            {/* Información adicional */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                🔒 Compra segura • 💝 Envío gratis • ↩️ Devoluciones fáciles
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CartSidebar
