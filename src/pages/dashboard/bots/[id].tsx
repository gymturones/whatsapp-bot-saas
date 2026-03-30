import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useFetch, useMutation } from '@/hooks';
import {
  Card,
  Button,
  Input,
  Textarea,
  Spinner,
  Alert,
  Modal,
} from '@/components/UI';
import {
  BotResponseItem,
  StatsCard,
  ConversationList,
} from '@/components/DomainComponents';

export default function BotDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [showAddResponse, setShowAddResponse] = useState(false);
  const [editingResponse, setEditingResponse] = useState<string | null>(null);

  // Fetch bot details
  const { data: bot, loading: botLoading, error: botError } = useFetch(
    id ? `/api/bots/${id}` : null
  );

  // Fetch conversations
  const {
    data: conversationsData,
    loading: convLoading,
  } = useFetch(
    id ? `/api/conversations?botId=${id}` : null
  );

  // Mutations
  const { mutate: updateBot, loading: updating } = useMutation(
    `/api/bots/${id}`,
    { method: 'PUT' }
  );

  const { mutate: deleteResponse, loading: deletingResponse } = useMutation(
    `/api/bot-responses/[id]`,
    { method: 'DELETE' }
  );

  const { mutate: addResponse, loading: addingResponse } = useMutation(
    `/api/bot-responses`,
    { method: 'POST' }
  );

  if (botLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (botError) {
    return <Alert variant="error">{botError}</Alert>;
  }

  if (!bot) {
    return <Alert variant="error">Bot no encontrado</Alert>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{bot.name}</h1>
          <p className="text-gray-600 mt-1">{bot.description}</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => router.push('/dashboard/bots')}
        >
          ← Volver
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          label="Conversaciones"
          value={bot.conversation_count || 0}
          icon="💬"
        />
        <StatsCard
          label="Mensajes"
          value={bot.message_count || 0}
          icon="📨"
        />
        <StatsCard
          label="Respuestas"
          value={bot.bot_responses?.length || 0}
          icon="🤖"
        />
      </div>

      {/* Bot Settings */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Configuración del Bot</h2>
        <div className="space-y-4">
          <Input
            label="Nombre"
            defaultValue={bot.name}
            onChange={(e) => {}}
          />
          <Textarea
            label="Descripción"
            defaultValue={bot.description}
            onChange={(e) => {}}
          />
          <Input
            label="Número de Teléfono"
            defaultValue={bot.phone_number}
            disabled
          />
          <Input
            label="Mensaje de Bienvenida"
            defaultValue={bot.welcome_message}
            onChange={(e) => {}}
          />
          <Textarea
            label="Mensaje de Fallback"
            defaultValue={bot.fallback_message}
            onChange={(e) => {}}
          />
          <div className="flex gap-2">
            <Button loading={updating} onClick={() => updateBot(bot)}>
              Guardar Cambios
            </Button>
            <Button variant="danger">Eliminar Bot</Button>
          </div>
        </div>
      </Card>

      {/* Bot Responses */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Respuestas Automáticas</h2>
          <Button onClick={() => setShowAddResponse(true)}>
            + Agregar Respuesta
          </Button>
        </div>

        {bot.bot_responses?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Sin respuestas automáticas configuradas
          </p>
        ) : (
          <div className="space-y-3">
            {bot.bot_responses?.map((response: any) => (
              <BotResponseItem
                key={response.id}
                response={response}
                onEdit={setEditingResponse}
                onDelete={() => deleteResponse()}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Recent Conversations */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Conversaciones Recientes</h2>
        <ConversationList
          conversations={conversationsData?.conversations || []}
          loading={convLoading}
          onSelectConversation={(id) =>
            router.push(`/dashboard/conversations/${id}`)
          }
        />
      </Card>

      {/* Modal para agregar respuesta */}
      <Modal
        isOpen={showAddResponse}
        title="Nueva Respuesta Automática"
        onClose={() => setShowAddResponse(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowAddResponse(false)}
            >
              Cancelar
            </Button>
            <Button
              loading={addingResponse}
              onClick={() => {
                // TODO: submit form
              }}
            >
              Crear
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Palabra Clave"
            placeholder="ej: hola"
          />
          <Textarea
            label="Respuesta"
            placeholder="Mensaje que se enviará cuando se detecte la palabra clave"
          />
        </div>
      </Modal>
    </div>
  );
}
