import { NextApiRequest, NextApiResponse } from 'next';
import { withMiddleware } from '@/middleware/auth';
import { prisma } from '@/lib/prisma';
import { sendError, sendSuccess, calculateOffset, getPaginationParams } from '@/utils/helpers';

// GET /api/conversations?botId=...
async function handleGetConversations(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  try {
    if (!userId) {
      return sendError(res, new Error('User ID required'), 401);
    }

    const { botId } = req.query;

    if (!botId || typeof botId !== 'string') {
      return sendError(res, new Error('Bot ID requerido'), 400);
    }

    // Verificar que el bot pertenece al usuario
    const bot = await prisma.bot.findUnique({ where: { id: botId } });
    if (!bot || bot.user_id !== userId) {
      return sendError(res, new Error('Bot no encontrado'), 404);
    }

    const { page, limit } = getPaginationParams(req.query);
    const offset = calculateOffset(page, limit);

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where: { bot_id: botId },
        skip: offset,
        take: limit,
        orderBy: { updated_at: 'desc' },
        include: {
          messages: { orderBy: { created_at: 'desc' }, take: 1 },
          _count: { select: { messages: true } },
        },
      }),
      prisma.conversation.count({ where: { bot_id: botId } }),
    ]);

    const formatted = conversations.map((conv) => ({
      ...conv,
      last_message: conv.messages[0]?.content,
      last_message_at: conv.messages[0]?.created_at,
      message_count: conv._count.messages,
    }));

    sendSuccess(res, {
      conversations: formatted,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    sendError(res, error);
  }
}

// GET /api/conversations/[id]
async function handleGetConversation(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  try {
    if (!userId) {
      return sendError(res, new Error('User ID required'), 401);
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return sendError(res, new Error('Conversation ID inválido'), 400);
    }

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

    sendSuccess(res, conversation);
  } catch (error) {
    sendError(res, error);
  }
}

// PUT /api/conversations/[id]
async function handleUpdateConversation(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  try {
    if (!userId) {
      return sendError(res, new Error('User ID required'), 401);
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return sendError(res, new Error('Conversation ID inválido'), 400);
    }

    // Verificar autorización
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { bot: true },
    });

    if (!conversation || conversation.bot.user_id !== userId) {
      return sendError(res, new Error('Conversación no encontrada'), 404);
    }

    const updated = await prisma.conversation.update({
      where: { id },
      data: {
        customer_name: req.body.customer_name,
        notes: req.body.notes,
      },
      include: { messages: true },
    });

    sendSuccess(res, updated);
  } catch (error) {
    sendError(res, error);
  }
}

// DELETE /api/conversations/[id]
async function handleDeleteConversation(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  try {
    if (!userId) {
      return sendError(res, new Error('User ID required'), 401);
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return sendError(res, new Error('Conversation ID inválido'), 400);
    }

    // Verificar autorización
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { bot: true },
    });

    if (!conversation || conversation.bot.user_id !== userId) {
      return sendError(res, new Error('Conversación no encontrada'), 404);
    }

    await prisma.message.deleteMany({ where: { conversation_id: id } });
    await prisma.conversation.delete({ where: { id } });

    sendSuccess(res, { message: 'Conversación eliminada' });
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
  const { id } = req.query;

  // GET /api/conversations?botId=...
  if (!id && req.method === 'GET') {
    return handleGetConversations(req, res, userId);
  }

  // GET /api/conversations/[id]
  if (id && req.method === 'GET') {
    return handleGetConversation(req, res, userId);
  }

  // PUT /api/conversations/[id]
  if (id && req.method === 'PUT') {
    return handleUpdateConversation(req, res, userId);
  }

  // DELETE /api/conversations/[id]
  if (id && req.method === 'DELETE') {
    return handleDeleteConversation(req, res, userId);
  }

  res.status(405).json({ error: 'Método no permitido' });
}

export default withMiddleware(handler, { auth: true });
