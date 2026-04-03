import type { NextApiRequest, NextApiResponse } from 'next';
import { withMiddleware } from '@/middleware/auth';
import { prisma } from '@/lib/supabase';

async function handler(req: NextApiRequest, res: NextApiResponse, userId?: string) {
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const { password_hash, ...safeUser } = user;
    return res.status(200).json({ data: safeUser });
  }

  if (req.method === 'PUT') {
    const { full_name, company_name } = req.body;
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(full_name ? { name: full_name } : {}),
        ...(company_name !== undefined ? { company_name } : {}),
      },
    });
    const { password_hash, ...safeUser } = updated;
    return res.status(200).json({ success: true, data: safeUser });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withMiddleware(handler, { auth: true, methods: ['GET', 'PUT'] });
