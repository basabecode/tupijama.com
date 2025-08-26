'use client'
import { useState } from 'react'

export default function NewProductPage() {
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
  const [msg, setMsg] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    const payload = {
      name: form.name,
      description: form.description || undefined,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      category: form.category || undefined,
      sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()) : [],
      colors: form.colors ? form.colors.split(',').map(s => s.trim()) : [],
      images: form.images ? form.images.split(',').map(s => s.trim()) : [],
      is_featured: form.is_featured,
      status: form.status as 'active' | 'archived',
    }
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!res.ok) setMsg(json.error || 'Error al crear')
    else {
      setMsg('Producto creado')
      setTimeout(() => {
        window.location.href = '/admin/products'
      }, 600)
    }
  }

  const set = (k: keyof typeof form, v: any) => setForm(s => ({ ...s, [k]: v }))

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Nuevo producto</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Nombre"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          required
        />
        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder="Descripción"
          value={form.description}
          onChange={e => set('description', e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Precio"
            value={form.price}
            onChange={e => set('price', e.target.value)}
            required
          />
          <input
            className="border px-3 py-2 rounded"
            placeholder="Stock"
            value={form.stock}
            onChange={e => set('stock', e.target.value)}
          />
        </div>
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Categoría"
          value={form.category}
          onChange={e => set('category', e.target.value)}
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Tallas (coma)"
          value={form.sizes}
          onChange={e => set('sizes', e.target.value)}
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Colores (coma)"
          value={form.colors}
          onChange={e => set('colors', e.target.value)}
        />
        <ImagesUploader onUploaded={urls => set('images', urls.join(','))} />
        <div className="flex items-center gap-2">
          <input
            id="feat"
            type="checkbox"
            checked={form.is_featured}
            onChange={e => set('is_featured', e.target.checked)}
          />
          <label htmlFor="feat">Destacado</label>
        </div>
        <select
          className="border px-3 py-2 rounded"
          value={form.status}
          onChange={e => set('status', e.target.value)}
        >
          <option value="active">Activo</option>
          <option value="archived">Archivado</option>
        </select>
        <button className="bg-black text-white px-4 py-2 rounded">Crear</button>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>
    </div>
  )
}

function ImagesUploader({
  onUploaded,
}: {
  onUploaded: (urls: string[]) => void
}) {
  const [files, setFiles] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const [urls, setUrls] = useState<string[]>([])
  const upload = async () => {
    if (!files || files.length === 0) return
    setLoading(true)
    const out: string[] = []
    for (const file of Array.from(files)) {
      const b64 = await fileToDataUrl(file)
      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: b64, filename: file.name }),
      })
      const json = await res.json()
      if (res.ok && json.publicUrl) out.push(json.publicUrl)
    }
    setUrls(out)
    onUploaded(out)
    setLoading(false)
  }
  return (
    <div className="space-y-2">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={e => setFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={upload}
        className="border px-3 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Subiendo...' : 'Subir imágenes'}
      </button>
      {!!urls.length && (
        <div className="text-xs text-gray-600">
          {urls.length} imagen(es) subida(s)
        </div>
      )}
    </div>
  )
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
