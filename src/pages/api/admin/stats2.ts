// src/pages/api/admin/stats2.ts — Copy of stats with explicit error handling

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Inline the admin check to avoid import issues
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' })
    }

    // Import dynamically to isolate any issues
    const { getSupabaseServiceClient, prisma } = await import('@/lib/supabase')
    const supabase = getSupabaseServiceClient()
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser) {
      return res.status(401).json({ error: 'Usuario no encontrado en DB' })
    }

    const adminEmails = (process.env.ADMIN_EMAILS || 'gymturones@gmail.com').split(',').map(e => e.trim().toLowerCase())
    if (!adminEmails.includes(dbUser.email.toLowerCase())) {
      return res.status(403).json({ error: 'Acceso denegado' })
    }

    // Fetch stats
    const [userCount, botCount, conversationCount, messageCount, activeBots] = await Promise.all([
      prisma.user.count(),
      prisma.bot.count(),
      prisma.conversation.count(),
      prisma.message.count(),
      prisma.bot.count({ where: { is_active: true } }),
    ])

    const planDist = await prisma.user.groupBy({
      by: ['subscription_plan'],
      _count: { subscription_plan: true },
    })

    const recentUsers = await prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      take: 5,
      select: { id: true, email: true, name: true, subscription_plan: true, created_at: true },
    })

    const recentBots = await prisma.bot.findMany({
      orderBy: { created_at: 'desc' },
      take: 5,
      include: { user: { select: { email: true, name: true } } },
    })

    res.status(200).json({
      success: true,
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
  } catch (err: any) {
    console.error('[Admin Stats] Error:', err)
    res.status(500).json({ error: err?.message || 'Error interno' })
  }
}
