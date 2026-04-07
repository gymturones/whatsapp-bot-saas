// src/pages/auth/login.tsx

import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { getSupabaseBrowserClient } from '@/lib/supabase'

const Login: NextPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Use our API endpoint that handles Supabase Auth + Prisma User sync
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión')
        return
      }

      // Save token for API requests
      if (data.access_token) {
        localStorage.setItem('sb_access_token', data.access_token)

        // Also set the session in the Supabase browser client
        // so useAuth() can find it via getSession()
        try {
          const supabase = getSupabaseBrowserClient()
          await supabase.auth.setSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token || '',
          })
        } catch (e) {
          console.warn('Could not set Supabase browser session:', e)
        }
      }
      if (data.user?.email) {
        localStorage.setItem('user_email', data.user.email)
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Iniciá sesión - BotPyme</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-green-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-green-500/30">
              <svg className="w-9 h-9" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="24" height="17" rx="5" fill="white"/>
                <circle cx="10" cy="12" r="2.2" fill="#22c55e"/>
                <circle cx="18" cy="12" r="2.2" fill="#22c55e"/>
                <path d="M9 17.5 Q14 20.5 19 17.5" stroke="#22c55e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M18 21 L22 26 L14 21" fill="white"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">BotPyme</h1>
            <p className="text-gray-600 mt-2">Iniciá sesión en tu cuenta</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Olvidé mi contraseña
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿No tenés cuenta?{' '}
                <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-medium">
                  Creá una gratis
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-8">
            © 2026 BotPyme
          </p>
        </div>
      </div>
    </>
  )
}

export default Login
