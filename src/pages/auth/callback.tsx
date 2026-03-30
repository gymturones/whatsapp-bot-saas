// src/pages/auth/callback.tsx
// Handles Supabase Auth email confirmation redirects

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getSupabaseBrowserClient } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    // Exchange the code for a session (PKCE flow)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/dashboard')
      } else {
        router.replace('/auth/login')
      }
    })
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Verificando tu cuenta...</p>
      </div>
    </div>
  )
}
