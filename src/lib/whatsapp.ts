// src/lib/whatsapp.ts

import axios, { AxiosError } from "axios";

const WHATSAPP_API_URL = "https://graph.instagram.com/v22.0";
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
const WHATSAPP_PHONE_NUMBER_ID =
  process.env.WHATSAPP_PHONE_NUMBER_ID ||
  process.env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Validate critical environment variables
if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN || !WHATSAPP_BUSINESS_ACCOUNT_ID) {
  console.error("Missing critical WhatsApp environment variables:", {
    hasPhoneId: !!WHATSAPP_PHONE_NUMBER_ID,
    hasAccessToken: !!WHATSAPP_ACCESS_TOKEN,
    hasAccountId: !!WHATSAPP_BUSINESS_ACCOUNT_ID,
  });
}

interface WhatsAppMessage {
  id: string;
  timestamp: string;
  type: "text" | "image" | "document" | "audio" | "video";
  text?: string;
  from: string;
  profile_name?: string;
}

interface WhatsAppContact {
  profile: {
    name: string;
  };
  wa_id: string;
}

interface WhatsAppStatus {
  id: string;
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: string;
}

// Send text message
export async function sendWhatsAppMessage(
  recipientPhone: string,
  message: string
) {
  try {
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: recipientPhone,
        type: "text",
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        },
      }
    );

    return {
      success: true,
      messageId: response.data.messages[0].id,
    };
  } catch (error) {
    console.error("WhatsApp send error:", error);
    throw new Error("Failed to send WhatsApp message");
  }
}

// Send template message
export async function sendWhatsAppTemplate(
  recipientPhone: string,
  templateName: string,
  templateLanguage: string = "es",
  parameters?: Record<string, any>[]
) {
  try {
    const payload: any = {
      messaging_product: "whatsapp",
      to: recipientPhone,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: templateLanguage,
        },
      },
    };

    if (parameters) {
      payload.template.components = [
        {
          type: "body",
          parameters: parameters.map((p) => ({ type: "text", text: p })),
        },
      ];
    }

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        },
      }
    );

    return {
      success: true,
      messageId: response.data.messages[0].id,
    };
  } catch (error) {
    console.error("WhatsApp template error:", error);
    throw new Error("Failed to send WhatsApp template");
  }
}

// Mark message as read
export async function markMessageAsRead(messageId: string) {
  try {
    await axios.post(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error("WhatsApp mark read error:", error);
    throw new Error("Failed to mark message as read");
  }
}

// Upload media (image, video, document, audio)
export async function uploadWhatsAppMedia(
  fileStream: Buffer,
  mediaType: "image" | "video" | "document" | "audio",
  mimeType: string
) {
  try {
    const formData = new FormData();
    formData.append("file", new Blob([fileStream], { type: mimeType }));
    formData.append("type", mimeType);

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${WHATSAPP_BUSINESS_ACCOUNT_ID}/media`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        },
      }
    );

    return {
      success: true,
      mediaId: response.data.id,
    };
  } catch (error) {
    console.error("WhatsApp media upload error:", error);
    throw new Error("Failed to upload media");
  }
}

// Send media message
export async function sendWhatsAppMediaMessage(
  recipientPhone: string,
  mediaType: "image" | "video" | "document" | "audio",
  mediaUrl: string,
  caption?: string
) {
  try {
    const payload: any = {
      messaging_product: "whatsapp",
      to: recipientPhone,
      type: mediaType,
      [mediaType]: {
        link: mediaUrl,
      },
    };

    if (caption && (mediaType === "image" || mediaType === "video")) {
      payload[mediaType].caption = caption;
    }

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        },
      }
    );

    return {
      success: true,
      messageId: response.data.messages[0].id,
    };
  } catch (error) {
    console.error("WhatsApp media send error:", error);
    throw new Error("Failed to send media message");
  }
}

// Get phone number details
export async function getPhoneNumberInfo() {
  try {
    const response = await axios.get(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}`,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("WhatsApp phone info error:", error);
    throw new Error("Failed to get phone number info");
  }
}

// Verify webhook token
export function verifyWebhookToken(token: string, verifyToken: string) {
  return token === verifyToken;
}

// Parse webhook payload
export function parseWebhookPayload(body: any) {
  try {
    if (body.object !== "whatsapp_business_account") {
      return null;
    }

    const entry = body.entry[0];
    const changes = entry.changes[0];
    const value = changes.value;

    return {
      messages: value.messages || [],
      statuses: value.statuses || [],
      contacts: value.contacts || [],
    };
  } catch (error) {
    console.error("Webhook parse error:", error);
    return null;
  }
}

// Send error reply
export async function sendErrorMessage(recipientPhone: string) {
  return sendWhatsAppMessage(
    recipientPhone,
    "Lo siento, hubo un error. Por favor intenta de nuevo."
  );
}

// Test webhook connection
export async function testWebhookConnection() {
  try {
    const response = await axios.get(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}`,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        },
      }
    );

    return {
      success: true,
      phoneNumber: response.data.display_phone_number,
      status: response.data.quality_rating,
    };
  } catch (error) {
    console.error("Webhook test error:", error);
    return {
      success: false,
      error: "Failed to connect to WhatsApp API",
    };
  }
}
