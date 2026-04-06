import React from 'react';
import { useRouter } from 'next/router';
import { useFetch } from '@/hooks';
import { Card, Button, Spinner } from '@/components/UI';
import { ConversationItem } from '@/components/DomainComponents';

export default function ConversationsPage() {
  const router = useRouter();

  // Fetch all user bots
  const { data: botsData, loading: botsLoading } = useFetch('/api/bots/list?page=1&limit=50');

  if (botsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const bots = botsData?.bots || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Conversaciones</h1>
          <p className="text-slate-400 mt-1">Historial de conversaciones por bot</p>
        </div>
      </div>

      {bots.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-5xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-white mb-2">No tenés bots activos</h3>
          <p className="text-slate-400 mb-6">
            Creá tu primer bot para empezar a recibir conversaciones.
          </p>
          <Button onClick={() => router.push('/dashboard/bots/new')}>
            Crear tu primer bot
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {bots.map((bot: any) => (
            <BotConversations
              key={bot.id}
              bot={bot}
              onSelectConversation={(id) =>
                router.push(`/dashboard/conversations/${id}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BotConversations({
  bot,
  onSelectConversation,
}: {
  bot: any;
  onSelectConversation: (id: string) => void;
}) {
  const { data: convData, loading } = useFetch(
    `/api/conversations?botId=${bot.id}&page=1&limit=10`
  );

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h2 className="text-lg font-semibold text-white">{bot.name}</h2>
            <p className="text-sm text-slate-400">
              {bot.phone_number || bot.whatsapp_phone || 'Sin número'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            bot.is_active
              ? 'bg-green-500/15 text-green-400 border border-green-500/20'
              : 'bg-slate-700/60 text-slate-400'
          }`}>
            {bot.is_active ? '● Activo' : '⏸ Pausado'}
          </span>
          <span className="text-sm text-slate-500">
            {convData?.pagination?.total || 0} conv.
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : convData?.conversations?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No hay conversaciones todavia</p>
          <p className="text-slate-500 text-sm mt-1">Las conversaciones aparecen cuando tu bot recibe mensajes</p>
        </div>
      ) : (
        <div className="space-y-2">
          {(convData?.conversations || []).map((conv: any) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
