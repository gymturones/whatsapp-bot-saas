// src/types/index.ts

// User
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  company_name?: string
  avatar_url?: string
  subscription_plan: 'free' | 'starter' | 'pro' | 'business'
  subscription_status: 'inactive' | 'active' | 'cancelled'
  stripe_customer_id?: string
  is_active: boolean
  email_verified: boolean
  created_at: Date
  updated_at: Date
}

// Bot
export interface Bot {
  id: string
  user_id: string
  name: string
  description?: string
  whatsapp_phone: string
  whatsapp_api_token: string
  is_active: boolean
  auto_reply_enabled: boolean
  auto_reply_message?: string
  greeting_message?: string
  fallback_message?: string
  ai_model: string
  ai_temperature: number
  ai_instructions?: string
  total_messages: number
  total_conversations: number
  created_at: Date
  updated_at: Date
}

// Conversation
export interface Conversation {
  id: string
  user_id: string
  bot_id: string
  whatsapp_contact: string
  contact_name?: string
  status: 'active' | 'archived' | 'closed'
  message_count: number
  last_message_at?: Date
  created_at: Date
  updated_at: Date
}

// Message
export interface Message {
  id: string
  conversation_id: string
  bot_id: string
  direction: 'incoming' | 'outgoing'
  content: string
  whatsapp_message_id?: string
  sender_phone: string
  processed: boolean
  ai_generated: boolean
  response_time_ms?: number
  created_at: Date
}

// Payment
export interface Payment {
  id: string
  user_id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: 'stripe' | 'mercado_pago'
  payment_id: string
  invoice_url?: string
  receipt_url?: string
  billing_period_start: Date
  billing_period_end: Date
  created_at: Date
  updated_at: Date
}

// API Response
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Webhook Event
export interface WebhookEvent {
  id: string
  bot_id: string
  event_type: string
  payload: any
  processed: boolean
  error_message?: string
  retry_count: number
  created_at: Date
  processed_at?: Date
}

// Bot Response (keyword triggers)
export interface BotResponse {
  id: string
  bot_id: string
  trigger: string
  response: string
  is_active: boolean
  trigger_type: 'keyword' | 'regex' | 'contains'
  created_at: Date
  updated_at: Date
}

// Subscription Plan
export interface SubscriptionPlan {
  id: string
  plan_id: string
  plan_name: string
  price: number
  currency: string
  features: string[]
  max_bots: number
  max_messages_per_month: number
  ai_enabled: boolean
  is_active: boolean
  created_at: Date
}

// Stats
export interface BotStats {
  id: string
  bot_id: string
  date: Date
  messages_count: number
  conversations_count: number
  ai_messages_count: number
  average_response_time: number
}

// Dashboard Stats
export interface DashboardStats {
  total_bots: number
  total_conversations: number
  total_messages: number
  total_users: number
  revenue_this_month: number
  revenue_last_month: number
  active_subscriptions: number
  churn_rate: number
}

// Pagination
export interface PaginationParams {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}
