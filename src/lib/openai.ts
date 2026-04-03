// src/lib/openai.ts
// Integración con OpenAI para respuestas inteligentes del bot

import { prisma } from '@/lib/supabase';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponseOptions {
  botId: string;
  conversationId: string;
  userMessage: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
}

/**
 * Genera una respuesta con IA usando la API de OpenAI.
 * Carga el historial reciente de la conversación para mantener contexto.
 */
export async function generateAIResponse(options: AIResponseOptions): Promise<string> {
  const {
    botId,
    conversationId,
    userMessage,
    systemPrompt,
    model = 'gpt-3.5-turbo',
    temperature = 0.7,
  } = options;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'sk-replace-with-real-key') {
    throw new Error('OpenAI API key not configured');
  }

  // Cargar las últimas 10 mensajes de la conversación para contexto
  const recentMessages = await prisma.message.findMany({
    where: { conversation_id: conversationId },
    orderBy: { created_at: 'desc' },
    take: 10,
  });

  // Construir el historial de chat (invertir para orden cronológico)
  const chatHistory: ChatMessage[] = recentMessages
    .reverse()
    .map((msg) => ({
      role: msg.direction === 'incoming' ? 'user' as const : 'assistant' as const,
      content: msg.content,
    }));

  // Cargar las respuestas predefinidas del bot como conocimiento base
  const botResponses = await prisma.botResponse.findMany({
    where: { bot_id: botId, is_active: true },
    select: { trigger: true, response: true },
  });

  const knowledgeBase = botResponses.length > 0
    ? `\n\nInformación cargada por el dueño del negocio (usala cuando sea relevante):\n${botResponses.map((r) => `- Cuando preguntan "${r.trigger}": ${r.response}`).join('\n')}`
    : '';

  // System prompt: instrucciones del dueño + conocimiento base
  const fullSystemPrompt = (systemPrompt || 'Sos un asistente virtual de WhatsApp para un negocio. Respondé de forma amable, concisa y en español. Si no sabés algo, decilo honestamente.') + knowledgeBase;

  const messages: ChatMessage[] = [
    { role: 'system', content: fullSystemPrompt },
    ...chatHistory,
    { role: 'user', content: userMessage },
  ];

  // Llamada a la API de OpenAI
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || 'No pude generar una respuesta.';
}
