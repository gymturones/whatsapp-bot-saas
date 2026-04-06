// src/pages/api/admin/bots.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { withAdmin } from '@/middleware/admin'
import { prisma } from '@/lib/supabase'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20))

  const [bots, total] = await Promise.all([
    prisma.bot.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        user: { select: { email: true, name: true, subscription_plan: true } },
        _count: { select: { conversations: true, messages: true, responses: true } },
      },
    }),
    prisma.bot.count(),
  ])

  const formatted = bots.map(b => ({
    ...b,
    conversation_count: b._count.conversations,
    message_count: b._count.messages,
    response_count: b._count.responses,
  }))

  res.status(200).json({
    data: {
      bots: formatted,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    },
  })
}

export default withAdmin(handler)
