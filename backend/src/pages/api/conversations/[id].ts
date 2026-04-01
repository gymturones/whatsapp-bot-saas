import { NextApiRequest, NextApiResponse } from 'next';
import { withMiddleware } from '@/middleware/auth';
import { prisma } from '@/lib/prisma';
import { sendError, sendSuccess } from '@/utils/helpers';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  if (!userId) {
    return sendError(res, new Error('User ID required'), 401);
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return sendError(res, new Error('Conversation ID inválido'), 400);
  }

  // Verify ownership
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { bot: true },
  });

  if (!conversation || conversation.bot.user_id !== userId) {
    return sendError(res, new Error('Conversación no encontrada'), 404);
  }

  if (req.method === 'GET') {
    const full = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { created_at: 'asc' } },
        bot: true,
      },
    });
    return sendSuccess(res, full);
  }

  if (req.method === 'PUT') {
    const updated = await prisma.conversation.update({
      where: { id },
      data: {
        customer_name: req.body.customer_name,
        notes: req.body.notes,
      },
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

export default withMiddleware(handler, {
  auth: true,
  methods: ['GET', 'PUT', 'DELETE'],
});
