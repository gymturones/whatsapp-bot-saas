// src/pages/api/auth/reset-password.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { access_token, password } = req.body

    if (!access_token || !password) {
      return res.status(400).json({ error: 'Token y contraseña requeridos' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
    }

    // Create a client with the user's recovery token
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({ error: 'Configuración de Supabase faltante' })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${access_token}` } },
    })

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      if (error.message.includes('expired') || error.message.includes('Invalid')) {
        return res.status(400).json({ error: 'El link expiró. Solicitá uno nuevo.' })
      }
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
