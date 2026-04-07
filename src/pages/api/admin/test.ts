// src/pages/api/admin/test.ts — Test minimal para aislar el 500

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const steps: string[] = []

  try {
    steps.push('1-import-start')

    // Test importing supabase
    const supabaseModule = await import('@/lib/supabase')
    steps.push('2-supabase-ok: ' + Object.keys(supabaseModule).join(','))

    // Test prisma
    const count = await supabaseModule.prisma.user.count()
    steps.push('3-prisma-ok: ' + count + ' users')

    // Test importing auth middleware
    const authModule = await import('@/middleware/auth')
    steps.push('4-auth-ok: ' + Object.keys(authModule).join(','))

    // Test importing admin middleware
    const adminModule = await import('@/middleware/admin')
    steps.push('5-admin-ok: ' + Object.keys(adminModule).join(','))

    res.status(200).json({ ok: true, steps })
  } catch (err: any) {
    steps.push('ERROR: ' + (err?.message || String(err)))
    steps.push('STACK: ' + (err?.stack || 'none'))
    res.status(500).json({ ok: false, steps })
  }
}
