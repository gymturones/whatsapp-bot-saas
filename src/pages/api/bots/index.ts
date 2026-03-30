// src/pages/api/bots/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { withMiddleware } from "@/middleware/auth";
import { prisma } from "@/lib/supabase";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  userId?: string
) {
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // GET: List all bots for user
  if (req.method === "GET") {
    try {
      const bots = await prisma.bot.findMany({
        where: { user_id: userId },
        include: {
          conversations: { select: { id: true } },
          messages: { select: { id: true } },
        },
      });

      const botsWithStats = bots.map((bot) => ({
        ...bot,
        conversation_count: bot.conversations.length,
        message_count: bot.messages.length,
      }));

      res.status(200).json({ data: { bots: botsWithStats, pagination: { page: 1, pages: 1 } } });
    } catch (error) {
      console.error("Error fetching bots:", error);
      res.status(500).json({ error: "Failed to fetch bots" });
    }
    return;
  }

  // POST: Create a new bot
  if (req.method === "POST") {
    try {
      const {
        name,
        description,
        phone_number,
        welcome_message,
        fallback_message,
        ai_instructions,
        ai_model,
        ai_temperature,
      } = req.body;

      if (!name) {
        res.status(400).json({ error: "El nombre es obligatorio" });
        return;
      }

      const bot = await prisma.bot.create({
        data: {
          user_id: userId,
          name,
          description: description || null,
          whatsapp_phone: phone_number || "",
          whatsapp_api_token: "",
          greeting_message: welcome_message || "Hola! ¿En qué puedo ayudarte?",
          fallback_message: fallback_message || "Disculpá, no pude procesar tu mensaje.",
          ai_instructions: ai_instructions || null,
          ai_model: ai_model || "gpt-3.5-turbo",
          ai_temperature: ai_temperature ? parseFloat(ai_temperature) : 0.7,
          auto_reply_enabled: true,
        },
      });

      res.status(201).json({ success: true, data: bot });
    } catch (error) {
      console.error("Error creating bot:", error);
      res.status(500).json({ error: "Failed to create bot" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}

export default withMiddleware(handler, { auth: true, methods: ["GET", "POST"] });
