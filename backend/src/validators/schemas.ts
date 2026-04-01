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

// Bot
export const CreateBotSchema = z.object({
  name: z.string().min(2, 'Nombre mínimo 2 caracteres').max(100),
  description: z.string().optional(),
  phone_number: z.string().regex(/^\d{10,15}$/, 'Número de teléfono inválido'),
  welcome_message: z.string().min(1),
  fallback_message: z.string().min(1),
  is_active: z.boolean().default(true),
});

export const UpdateBotSchema = CreateBotSchema.partial();

// Bot Response (respuestas automáticas)
export const CreateBotResponseSchema = z.object({
  bot_id: z.string().uuid(),
  trigger_keyword: z.string().min(1, 'Palabra clave requerida'),
  response_text: z.string().min(1, 'Respuesta requerida'),
  response_type: z.enum(['text', 'template']).default('text'),
  order: z.number().int().min(0).default(0),
});

export const UpdateBotResponseSchema = CreateBotResponseSchema.partial();

// Message
export const SendMessageSchema = z.object({
  bot_id: z.string().uuid(),
  phone_number: z.string().regex(/^\d{10,15}$/),
  message: z.string().min(1),
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
