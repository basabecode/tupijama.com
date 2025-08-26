'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function ProductsTable({ items }: { items: any[] }) {
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-4">Nombre</th>
            <th className="py-2 pr-4">Precio</th>
            <th className="py-2 pr-4">Stock</th>
            <th className="py-2 pr-4">Estado</th>
            <th className="py-2 pr-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p: any) => (
            <tr key={p.id} className="border-b">
              <td className="py-2 pr-4">{p.name}</td>
              <td className="py-2 pr-4">${p.price}</td>
              <td className="py-2 pr-4">{p.stock}</td>
              <td className="py-2 pr-4">{p.status}</td>
              <td className="py-2 pr-4 flex gap-2">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="px-2 py-1 border rounded hover:bg-gray-50"
                >
                  Editar
                </Link>
                <button
                  onClick={() => onDelete(p.id)}
                  className="px-2 py-1 border rounded text-red-600 hover:bg-red-50"
                  disabled={deleting === p.id}
                >
                  {deleting === p.id ? 'Eliminando…' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
