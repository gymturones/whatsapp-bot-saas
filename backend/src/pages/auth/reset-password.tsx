// src/pages/auth/reset-password.tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getSupabaseBrowserClient } from '@/lib/supabase'

const ResetPassword: NextPage = () => {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    // Supabase puts the access_token in the URL hash after recovery redirect
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const type = params.get('type')

    if (type === 'recovery' && accessToken && refreshToken) {
      const supabase = getSupabaseBrowserClient()
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ error }) => {
        if (error) {
          setError('El link de recuperación expiró. Pedí uno nuevo.')
        } else {
          setSessionReady(true)
        }
      })
    } else {
      setError('Link inválido. Pedí un nuevo link de recuperación.')
    }
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) {
        setError('No se pudo actualizar la contraseña. Intentá de nuevo.')
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Nueva Contraseña - WhatsApp Bot SaaS</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900">WhatsApp Bot</h1>
            <p className="text-gray-600 mt-2">Creá tu nueva contraseña</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {success ? (
              <div className="text-center">
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <p className="text-gray-800 font-medium">¡Contraseña actualizada!</p>
                <p className="text-gray-500 text-sm mt-2">Redirigiendo al dashboard...</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-700">{error}</p>
                    {error.includes('expiró') || error.includes('inválido') ? (
                      <Link
                        href="/auth/login"
                        className="text-sm text-blue-600 hover:text-blue-700 mt-1 block"
                      >
                        → Volver al login
                      </Link>
                    ) : null}
                  </div>
                )}

                {sessionReady && (
                  <form onSubmit={handleReset} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nueva contraseña
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar contraseña
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                    >
                      {loading ? 'Guardando...' : 'Guardar contraseña'}
                    </button>
                  </form>
                )}

                {!sessionReady && !error && (
                  <p className="text-center text-gray-500 text-sm">Verificando link...</p>
                )}
              </>
            )}
          </div>

          <p className="text-center text-gray-600 text-sm mt-8">
            © 2025 WhatsApp Bot SaaS
          </p>
        </div>
      </div>
    </>
  )
}

export default ResetPassword
