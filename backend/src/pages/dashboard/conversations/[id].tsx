import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useFetch, useMutation } from '@/hooks';
import { Card, Button, Input, Spinner, Alert } from '@/components/UI';
import { MessageThread, MessageItem } from '@/components/DomainComponents';

export default function ConversationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [messageInput, setMessageInput] = useState('');

  // Fetch conversation
  const {
    data: conversation,
    loading: convLoading,
    error: convError,
  } = useFetch(id ? `/api/conversations/${id}` : null);

  // Send message
  const { mutate: sendMessage, loading: sending } = useMutation(
    '/api/messages/send',
    {
      method: 'POST',
      onSuccess: () => {
        setMessageInput('');
        // Refetch messages
        router.replace(router.asPath);
      },
    }
  );

  if (convLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (convError) {
    return <Alert variant="error">{convError}</Alert>;
  }

  if (!conversation) {
    return <Alert variant="error">Conversación no encontrada</Alert>;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      await sendMessage({
        bot_id: conversation.bot_id,
        phone_number: conversation.phone_number,
        message: messageInput,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {conversation.customer_name || conversation.phone_number}
          </h1>
          <p className="text-gray-600 text-sm mt-1">📱 {conversation.phone_number}</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => router.push('/dashboard')}
        >
          ← Volver
        </Button>
      </div>

      {/* Messages */}
      <Card className="flex flex-col h-96">
        <div className="flex-1 overflow-y-auto p-4">
          {conversation.messages?.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Sin mensajes</p>
          ) : (
            <div className="space-y-3">
              {conversation.messages?.map((msg: any) => (
                <MessageItem key={msg.id} message={msg} />
              ))}
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              type="text"
              placeholder="Escribe un mensaje..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              disabled={sending}
              className="flex-1"
            />
            <Button
              type="submit"
              loading={sending}
              disabled={!messageInput.trim()}
            >
              Enviar
            </Button>
          </form>
        </div>
      </Card>

      {/* Info */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Información</h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Iniciada:</span>{' '}
            {new Date(conversation.created_at).toLocaleDateString('es-AR')}
          </p>
          <p>
            <span className="font-medium">Última actualización:</span>{' '}
            {new Date(conversation.updated_at).toLocaleDateString('es-AR')}
          </p>
          <p>
            <span className="font-medium">Mensajes:</span>{' '}
            {conversation.messages?.length || 0}
          </p>
        </div>
      </Card>
    </div>
  );
}
