'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Home,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type Mode = 'signin' | 'signup'
type AuthMethod = 'password' | 'otp'

export function LoginFormImproved() {
  const supabase = supabaseBrowser()
  const params = useSearchParams()
  const router = useRouter()
  const next = useMemo(() => params.get('next') || '/', [params])

  const [mode, setMode] = useState<Mode>('signin')
  const [method, setMethod] = useState<AuthMethod>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [verificationSent, setVerificationSent] = useState(false)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    // Si ya hay sesión, decide destino: admin -> /admin, otro -> next
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user
      if (!user) return
      const role =
        (user.app_metadata as any)?.role || (user.user_metadata as any)?.role
      const target = next || (role === 'admin' ? '/admin' : '/')
      router.replace(target)
    })
  }, [next, router, supabase])

  const handleSignInPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    if (error) {
      const msg = error.message || 'No se pudo iniciar sesión'
      setMessage(msg)
      return
    }
    const user = data.user
    if (user) {
      const role =
        (user.app_metadata as any)?.role || (user.user_metadata as any)?.role
      const target = next || (role === 'admin' ? '/admin' : '/')
      router.replace(target)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setMessage('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          typeof window !== 'undefined'
            ? `${window.location.origin}/login?next=${encodeURIComponent(next)}`
            : undefined,
      },
    })
    setLoading(false)
    if (error) {
      setMessage(error.message || 'No se pudo crear la cuenta')
      return
    }
    setVerificationSent(true)
    setTimeout(() => setCanResend(true), 60000)
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== 'undefined'
            ? `${window.location.origin}/login?next=${encodeURIComponent(next)}`
            : undefined,
      },
    })
    setLoading(false)
    if (error) {
      setMessage(error.message || 'No se pudo enviar el enlace mágico')
      return
    }
    setVerificationSent(true)
    setTimeout(() => setCanResend(true), 60000)
  }

  const handleGoogle = async () => {
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo:
          typeof window !== 'undefined'
            ? `${window.location.origin}/login?next=${encodeURIComponent(next)}`
            : undefined,
      },
    })
    setLoading(false)
    if (error) {
      setMessage(error.message || 'No se pudo iniciar sesión con Google')
    }
  }

  const handleReset = async () => {
    if (!email) {
      setMessage('Por favor, introduce tu email primero')
      return
    }
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== 'undefined'
          ? `${window.location.origin}/update-password`
          : undefined,
    })
    setLoading(false)
    if (error) {
      setMessage(error.message || 'No se pudo enviar el correo de recuperación')
      return
    }
    setMessage('Te hemos enviado un enlace para restablecer tu contraseña')
  }

  const handleResend = async () => {
    setLoading(true)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo:
          typeof window !== 'undefined'
            ? `${window.location.origin}/login?next=${encodeURIComponent(next)}`
            : undefined,
      },
    } as any)
    setLoading(false)
    setMessage(
      error ? error.message : 'Hemos reenviado el correo de verificación.'
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Botón de regreso */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver al inicio</span>
          </Link>
        </div>

        {/* Header con logo */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center">
            <Link href="/" aria-label="Ir al inicio" className="mb-4">
              <Image
                src="/logotipo/logo_edit_2.png"
                alt="PijamaCandy Logo"
                width={300}
                height={100}
                className="h-16 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
                priority
              />
            </Link>
            <p className="text-gray-600 text-lg">
              {mode === 'signin' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
            </p>
          </div>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {verificationSent ? (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                ¡Revisa tu email!
              </h3>
              <p className="text-gray-600 mb-6">
                Te hemos enviado un enlace de verificación a{' '}
                <strong>{email}</strong>
              </p>

              <div className="space-y-3">
                {canResend && (
                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center text-rose-600 hover:text-rose-700 font-medium py-2 px-4 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Reenviando...' : 'Reenviar correo'}
                  </button>
                )}

                <Link
                  href="/"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-colors"
                >
                  <Home size={18} />
                  <span>Ir al inicio</span>
                </Link>

                <button
                  onClick={() => {
                    setVerificationSent(false)
                    setMode('signin')
                  }}
                  className="w-full text-gray-600 hover:text-gray-800 py-2 font-medium"
                >
                  Volver al login
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tabs para Iniciar sesión / Registrarse */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    mode === 'signin'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    mode === 'signup'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Registrarse
                </button>
              </div>

              {/* Botón Google */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-gray-300 py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all mb-6 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </button>

              {/* Separador */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    o continúa con email
                  </span>
                </div>
              </div>

              {/* Tabs método de autenticación */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setMethod('password')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    method === 'password'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Lock className="w-4 h-4 inline mr-2" />
                  Contraseña
                </button>
                <button
                  onClick={() => setMethod('otp')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    method === 'otp'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  Magic Link
                </button>
              </div>

              {method === 'password' ? (
                <form
                  onSubmit={
                    mode === 'signin' ? handleSignInPassword : handleSignUp
                  }
                  className="space-y-4"
                >
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPwd ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPwd(v => !v)}
                      >
                        {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar contraseña (solo en registro) */}
                  {mode === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Confirmar contraseña
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPwd2 ? 'text' : 'password'}
                          required
                          value={confirm}
                          onChange={e => setConfirm(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPwd2(v => !v)}
                        >
                          {showPwd2 ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Enlace recuperar contraseña */}
                  {mode === 'signin' && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                  )}

                  {/* Botón principal */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        {mode === 'signin' ? 'Iniciar sesión' : 'Crear cuenta'}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Formulario Magic Link */
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Magic Link
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Mensaje de error/éxito */}
              {message && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{message}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          ¿Necesitas ayuda?{' '}
          <a
            href="#contact"
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </div>
  )
}
