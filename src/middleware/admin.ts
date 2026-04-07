// src/middleware/admin.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth } from './auth'
import { prisma } from '@/lib/supabase'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'gymturones@gmail.com').split(',').map(e => e.trim().toLowerCase())

export async function withAdmin(
  handler: (req: NextApiRequest, res: NextApiResponse, userId?: string) => Promise<void> | void,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Step 1: Auth check
    let userId: string | null = null
    try {
      userId = await requireAuth(req, res)
    } catch (err) {
      console.error('[Admin] Auth failed:', err)
      return res.status(401).json({ error: 'Error de autenticación' })
    }
    if (!userId) return

    // Step 2: Admin check via Prisma
    let user
    try {
      user = await prisma.user.findUnique({ where: { id: userId } })
    } catch (dbErr) {
      console.error('[Admin] DB error:', dbErr)
      return res.status(500).json({ error: 'Error de conexión a la base de datos' })
    }

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado. Cerrá sesión y volvé a entrar.' })
    }
    if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return res.status(403).json({ error: 'Acceso denegado' })
    }

    // Step 3: Run handler
    try {
      return await handler(req, res, userId)
    } catch (error) {
      console.error('[Admin] Handler error:', error)
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
