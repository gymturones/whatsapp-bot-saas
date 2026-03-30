// src/pages/api/webhooks/whatsapp.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import {
  verifyWebhookToken,
  parseWebhookPayload,
  markMessageAsRead,
  sendWhatsAppMessage,
} from "@/lib/whatsapp";
import { generateAIResponse } from "@/lib/openai";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN!;

  // GET: Webhook verification
  if (req.method === "GET") {
    const token = req.query["hub.verify_token"] as string;
    const challenge = req.query["hub.challenge"] as string;

    if (verifyWebhookToken(token, verifyToken)) {
      res.status(200).send(challenge);
      return;
    }

    res.status(403).send("Verification failed");
    return;
  }

  // POST: Handle incoming messages
  if (req.method === "POST") {
    try {
      const payload = parseWebhookPayload(req.body);

      if (!payload) {
        res.status(200).json({ success: false });
        return;
      }

      // Process incoming messages
      for (const message of payload.messages) {
        await processIncomingMessage(message);
      }

      // Process status updates
      for (const status of payload.statuses) {
        await processStatusUpdate(status);
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}

async function processIncomingMessage(message: any) {
  try {
    const {
      id: messageId,
      from: phoneNumber,
      type,
      text,
      timestamp,
    } = message;

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        whatsapp_contact: phoneNumber,
      },
      include: {
        bot: true,
      },
    });

    if (!conversation) {
      // Create new conversation
      // For now, assign to the first bot of the user (you'd want to improve this logic)
      const firstBot = await prisma.bot.findFirst();

      if (!firstBot) {
        console.log("No bot found for new conversation");
        return;
      }

      conversation = await prisma.conversation.create({
        data: {
          user_id: firstBot.user_id,
          bot_id: firstBot.id,
          whatsapp_contact: phoneNumber,
          contact_name: message.profile?.name,
        },
        include: {
          bot: true,
        },
      });
    }

    // Extract message content
    let messageContent = "";
    if (type === "text") {
      messageContent = text.body;
    } else {
      messageContent = `[${type}]`;
    }

    // Save message to database
    const savedMessage = await prisma.message.create({
      data: {
        conversation_id: conversation.id,
        bot_id: conversation.bot.id,
        direction: "incoming",
        content: messageContent,
        whatsapp_message_id: messageId,
        sender_phone: phoneNumber,
        processed: false,
      },
    });

    // Mark as read
    try {
      await markMessageAsRead(messageId);
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }

    // Process the message with bot logic
    await processMessageWithBot(conversation, savedMessage, messageContent);

    // Update conversation stats
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        message_count: {
          increment: 1,
        },
        last_message_at: new Date(),
      },
    });

    // Update bot stats
    await prisma.bot.update({
      where: { id: conversation.bot.id },
      data: {
        total_messages: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error("Error processing incoming message:", error);
  }
}

async function processMessageWithBot(
  conversation: any,
  message: any,
  content: string
) {
  const bot = conversation.bot;

  // Check if auto-reply is enabled
  if (!bot.auto_reply_enabled) {
    return;
  }

  let replyMessage = "";
  let aiGenerated = false;

  // 1. Primero buscar respuestas manuales por keyword
  const manualResponse = await prisma.botResponse.findFirst({
    where: {
      bot_id: bot.id,
      is_active: true,
      trigger: {
        in: content.toLowerCase().split(" "),
      },
    },
  });

  if (manualResponse) {
    // Respuesta manual encontrada — rápida y gratis
    replyMessage = manualResponse.response;
  } else {
    // 2. No hay respuesta manual → usar IA
    try {
      replyMessage = await generateAIResponse({
        botId: bot.id,
        conversationId: conversation.id,
        userMessage: content,
        systemPrompt: bot.ai_instructions || undefined,
        model: bot.ai_model || 'gpt-3.5-turbo',
        temperature: bot.ai_temperature ?? 0.7,
      });
      aiGenerated = true;
    } catch (error) {
      console.error("AI response failed, using fallback:", error);
      replyMessage = bot.fallback_message || "Disculpá, no pude procesar tu mensaje. Intentá de nuevo en unos minutos.";
    }
  }

  // Enviar respuesta por WhatsApp
  try {
    const result = await sendWhatsAppMessage(
      conversation.whatsapp_contact,
      replyMessage
    );

    // Guardar respuesta del bot en la base de datos
    await prisma.message.create({
      data: {
        conversation_id: conversation.id,
        bot_id: bot.id,
        direction: "outgoing",
        content: replyMessage,
        whatsapp_message_id: result.messageId,
        sender_phone: bot.whatsapp_phone,
        processed: true,
        ai_generated: aiGenerated,
      },
    });
  } catch (error) {
    console.error("Failed to send auto-reply:", error);
  }
}

async function processStatusUpdate(status: any) {
  try {
    const { message_id, status: messageStatus } = status;

    // Find message and update status
    const message = await prisma.message.findFirst({
      where: {
        whatsapp_message_id: message_id,
      },
    });

    if (message) {
      // You could add status tracking to the Message model if needed
      console.log(`Message ${message_id} status: ${messageStatus}`);
    }
  } catch (error) {
    console.error("Error processing status update:", error);
  }
}
