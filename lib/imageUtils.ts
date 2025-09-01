// Lista de imágenes disponibles en public/piyamas/
export const AVAILABLE_IMAGES = [
  '/piyamas/tela_calis_2.jpg',
  '/piyamas/tela_chalis_3.jpg',
  '/piyamas/tela_chalis_4.jpg',
  '/piyamas/tela_chalis_crepe.jpg',
]

// Función para obtener una imagen aleatoria
export const getRandomImage = (): string => {
  return AVAILABLE_IMAGES[Math.floor(Math.random() * AVAILABLE_IMAGES.length)]
}

// Función para procesar URLs de Supabase
export const processImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    return getRandomImage()
  }

  // Si es una URL de Supabase Storage, extraer el nombre del archivo
  if (imageUrl.startsWith('https://') && imageUrl.includes('supabase')) {
    const fileName = imageUrl.split('/').pop()
    if (fileName) {
      // Intentar con la carpeta de pijamas primero
      return `/piyamas/${fileName}`
    }
  }

  // Si no empieza con http, es ruta local
  if (!imageUrl.startsWith('http')) {
    return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
  }

  // Fallback a imagen aleatoria
  return getRandomImage()
}

// Handler de error para componentes de imagen
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  e.currentTarget.src = getRandomImage()
}
