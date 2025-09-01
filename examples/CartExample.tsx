// Ejemplo de integración del sistema de carrito en la aplicación principal

import React from 'react'
import { CartProvider } from '../contexts/CartContext'
import Header from '../components/layout/Header'
import CartSidebar from '../components/features/CartSidebar'
import ProductCard from '../components/products/ProductCard'

// Datos de ejemplo de productos
const sampleProducts = [
  {
    id: '1',
    name: 'Pijama Seda Rosa Premium',
    price: 89900,
    originalPrice: 129900,
    image: '/piyamas/tela_chalis_crepe.jpg',
    rating: 4.8,
    reviews: 156,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Rosa', 'Blanco', 'Lavanda'],
    maxStock: 15,
    isNew: true,
    isOnSale: true,
  },
  {
    id: '2',
    name: 'Conjunto Algodón Floral Elegante',
    price: 79900,
    image: '/piyamas/tela_calis_2.jpg',
    rating: 4.6,
    reviews: 98,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Floral Rosa', 'Floral Azul', 'Floral Verde'],
    maxStock: 8,
    isNew: false,
    isOnSale: false,
  },
  {
    id: '3',
    name: 'Modal Bambú Premium Comfort',
    price: 119900,
    originalPrice: 149900,
    image: '/piyamas/tela_chalis_3.jpg',
    rating: 4.9,
    reviews: 234,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Gris', 'Azul Marino', 'Verde Menta'],
    maxStock: 12,
    isNew: false,
    isOnSale: true,
  },
  {
    id: '4',
    name: 'Colección Satén Luxury',
    price: 149900,
    image: '/piyamas/tela_chalis_4.jpg',
    rating: 4.7,
    reviews: 189,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Champagne', 'Borgoña', 'Negro'],
    maxStock: 6,
    isNew: true,
    isOnSale: false,
  },
]

// Componente de ejemplo de uso
const ExampleUsage: React.FC = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header con carrito funcional */}
        <Header />

        {/* Contenido principal */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Productos Destacados
            </h1>
            <p className="text-gray-600">
              Haz clic en "Agregar al Carrito" para probar la funcionalidad
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sampleProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </main>

        {/* Carrito lateral */}
        <CartSidebar />
      </div>
    </CartProvider>
  )
}

export default ExampleUsage

/*
INSTRUCCIONES DE USO:

1. Envolver tu aplicación con CartProvider:
   <CartProvider>
     <YourApp />
   </CartProvider>

2. Importar y usar el hook useCart en cualquier componente:
   const { addItem, removeItem, itemCount, total } = useCart()

3. Agregar CartSidebar en tu layout principal:
   <CartSidebar />

4. Usar ProductCard para mostrar productos:
   <ProductCard
     id="1"
     name="Producto Ejemplo"
     price={50000}
     image="/imagen.jpg"
     // ... otros props
   />

FUNCIONALIDADES INCLUIDAS:
✅ Agregar productos al carrito
✅ Remover productos del carrito
✅ Actualizar cantidades
✅ Cálculo automático de totales
✅ Persistencia del estado durante la sesión
✅ UI responsive y profesional
✅ Animaciones y transiciones suaves
✅ Manejo de stock máximo
✅ Validaciones de cantidad
✅ Formato de moneda colombiana
✅ Botones de checkout y continuar comprando
✅ Estados de carga
✅ Accesibilidad completa

PRÓXIMOS PASOS RECOMENDADOS:
1. Integrar con API de productos real
2. Implementar persistencia en localStorage
3. Conectar con pasarela de pagos
4. Agregar sistema de autenticación
5. Implementar wishlist funcional
6. Agregar filtros y búsqueda avanzada
*/
