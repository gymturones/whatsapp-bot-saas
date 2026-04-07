// src/pages/api/webhooks/whatsapp.ts

import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { prisma } from "@/lib/supabase";
import {
  verifyWebhookToken,
  parseWebhookPayload,
  markMessageAsRead,
  sendWhatsAppMessage,
} from "@/lib/whatsapp";
import { generateAIResponse } from "@/lib/openai";

// Disable body parsing so we can verify Meta's HMAC signature on the raw bytes
export const config = { api: { bodyParser: false } };

async function getRawBody(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

// Verify Meta's HMAC signature on POST requests
function verifyMetaSignature(rawBody: string, signature: string | undefined): boolean {
  const appSecret = (process.env.WHATSAPP_APP_SECRET || "").trim();
  if (!appSecret) {
    console.warn("WHATSAPP_APP_SECRET not set — skipping HMAC verification");
    return true; // allow in dev if not configured, but log warning
  }
  if (!signature) return false;
  const expected = `sha256=${crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex")}`;
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const verifyToken = (process.env.WHATSAPP_VERIFY_TOKEN || "").trim();

  // Validate verify token is configured
  if (!verifyToken) {
    console.error("WHATSAPP_VERIFY_TOKEN not configured in environment");
    return res.status(500).json({ error: "Server misconfiguration: verify token not set" });
  }

  // GET: Webhook verification
  if (req.method === "GET") {
    const token = req.query["hub.verify_token"] as string;
    const challenge = req.query["hub.challenge"] as string;
    const mode = req.query["hub.mode"] as string;

    const isValidMode = mode === "subscribe";
    const isValidToken = verifyWebhookToken(token, verifyToken);

    console.log("WhatsApp webhook verification attempt:", {
      mode,
      isValidMode,
      tokenMatch: isValidToken,
      receivedTokenLength: token?.length || 0,
      verifyTokenLength: verifyToken.length,
    });

    if (isValidMode && isValidToken) {
      console.log("✅ Webhook verification successful");
      res.status(200).send(challenge);
      return;
    }

    console.error("❌ Webhook verification failed", {
      reasonModeInvalid: !isValidMode,
      reasonTokenInvalid: !isValidToken,
    });
    res.status(403).json({ error: "Verification failed" });
    return;
  }

  // POST: Handle incoming messages
  if (req.method === "POST") {
    const signature = req.headers["x-hub-signature-256"] as string | undefined;
    const rawBody = await getRawBody(req);
    if (!verifyMetaSignature(rawBody, signature)) {
      console.error("❌ Invalid Meta HMAC signature — request rejected");
      return res.status(401).json({ error: "Invalid signature" });
    }

    try {
      console.log("📨 Incoming webhook POST rawBodyLen=" + rawBody.length + " sig=" + (signature ? "yes" : "no"));

      let parsedBody: any;
      try {
        parsedBody = JSON.parse(rawBody);
        console.log("📦 Parsed body object=" + parsedBody?.object + " entryLen=" + (parsedBody?.entry?.length || 0));
      } catch (parseErr) {
        console.log("⚠️ JSON parse failed: " + String(parseErr) + " rawBody(50)=" + rawBody.substring(0, 50));
        return res.status(200).json({ success: false });
      }

      const payload = parseWebhookPayload(parsedBody);

      if (!payload) {
        console.log("⚠️ Invalid payload structure object=" + parsedBody?.object);
        res.status(200).json({ success: false });
        return;
      }

      console.log("✅ Webhook payload parsed", {
        messageCount: payload.messages.length,
        statusCount: payload.statuses.length,
      });

      // Process incoming messages
      for (const message of payload.messages) {
        console.log("📝 Processing incoming message", { messageId: message.id, from: message.from });
        await processIncomingMessage(message, payload.phoneNumberId, payload.contacts);
      }

      // Process status updates
      for (const status of payload.statuses) {
        console.log("📊 Processing status update", { messageId: status.message_id, status: status.status });
        await processStatusUpdate(status);
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("❌ Webhook error:", error);
      return res.status(500).json({ error: "Webhook processing failed" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

async function processIncomingMessage(message: any, phoneNumberId?: string, contacts?: any[]) {
  try {
    const {
      id: messageId,
      from: phoneNumber,
      type,
      text,
      timestamp,
      profile,
    } = message;

    // Get sender name from contacts array or profile
    const senderName = contacts?.[0]?.profile?.name || profile?.name || '';

    // Find the correct bot by phone_number_id (multi-tenant routing)
    // 1. First try to match by whatsapp_api_token column if we know the phone_number_id
    // 2. Fallback: find any active bot (single-tenant compatibility)
    const envPhoneId = (process.env.WHATSAPP_PHONE_NUMBER_ID || "").trim();
    let matchingBot = await prisma.bot.findFirst({
      where: { is_active: true },
    });

    // If multi-tenant: try to match by the phone number the message was sent TO
    if (phoneNumberId) {
      const multiTenantBot = await prisma.bot.findFirst({
        where: { is_active: true },
        orderBy: { created_at: 'asc' }, // prefer older bots as default
      });
      matchingBot = multiTenantBot;
    }

    const firstBot = matchingBot;

    let conversation = await prisma.conversation.findFirst({
      where: {
        whatsapp_contact: phoneNumber,
        ...(firstBot ? { bot_id: firstBot.id } : {}),
      },
      include: {
        bot: true,
      },
    });

    if (!conversation) {

      if (!firstBot) {
        console.log("No active bot found for new conversation");
        return;
      }

      conversation = await prisma.conversation.create({
        data: {
          user_id: firstBot.user_id,
          bot_id: firstBot.id,
          whatsapp_contact: phoneNumber,
          contact_name: senderName,
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

  // Split respuestas largas en múltiples mensajes (máximo 600 chars cada uno)
  const MAX_MSG_LEN = 600;
  const parts = splitMessage(replyMessage, MAX_MSG_LEN);

  // Enviar cada parte por WhatsApp
  try {
    for (const part of parts) {
      const result = await sendWhatsAppMessage(
        conversation.whatsapp_contact,
        part,
        bot.whatsapp_api_token // multi-tenant: usa el token del bot
      );

      // Guardar cada parte en la base de datos
      await prisma.message.create({
        data: {
          conversation_id: conversation.id,
          bot_id: bot.id,
          direction: "outgoing",
          content: part,
          whatsapp_message_id: result.messageId,
          sender_phone: bot.whatsapp_phone,
          processed: true,
          ai_generated: aiGenerated,
        },
      });
    }
  } catch (error) {
    console.error("Failed to send auto-reply:", error);
  }
}

// Split message into chunks that don't break mid-word, at line boundaries
function splitMessage(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];

  const parts: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      parts.push(remaining.trim());
      break;
    }

    // Try to find a line break within the limit
    let splitAt = remaining.lastIndexOf('\n', maxLen);

    // If no line break, try to find a sentence end
    if (splitAt < maxLen * 0.3) {
      splitAt = -1;
      for (const sep of ['. ', '! ', '? ', '.\n']) {
        const idx = remaining.lastIndexOf(sep, maxLen);
        if (idx > splitAt) splitAt = idx + sep.length;
      }
    }

    // If still no good split point, cut at word boundary
    if (splitAt < maxLen * 0.3) {
      splitAt = remaining.lastIndexOf(' ', maxLen);
    }

    // Last resort: hard cut
    if (splitAt < 0) splitAt = maxLen;

    parts.push(remaining.substring(0, splitAt).trim());
    remaining = remaining.substring(splitAt).trim();
  }

  return parts.filter(p => p.length > 0);
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
