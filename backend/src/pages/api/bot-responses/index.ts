import { NextApiRequest, NextApiResponse } from 'next';
import { withMiddleware } from '@/middleware/auth';
import {
  CreateBotResponseSchema,
  UpdateBotResponseSchema,
} from '@/validators/schemas';
import { prisma } from '@/lib/prisma';
import { sendError, sendSuccess } from '@/utils/helpers';

// GET /api/bot-responses?botId=...
async function handleGetResponses(
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

    // Verificar autorización
    const bot = await prisma.bot.findUnique({ where: { id: botId } });
    if (!bot || bot.user_id !== userId) {
      return sendError(res, new Error('Bot no encontrado'), 404);
    }

    const responses = await prisma.botResponse.findMany({
      where: { bot_id: botId },
      orderBy: { order: 'asc' },
    });

    sendSuccess(res, { responses });
  } catch (error) {
    sendError(res, error);
  }
}

// POST /api/bot-responses
async function handleCreateResponse(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  try {
    if (!userId) {
      return sendError(res, new Error('User ID required'), 401);
    }

    const validated = CreateBotResponseSchema.parse(req.body);

    // Verificar autorización
    const bot = await prisma.bot.findUnique({
      where: { id: validated.bot_id },
    });
    if (!bot || bot.user_id !== userId) {
      return sendError(res, new Error('Bot no encontrado'), 404);
    }

    const response = await prisma.botResponse.create({
      data: validated,
    });

    sendSuccess(res, { response }, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, new Error(error.errors[0]?.message), 400);
    }
    sendError(res, error);
  }
}

// PUT /api/bot-responses/[id]
async function handleUpdateResponse(
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
      return sendError(res, new Error('Response ID inválido'), 400);
    }

    // Verificar autorización
    const botResponse = await prisma.botResponse.findUnique({
      where: { id },
      include: { bot: true },
    });

    if (!botResponse || botResponse.bot.user_id !== userId) {
      return sendError(res, new Error('Respuesta no encontrada'), 404);
    }

    const validated = UpdateBotResponseSchema.parse(req.body);

    const updated = await prisma.botResponse.update({
      where: { id },
      data: validated,
    });

    sendSuccess(res, { response: updated });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, new Error(error.errors[0]?.message), 400);
    }
    sendError(res, error);
  }
}

// DELETE /api/bot-responses/[id]
async function handleDeleteResponse(
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
      return sendError(res, new Error('Response ID inválido'), 400);
    }

    // Verificar autorización
    const botResponse = await prisma.botResponse.findUnique({
      where: { id },
      include: { bot: true },
    });

    if (!botResponse || botResponse.bot.user_id !== userId) {
      return sendError(res, new Error('Respuesta no encontrada'), 404);
    }

    await prisma.botResponse.delete({ where: { id } });

    sendSuccess(res, { message: 'Respuesta eliminada' });
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

  if (!id && req.method === 'GET') {
    return handleGetResponses(req, res, userId);
  }

  if (!id && req.method === 'POST') {
    return handleCreateResponse(req, res, userId);
  }

  if (id && req.method === 'PUT') {
    return handleUpdateResponse(req, res, userId);
  }

  if (id && req.method === 'DELETE') {
    return handleDeleteResponse(req, res, userId);
  }

  res.status(405).json({ error: 'Método no permitido' });
}

export default withMiddleware(handler, { auth: true });
