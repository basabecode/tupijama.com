'use client'

import { useState, useEffect } from 'react'
import { Filter, X, Search, Grid, List } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import ProductCard from './products/ProductCard'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number | null
  image: string
  category: string
  size: string[]
  colors: string[]
  description: string
  isNew?: boolean
  isSale?: boolean
  isPopular?: boolean
  source: 'database' | 'offers' | 'special'
  rating?: number
  reviews?: number
  stock?: number
}

interface Category {
  id: string
  name: string
  description: string
  color: string
}

// 🎨 Componente renovado: Centro de Filtrado Avanzado y Showcase de Productos
export default function ProductGrid() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSize, setSelectedSize] = useState<string>('all')
  const [selectedColor, setSelectedColor] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<string>('featured')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [activeView, setActiveView] = useState<
    'all' | 'offers' | 'new' | 'popular'
  >('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Marcar como montado para evitar hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Función helper para validar URLs de imágenes (igual que ProductGridDynamic)
  const getValidImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl || imageUrl.trim() === '') {
      return '/placeholder.jpg'
    }
    return String(imageUrl)
  }

  // 🔄 Cargar productos combinados (BD + JSON + Ofertas especiales)
  const loadAllProducts = async () => {
    try {
      setLoading(true)

      // 1. Cargar productos de la base de datos
      const supabase = supabaseBrowser()
      const { data: dbProducts, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')

      // 2. Cargar productos del JSON (ofertas especiales)
      let jsonProducts: any[] = []
      try {
        const response = await fetch('/data/products.json')
        const jsonData = await response.json()
        jsonProducts = jsonData.products || []
      } catch (jsonError) {
        console.error('Error loading JSON products:', jsonError)
      }

      // 3. Combinar y normalizar todos los productos
      const combinedProducts: Product[] = [
        // Productos de la base de datos
        ...(dbProducts || []).map((p: any) => ({
          id: String(p.id),
          name: p.name,
          price: Number(p.price) || 0,
          originalPrice: Number(p.price) || undefined,
          image:
            Array.isArray(p.images) && p.images.length > 0
              ? String(p.images[0])
              : '/placeholder.jpg',
          category: p.category || 'General',
          size: Array.isArray(p.sizes) ? p.sizes.map(String) : ['M'],
          colors: Array.isArray(p.colors) ? p.colors.map(String) : ['Algodón'],
          description: p.description || '',
          source: 'database' as const,
          stock: p.stock || 0,
          isNew:
            p.created_at &&
            new Date(p.created_at) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          isSale: false,
          isPopular: p.stock > 50,
        })),
        // Productos del JSON (ofertas especiales)
        ...jsonProducts.map((p: any) => ({
          id: String(p.id),
          name: p.name,
          price: Number(p.price) || 0,
          originalPrice: Number(p.originalPrice) || Number(p.price),
          image: getValidImageUrl(p.image),
          category: p.category || 'Ofertas',
          size: Array.isArray(p.size) ? p.size : ['M'],
          colors: Array.isArray(p.colors) ? p.colors : ['Algodón'],
          description: p.description || '',
          source: 'offers' as const,
          rating: p.rating || 4.5,
          reviews: p.reviews || 0,
          isNew: p.isNew || false,
          isSale: true,
          isPopular: p.isPopular || false,
        })),
      ]

      setAllProducts(combinedProducts)
      setFilteredProducts(combinedProducts)

      // Extraer categorías únicas
      const uniqueCategories = Array.from(
        new Set(combinedProducts.map(p => p.category))
      ).map(cat => ({
        id: cat.toLowerCase().replace(/\s+/g, '-'),
        name: cat,
        description: `Productos de ${cat}`,
        color: '#3B82F6',
      }))

      setCategories(uniqueCategories)

      console.log(
        '✅ Productos cargados en ProductGrid:',
        combinedProducts.length
      )
    } catch (error) {
      console.error('❌ Error loading products:', error)
      setAllProducts([])
      setFilteredProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Cargar productos al montar
  useEffect(() => {
    if (mounted) {
      loadAllProducts()
    }
  }, [mounted])

  // 🔍 Obtener datos únicos para filtros
  const allSizes = Array.from(new Set(allProducts.flatMap(p => p.size)))
  const allColors = Array.from(new Set(allProducts.flatMap(p => p.colors)))

  // 🎯 Filtrar y ordenar productos
  useEffect(() => {
    if (allProducts.length === 0) return

    let filtered = allProducts.filter(product => {
      // Filtro por vista activa
      if (activeView === 'offers' && !product.isSale) return false
      if (activeView === 'new' && !product.isNew) return false
      if (activeView === 'popular' && !product.isPopular) return false

      // Filtros básicos
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

      // Filtro de búsqueda
      const searchMatch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())

      return (
        categoryMatch && sizeMatch && colorMatch && priceMatch && searchMatch
      )
    })

    // Ordenar productos
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'popular':
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
        break
      case 'featured':
      default:
        // Priorizar ofertas, luego nuevos, luego populares
        filtered.sort((a, b) => {
          if (a.isSale && !b.isSale) return -1
          if (!a.isSale && b.isSale) return 1
          if (a.isNew && !b.isNew) return -1
          if (!a.isNew && b.isNew) return 1
          if (a.isPopular && !b.isPopular) return -1
          if (!a.isPopular && b.isPopular) return 1
          return 0
        })
        break
    }

    setFilteredProducts(filtered)
  }, [
    allProducts,
    selectedCategory,
    selectedSize,
    selectedColor,
    priceRange,
    sortBy,
    activeView,
    searchTerm,
  ])

  // 🧹 Limpiar todos los filtros
  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedSize('all')
    setSelectedColor('all')
    setPriceRange([0, 500000])
    setSortBy('featured')
    setActiveView('all')
    setSearchTerm('')
  }

  // 📊 Estadísticas de productos
  const stats = {
    total: allProducts.length,
    offers: allProducts.filter(p => p.isSale).length,
    new: allProducts.filter(p => p.isNew).length,
    popular: allProducts.filter(p => p.isPopular).length,
    database: allProducts.filter(p => p.source === 'database').length,
    jsonOffers: allProducts.filter(p => p.source === 'offers').length,
  }

  return (
    <section
      className="py-14 bg-gradient-to-b from-white via-rose-50/50 to-white"
      aria-labelledby="products-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2
            id="products-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900"
          >
            Centro de productos
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Explora nuestra colección completa y combina productos de la base de
            datos con ofertas especiales.
          </p>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <div className="rounded-full bg-white px-3.5 py-1.5 text-sm text-gray-700 ring-1 ring-gray-200">
              Total:{' '}
              <span className="font-semibold text-rose-600">{stats.total}</span>
            </div>
            <div className="rounded-full bg-white px-3.5 py-1.5 text-sm text-gray-700 ring-1 ring-red-200">
              Ofertas:{' '}
              <span className="font-semibold text-red-600">{stats.offers}</span>
            </div>
            <div className="rounded-full bg-white px-3.5 py-1.5 text-sm text-gray-700 ring-1 ring-green-200">
              Nuevos:{' '}
              <span className="font-semibold text-green-600">{stats.new}</span>
            </div>
            <div className="rounded-full bg-white px-3.5 py-1.5 text-sm text-gray-700 ring-1 ring-blue-200">
              Populares:{' '}
              <span className="font-semibold text-blue-600">
                {stats.popular}
              </span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative mx-auto max-w-xl">
            <input
              type="text"
              placeholder="Buscar en esta colección..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 pl-10 text-[15px] text-gray-800 shadow-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center gap-3">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
              <span className="text-gray-600">Cargando productos…</span>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {/* Toolbar */}
            <div className="mb-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Tabs */}
                  <div className="flex rounded-full border border-gray-200 bg-white p-1 shadow-sm">
                    <button
                      onClick={() => setActiveView('all')}
                      className={`px-3.5 py-1.5 text-sm rounded-full transition ${
                        activeView === 'all'
                          ? 'bg-rose-500 text-white shadow'
                          : 'text-gray-700 hover:text-rose-600'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setActiveView('offers')}
                      className={`px-3.5 py-1.5 text-sm rounded-full transition ${
                        activeView === 'offers'
                          ? 'bg-rose-500 text-white shadow'
                          : 'text-gray-700 hover:text-rose-600'
                      }`}
                    >
                      Ofertas
                    </button>
                    <button
                      onClick={() => setActiveView('new')}
                      className={`px-3.5 py-1.5 text-sm rounded-full transition ${
                        activeView === 'new'
                          ? 'bg-rose-500 text-white shadow'
                          : 'text-gray-700 hover:text-rose-600'
                      }`}
                    >
                      Nuevos
                    </button>
                    <button
                      onClick={() => setActiveView('popular')}
                      className={`px-3.5 py-1.5 text-sm rounded-full transition ${
                        activeView === 'popular'
                          ? 'bg-rose-500 text-white shadow'
                          : 'text-gray-700 hover:text-rose-600'
                      }`}
                    >
                      Populares
                    </button>
                  </div>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm text-gray-800 shadow-sm transition hover:bg-gray-50"
                  >
                    <Filter size={16} /> Filtros
                  </button>

                  {(selectedCategory !== 'all' ||
                    selectedSize !== 'all' ||
                    selectedColor !== 'all' ||
                    searchTerm) && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-3.5 py-1.5 text-sm text-white shadow-sm transition hover:bg-rose-600"
                    >
                      <X size={16} /> Limpiar
                    </button>
                  )}

                  <span className="text-sm text-gray-600">
                    {filteredProducts.length} productos encontrados
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex rounded-full border border-gray-200 bg-white p-1 shadow-sm">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`rounded-full p-2 transition ${
                        viewMode === 'grid'
                          ? 'bg-rose-500 text-white shadow'
                          : 'text-gray-700 hover:text-rose-600'
                      }`}
                      aria-label="Vista en cuadrícula"
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`rounded-full p-2 transition ${
                        viewMode === 'list'
                          ? 'bg-rose-500 text-white shadow'
                          : 'text-gray-700 hover:text-rose-600'
                      }`}
                      aria-label="Vista en lista"
                    >
                      <List size={16} />
                    </button>
                  </div>

                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                  >
                    <option value="featured">Destacados</option>
                    <option value="newest">Más nuevos</option>
                    <option value="popular">Más populares</option>
                    <option value="price-low">Precio: menor a mayor</option>
                    <option value="price-high">Precio: mayor a menor</option>
                  </select>
                </div>
              </div>

              {/* Panel de Filtros */}
              {showFilters && (
                <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Categoría */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Categoría
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
                      >
                        <option value="all">Todas las categorías</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Talla */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Talla
                      </label>
                      <select
                        value={selectedSize}
                        onChange={e => setSelectedSize(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
                      >
                        <option value="all">Todas las tallas</option>
                        {allSizes.map(size => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Material */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Material
                      </label>
                      <select
                        value={selectedColor}
                        onChange={e => setSelectedColor(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
                      >
                        <option value="all">Todos los materiales</option>
                        {allColors.map(color => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Precio */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Precio: ${priceRange[0].toLocaleString()} - $
                        {priceRange[1].toLocaleString()}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        step="10000"
                        value={priceRange[1]}
                        onChange={e =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="w-full accent-rose-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Grid de Productos - Optimizado para uniformidad */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                  <Search size={56} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="mb-2 text-xl font-semibold text-gray-800">
                    No se encontraron productos
                  </h3>
                  <p className="mb-6 text-gray-500">
                    Intenta ajustar los filtros o cambiar la vista activa.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="rounded-full bg-rose-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                    : 'grid-cols-1'
                }`}
              >
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice || undefined}
                    image={product.image}
                    rating={product.rating || 4.5}
                    reviews={product.reviews || 0}
                    sizes={product.size}
                    colors={product.colors}
                    maxStock={product.stock || 10}
                    isNew={product.isNew}
                    isOnSale={product.isSale}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
