import React from 'react';
import { useRouter } from 'next/router';
import { useFetch } from '@/hooks';
import { Card, Button, Spinner } from '@/components/UI';
import { ConversationList } from '@/components/DomainComponents';

export default function ConversationsPage() {
  const router = useRouter();

  // Fetch all bots to then show conversations per bot
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
          <h1 className="text-3xl font-bold text-gray-900">Conversaciones</h1>
          <p className="text-gray-600 mt-1">Historial de conversaciones por bot</p>
        </div>
      </div>

      {bots.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-600 mb-4">No tienes bots activos todavía</p>
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
        <h2 className="text-lg font-semibold text-gray-900">🤖 {bot.name}</h2>
        <span className="text-sm text-gray-500">
          {convData?.pagination?.total || 0} conversaciones
        </span>
      </div>
      <ConversationList
        conversations={convData?.conversations || []}
        loading={loading}
        onSelectConversation={onSelectConversation}
      />
    </Card>
  );
}
