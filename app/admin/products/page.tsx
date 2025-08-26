import Link from 'next/link'
import ProductsTableImproved from './ProductsTableImproved'
import { cookies } from 'next/headers'
import { getSupabaseServerClient } from '@/lib/supabaseServer'
import { Plus, Package, TrendingUp, AlertTriangle } from 'lucide-react'

async function fetchProducts() {
  // En lugar de hacer fetch HTTP, usar directamente Supabase desde el servidor
  const cookieStore = await cookies()
  const supabase = getSupabaseServerClient(() => cookieStore)

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

async function getProductStats(products: any[]) {
  const total = products.length
  const active = products.filter(p => p.status === 'active').length
  const lowStock = products.filter(p => p.stock <= 5 && p.stock > 0).length
  const outOfStock = products.filter(p => p.stock === 0).length

  return { total, active, lowStock, outOfStock }
}

export default async function AdminProductsPage() {
  const items = await fetchProducts()
  const stats = await getProductStats(items)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Productos
            </h1>
            <p className="text-gray-600 mt-1">
              Administra tu catálogo de productos
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-sm"
          >
            <Plus size={20} />
            Nuevo Producto
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Productos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Productos Activos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.lowStock}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sin Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.outOfStock}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <ProductsTableImproved items={items} />
    </div>
  )
}
