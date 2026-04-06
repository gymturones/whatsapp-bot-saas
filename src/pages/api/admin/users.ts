// src/pages/api/admin/users.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { withAdmin } from '@/middleware/admin'
import { prisma } from '@/lib/supabase'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20))

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: 'desc' },
      select: {
        id: true, email: true, name: true, phone: true, company_name: true,
        subscription_plan: true, subscription_status: true,
        created_at: true,
        _count: { select: { bots: true } },
      },
    }),
    prisma.user.count(),
  ])

  res.status(200).json({
    data: {
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    },
  })
}

export default withAdmin(handler)
