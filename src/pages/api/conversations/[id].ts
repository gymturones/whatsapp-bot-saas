import { NextApiRequest, NextApiResponse } from 'next';
import { withMiddleware } from '@/middleware/auth';
import { prisma } from '@/lib/supabase';
import { sendError, sendSuccess } from '@/utils/helpers';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  if (!userId) return sendError(res, new Error('No autorizado'), 401);

  const { id } = req.query;
  if (!id || typeof id !== 'string') return sendError(res, new Error('ID inválido'), 400);

  // Verificar que la conversación pertenece al usuario
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { created_at: 'asc' } },
      bot: true,
    },
  });

  if (!conversation || conversation.bot.user_id !== userId) {
    return sendError(res, new Error('Conversación no encontrada'), 404);
  }

  if (req.method === 'GET') {
    return sendSuccess(res, conversation);
  }

  if (req.method === 'PUT') {
    const updated = await prisma.conversation.update({
      where: { id },
      data: { contact_name: req.body.contact_name },
      include: { messages: true },
    });
    return sendSuccess(res, updated);
  }

  if (req.method === 'DELETE') {
    await prisma.message.deleteMany({ where: { conversation_id: id } });
    await prisma.conversation.delete({ where: { id } });
    return sendSuccess(res, { message: 'Conversación eliminada' });
  }

  res.status(405).json({ error: 'Método no permitido' });
}

export default withMiddleware(handler, { auth: true });
