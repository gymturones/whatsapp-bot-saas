import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFetch, useMutation } from '@/hooks';
import { Card, Button, Alert, Spinner } from '@/components/UI';

interface Message {
  id: string;
  content: string;
  direction: 'inbound' | 'outbound';
  sender_type: string;
  created_at: string;
}

interface Conversation {
  id: string;
  phone_number: string;
  contact_name: string | null;
  status: string;
  last_message_at: string;
  messages: Message[];
  bot: {
    id: string;
    name: string;
    whatsapp_phone: string;
  };
}

export default function ConversationDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [messageText, setMessageText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const convId = typeof id === 'string' ? id : '';
  const [refreshKey, setRefreshKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, loading } = useFetch<any>(convId ? `/api/conversations/${convId}?_=${refreshKey}` : '');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversation: any = data?.data || data || null;

  const { mutate: sendMessage, loading: sending } = useMutation('/api/messages/send', {
    onSuccess: () => {
      setMessageText('');
      setRefreshKey((k) => k + 1);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages?.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg">Conversacion no encontrada</p>
        <Button variant="secondary" className="mt-4" onClick={() => router.push('/dashboard/conversations')}>
          Volver a conversaciones
        </Button>
      </div>
    );
  }

  const handleSend = () => {
    if (!messageText.trim()) return;
    sendMessage({
      bot_id: conversation.bot.id,
      conversation_id: convId,
      recipient_phone: conversation.phone_number,
      message: messageText.trim(),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const contactName = conversation.contact_name || conversation.phone_number;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-700">
        <button
          onClick={() => router.push('/dashboard/conversations')}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-white truncate">{contactName}</h1>
          <p className="text-slate-400 text-sm">{conversation.bot.name} &middot; {conversation.phone_number}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          conversation.status === 'active' ? 'bg-green-500/20 text-green-400' :
          conversation.status === 'closed' ? 'bg-slate-700 text-slate-400' :
          'bg-yellow-500/20 text-yellow-400'
        }`}>
          {conversation.status === 'active' ? 'Activa' :
           conversation.status === 'closed' ? 'Cerrada' : conversation.status}
        </span>
      </div>

      {successMsg && <Alert variant="success" className="mt-2">{successMsg}</Alert>}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {conversation.messages?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No hay mensajes en esta conversacion</p>
          </div>
        )}
        {conversation.messages?.map((msg: Message) => {
          const isOutbound = msg.direction === 'outbound' || msg.sender_type === 'bot';
          return (
            <div key={msg.id} className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                isOutbound
                  ? 'bg-green-600 text-white rounded-br-md'
                  : 'bg-slate-700 text-white rounded-bl-md'
              }`}>
                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                <p className={`text-xs mt-1 ${isOutbound ? 'text-green-200' : 'text-slate-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-slate-700">
        <div className="flex gap-3">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribi un mensaje..."
            rows={1}
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
          <Button loading={sending} onClick={handleSend} className="self-end">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
