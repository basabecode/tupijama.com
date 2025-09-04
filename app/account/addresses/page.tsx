'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Home,
  Building,
  Star,
  Phone,
  User,
  Save,
  X,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

type Address = {
  id: string
  full_name: string | null
  phone: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  region: string | null
  postal_code: string | null
  country: string | null
  is_default_shipping: boolean
  is_default_billing: boolean
}

export default function AddressesPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Omit<Address, 'id'>>({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    region: '',
    postal_code: '',
    country: 'CO',
    is_default_shipping: false,
    is_default_billing: false,
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/addresses', { cache: 'no-store' })
        if (res.status === 401) {
          router.replace('/login?next=/account/addresses')
          return
        }
        const list = (await res.json()) as Address[]
        if (!active) return
        setAddresses(list)
      } catch (e: any) {
        setMsg('No se pudieron cargar tus direcciones')
      } finally {
        if (!active) return
        setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [router])

  const set = (k: keyof typeof form, v: any) => setForm(s => ({ ...s, [k]: v }))

  const save = async () => {
    setMsg(null)
    setSaving(true)

    if (!form.full_name || !form.address_line1 || !form.city) {
      setMsg('Nombre, dirección y ciudad son requeridos')
      setSaving(false)
      return
    }

    try {
      if (editingId) {
        const res = await fetch(`/api/addresses/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const j = await res.json()
        if (!res.ok) throw new Error(j?.error || 'No se pudo guardar')
        setAddresses(prev =>
          prev.map(a => (a.id === editingId ? ({ ...a, ...form } as any) : a))
        )
        setEditingId(null)
      } else {
        const res = await fetch('/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const j = await res.json()
        if (!res.ok) throw new Error(j?.error || 'No se pudo guardar')
        setAddresses(prev => [j, ...prev])
      }
      setMsg('✅ Dirección guardada correctamente')
      resetForm()
      setShowForm(false)

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMsg(null), 3000)
    } catch (e: any) {
      setMsg(`❌ ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setForm({
      full_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      region: '',
      postal_code: '',
      country: 'CO',
      is_default_shipping: false,
      is_default_billing: false,
    })
    setEditingId(null)
  }

  const edit = (a: Address) => {
    setEditingId(a.id)
    setForm({
      full_name: a.full_name || '',
      phone: a.phone || '',
      address_line1: a.address_line1 || '',
      address_line2: a.address_line2 || '',
      city: a.city || '',
      region: a.region || '',
      postal_code: a.postal_code || '',
      country: a.country || 'CO',
      is_default_shipping: a.is_default_shipping,
      is_default_billing: a.is_default_billing,
    })
    setShowForm(true)
  }

  const remove = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta dirección?'))
      return
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAddresses(prev => prev.filter(a => a.id !== id))
        setMsg('✅ Dirección eliminada')
        setTimeout(() => setMsg(null), 3000)
      } else {
        setMsg('❌ Error al eliminar la dirección')
      }
    } catch (error) {
      setMsg('❌ Error al eliminar la dirección')
    }
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  const handleNewAddress = () => {
    resetForm()
    setShowForm(true)
  }

  const handleCancelForm = () => {
    resetForm()
    setShowForm(false)
    setMsg(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header con botón de regreso */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToHome}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Volver al inicio</span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Mis Direcciones
                    </h1>
                    <p className="text-gray-600">
                      Gestiona tus direcciones de entrega y facturación
                    </p>
                  </div>
                </div>
              </div>

              {!showForm && (
                <button
                  onClick={handleNewAddress}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-colors shadow-lg"
                >
                  <Plus size={18} />
                  <span>Nueva Dirección</span>
                </button>
              )}
            </div>
          </div>

          {/* Mensaje de estado */}
          {msg && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                msg.includes('✅')
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {msg}
            </div>
          )}

          {/* Formulario */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingId ? 'Editar Dirección' : 'Nueva Dirección'}
                </h2>
                <button
                  onClick={handleCancelForm}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Información personal */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <User size={16} className="mr-2" />
                    Información Personal
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={form.full_name || ''}
                      onChange={e =>
                        setForm({ ...form, full_name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Ingresa tu nombre completo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={form.phone || ''}
                      onChange={e =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Número de teléfono"
                    />
                  </div>
                </div>

                {/* Dirección */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <Home size={16} className="mr-2" />
                    Dirección
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección principal *
                    </label>
                    <input
                      type="text"
                      value={form.address_line1 || ''}
                      onChange={e =>
                        setForm({ ...form, address_line1: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Calle, número, barrio"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Información adicional
                    </label>
                    <input
                      type="text"
                      value={form.address_line2 || ''}
                      onChange={e =>
                        setForm({ ...form, address_line2: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Apartamento, interior, referencia"
                    />
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 flex items-center mb-4">
                  <Building size={16} className="mr-2" />
                  Ubicación
                </h3>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      value={form.city || ''}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Ciudad"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departamento/Estado
                    </label>
                    <input
                      type="text"
                      value={form.region || ''}
                      onChange={e =>
                        setForm({ ...form, region: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Departamento"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código postal
                    </label>
                    <input
                      type="text"
                      value={form.postal_code || ''}
                      onChange={e =>
                        setForm({ ...form, postal_code: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Código postal"
                    />
                  </div>
                </div>
              </div>

              {/* Opciones por defecto */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-4">
                  Configuraciones por defecto
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_default_shipping}
                      onChange={e =>
                        setForm({
                          ...form,
                          is_default_shipping: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-rose-500 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">
                      Usar como dirección de envío por defecto
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_default_billing}
                      onChange={e =>
                        setForm({
                          ...form,
                          is_default_billing: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-rose-500 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">
                      Usar como dirección de facturación por defecto
                    </span>
                  </label>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-8 flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancelForm}
                  disabled={saving}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={save}
                  disabled={
                    saving ||
                    !form.full_name ||
                    !form.address_line1 ||
                    !form.city
                  }
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  <span>
                    {saving
                      ? 'Guardando...'
                      : editingId
                      ? 'Actualizar'
                      : 'Guardar'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Lista de direcciones */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Direcciones Guardadas ({addresses.length})
            </h2>

            {addresses.length === 0 ? (
              <div className="text-center py-12">
                <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tienes direcciones guardadas
                </h3>
                <p className="text-gray-600 mb-6">
                  Agrega tu primera dirección para realizar pedidos más rápido
                </p>
                <button
                  onClick={handleNewAddress}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-colors"
                >
                  <Plus size={18} />
                  <span>Agregar Dirección</span>
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addresses.map(address => (
                  <div
                    key={address.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Badges */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex space-x-2">
                        {address.is_default_shipping && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Star size={12} className="mr-1" />
                            Envío
                          </span>
                        )}
                        {address.is_default_billing && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Star size={12} className="mr-1" />
                            Facturación
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Información de la dirección */}
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <User size={16} className="text-gray-400 mt-0.5" />
                        <p className="font-medium text-gray-900">
                          {address.full_name || 'Sin nombre'}
                        </p>
                      </div>

                      {address.phone && (
                        <div className="flex items-start space-x-2">
                          <Phone size={16} className="text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-600">
                            {address.phone}
                          </p>
                        </div>
                      )}

                      <div className="flex items-start space-x-2">
                        <MapPin size={16} className="text-gray-400 mt-0.5" />
                        <div className="text-sm text-gray-600">
                          <p>{address.address_line1}</p>
                          {address.address_line2 && (
                            <p>{address.address_line2}</p>
                          )}
                          <p>
                            {address.city}
                            {address.region ? `, ${address.region}` : ''}
                          </p>
                          <p>
                            {address.postal_code} {address.country}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => edit(address)}
                        className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-1 justify-center"
                      >
                        <Edit size={14} />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => remove(address.id)}
                        className="flex items-center space-x-1 px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex-1 justify-center"
                      >
                        <Trash2 size={14} />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
