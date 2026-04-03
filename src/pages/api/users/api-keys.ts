import type { NextApiRequest, NextApiResponse } from 'next';
import { withMiddleware } from '@/middleware/auth';
import { prisma } from '@/lib/supabase';
import crypto from 'crypto';

async function handler(req: NextApiRequest, res: NextApiResponse, userId?: string) {
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const keys = await prisma.apiKey.findMany({
      where: { user_id: userId, is_active: true },
      select: { id: true, name: true, last_used_at: true, created_at: true, expires_at: true },
    });
    return res.status(200).json({ data: { keys } });
  }

  if (req.method === 'POST') {
    const rawKey = `wbsk_${crypto.randomBytes(32).toString('hex')}`;
    const name = req.body?.name || `API Key ${new Date().toLocaleDateString('es-AR')}`;

    const apiKey = await prisma.apiKey.create({
      data: {
        user_id: userId,
        key: rawKey,
        name,
        is_active: true,
      },
    });

    // Solo devolvemos la clave en texto plano ESTA VEZ
    return res.status(201).json({ success: true, data: { key: apiKey.key, id: apiKey.id, name: apiKey.name } });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withMiddleware(handler, { auth: true, methods: ['GET', 'POST'] });
