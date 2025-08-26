'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Edit, Trash2, Eye, Plus, Star, Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  status: string
  is_featured: boolean
  category: string | null
  images: any[]
  created_at: string
}

export default function ProductsTableImproved({ items }: { items: Product[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const onDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const j = await res.json().catch(() => null)
        alert(j?.error || 'Error al eliminar')
        return
      }
      // refrescar la vista
      window.location.reload()
    } finally {
      setDeleting(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Activo' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactivo' },
      draft: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Borrador',
      },
    }
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    )
  }

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Sin stock
        </span>
      )
    } else if (stock <= 5) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          Bajo stock
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {stock} unidades
        </span>
      )
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay productos
        </h3>
        <p className="text-gray-500 mb-6">
          Comienza agregando tu primer producto a la tienda.
        </p>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
        >
          <Plus size={18} />
          Crear primer producto
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header de la tabla */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Productos ({items.length})
          </h3>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
          >
            <Plus size={16} />
            Nuevo producto
          </Link>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map(product => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {product.images && product.images.length > 0 ? (
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={
                            Array.isArray(product.images)
                              ? String(product.images[0])
                              : '/placeholder.jpg'
                          }
                          alt={product.name}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        {product.is_featured && (
                          <Star className="ml-2 h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {product.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(product.price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStockBadge(product.stock)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(product.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.category || 'Sin categoría'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Ver producto"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center p-2 text-blue-400 hover:text-blue-600 transition-colors"
                      title="Editar producto"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => onDelete(product.id)}
                      disabled={deleting === product.id}
                      className="inline-flex items-center p-2 text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                      title="Eliminar producto"
                    >
                      {deleting === product.id ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
