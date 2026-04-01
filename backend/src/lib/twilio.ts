// src/lib/twilio.ts
// Twilio WhatsApp integration helpers

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const fromNumber = process.env.TWILIO_WHATSAPP_FROM! // e.g. whatsapp:+14155238886

/**
 * Send a WhatsApp message via Twilio REST API
 */
export async function sendTwilioMessage(to: string, body: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Ensure number has whatsapp: prefix
    const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`
    const fromFormatted = fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`

    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromFormatted,
          To: toFormatted,
          Body: body,
        }).toString(),
      }
    )

    const data = await response.json() as any

    if (!response.ok) {
      console.error('Twilio error:', data)
      return { success: false, error: data.message || 'Twilio error' }
    }

    return { success: true, messageId: data.sid }
  } catch (error: any) {
    console.error('Twilio send error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Validate that a webhook request came from Twilio
 * For sandbox/testing, validation is optional
 */
export function buildTwimlResponse(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`
}

export function buildEmptyTwiml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Clean phone number: strip whatsapp: prefix and +
 */
export function cleanPhone(phone: string): string {
  return phone.replace('whatsapp:', '').replace(/^\+/, '')
}
