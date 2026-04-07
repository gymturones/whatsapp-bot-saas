// src/middleware/admin.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth } from './auth'
import { prisma } from '@/lib/supabase'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'gymturones@gmail.com').split(',').map(e => e.trim().toLowerCase())

export async function withAdmin(
  handler: (req: NextApiRequest, res: NextApiResponse, userId?: string) => Promise<void> | void,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const userId = await requireAuth(req, res)
      if (!userId) return // requireAuth already sent response

      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        console.error('[Admin] User not found in Prisma for id:', userId)
        return res.status(401).json({ error: 'Usuario no encontrado en la base de datos. Intentá cerrar sesión y volver a entrar.' })
      }
      if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        console.warn('[Admin] Access denied for:', user.email, '| Allowed:', ADMIN_EMAILS)
        return res.status(403).json({ error: 'Acceso denegado. Email no autorizado como admin.' })
      }

      return handler(req, res, userId)
    } catch (error) {
      console.error('[Admin] Middleware error:', error)
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
