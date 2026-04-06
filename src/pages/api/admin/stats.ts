// src/pages/api/admin/stats.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { withAdmin } from '@/middleware/admin'
import { prisma } from '@/lib/supabase'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const [userCount, botCount, conversationCount, messageCount, activeBots] = await Promise.all([
    prisma.user.count(),
    prisma.bot.count(),
    prisma.conversation.count(),
    prisma.message.count(),
    prisma.bot.count({ where: { is_active: true } }),
  ])

  // Plan distribution
  const planDist = await prisma.user.groupBy({
    by: ['subscription_plan'],
    _count: { subscription_plan: true },
  })

  // Recent users
  const recentUsers = await prisma.user.findMany({
    orderBy: { created_at: 'desc' },
    take: 5,
    select: { id: true, email: true, name: true, subscription_plan: true, created_at: true },
  })

  // Recent bots
  const recentBots = await prisma.bot.findMany({
    orderBy: { created_at: 'desc' },
    take: 5,
    include: { user: { select: { email: true, name: true } } },
  })

  res.status(200).json({
    data: {
      userCount,
      botCount,
      conversationCount,
      messageCount,
      activeBots,
      planDistribution: planDist.map(p => ({ plan: p.subscription_plan, count: p._count.subscription_plan })),
      recentUsers,
      recentBots,
    },
  })
}

export default withAdmin(handler)
