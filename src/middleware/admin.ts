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
      if (!user) return res.status(401).json({ error: 'Usuario no encontrado' })
      if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) return res.status(403).json({ error: 'Acceso denegado' })

      return handler(req, res, userId)
    } catch (error) {
      console.error('Admin middleware error:', error)
      res.status(500).json({ error: 'Error interno' })
    }
  }
}
