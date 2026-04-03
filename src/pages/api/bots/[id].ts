import { NextApiRequest, NextApiResponse } from 'next';
import { withMiddleware } from '@/middleware/auth';
import { UpdateBotSchema } from '@/validators/schemas';
import { prisma } from '@/lib/supabase';
import { sendError, sendSuccess } from '@/utils/helpers';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  // Verificar que el bot pertenece al usuario
  const bot = await prisma.bot.findUnique({ where: { id } });

  if (!bot || bot.user_id !== userId) {
    return sendError(res, new Error('Bot no encontrado'), 404);
  }

  if (req.method === 'GET') {
    return handleGet(res, bot);
  } else if (req.method === 'PUT') {
    return handlePut(req, res, id);
  } else if (req.method === 'DELETE') {
    return handleDelete(res, id);
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}

// GET /api/bots/[id]
async function handleGet(res: NextApiResponse, bot: any) {
  try {
    const enriched = await prisma.bot.findUnique({
      where: { id: bot.id },
      include: {
        responses: { orderBy: { created_at: 'asc' } },
        conversations: { orderBy: { updated_at: 'desc' }, take: 5 },
        _count: {
          select: { conversations: true, messages: true },
        },
      },
    });

    sendSuccess(res, enriched);
  } catch (error) {
    sendError(res, error);
  }
}

// PUT /api/bots/[id]
async function handlePut(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const validated = UpdateBotSchema.parse(req.body);

    const bot = await prisma.bot.update({
      where: { id },
      data: validated,
    });

    sendSuccess(res, { bot });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, new Error(error.errors[0]?.message), 400);
    }
    sendError(res, error);
  }
}

// DELETE /api/bots/[id]
async function handleDelete(res: NextApiResponse, id: string) {
  try {
    // Eliminar en cascada
    await prisma.conversation.deleteMany({ where: { bot_id: id } });
    await prisma.botResponse.deleteMany({ where: { bot_id: id } });
    await prisma.bot.delete({ where: { id } });

    sendSuccess(res, { message: 'Bot eliminado' });
  } catch (error) {
    sendError(res, error);
  }
}

export default withMiddleware(handler, { auth: true });
