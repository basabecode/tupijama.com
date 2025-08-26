'use client'

import ProductCard from './ProductCard'
import type { Database } from '@/types/database'

type Product = Database['public']['Tables']['products']['Row']

interface ProductGridProps {
  products: Product[]
}

export default function ProductGridDatabase({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No hay productos disponibles en este momento.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map(product => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          originalPrice={product.price} // Si no hay precio original, usar el mismo precio
          image={
            Array.isArray(product.images) && product.images.length > 0
              ? String(product.images[0])
              : '/placeholder.jpg'
          }
          rating={4.5} // Rating por defecto hasta que implementemos reviews
          reviews={0} // Reviews por defecto hasta que implementemos reviews
          sizes={
            Array.isArray(product.sizes)
              ? product.sizes.map(size => String(size))
              : []
          }
          colors={
            Array.isArray(product.colors)
              ? product.colors.map(color => String(color))
              : []
          }
          maxStock={product.stock}
          isNew={false} // Por ahora false, después podemos agregar lógica de fecha
          isOnSale={false} // Por ahora false, después podemos agregar lógica de descuentos
        />
      ))}
    </div>
  )
}
