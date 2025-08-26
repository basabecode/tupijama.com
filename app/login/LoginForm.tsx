'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

type Mode = 'signin' | 'signup'
type AuthMethod = 'password' | 'otp'

export function LoginForm() {
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
      if (/confirm|verify/i.test(msg)) {
        setCanResend(true)
        setMessage(
          'Tu email no está verificado. Revisa tu correo o reenvía la verificación.'
        )
      } else {
        setMessage(msg)
      }
      return
    }
    const role =
      (data.user?.app_metadata as any)?.role ||
      (data.user?.user_metadata as any)?.role
    router.replace(next || (role === 'admin' ? '/admin' : '/'))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    if (!password || password.length < 6) {
      setLoading(false)
      return setMessage('La contraseña debe tener al menos 6 caracteres')
    }
    if (password !== confirm) {
      setLoading(false)
      return setMessage('Las contraseñas no coinciden')
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${
          window.location.origin
        }/login?next=${encodeURIComponent(next)}`,
      },
    })
    setLoading(false)
    if (error) {
      setMessage(error.message)
    } else {
      setMessage(
        'Hemos enviado un correo de verificación. Revisa tu bandeja para activar tu cuenta.'
      )
      setVerificationSent(true)
      setCanResend(true)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${next}` },
    })
    setLoading(false)
    setMessage(error ? error.message : 'Revisa tu correo para continuar')
  }

  const handleGoogle = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${next}` },
    })
    setLoading(false)
    if (error) setMessage(error.message)
  }

  const handleReset = async () => {
    if (!email)
      return setMessage('Ingresa tu email para recuperar la contraseña')
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
    setLoading(false)
    setMessage(
      error
        ? error.message
        : 'Te enviamos un correo para restablecer tu contraseña'
    )
  }

  const handleResend = async () => {
    if (!email) return setMessage('Ingresa tu email para reenviar verificación')
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${
          window.location.origin
        }/login?next=${encodeURIComponent(next)}`,
      },
    } as any)
    setLoading(false)
    setMessage(
      error ? error.message : 'Hemos reenviado el correo de verificación.'
    )
  }

  return (
    <div className="min-h-[70vh] grid place-items-center p-6">
      <div className="w-full max-w-2xl border rounded-2xl p-6 md:p-8 shadow-sm bg-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">
            {mode === 'signin' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h1>
          <button
            className="text-sm text-rose-600 hover:underline"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setMessage(null)
            }}
          >
            {mode === 'signin'
              ? '¿No tienes cuenta? Regístrate'
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Columna: Formulario */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-sm">
              <button
                className={`px-3 py-1.5 rounded-full border ${
                  method === 'password'
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setMethod('password')}
              >
                {mode === 'signin' ? 'Con contraseña' : 'Crear con contraseña'}
              </button>
              {mode === 'signin' && (
                <button
                  className={`px-3 py-1.5 rounded-full border ${
                    method === 'otp'
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setMethod('otp')}
                >
                  Magic link
                </button>
              )}
            </div>

            {method === 'password' ? (
              <form
                onSubmit={
                  mode === 'signin' ? handleSignInPassword : handleSignUp
                }
                className="space-y-3"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full border rounded px-3 py-2"
                />
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full border rounded px-3 py-2 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPwd(v => !v)}
                    aria-label={
                      showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'
                    }
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {mode === 'signup' && (
                  <div className="relative">
                    <input
                      type={showPwd2 ? 'text' : 'password'}
                      required
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Confirmar contraseña"
                      className="w-full border rounded px-3 py-2 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPwd2(v => !v)}
                      aria-label={
                        showPwd2 ? 'Ocultar contraseña' : 'Mostrar contraseña'
                      }
                    >
                      {showPwd2 ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                )}
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-gray-600 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
                <button
                  disabled={loading}
                  className="w-full bg-black text-white py-2 rounded"
                >
                  {loading
                    ? 'Procesando…'
                    : mode === 'signin'
                    ? 'Entrar'
                    : 'Crear cuenta'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full border rounded px-3 py-2"
                />
                <button
                  disabled={loading}
                  className="w-full bg-black text-white py-2 rounded"
                >
                  {loading ? 'Enviando…' : 'Enviar magic link'}
                </button>
              </form>
            )}

            {message && (
              <div className="mt-3 text-sm">
                <p className="text-rose-600">{message}</p>
                {canResend && (
                  <button
                    onClick={handleResend}
                    className="mt-2 text-rose-600 underline"
                  >
                    Reenviar correo de verificación
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Columna: Proveedores y notas */}
          <div>
            <div className="space-y-2">
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full border py-2 rounded"
              >
                {mode === 'signin'
                  ? 'Entrar con Google'
                  : 'Crear cuenta con Google'}
              </button>
            </div>
            <div className="mt-5 text-sm text-gray-600 space-y-2">
              <p>
                • Si eres administrador, te redirigiremos al panel al iniciar
                sesión.
              </p>
              <p>
                • Puedes usar contraseña o un enlace mágico enviado a tu correo.
              </p>
              <p>
                • Asegúrate de permitir redirecciones a{' '}
                {typeof window !== 'undefined'
                  ? window.location.origin
                  : 'tu dominio'}{' '}
                en la consola de Supabase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
