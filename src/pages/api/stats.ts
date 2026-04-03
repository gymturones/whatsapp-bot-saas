import { NextApiRequest, NextApiResponse } from 'next';
import { withMiddleware } from '@/middleware/auth';
import { prisma } from '@/lib/supabase';
import { sendError, sendSuccess } from '@/utils/helpers';

async function handleGetStats(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  try {
    if (!userId) {
      return sendError(res, new Error('User ID required'), 401);
    }

    const { botId } = req.query;

    if (botId && typeof botId === 'string') {
      // Estadísticas de un bot específico
      const bot = await prisma.bot.findUnique({
        where: { id: botId },
      });
      if (!bot || bot.user_id !== userId) {
        return sendError(res, new Error('Bot no encontrado'), 404);
      }

      const [conversations, messages, responses] = await Promise.all([
        prisma.conversation.count({ where: { bot_id: botId } }),
        prisma.message.count({
          where: { conversation: { bot_id: botId } },
        }),
        prisma.botResponse.count({ where: { bot_id: botId } }),
      ]);

      return sendSuccess(res, {
        conversations,
        messages,
        responses,
        active: bot.is_active,
      });
    }

    // Estadísticas globales del usuario
    const [bots, conversations, messages, user] = await Promise.all([
      prisma.bot.count({ where: { user_id: userId } }),
      prisma.conversation.count({
        where: { bot: { user_id: userId } },
      }),
      prisma.message.count({
        where: { conversation: { bot: { user_id: userId } } },
      }),
      prisma.user.findUnique({ where: { id: userId }, select: { subscription_plan: true } }),
    ]);

    sendSuccess(res, {
      bots,
      conversations,
      messages,
      subscription_plan: user?.subscription_plan || 'free',
    });
  } catch (error) {
    sendError(res, error);
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  if (req.method === 'GET') {
    return handleGetStats(req, res, userId);
  }

  res.status(405).json({ error: 'Método no permitido' });
}

export default withMiddleware(handler, { auth: true, methods: ['GET'] });
