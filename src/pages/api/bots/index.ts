// src/pages/api/bots/index.ts — Consolidated: list + create

import type { NextApiRequest, NextApiResponse } from 'next';
import { withMiddleware } from '@/middleware/auth';
import { CreateBotSchema } from '@/validators/schemas';
import { prisma } from '@/lib/supabase';
import { sendError, sendSuccess } from '@/utils/helpers';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  if (!userId) return sendError(res, new Error('No autorizado'), 401);

  if (req.method === 'GET') return handleList(req, res, userId);
  if (req.method === 'POST') return handleCreate(req, res, userId);
  res.status(405).json({ error: 'Método no permitido' });
}

async function handleList(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
    const offset = (page - 1) * limit;

    const [bots, total] = await Promise.all([
      prisma.bot.findMany({
        where: { user_id: userId },
        skip: offset,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          _count: {
            select: { conversations: true, messages: true, responses: true },
          },
        },
      }),
      prisma.bot.count({ where: { user_id: userId } }),
    ]);

    const formatted = bots.map((bot) => ({
      ...bot,
      phone_number: bot.whatsapp_phone,
      welcome_message: bot.greeting_message,
      conversation_count: bot._count.conversations,
      message_count: bot._count.messages,
      response_count: bot._count.responses,
    }));

    sendSuccess(res, {
      bots: formatted,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    sendError(res, error);
  }
}

async function handleCreate(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const validated = CreateBotSchema.parse(req.body);

    // Check bot limit per plan
    const [botCount, user] = await Promise.all([
      prisma.bot.count({ where: { user_id: userId } }),
      prisma.user.findUnique({ where: { id: userId }, select: { subscription_plan: true } }),
    ]);

    const maxBots: Record<string, number> = { free: 1, starter: 5, pro: 25, business: 100 };
    const limit = maxBots[user?.subscription_plan || 'free'] ?? 1;

    if (botCount >= limit) {
      return sendError(res, new Error(`Límite de ${limit} bots para tu plan. Actualizá tu suscripción.`), 409);
    }

    const bot = await prisma.bot.create({
      data: {
        user_id: userId,
        name: validated.name,
        description: validated.description || null,
        whatsapp_phone: validated.whatsapp_phone,
        whatsapp_api_token: validated.whatsapp_api_token || '',
        greeting_message: validated.greeting_message || 'Hola! 👋 ¿En qué puedo ayudarte?',
        fallback_message: validated.fallback_message || 'Lo siento, no entendí.',
        is_active: validated.is_active ?? true,
        auto_reply_enabled: validated.auto_reply_enabled ?? true,
        ai_model: validated.ai_model || 'gpt-3.5-turbo',
        ai_temperature: validated.ai_temperature ?? 0.7,
        ai_instructions: validated.ai_instructions || null,
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
