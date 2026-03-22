import { NextApiRequest, NextApiResponse } from 'next';
import { withMiddleware } from '@/middleware/auth';
import { CreateBotSchema } from '@/validators/schemas';
import { prisma } from '@/lib/prisma';
import { sendError, sendSuccess, calculateOffset, getPaginationParams } from '@/utils/helpers';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  if (req.method === 'GET') {
    return handleGet(req, res, userId);
  } else if (req.method === 'POST') {
    return handlePost(req, res, userId);
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}

// GET /api/bots - Listar bots del usuario
async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  try {
    if (!userId) {
      return sendError(res, new Error('User ID required'), 401);
    }

    const { page, limit } = getPaginationParams(req.query);
    const offset = calculateOffset(page, limit);

    const [bots, total] = await Promise.all([
      prisma.bot.findMany({
        where: { user_id: userId },
        skip: offset,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          _count: {
            select: { conversations: true, messages: true },
          },
        },
      }),
      prisma.bot.count({ where: { user_id: userId } }),
    ]);

    const formatted = bots.map((bot) => ({
      ...bot,
      conversation_count: bot._count.conversations,
      message_count: bot._count.messages,
    }));

    sendSuccess(res, {
      bots: formatted,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    sendError(res, error);
  }
}

// POST /api/bots - Crear nuevo bot
async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  try {
    if (!userId) {
      return sendError(res, new Error('User ID required'), 401);
    }

    // Validar input
    const validated = CreateBotSchema.parse(req.body);

    // Verificar que el usuario no tenga demasiados bots (según plan)
    const botCount = await prisma.bot.count({ where: { user_id: userId } });
    const subscription = await prisma.subscription.findFirst({
      where: { user_id: userId, status: 'active' },
    });

    const maxBots = {
      free: 1,
      starter: 5,
      pro: 25,
      business: 100,
    }[subscription?.plan || 'free'];

    if (botCount >= maxBots) {
      return sendError(
        res,
        new Error(`Has alcanzado el límite de ${maxBots} bots para tu plan`),
        409
      );
    }

    // Crear bot
    const bot = await prisma.bot.create({
      data: {
        ...validated,
        user_id: userId,
      },
    });

    sendSuccess(res, { bot }, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, new Error(error.errors[0]?.message), 400);
    }
    sendError(res, error);
  }
}

export default withMiddleware(handler, { auth: true, methods: ['GET', 'POST'] });
