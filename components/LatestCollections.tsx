'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  Sparkles,
  ArrowRight,
  Eye,
  Heart,
  ShoppingCart,
  Clock,
  TrendingUp,
  Star,
  Zap,
  Gift,
} from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import ImageSelector from './ImageSelector'

interface LatestProduct {
  id: string
  name: string
  price: number
  image: string
  images: string[]
  category: string
  description: string
  created_at: string
  colors: string[]
  sizes: string[]
  stock: number
}

export default function LatestCollections() {
  const [latestProducts, setLatestProducts] = useState<LatestProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<{
    [productId: string]: string
  }>({})
  const { addItem } = useCart()
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlist()

  // 🔄 Cargar los productos más recientes de la base de datos
  const loadLatestProducts = async () => {
    try {
      setLoading(true)
      const supabase = supabaseBrowser()

      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(16)

      if (error) {
        console.error('Error loading latest products:', error)
        return
      }

      if (products) {
        console.log('🔍 Debug - Productos raw de DB:', products.slice(0, 2))

        const formattedProducts: LatestProduct[] = products.map((p: any) => {
          // Normalizar imágenes - asegurar que tenemos un array
          const images =
            Array.isArray(p.images) && p.images.length > 0
              ? p.images.map((img: any) => String(img))
              : ['/placeholder.jpg']

          // La imagen principal es la primera del array
          const image = images[0]

          console.log(
            `🖼️ Producto ${p.name}: imagen principal = ${image}, total imágenes = ${images.length}`
          )

          return {
            id: String(p.id),
            name: p.name,
            price: Number(p.price) || 0,
            image: image,
            images: images,
            category: p.category || 'General',
            description: p.description || '',
            created_at: p.created_at,
            colors: Array.isArray(p.colors) ? p.colors : ['Algodón'],
            sizes: Array.isArray(p.sizes) ? p.sizes : ['M'],
            stock: p.stock || 0,
          }
        })

        setLatestProducts(formattedProducts)
        console.log('✅ Latest products loaded:', formattedProducts.length)
      }
    } catch (error) {
      console.error('❌ Error loading latest products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLatestProducts()
  }, [])

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Hace 1 día'
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`
    return `Hace ${Math.ceil(diffDays / 30)} meses`
  }

  // Función para añadir al carrito - REDIRIGIR AL MODAL
  const handleAddToCart = (product: LatestProduct) => {
    // En lugar de agregar directamente, abrir el modal para seleccionar imagen + talla
    handleViewDetails(product)
  }

  // Función para manejar wishlist - REDIRIGIR AL MODAL
  const handleWishlistToggle = (product: LatestProduct) => {
    // En lugar de usar localStorage, abrir el modal para seleccionar imágenes
    handleViewDetails(product)
  }

  // Función para manejar selección de imagen - MEJORADA
  const handleImageSelect = (productId: string, selectedImage: string) => {
    setSelectedImages(prev => ({
      ...prev,
      [productId]: selectedImage,
    }))
    console.log(
      `🖼️ Imagen seleccionada para producto ${productId}: ${selectedImage}`
    )
  }

  // Función para ver detalles del producto
  const handleViewDetails = (product: LatestProduct) => {
    window.dispatchEvent(
      new CustomEvent('openProductDetails', {
        detail: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: selectedImages[product.id] || product.image,
          images: product.images,
          category: product.category,
          description: product.description,
          sizes: product.sizes,
          colors: product.colors,
          stock: product.stock,
          rating: 4.5,
          reviews: 0,
          size: product.sizes,
          fabricType: product.colors,
        },
      })
    )
  }

  // Función para agregar a wishlist (compatibilidad)
  const handleAddToWishlist = (product: LatestProduct) => {
    handleWishlistToggle(product)
  }

  // Usar la lista completa de productos filtrada (sin control de categoría)
  const filteredProducts = latestProducts

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
              <span className="text-lg text-gray-600">
                Cargando últimas colecciones...
              </span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (latestProducts.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/40 to-pink-300/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-indigo-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-r from-rose-300/30 to-pink-400/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-indigo-300/30 to-purple-400/30 rounded-full blur-xl animate-float delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header moderno con filtros */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-purple-200 shadow-lg">
            <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
            <span className="text-purple-700 font-semibold text-sm uppercase tracking-wider">
              Últimas Tendencias
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent mb-6 leading-tight">
            👚 Nuevas Colecciones
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Explora nuestras últimas creaciones. Diseños únicos que combinan
            elegancia, confort y las tendencias más actuales en ropa de
            descanso.
          </p>

          {/* Filtro de categorías eliminado: mostrar todas las colecciones por defecto */}
        </div>

        {/* Layout tipo Magazine - Responsivo y Moderno */}
        <div className="max-w-7xl mx-auto scroll-mt-28" id="collection-heading">
          {/* Hero Section - Producto Principal con fondo transparente creativo */}
          {filteredProducts[0] && (
            <div className="mb-8 lg:mb-12">
              <div
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredProduct(filteredProducts[0].id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Contenedor principal con fondo transparente y watermark */}
                <div className="relative bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-1000 group-hover:scale-[1.01] group-hover:shadow-3xl border border-white/20">
                  {/* Patrón decorativo de fondo */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-xl"></div>
                    <div className="absolute bottom-16 right-16 w-32 h-32 bg-gradient-to-br from-blue-200/15 to-indigo-200/15 rounded-full blur-2xl"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-rose-200/25 to-pink-200/25 rounded-full blur-lg"></div>
                  </div>

                  {/* Grid interno responsivo */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] lg:min-h-[500px] relative z-20">
                    {/* Imagen */}
                    <div className="relative overflow-hidden lg:order-2">
                      <ImageSelector
                        images={filteredProducts[0].images}
                        productName={filteredProducts[0].name}
                        onImageSelect={selectedImage =>
                          handleImageSelect(
                            filteredProducts[0].id,
                            selectedImage
                          )
                        }
                        className="h-full"
                        showThumbnails={filteredProducts[0].images.length > 1}
                      />

                      {/* Badge flotante con mejor contraste */}
                      <div className="absolute top-6 right-6 z-30">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl animate-pulse backdrop-blur-sm">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Tendencia
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contenido con fondo semi-transparente */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center lg:order-1 relative z-10">
                      {/* Fondo semi-transparente para el contenido */}
                      <div className="absolute inset-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 z-0"></div>

                      {/* Contenido */}
                      <div className="relative z-20">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-purple-700 bg-purple-100/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold border border-purple-200/50">
                            {filteredProducts[0].category}
                          </span>
                          <span className="text-gray-600 text-sm bg-white/50 px-2 py-1 rounded-full">
                            {formatDate(filteredProducts[0].created_at)}
                          </span>
                        </div>

                        <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight drop-shadow-sm">
                          {filteredProducts[0].name}
                        </h3>

                        <p className="text-gray-700 text-lg leading-relaxed mb-6 line-clamp-3 drop-shadow-sm">
                          {filteredProducts[0].description}
                        </p>

                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                              ${filteredProducts[0].price.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 text-yellow-400 fill-current"
                                />
                              ))}
                              <span className="text-gray-600 text-sm ml-1">
                                (4.8)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Botones de acción con mejor contraste */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() =>
                              handleViewDetails(filteredProducts[0])
                            }
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 backdrop-blur-sm"
                          >
                            <Eye className="w-5 h-5" />
                            Ver modelos
                          </button>
                          <button
                            onClick={() => handleAddToCart(filteredProducts[0])}
                            className="flex-1 bg-white/80 backdrop-blur-sm border-2 border-purple-300/50 text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-white/90 hover:border-purple-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                          >
                            <ShoppingCart className="w-5 h-5" />
                            Agregar al Carrito
                          </button>
                          <button
                            onClick={() =>
                              handleWishlistToggle(filteredProducts[0])
                            }
                            className={`border-2 px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm shadow-md ${
                              isInWishlist(filteredProducts[0].id)
                                ? 'bg-red-50/80 border-red-300/50 text-red-700 hover:bg-red-100/80 hover:border-red-400'
                                : 'bg-white/80 border-gray-300/50 text-gray-700 hover:bg-white/90 hover:border-gray-400'
                            }`}
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                isInWishlist(filteredProducts[0].id)
                                  ? 'fill-current'
                                  : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Watermark vertical repetido "PijamaCandy" - Degradado pastel TAMAÑO x2 */}
                  <div className="absolute left-0 top-0 bottom-0 w-1/2 lg:w-[45%] flex flex-col items-center justify-center pointer-events-none overflow-hidden z-30 gap-6">
                    {/* Repetición 1 - Rosa pastel más visible - TAMAÑO x2 */}
                    <div
                      className="text-[3.6rem] sm:text-[4.4rem] md:text-[5.6rem] lg:text-[6.4rem] font-black select-none transform -rotate-12 whitespace-nowrap"
                      style={{
                        color: 'rgba(236, 72, 153, 0.15)',
                        textShadow: '2px 2px 4px rgba(255,255,255,0.25)',
                        WebkitTextStroke: '1px rgba(236, 72, 153, 0.10)',
                      }}
                    >
                      PijamaCandy
                    </div>

                    {/* Repetición 2 - Púrpura pastel - TAMAÑO x2 */}
                    <div
                      className="text-[3.2rem] sm:text-[4rem] md:text-[4.8rem] lg:text-[5.6rem] font-black select-none transform rotate-6 whitespace-nowrap"
                      style={{
                        color: 'rgba(147, 51, 234, 0.13)',
                        textShadow: '2px 2px 3px rgba(255,255,255,0.2)',
                        WebkitTextStroke: '1px rgba(147, 51, 234, 0.08)',
                      }}
                    >
                      PijamaCandy
                    </div>

                    {/* Repetición 3 - Azul pastel - TAMAÑO x2 */}
                    <div
                      className="text-[2.8rem] sm:text-[3.6rem] md:text-[4.4rem] lg:text-[5.2rem] font-black select-none transform -rotate-8 whitespace-nowrap"
                      style={{
                        color: 'rgba(59, 130, 246, 0.11)',
                        textShadow: '2px 2px 3px rgba(255,255,255,0.15)',
                        WebkitTextStroke: '1px rgba(59, 130, 246, 0.07)',
                      }}
                    >
                      PijamaCandy
                    </div>

                    {/* Repetición 4 - Verde pastel - TAMAÑO x2 */}
                    <div
                      className="text-[2.4rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.8rem] font-black select-none transform rotate-4 whitespace-nowrap"
                      style={{
                        color: 'rgba(34, 197, 94, 0.09)',
                        textShadow: '2px 2px 2px rgba(255,255,255,0.12)',
                        WebkitTextStroke: '1px rgba(34, 197, 94, 0.06)',
                      }}
                    >
                      PijamaCandy
                    </div>

                    {/* Repetición 5 - Coral pastel - TAMAÑO x2 */}
                    <div
                      className="text-[2rem] sm:text-[2.8rem] md:text-[3.6rem] lg:text-[4.4rem] font-black select-none transform -rotate-6 whitespace-nowrap"
                      style={{
                        color: 'rgba(251, 113, 133, 0.07)',
                        textShadow: '2px 2px 2px rgba(255,255,255,0.1)',
                        WebkitTextStroke: '1px rgba(251, 113, 133, 0.05)',
                      }}
                    >
                      PijamaCandy
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid de Productos Destacados */}
          {filteredProducts.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
              {filteredProducts.slice(1, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="group cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <ImageSelector
                        images={product.images}
                        productName={product.name}
                        onImageSelect={selectedImage =>
                          handleImageSelect(product.id, selectedImage)
                        }
                        showThumbnails={false}
                      />

                      {/* Badge dinámico */}
                      <div className="absolute top-4 left-4 z-10">
                        <div
                          className={`text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg ${
                            index % 3 === 0
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                              : index % 3 === 1
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                              : 'bg-gradient-to-r from-orange-500 to-red-500'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            {index % 3 === 0 ? (
                              <>
                                <Zap className="w-3 h-3" /> Nuevo
                              </>
                            ) : index % 3 === 1 ? (
                              <>
                                <Star className="w-3 h-3" /> Popular
                              </>
                            ) : (
                              <>
                                <Gift className="w-3 h-3" /> Oferta
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Botones flotantes */}
                      <div
                        className={`absolute bottom-4 right-4 flex gap-2 transition-all duration-300 z-10 ${
                          hoveredProduct === product.id
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-2'
                        }`}
                      >
                        <button
                          onClick={() => handleWishlistToggle(product)}
                          className={`w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-colors ${
                            isInWishlist(product.id)
                              ? 'bg-red-100/90 text-red-600 hover:bg-red-200/90'
                              : 'bg-white/90 text-gray-700 hover:bg-white'
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isInWishlist(product.id) ? 'fill-current' : ''
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>

                      {/* Información superpuesta */}
                      <div
                        className={`absolute bottom-4 left-4 right-16 transition-all duration-300 z-10 ${
                          hoveredProduct === product.id
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-2'
                        }`}
                      >
                        <h4 className="text-white font-bold text-lg mb-1 drop-shadow-lg line-clamp-1">
                          {product.name}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-bold text-xl drop-shadow-lg">
                            ${product.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contenido de la tarjeta */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            index % 3 === 0
                              ? 'text-emerald-600 bg-emerald-100'
                              : index % 3 === 1
                              ? 'text-blue-600 bg-blue-100'
                              : 'text-orange-600 bg-orange-100'
                          }`}
                        >
                          {product.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(product.created_at)}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                        {product.name}
                      </h4>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xl font-bold ${
                            index % 3 === 0
                              ? 'text-emerald-600'
                              : index % 3 === 1
                              ? 'text-blue-600'
                              : 'text-orange-600'
                          }`}
                        >
                          ${product.price.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleViewDetails(product)}
                          className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                        >
                          Ver más →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grid Compacto - Productos Restantes */}
          {filteredProducts.length > 4 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredProducts.slice(4, 10).map((product, index) => (
                <div
                  key={product.id}
                  className="group cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <ImageSelector
                        images={product.images}
                        productName={product.name}
                        onImageSelect={selectedImage =>
                          handleImageSelect(product.id, selectedImage)
                        }
                        showThumbnails={false}
                      />

                      {/* Badge pequeño */}
                      <div className="absolute top-2 left-2 z-10">
                        <div className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                          Nuevo
                        </div>
                      </div>

                      {/* Precio y botón superpuesto */}
                      <div
                        className={`absolute bottom-2 left-2 right-2 transition-all duration-300 z-10 ${
                          hoveredProduct === product.id
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-2'
                        }`}
                      >
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                          <h5 className="text-xs font-bold text-gray-800 line-clamp-1 mb-1">
                            {product.name}
                          </h5>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-purple-600">
                              ${product.price.toLocaleString()}
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleWishlistToggle(product)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                  isInWishlist(product.id)
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                              >
                                <Heart
                                  className={`w-3 h-3 ${
                                    isInWishlist(product.id)
                                      ? 'fill-current'
                                      : ''
                                  }`}
                                />
                              </button>
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
                              >
                                <ShoppingCart className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action Mejorado */}
        <div className="text-center mt-12 lg:mt-16">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 lg:p-12 text-white shadow-2xl">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              ¿Te encanta lo que ves? 💖
            </h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Explora toda nuestra colección y encuentra tu pijama
              perfecta.Apoya lo nuestro, pijamas hechas en Colombia para noches
              inolvidables.
            </p>
            <button className="inline-flex items-center gap-3 bg-white text-purple-700 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span>Explorar Colección Completa</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
