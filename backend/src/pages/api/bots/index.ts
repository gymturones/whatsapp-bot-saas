// src/pages/api/bots/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/supabase";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getCurrentUser();

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // GET: List all bots for user
  if (req.method === "GET") {
    try {
      const bots = await prisma.bot.findMany({
        where: {
          user_id: user.id,
        },
        include: {
          conversations: {
            select: {
              id: true,
            },
          },
          messages: {
            select: {
              id: true,
            },
          },
        },
      });

      const botsWithStats = bots.map((bot) => ({
        ...bot,
        conversation_count: bot.conversations.length,
        message_count: bot.messages.length,
      }));

      res.status(200).json(botsWithStats);
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
        whatsapp_phone,
        whatsapp_api_token,
        greeting_message,
        fallback_message,
      } = req.body;

      // Validate required fields
      if (!name || !whatsapp_phone || !whatsapp_api_token) {
        res
          .status(400)
          .json({
            error: "Missing required fields: name, whatsapp_phone, whatsapp_api_token",
          });
        return;
      }

      // Create the bot
      const bot = await prisma.bot.create({
        data: {
          user_id: user.id,
          name,
          description,
          whatsapp_phone,
          whatsapp_api_token,
          greeting_message: greeting_message || "Hola! 👋 ¿En qué puedo ayudarte?",
          fallback_message:
            fallback_message || "Lo siento, no entendí. ¿Podrías reformular tu pregunta?",
        },
      });

      res.status(201).json({
        success: true,
        bot,
      });
    } catch (error) {
      console.error("Error creating bot:", error);
      res.status(500).json({ error: "Failed to create bot" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
