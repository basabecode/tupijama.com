'use client'

import { useEffect, useMemo, useState } from 'react'
import { Star, Heart, ShoppingCart, Filter, X, ChevronDown } from 'lucide-react'
import ProductCard from './ProductCard'
import type { Database } from '@/types/database'

type ProductRow = Database['public']['Tables']['products']['Row']

interface ProductGridProps {
  products: ProductRow[]
}

// Normalizamos la fila de DB al shape que usa la UI
function normalize(p: ProductRow) {
  const sizes = Array.isArray(p.sizes) ? p.sizes.map(String) : []
  const fabricTypes = Array.isArray(p.colors)
    ? p.colors.map(String)
    : ['Algodón', 'Poliéster', 'Lino']
  const image =
    Array.isArray(p.images) && p.images.length > 0
      ? String(p.images[0])
      : '/placeholder.jpg'
  const images = Array.isArray(p.images) ? p.images.map(String) : []

  // Descripciones de fallback para hacer pruebas
  const fallbackDescriptions = [
    'Pijama de alta calidad con materiales premium y diseño elegante.',
    'Cómodo conjunto de descanso con telas suaves y transpirables.',
    'Diseño exclusivo perfecto para noches de relajación y comodidad.',
    'Conjunto premium con acabados de lujo y máxima suavidad.',
    'Pijama artesanal con atención a cada detalle para tu confort.',
  ]

  const description =
    p.description ||
    fallbackDescriptions[
      Math.floor(Math.random() * fallbackDescriptions.length)
    ]

  return {
    id: String(p.id),
    name: p.name || `Pijama Premium ${p.id}`,
    price: Number(p.price) || 0,
    originalPrice: Number(p.price) || undefined,
    rating: 4.5, // Mantener por compatibilidad pero no se mostrará
    reviews: 0, // Mantener por compatibilidad pero no se mostrará
    image,
    images, // Agregar todas las imágenes
    category: p.category || 'General',
    size: sizes,
    colors: fabricTypes, // Ahora representa tipos de tela
    description,
    isNew: false,
    isSale: false,
    isPopular: false,
    material: '',
    care: '',
    tags: [],
    stock: p.stock || 0,
  }
}

export default function ProductGridDynamic({ products }: ProductGridProps) {
  const normalized = useMemo(() => products.map(normalize), [products])

  // Debug: Log cuántos productos se reciben
  useEffect(() => {
    console.log('🔍 ProductGridDynamic - Productos recibidos:', products.length)
    console.log(
      '🔍 ProductGridDynamic - Productos normalizados:',
      normalized.length
    )
  }, [products.length, normalized.length])

  const [filteredProducts, setFilteredProducts] = useState(normalized)
  const [displayedProducts, setDisplayedProducts] = useState<typeof normalized>(
    []
  )
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSize, setSelectedSize] = useState<string>('all')
  const [selectedColor, setSelectedColor] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<string>('popular')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(36) // Inicialmente 36 productos para mejor aprovechamiento del espacio
  const [loadIncrement] = useState(18) // Cargar 18 más cada vez

  // Extraer tamaños y tipos de tela únicos
  const allSizes = Array.from(new Set(normalized.flatMap(p => p.size)))
  const allColors = Array.from(new Set(normalized.flatMap(p => p.colors))) // Ahora representa tipos de tela
  const categories = Array.from(new Set(normalized.map(p => p.category)))

  useEffect(() => {
    let filtered = normalized.filter(product => {
      const categoryMatch =
        selectedCategory === 'all' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      const sizeMatch =
        selectedSize === 'all' || product.size.includes(selectedSize)
      const colorMatch =
        selectedColor === 'all' ||
        product.colors.some(c =>
          c.toLowerCase().includes(selectedColor.toLowerCase())
        )
      const priceMatch =
        product.price >= priceRange[0] && product.price <= priceRange[1]
      return categoryMatch && sizeMatch && colorMatch && priceMatch
    })

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => 0)
        break
      case 'popular':
      default:
        filtered.sort((a, b) => 0)
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset pagination when filters change
  }, [
    selectedCategory,
    selectedSize,
    selectedColor,
    priceRange,
    sortBy,
    normalized,
  ])

  // Update displayed products based on pagination
  useEffect(() => {
    const startIndex = 0
    const endIndex = itemsPerPage + (currentPage - 1) * loadIncrement
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex))
  }, [filteredProducts, currentPage, itemsPerPage, loadIncrement])

  // Load more products
  const loadMoreProducts = () => {
    setCurrentPage(prev => prev + 1)
  }

  // Check if there are more products to load
  const hasMoreProducts = displayedProducts.length < filteredProducts.length

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedSize('all')
    setSelectedColor('all')
    setPriceRange([0, 100000])
    setSortBy('popular')
    setCurrentPage(1)
  }

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
    <section
      className="py-12 bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50"
      aria-labelledby="products-heading"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="products-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4 px-4 py-2 leading-relaxed"
            style={{ lineHeight: '1.3' }}
          >
            🛍️ Catálogo Completo
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
            Descubre nuestra selección exclusiva de pijamas premium, diseñadas
            para tu máximo confort y estilo.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-3 py-1.5 rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 shadow-sm text-sm"
              >
                <Filter size={16} />
                Filtros
              </button>

              {(selectedCategory !== 'all' ||
                selectedSize !== 'all' ||
                selectedColor !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedSize('all')
                    setSelectedColor('all')
                    setPriceRange([0, 100000])
                    setSortBy('popular')
                    setCurrentPage(1)
                  }}
                  className="flex items-center gap-2 bg-gray-500 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  <X size={16} />
                  Limpiar Filtros
                </button>
              )}

              <span className="text-gray-600 text-sm">
                Mostrando {displayedProducts.length} de{' '}
                {filteredProducts.length} productos
              </span>
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-white border border-blue-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="popular">Más Populares</option>
              <option value="newest">Más Nuevos</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Calificados</option>
            </select>
          </div>

          {showFilters && (
            <div className="bg-white rounded-lg p-4 shadow-md mb-4 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full bg-white border border-blue-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Talla
                  </label>
                  <select
                    value={selectedSize}
                    onChange={e => setSelectedSize(e.target.value)}
                    className="w-full bg-white border border-blue-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="all">Todas las tallas</option>
                    {allSizes.map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Tela
                  </label>
                  <select
                    value={selectedColor}
                    onChange={e => setSelectedColor(e.target.value)}
                    className="w-full bg-white border border-blue-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="all">Todos los tipos</option>
                    {allColors.map(color => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio: ${priceRange[0].toLocaleString()} - $
                    {priceRange[1].toLocaleString()}
                  </label>
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="5000"
                      value={priceRange[1]}
                      onChange={e =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contenedor del grid optimizado para uniformidad - ANCHO COMPLETO */}
        <div className="w-full">
          <div className="w-full px-4">
            <div
              className={`grid gap-4 ${
                displayedProducts.length < 12
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 3xl:grid-cols-7 justify-center'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 3xl:grid-cols-7'
              }`}
            >
              {displayedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  images={product.images}
                  rating={product.rating}
                  reviews={product.reviews}
                  sizes={product.size}
                  colors={product.colors}
                  description={product.description}
                  maxStock={product.stock}
                  isNew={product.isNew}
                  isOnSale={product.isSale}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Botón Ver más de la colección */}
        {hasMoreProducts && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMoreProducts}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-md flex items-center gap-2 group"
            >
              Ver más de la colección
              <ChevronDown
                size={18}
                className="group-hover:translate-y-1 transition-transform"
              />
            </button>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No encontramos productos con esos filtros
            </h3>
            <p className="text-gray-600 mb-4">
              Prueba ajustando tus filtros o explora todas nuestras categorías
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedSize('all')
                setSelectedColor('all')
                setPriceRange([0, 100000])
                setSortBy('popular')
                setCurrentPage(1)
              }}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-md"
            >
              Ver Todos los Productos
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
