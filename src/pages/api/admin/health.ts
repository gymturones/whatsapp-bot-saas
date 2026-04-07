// src/pages/api/admin/health.ts — Diagnóstico del admin panel

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const checks: Record<string, { ok: boolean; detail?: string }> = {}

  // 1. Env vars
  checks.database_url = { ok: !!process.env.DATABASE_URL }
  checks.supabase_service_key = { ok: !!process.env.SUPABASE_SERVICE_ROLE_KEY, detail: process.env.SUPABASE_SERVICE_ROLE_KEY ? `set (${process.env.SUPABASE_SERVICE_ROLE_KEY.length} chars)` : 'MISSING' }
  checks.jwt_secret = { ok: !!process.env.JWT_SECRET }
  checks.admin_emails = { ok: true, detail: (process.env.ADMIN_EMAILS || 'gymturones@gmail.com') }
  checks.supabase_url = { ok: !!process.env.NEXT_PUBLIC_SUPABASE_URL }

  // 2. Prisma connection
  try {
    const { prisma } = await import('@/lib/supabase')
    await prisma.$queryRaw`SELECT 1`
    checks.prisma_db = { ok: true }
    // Count records
    const userCount = await prisma.user.count()
    const botCount = await prisma.bot.count()
    checks.db_records = { ok: true, detail: `${userCount} users, ${botCount} bots` }
  } catch (err: any) {
    checks.prisma_db = { ok: false, detail: err.message || String(err) }
  }

  res.status(200).json({ checks })
}
