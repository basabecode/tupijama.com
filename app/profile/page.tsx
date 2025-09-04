'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import { useRouter } from 'next/navigation'
import { User, Mail, Calendar, Shield, Edit2, Save, X } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface UserProfile {
  id: string
  email: string
  name?: string
  phone?: string
  created_at: string
  role?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const supabase = supabaseBrowser()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const userProfile: UserProfile = {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.user_metadata?.full_name || '',
      phone: user.user_metadata?.phone || '',
      created_at: user.created_at,
      role: user.app_metadata?.role || user.user_metadata?.role || 'user',
    }

    setUser(userProfile)
    setFormData({
      name: userProfile.name || '',
      phone: userProfile.phone || '',
    })
    setLoading(false)
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    const supabase = supabaseBrowser()

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          phone: formData.phone,
        },
      })

      if (error) throw error

      // Actualizar el estado local
      setUser({
        ...user,
        name: formData.name,
        phone: formData.phone,
      })

      setEditing(false)
      alert('Perfil actualizado correctamente')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error al actualizar el perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
    })
    setEditing(false)
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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name || 'Usuario'}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                >
                  <Edit2 size={16} />
                  <span>Editar</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Información Personal
            </h2>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center space-x-4">
                <Mail size={20} className="text-gray-400" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {user.email}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    El email no se puede modificar
                  </p>
                </div>
              </div>

              {/* Name */}
              <div className="flex items-center space-x-4">
                <User size={20} className="text-gray-400" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Ingresa tu nombre"
                    />
                  ) : (
                    <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {user.name || 'No especificado'}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4">
                <User size={20} className="text-gray-400" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Ingresa tu teléfono"
                    />
                  ) : (
                    <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {user.phone || 'No especificado'}
                    </div>
                  )}
                </div>
              </div>

              {/* Member since */}
              <div className="flex items-center space-x-4">
                <Calendar size={20} className="text-gray-400" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Miembro desde
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {new Date(user.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center space-x-4">
                <Shield size={20} className="text-gray-400" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de cuenta
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              {editing && (
                <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{saving ? 'Guardando...' : 'Guardar'}</span>
                  </button>

                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X size={16} />
                    <span>Cancelar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
