'use client'

import { useState, useEffect } from 'react'
import { Check, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react'

interface MultiImageSelectorProps {
  images: string[]
  productName: string
  maxSelections?: number
  onSelectionChange: (
    selectedVariations: {
      index: number
      image: string
      variationName: string
    }[]
  ) => void
}

export default function MultiImageSelector({
  images,
  productName,
  maxSelections = 5,
  onSelectionChange,
}: MultiImageSelectorProps) {
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set())
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({})
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'gallery' | 'single'>('single')

  // Asegurar que tenemos al menos una imagen
  const imageList = images && images.length > 0 ? images : ['/placeholder.jpg']

  // Reset selections when images change (new product)
  useEffect(() => {
    setSelectedIndexes(new Set())
    setImageErrors({})
    // Notificar que no hay selecciones
    onSelectionChange([])
  }, [images, onSelectionChange])

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }))
  }

  const getImageSrc = (image: string, index: number) => {
    if (imageErrors[index]) return '/placeholder.jpg'
    if (!image || image === '') return '/placeholder.jpg'
    return image
  }

  const toggleSelection = (index: number) => {
    const newSelection = new Set(selectedIndexes)

    if (newSelection.has(index)) {
      // Remover selección
      newSelection.delete(index)
    } else {
      // Agregar selección (verificar límite)
      if (newSelection.size < maxSelections) {
        newSelection.add(index)
      } else {
        // Si se alcanzó el límite, no agregar
        return
      }
    }

    setSelectedIndexes(newSelection)

    // Notificar cambio a componente padre
    const selectedVariations = Array.from(newSelection).map(idx => ({
      index: idx,
      image: getImageSrc(imageList[idx], idx),
      variationName: `Diseño ${idx + 1}`,
    }))

    onSelectionChange(selectedVariations)
  }

  const isSelected = (index: number) => selectedIndexes.has(index)
  const canAddMore = selectedIndexes.size < maxSelections

  // Funciones de navegación para modo single
  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % imageList.length)
  }

  const prevImage = () => {
    setCurrentImageIndex(
      prev => (prev - 1 + imageList.length) % imageList.length
    )
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="space-y-6">
      {/* Header con toggle de vista */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">
            Selecciona tu modelo favorito haciendo click en el circulo superior
            derecho de cada imagen y escoge la talla.
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            Elige hasta {maxSelections} diseños ({selectedIndexes.size}/
            {maxSelections} seleccionados)
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('single')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'single'
                ? 'bg-rose-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Vista Individual
          </button>
          <button
            onClick={() => setViewMode('gallery')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'gallery'
                ? 'bg-rose-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Galería
          </button>
        </div>
      </div>

      {/* Vista Individual */}
      {viewMode === 'single' && (
        <div className="space-y-4">
          <div className="relative">
            {/* Imagen principal - Más vertical */}
            <div className="relative aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={getImageSrc(
                  imageList[currentImageIndex],
                  currentImageIndex
                )}
                alt={`${productName} - Diseño ${currentImageIndex + 1}`}
                className="w-full h-full object-cover object-center"
                onError={() => handleImageError(currentImageIndex)}
              />

              {/* Controles de navegación */}
              {imageList.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Botón de selección en la imagen */}
              <button
                onClick={() => toggleSelection(currentImageIndex)}
                disabled={!isSelected(currentImageIndex) && !canAddMore}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all shadow-lg ${
                  isSelected(currentImageIndex)
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : canAddMore
                    ? 'bg-white/90 border-gray-300 text-gray-600 hover:border-rose-300 hover:bg-white'
                    : 'bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSelected(currentImageIndex) ? (
                  <Check className="w-6 h-6" />
                ) : canAddMore ? (
                  <Plus className="w-6 h-6" />
                ) : (
                  <Minus className="w-6 h-6" />
                )}
              </button>

              {/* Indicador de posición */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {imageList.length}
              </div>
            </div>

            {/* Información del diseño actual */}
            <div className="text-center mt-4">
              <h5 className="font-semibold text-gray-800 text-lg">
                Diseño {currentImageIndex + 1}
              </h5>
              {isSelected(currentImageIndex) && (
                <p className="text-rose-600 text-sm font-medium mt-1">
                  ✓ Seleccionado
                </p>
              )}
            </div>
          </div>

          {/* Thumbnails de navegación */}
          {imageList.length > 1 && (
            <div className="flex gap-2 justify-center overflow-x-auto pb-2">
              {imageList.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-rose-500 ring-2 ring-rose-200'
                      : 'border-gray-200 hover:border-rose-300'
                  }`}
                >
                  <img
                    src={getImageSrc(image, index)}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(index)}
                  />
                  {isSelected(index) && (
                    <div className="absolute inset-0 bg-rose-500/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vista Galería */}
      {viewMode === 'gallery' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {imageList.map((image, index) => {
            const selected = isSelected(index)
            const disabled = !selected && !canAddMore

            return (
              <div
                key={index}
                className={`relative group cursor-pointer transition-all duration-200 ${
                  disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => !disabled && toggleSelection(index)}
              >
                {/* Imagen con aspect ratio vertical optimizado */}
                <div
                  className={`relative aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selected
                      ? 'border-rose-500 ring-2 ring-rose-200 shadow-lg'
                      : disabled
                      ? 'border-gray-200'
                      : 'border-gray-300 hover:border-rose-300 hover:shadow-md'
                  }`}
                >
                  <img
                    src={getImageSrc(image, index)}
                    alt={`${productName} - Diseño ${index + 1}`}
                    className={`w-full h-full object-cover object-center transition-transform duration-200 ${
                      selected ? 'scale-105' : 'group-hover:scale-105'
                    }`}
                    onError={() => handleImageError(index)}
                  />

                  {/* Overlay de selección */}
                  <div
                    className={`absolute inset-0 transition-all duration-200 ${
                      selected
                        ? 'bg-rose-500/20'
                        : disabled
                        ? 'bg-gray-500/30'
                        : 'bg-black/0 group-hover:bg-black/10'
                    }`}
                  />

                  {/* Checkbox/indicador */}
                  <div
                    className={`absolute top-3 right-3 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 shadow-sm ${
                      selected
                        ? 'bg-rose-500 border-rose-500 text-white'
                        : disabled
                        ? 'bg-gray-300 border-gray-300 text-gray-500'
                        : 'bg-white/90 border-gray-300 text-gray-600 group-hover:border-rose-300'
                    }`}
                  >
                    {selected ? (
                      <Check className="w-4 h-4" />
                    ) : disabled ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </div>

                  {/* Número de diseño */}
                  <div
                    className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 shadow-sm ${
                      selected
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/90 text-gray-700'
                    }`}
                  >
                    Diseño {index + 1}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Preview de selecciones */}
      {selectedIndexes.size > 0 && (
        <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
          <h5 className="font-medium text-rose-800 mb-2">
            Diseños Seleccionados:
          </h5>
          <div className="flex flex-wrap gap-2">
            {Array.from(selectedIndexes).map(index => (
              <div
                key={index}
                className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm"
              >
                <span>Diseño {index + 1}</span>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    toggleSelection(index)
                  }}
                  className="hover:bg-rose-200 rounded-full p-0.5 transition-colors"
                >
                  <Plus className="w-3 h-3 rotate-45" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje de límite alcanzado */}
      {!canAddMore && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-700">
            <span className="font-medium">Límite alcanzado:</span> Has
            seleccionado el máximo de {maxSelections} diseños. Puedes
            deseleccionar algunos para elegir otros.
          </p>
        </div>
      )}
    </div>
  )
}
