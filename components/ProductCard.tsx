'use client'

import React, { useState } from 'react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  sizes: string[]
  colors: string[]
  maxStock: number
  isNew?: boolean
  isOnSale?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
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
  isNew = false,
  isOnSale = false,
}) => {
  const [selectedSize, setSelectedSize] = useState(sizes[0] || 'M')
  const [selectedColor, setSelectedColor] = useState(colors[0] || 'Rosa')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { addItem, openCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(price)
  }

  const handleAddToCart = async () => {
    setIsLoading(true)

    // Simular una pequeña carga para UX
    await new Promise(resolve => setTimeout(resolve, 500))

    const cartItem = {
      id,
      name,
      price,
      image,
      size: selectedSize,
      color: selectedColor,
      maxStock,
    }

    addItem(cartItem)
    setIsLoading(false)

    // Opcional: abrir el carrito después de agregar
    setTimeout(() => {
      openCart()
    }, 300)
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // Aquí iría la lógica para agregar/quitar de wishlist
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }
      />
    ))
  }

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Imagen del producto */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              NUEVO
            </span>
          )}
          {isOnSale && discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Botón de wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg"
        >
          <Heart
            size={16}
            className={
              isWishlisted
                ? 'text-red-500 fill-current'
                : 'text-gray-600 hover:text-red-500'
            }
          />
        </button>

        {/* Overlay de acciones rápidas */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
          >
            {isLoading ? 'Agregando...' : 'Vista Rápida'}
          </button>
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-4">
        {/* Rating y reviews */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">{renderStars()}</div>
          <span className="text-sm text-gray-600">
            {rating} ({reviews} reseñas)
          </span>
        </div>

        {/* Nombre del producto */}
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {name}
        </h3>

        {/* Precios */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-rose-600">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Selecciones de talla y color */}
        <div className="space-y-3 mb-4">
          {/* Tallas */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Talla:
            </label>
            <div className="flex gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-8 h-8 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedSize === size
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colores */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Color:
            </label>
            <div className="flex gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                    selectedColor === color
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botón agregar al carrito */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-4 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <ShoppingCart size={18} />
          {isLoading ? 'Agregando...' : 'Agregar al Carrito'}
        </button>

        {/* Stock disponible */}
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">
            {maxStock > 10 ? 'Disponible' : `Solo ${maxStock} disponibles`}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
