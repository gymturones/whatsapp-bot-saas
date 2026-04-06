// src/pages/api/auth/forgot-password.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseServerClient } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ error: 'Email requerido' })
    }

    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || ''}/auth/reset-password`,
    })

    if (error) {
      console.error('Reset password error:', error)
    }

    // Always return success to avoid email enumeration
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
