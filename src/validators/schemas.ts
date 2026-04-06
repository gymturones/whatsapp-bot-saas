import { z } from 'zod';

// Auth
export const SignUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  company_name: z.string().min(2, 'Nombre de empresa requerido'),
});

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

// Bot — campos alineados con schema Prisma (model Bot)
export const CreateBotSchema = z.object({
  name: z.string().min(2, 'Nombre mínimo 2 caracteres').max(100),
  description: z.string().optional(),
  whatsapp_phone: z.string().min(10, 'Número de WhatsApp requerido').max(15),
  whatsapp_api_token: z.string().optional(),
  greeting_message: z.string().optional().default('Hola! 👋 ¿En qué puedo ayudarte?'),
  fallback_message: z.string().optional().default('Lo siento, no entendí. ¿Podrías reformular tu pregunta?'),
  auto_reply_enabled: z.boolean().default(true),
  auto_reply_message: z.string().optional(),
  ai_model: z.string().default('gpt-3.5-turbo'),
  ai_temperature: z.number().default(0.7),
  ai_instructions: z.string().optional(),
  is_active: z.boolean().default(true),
});

export const UpdateBotSchema = CreateBotSchema.partial();

// Bot Response (respuestas automáticas) — campos alineados con schema Prisma
export const CreateBotResponseSchema = z.object({
  bot_id: z.string().uuid(),
  trigger: z.string().min(1, 'Palabra clave requerida'),
  response: z.string().min(1, 'Respuesta requerida'),
  trigger_type: z.enum(['keyword', 'regex', 'contains']).default('keyword'),
  is_active: z.boolean().default(true),
});

export const UpdateBotResponseSchema = CreateBotResponseSchema.partial();

// Message
export const SendMessageSchema = z.object({
  bot_id: z.string(),
  conversation_id: z.string().optional(),
  recipient_phone: z.string().min(10, 'Número de teléfono requerido'),
  message: z.string().min(1, 'Mensaje requerido'),
});

// Conversation
export const CreateConversationSchema = z.object({
  bot_id: z.string().uuid(),
  phone_number: z.string(),
  customer_name: z.string().optional(),
});

// API Key
export const CreateApiKeySchema = z.object({
  name: z.string().min(1),
  expires_in_days: z.number().int().min(1).max(365).optional(),
});

// Subscription/Payment
export const CreateSubscriptionSchema = z.object({
  plan: z.enum(['free', 'starter', 'pro', 'business']),
  payment_method: z.string().optional(),
});

// Type exports
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateBotInput = z.infer<typeof CreateBotSchema>;
export type UpdateBotInput = z.infer<typeof UpdateBotSchema>;
export type CreateBotResponseInput = z.infer<typeof CreateBotResponseSchema>;
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
export type CreateConversationInput = z.infer<typeof CreateConversationSchema>;
export type CreateApiKeyInput = z.infer<typeof CreateApiKeySchema>;
export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;
