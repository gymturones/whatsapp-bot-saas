// src/pages/api/webhooks/twilio.ts
// Twilio WhatsApp webhook handler

import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { buildTwimlResponse, buildEmptyTwiml, cleanPhone, sendTwilioMessage } from '@/lib/twilio'

// Disable Next.js JSON body parser — Twilio sends form-encoded data
export const config = {
  api: {
    bodyParser: {
      type: ['application/x-www-form-urlencoded', 'text/xml'],
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  try {
    const body = req.body

    // Twilio fields
    const from: string = body?.From || ''   // e.g. whatsapp:+5491112345678
    const to: string = body?.To || ''       // e.g. whatsapp:+14155238886
    const messageBody: string = body?.Body || ''
    const messageSid: string = body?.MessageSid || ''
    const profileName: string = body?.ProfileName || ''

    if (!from || !messageBody) {
      return res.status(200).send(buildEmptyTwiml())
    }

    const senderPhone = cleanPhone(from)  // 5491112345678
    const botPhone = cleanPhone(to)        // 14155238886 (sandbox)

    console.log(`[Twilio] Message from ${senderPhone}: "${messageBody}"`)

    // Find bot by whatsapp_phone, or fall back to first active bot
    let bot = await prisma.bot.findFirst({
      where: {
        whatsapp_phone: botPhone,
        is_active: true,
      },
    })

    if (!bot) {
      // Fallback: first active bot in the system
      bot = await prisma.bot.findFirst({
        where: { is_active: true },
      })
    }

    if (!bot) {
      console.log('[Twilio] No active bot found')
      return res.status(200).send(buildEmptyTwiml())
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        bot_id: bot.id,
        whatsapp_contact: senderPhone,
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user_id: bot.user_id,
          bot_id: bot.id,
          whatsapp_contact: senderPhone,
          contact_name: profileName || null,
        },
      })
    }

    // Save incoming message
    await prisma.message.create({
      data: {
        conversation_id: conversation.id,
        bot_id: bot.id,
        direction: 'incoming',
        content: messageBody,
        whatsapp_message_id: messageSid || null,
        sender_phone: senderPhone,
        processed: false,
      },
    })

    // Update conversation stats
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        message_count: { increment: 1 },
        last_message_at: new Date(),
      },
    })

    // Update bot stats
    await prisma.bot.update({
      where: { id: bot.id },
      data: { total_messages: { increment: 1 } },
    })

    // --- Auto-reply logic ---
    if (!bot.auto_reply_enabled) {
      return res.status(200).send(buildEmptyTwiml())
    }

    // 1. Check keyword responses first
    const words = messageBody.toLowerCase().trim().split(/\s+/)
    const keywordResponse = await prisma.botResponse.findFirst({
      where: {
        bot_id: bot.id,
        is_active: true,
        trigger: { in: words },
      },
    })

    let replyText: string

    if (keywordResponse) {
      replyText = keywordResponse.response
    } else {
      // 2. Use fallback message
      replyText = bot.fallback_message || 'Lo siento, no entendí tu mensaje. ¿Podés reformularlo?'
    }

    // Save outgoing message
    await prisma.message.create({
      data: {
        conversation_id: conversation.id,
        bot_id: bot.id,
        direction: 'outgoing',
        content: replyText,
        sender_phone: botPhone,
        processed: true,
        ai_generated: false,
      },
    })

    // Respond with TwiML (Twilio sends the message automatically)
    res.setHeader('Content-Type', 'text/xml')
    return res.status(200).send(buildTwimlResponse(replyText))

  } catch (error) {
    console.error('[Twilio webhook error]', error)
    // Always return 200 to Twilio to avoid retries
    res.setHeader('Content-Type', 'text/xml')
    return res.status(200).send(buildEmptyTwiml())
  }
}
