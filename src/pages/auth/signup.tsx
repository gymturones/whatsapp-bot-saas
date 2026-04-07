// src/pages/auth/signup.tsx

import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { getSupabaseBrowserClient } from '@/lib/supabase'

const Signup: NextPage = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

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
      // Use our API endpoint that creates both Supabase Auth + Prisma User
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al crear la cuenta')
        return
      }

      // If session returned, save token and go to onboarding
      if (data.session?.access_token) {
        localStorage.setItem('sb_access_token', data.session.access_token)
        localStorage.setItem('user_email', data.user?.email || email)

        // Set session in Supabase browser client
        try {
          const supabase = getSupabaseBrowserClient()
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token || '',
          })
        } catch (e) {
          console.warn('Could not set Supabase browser session:', e)
        }

        router.push('/dashboard/onboarding')
        return
      }

      // No immediate session — redirect to login
      setSuccess('¡Cuenta creada! Iniciá sesión con tus datos.')
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Registrate - BotPyme</title>
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
            <p className="text-gray-600 mt-2">Creá tu cuenta gratis</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Tu nombre"
                  required
                />
              </div>

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
                  placeholder="Mínimo 6 caracteres"
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Repetí tu contraseña"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿Ya tenés cuenta?{' '}
                <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium">
                  Iniciá sesión
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

export default Signup
