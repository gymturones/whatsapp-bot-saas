// src/pages/auth/reset-password.tsx

import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const ResetPassword: NextPage = () => {
  const router = useRouter()
  const { access_token } = router.query
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [tokenReady, setTokenReady] = useState(false)

  useEffect(() => {
    if (access_token && typeof access_token === 'string') {
      setTokenReady(true)
    }
  }, [access_token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token, password }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setDone(true)
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }

  if (!tokenReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="text-center text-slate-400">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <Head>
        <title>Nueva contraseña - BotPyme</title>
      </Head>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
            <img src="/logo-casco.svg" alt="BotPyme" className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">Nueva contraseña</h1>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          {done ? (
            <div className="text-center space-y-3">
              <div className="text-4xl">✅</div>
              <p className="text-white font-medium">Contraseña actualizada</p>
              <p className="text-slate-400 text-sm">Ya puedes iniciar sesión con tu nueva contraseña.</p>
              <Link
                href="/auth/login"
                className="inline-block w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl text-center mt-4 transition-colors"
              >
                Ir al login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nueva contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Repetí la contraseña"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl disabled:opacity-50 transition-colors"
              >
                {loading ? 'Actualizando...' : 'Cambiar contraseña'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
