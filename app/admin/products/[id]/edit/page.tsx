'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Upload, X, Eye, Trash2, Plus, ArrowLeft } from 'lucide-react'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams() as { id?: string }
  const id = params?.id as string
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    sizes: '',
    colors: '',
    images: '',
    is_featured: false,
    status: 'active',
  })

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch(`/api/products/${id}?includeAll=true`, {
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('No se pudo cargar el producto')
        const p = await res.json()
        if (!active) return
        setForm({
          name: p.name ?? '',
          description: p.description ?? '',
          price: String(p.price ?? ''),
          stock: String(p.stock ?? ''),
          category: p.category ?? '',
          sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : '',
          colors: Array.isArray(p.colors) ? p.colors.join(', ') : '',
          images: Array.isArray(p.images) ? p.images.join(', ') : '',
          is_featured: !!p.is_featured,
          status: p.status ?? 'active',
        })

        // Establecer imágenes ya subidas
        if (Array.isArray(p.images)) {
          setUploadedImages(p.images)
        }
      } catch (e: any) {
        setMsg(e.message)
      } finally {
        if (!active) return
        setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [id])

  const set = (k: keyof typeof form, v: any) => setForm(s => ({ ...s, [k]: v }))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newImages: string[] = []

    try {
      for (const file of Array.from(files)) {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          setMsg(`${file.name} no es una imagen válida`)
          continue
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setMsg(`${file.name} es muy grande (máximo 5MB)`)
          continue
        }

        // Convertir a base64
        const reader = new FileReader()
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        // Subir imagen
        const response = await fetch('/api/storage/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64,
            filename: file.name,
          }),
        })

        const result = await response.json()
        if (!response.ok) {
          throw new Error(result.error || 'Error al subir imagen')
        }

        newImages.push(result.publicUrl)
      }

      // Actualizar las imágenes
      setUploadedImages(prev => [...prev, ...newImages])

      // Actualizar el formulario
      const allImages = [...uploadedImages, ...newImages]
      set('images', allImages.join(', '))

      setMsg(`${newImages.length} imagen(es) subidas correctamente`)
      setTimeout(() => setMsg(null), 3000)
    } catch (error: any) {
      setMsg(error.message || 'Error al subir imágenes')
    } finally {
      setUploading(false)
      // Limpiar el input
      e.target.value = ''
    }
  }

  const removeImage = (indexToRemove: number) => {
    const newImages = uploadedImages.filter(
      (_, index) => index !== indexToRemove
    )
    setUploadedImages(newImages)
    set('images', newImages.join(', '))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    const payload: any = {
      name: form.name,
      description: form.description || null,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      category: form.category || null,
      sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()) : [],
      colors: form.colors ? form.colors.split(',').map(s => s.trim()) : [],
      images:
        uploadedImages.length > 0
          ? uploadedImages
          : form.images
          ? form.images.split(',').map(s => s.trim())
          : [],
      is_featured: form.is_featured,
      status: form.status as 'active' | 'archived',
    }
    const res = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMsg((json as any)?.error || 'Error al actualizar')
      return
    }
    router.push('/admin/products')
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/admin/products')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Volver a productos</span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Editar Producto
                </h1>
              </div>
            </div>
          </div>

          {/* Mensaje de estado */}
          {msg && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                msg.includes('correctamente') || msg.includes('subidas')
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {msg}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Información básica */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Información Básica
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del producto *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Nombre del producto"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={form.description}
                      onChange={e => set('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                      placeholder="Descripción del producto"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={e => set('price', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={e => set('stock', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={e => set('category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Pijamas, Ropa interior, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Variantes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Variantes
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tallas disponibles
                    </label>
                    <input
                      type="text"
                      value={form.sizes}
                      onChange={e => set('sizes', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="XS, S, M, L, XL"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separar con comas
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Colores disponibles
                    </label>
                    <input
                      type="text"
                      value={form.colors}
                      onChange={e => set('colors', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Rosa, Azul, Blanco"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separar con comas
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.is_featured}
                        onChange={e => set('is_featured', e.target.checked)}
                        className="w-4 h-4 text-rose-500 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-700">
                        Producto destacado
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={form.status}
                      onChange={e => set('status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    >
                      <option value="active">Activo</option>
                      <option value="archived">Archivado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Gestión de imágenes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Imágenes del Producto
              </h2>

              {/* Input de carga */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subir nuevas imágenes
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Clic para subir</span> o
                        arrastra archivos
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG (MAX. 5MB cada una)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {uploading && (
                  <div className="mt-2 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-500 mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Subiendo imágenes...
                    </span>
                  </div>
                )}
              </div>

              {/* Imágenes actuales */}
              {uploadedImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Imágenes actuales ({uploadedImages.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={`Producto ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={e => {
                              const target = e.target as HTMLImageElement
                              target.src = '/placeholder.jpg'
                            }}
                          />
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-colors"
                          >
                            <Eye size={14} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Campo manual de URLs (fallback) */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URLs manuales (opcional)
                </label>
                <input
                  type="text"
                  value={form.images}
                  onChange={e => set('images', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separar múltiples URLs con comas. Estas se agregarán a las
                  imágenes subidas.
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/admin/products')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Subiendo...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
