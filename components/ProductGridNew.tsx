'use client'

import { useState, useEffect } from 'react'
import { Star, Heart, ShoppingCart, Filter, X } from 'lucide-react'
import productsData from '../data/products.json'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number | null
  rating: number
  reviews: number
  image: string
  category: string
  size: string[]
  colors: string[]
  description: string
  isNew?: boolean
  isSale?: boolean
  isPopular?: boolean
  material: string
  care: string
  tags: string[]
}

interface Category {
  id: string
  name: string
  description: string
  color: string
}

export default function ProductGrid() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [cart, setCart] = useState<number[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(
    productsData.products
  )
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSize, setSelectedSize] = useState<string>('all')
  const [selectedColor, setSelectedColor] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<string>('popular')

  const products: Product[] = productsData.products
  const categories: Category[] = productsData.categories

  // Extract all unique sizes and colors from products
  const allSizes = Array.from(new Set(products.flatMap(p => p.size)))
  const allColors = Array.from(new Set(products.flatMap(p => p.colors)))

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter(product => {
      const categoryMatch =
        selectedCategory === 'all' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      const sizeMatch =
        selectedSize === 'all' || product.size.includes(selectedSize)
      const colorMatch =
        selectedColor === 'all' ||
        product.colors.some(color =>
          color.toLowerCase().includes(selectedColor.toLowerCase())
        )
      const priceMatch =
        product.price >= priceRange[0] && product.price <= priceRange[1]

      return categoryMatch && sizeMatch && colorMatch && priceMatch
    })

    // Sort products
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
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'popular':
      default:
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
        break
    }

    setFilteredProducts(filtered)
  }, [
    selectedCategory,
    selectedSize,
    selectedColor,
    priceRange,
    sortBy,
    products,
  ])

  // Toggle favorite state
  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // Add to cart
  const addToCart = (productId: number) => {
    setCart(prev => [...prev, productId])
    // You could add a toast notification here
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedSize('all')
    setSelectedColor('all')
    setPriceRange([0, 200])
    setSortBy('popular')
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }
      />
    ))
  }

  return (
    <section
      className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50"
      aria-labelledby="products-heading"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            id="products-heading"
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          >
            ✨ Nuestra Colección Premium 💖
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre pijamas diseñadas especialmente para tu comodidad y estilo.
            Cada pieza es cuidadosamente seleccionada para brindarte la mejor
            experiencia de descanso.
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Filter size={18} />
                Filtros
              </button>

              {(selectedCategory !== 'all' ||
                selectedSize !== 'all' ||
                selectedColor !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X size={18} />
                  Limpiar Filtros
                </button>
              )}

              <span className="text-gray-600">
                {filteredProducts.length} productos encontrados
              </span>
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="popular">Más Populares</option>
              <option value="newest">Más Nuevos</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Calificados</option>
            </select>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg p-6 shadow-md mb-6 border border-primary-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Size Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Talla
                  </label>
                  <select
                    value={selectedSize}
                    onChange={e => setSelectedSize(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">Todas las tallas</option>
                    {allSizes.map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Color
                  </label>
                  <select
                    value={selectedColor}
                    onChange={e => setSelectedColor(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">Todos los colores</option>
                    {allColors.map(color => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Precio: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={e =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full accent-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <article
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 border border-primary-100"
            >
              <div className="relative">
                <img
                  src={product.image || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isNew && (
                    <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      ✨ Nuevo
                    </span>
                  )}
                  {product.isSale && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      🔥 Oferta
                    </span>
                  )}
                  {product.isPopular && (
                    <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      💖 Popular
                    </span>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  aria-label={
                    favorites.includes(product.id)
                      ? 'Remove from favorites'
                      : 'Add to favorites'
                  }
                >
                  <Heart
                    size={18}
                    className={
                      favorites.includes(product.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-500'
                    }
                  />
                </button>
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-primary-600 font-semibold uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600 ml-1">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-primary-600">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                      -
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      %
                    </span>
                  )}
                </div>

                {/* Material & Care */}
                <div className="text-xs text-gray-500 mb-3">
                  <div className="mb-1">
                    <span className="font-semibold">Material:</span>{' '}
                    {product.material}
                  </div>
                  <div>
                    <span className="font-semibold">Cuidado:</span>{' '}
                    {product.care}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-3">
                  <span className="text-xs text-gray-600 font-semibold">
                    Tallas:{' '}
                  </span>
                  <span className="text-xs text-gray-600">
                    {product.size.join(', ')}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product.id)}
                  className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Agregar al Carrito
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* No products message */}
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
              onClick={clearFilters}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Ver Todos los Productos
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
