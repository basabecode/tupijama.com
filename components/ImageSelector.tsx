'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageSelectorProps {
  images: string[]
  productName: string
  onImageSelect?: (selectedImage: string, selectedIndex: number) => void
  className?: string
  showThumbnails?: boolean
}

export default function ImageSelector({
  images,
  productName,
  onImageSelect,
  className = '',
  showThumbnails = true,
}: ImageSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({})

  // Asegurar que tenemos al menos una imagen
  const imageList = images && images.length > 0 ? images : ['/placeholder.jpg']

  const handleImageSelect = (index: number) => {
    setSelectedIndex(index)
    onImageSelect?.(imageList[index], index)
  }

  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }))
  }

  const getImageSrc = (image: string, index: number) => {
    if (imageError[index]) return '/placeholder.jpg'
    if (!image || image === '') return '/placeholder.jpg'
    return image
  }

  const goToPrevious = () => {
    const newIndex =
      selectedIndex > 0 ? selectedIndex - 1 : imageList.length - 1
    handleImageSelect(newIndex)
  }

  const goToNext = () => {
    const newIndex =
      selectedIndex < imageList.length - 1 ? selectedIndex + 1 : 0
    handleImageSelect(newIndex)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Imagen principal */}
      <div className="relative group">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100">
          <img
            src={getImageSrc(imageList[selectedIndex], selectedIndex)}
            alt={`${productName} - Imagen ${selectedIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => handleImageError(selectedIndex)}
          />

          {/* Navegación por flechas (solo si hay múltiples imágenes) */}
          {imageList.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
            </>
          )}

          {/* Indicador de cantidad de imágenes */}
          {imageList.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
              {selectedIndex + 1}/{imageList.length}
            </div>
          )}
        </div>
      </div>

      {/* Miniaturas (solo si hay múltiples imágenes y showThumbnails es true) */}
      {showThumbnails && imageList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imageList.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageSelect(index)}
              className={`flex-shrink-0 relative aspect-square w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedIndex === index
                  ? 'border-purple-500 ring-2 ring-purple-200 scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={getImageSrc(image, index)}
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(index)}
              />

              {/* Overlay de selección */}
              {selectedIndex === index && (
                <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
