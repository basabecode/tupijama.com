'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Heart, Eye, ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[] // Agregar array de todas las imágenes
  rating?: number // Opcional ahora
  reviews?: number // Opcional ahora
  sizes: string[]
  colors: string[] // Cambiará a tipos de tela
  maxStock: number
  description?: string // Agregar descripción
  isNew?: boolean
  isOnSale?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  images = [], // Valor por defecto
  rating = 0, // Valor por defecto
  reviews = 0, // Valor por defecto
  sizes,
  colors, // Ahora representa tipos de tela
  maxStock,
  description = '', // Valor por defecto
  isNew = false,
  isOnSale = false,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const imageList = images && images.length > 0 ? images : [image]
  const [currentIndex, setCurrentIndex] = useState(0)

  // Verificar si el producto está en wishlist al montar
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setIsWishlisted(wishlist.some((item: any) => item.id === id))
  }, [id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(price)
  }

  // La compra y selección de variaciones se gestionan en el modal de detalles
  const handleViewDetails = () => {
    // Emitir evento personalizado para que el Header abra el modal de detalles
    const event = new CustomEvent('openProductDetails', {
      detail: {
        id,
        name,
        price,
        originalPrice,
        image,
        rating,
        reviews,
        sizes,
        colors,
        maxStock,
        description:
          description ||
          'Pijama de alta calidad con materiales premium. Diseño cómodo y elegante perfecto para el descanso.',
        category: 'General',
        size: sizes,
        fabricType: colors,
        images: imageList,
      },
    })
    window.dispatchEvent(event)
  }

  const handleWishlist = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
      const wishlistItem = {
        id,
        name,
        price,
        image,
        maxStock,
      }

      let newWishlist
      if (isWishlisted) {
        // Remover del wishlist
        newWishlist = wishlist.filter((item: any) => item.id !== id)
        setIsWishlisted(false)
      } else {
        // Agregar al wishlist
        newWishlist = [...wishlist, wishlistItem]
        setIsWishlisted(true)
      }

      localStorage.setItem('wishlist', JSON.stringify(newWishlist))

      // Disparar evento para actualizar el contador del header
      const event = new Event('wishlistUpdated')
      window.dispatchEvent(event)

      console.log('Wishlist actualizado:', {
        productId: id,
        isWishlisted: !isWishlisted,
        totalItems: newWishlist.length,
      })
    } catch (error) {
      console.error('Error al actualizar wishlist:', error)
    }
  }

  // Funciones para rotar imágenes automáticamente en hover
  const startAutoRotate = () => {
    if (imageList.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % imageList.length)
      }, 1000) // Cambia cada segundo
    }
  }

  const stopAutoRotate = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setCurrentIndex(0) // Resetear a la primera imagen
    }
  }

  // Limpiar el intervalo al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  return (
    <div
      className="group flex h-[650px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-rose-200"
      onMouseEnter={startAutoRotate}
      onMouseLeave={stopAutoRotate}
    >
      {/* Imagen del producto */}
      <div
        className="relative h-[420px] cursor-pointer overflow-hidden"
        onClick={handleViewDetails}
      >
        <img
          src={imageList[currentIndex]}
          alt={name}
          className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
          style={{
            imageRendering: 'auto',
            objectFit: 'cover',
          }}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={e => {
            const target = e.target as HTMLImageElement
            if (target.src !== '/placeholder.jpg') {
              target.src = '/placeholder.jpg'
            }
          }}
        />

        {/* Badges - Posicionados de forma consistente */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isNew && (
            <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              NUEVO
            </span>
          )}
          {isOnSale && discount > 0 && (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Botón de favorito - Adelante y mejorado */}
        <button
          onClick={e => {
            e.stopPropagation()
            handleWishlist()
          }}
          className="absolute top-4 right-4 z-20 rounded-full bg-white/95 backdrop-blur-sm p-3 text-gray-600 shadow-lg transition-all hover:bg-white hover:scale-110"
          aria-label={
            isWishlisted ? 'Remover de favoritos' : 'Agregar a favoritos'
          }
        >
          <Heart
            size={20}
            className={`transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'hover:text-red-500'
            }`}
          />
        </button>

        {/* Indicadores de imagen múltiple - Mejorados */}
        {imageList.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex gap-1.5">
              {imageList.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-white shadow-md'
                      : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contenido de información - Layout optimizado y controlado */}
      <div className="flex h-[230px] flex-col p-4 text-center bg-white relative z-10">
        {/* Nombre del producto - Altura fija */}
        <div className="h-[40px] mb-1 flex items-center justify-center">
          <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-2">
            {name || 'Pijama Premium'}
          </h3>
        </div>

        {/* Descripción del producto - Altura fija */}
        <div className="h-[32px] mb-2 flex items-start justify-center">
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
            {description || 'Pijama de alta calidad con materiales premium.'}
          </p>
        </div>

        {/* Precio - Compacto */}
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="text-lg font-bold text-rose-600">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Botones horizontales - Compactos y eficientes */}
        <div className="mb-2 flex gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:from-rose-600 hover:to-pink-600 hover:shadow-md"
            aria-label="Comprar"
          >
            <span className="inline-flex items-center justify-center gap-1">
              <ShoppingCart size={14} /> Comprar
            </span>
          </button>
          <button
            onClick={handleViewDetails}
            className="flex-1 rounded-lg border-2 border-rose-500 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
            aria-label="Ver modelos"
          >
            <span className="inline-flex items-center justify-center gap-1">
              <Eye size={14} /> Ver
            </span>
          </button>
        </div>

        {/* Stock disponible - Compacto */}
        <div className="text-center">
          <span
            className={`text-xs font-medium ${
              maxStock <= 10 ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {maxStock > 10 ? '✓ Disponible' : `⚠ Solo ${maxStock} disponibles`}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
