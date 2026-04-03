import { NextApiRequest, NextApiResponse } from 'next';
import { withMiddleware } from '@/middleware/auth';
import { SendMessageSchema } from '@/validators/schemas';
import { prisma } from '@/lib/supabase';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { sendError, sendSuccess } from '@/utils/helpers';

// POST /api/messages/send
async function handleSendMessage(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  try {
    if (!userId) {
      return sendError(res, new Error('User ID required'), 401);
    }

    const validated = SendMessageSchema.parse(req.body);

    // Verificar que el bot pertenece al usuario
    const bot = await prisma.bot.findUnique({
      where: { id: validated.bot_id },
    });
    if (!bot || bot.user_id !== userId) {
      return sendError(res, new Error('Bot no encontrado'), 404);
    }

    // Obtener o crear conversación
    let conversation = await prisma.conversation.findFirst({
      where: {
        bot_id: validated.bot_id,
        whatsapp_contact: validated.phone_number,
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          bot_id: validated.bot_id,
          user_id: bot.user_id,
          whatsapp_contact: validated.phone_number,
        },
      });
    }

    // Enviar mensaje via WhatsApp
    await sendWhatsAppMessage(validated.phone_number, validated.message);

    // Guardar en DB
    await prisma.message.create({
      data: {
        conversation_id: conversation.id,
        bot_id: validated.bot_id,
        direction: 'outgoing',
        content: validated.message,
        sender_phone: bot.whatsapp_phone,
      },
    });

    sendSuccess(res, { message: 'Mensaje enviado' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, new Error(error.errors[0]?.message), 400);
    }
    sendError(res, error);
  }
}

// GET /api/stats?botId=...
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
    const [bots, conversations, messages, subscriptions] = await Promise.all([
      prisma.bot.count({ where: { user_id: userId } }),
      prisma.conversation.count({
        where: { bot: { user_id: userId } },
      }),
      prisma.message.count({
        where: { conversation: { bot: { user_id: userId } } },
      }),
      prisma.user.findUnique({ where: { id: userId! }, select: { subscription_plan: true } }),
    ]);

    sendSuccess(res, {
      bots,
      conversations,
      messages,
      subscription_plan: subscriptions?.subscription_plan || 'free',
    });
  } catch (error) {
    sendError(res, error);
  }
}

// Handler principal
async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  const { pathname } = req.url ? new URL(req.url, 'http://localhost') : { pathname: '' };

  if (pathname.includes('/messages/send') && req.method === 'POST') {
    return handleSendMessage(req, res, userId);
  }

  if (pathname.includes('/stats') && req.method === 'GET') {
    return handleGetStats(req, res, userId);
  }

  res.status(405).json({ error: 'Método no permitido' });
}

export default withMiddleware(handler, { auth: true });
