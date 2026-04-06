import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, useFetch } from '@/hooks';
import { Card, Button, Spinner } from '@/components/UI';
import { BotCard } from '@/components/DomainComponents';

export default function BotsPage() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [localBots, setLocalBots] = useState<any[]>([]);

  const page = typeof router.query.page === 'string' ? parseInt(router.query.page) : 1;
  const { data: botsData, loading: botsLoading } = useFetch(
    `/api/bots?page=${page}&limit=12`
  );

  useEffect(() => {
    if (botsData?.bots) setLocalBots(botsData.bots);
  }, [botsData]);

  const handleDeleteBot = async (botId: string) => {
    try {
      setDeleting(true);
      const token = localStorage.getItem('sb_access_token') || '';
      const res = await fetch(`/api/bots/${botId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error eliminando bot');
      setShowDeleteModal(null);
      setLocalBots(prev => prev.filter(b => b.id !== botId));
    } catch (err) {
      console.error('Error eliminando bot:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || botsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Mis Bots</h1>
          <p className="text-slate-400 mt-1">
            Gestioná todos tus bots de WhatsApp
          </p>
        </div>
        <Button size="lg" onClick={() => router.push('/dashboard/bots/new')}>
          + Crear Bot
        </Button>
      </div>

      {localBots.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-slate-400 mb-4">Aún no tenés bots creados</p>
          <Button onClick={() => router.push('/dashboard/bots/new')}>
            Crear tu primer bot
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localBots.map((bot: any) => (
              <BotCard
                key={bot.id}
                bot={bot}
                onView={(id) => router.push(`/dashboard/bots/${id}`)}
                onEdit={(id) => router.push(`/dashboard/bots/new?id=${id}`)}
                onDelete={(id) => setShowDeleteModal(id)}
              />
            ))}
          </div>

          {botsData?.pagination?.pages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from(
                { length: botsData.pagination.pages },
                (_, i) => i + 1
              ).map((p) => (
                <Button
                  key={p}
                  variant={botsData.pagination.page === p ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => router.push(`/dashboard/bots?page=${p}`)}
                >
                  {p}
                </Button>
              ))}
            </div>
          )}
        </>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-2">Eliminar Bot</h2>
            <p className="text-slate-300 mb-6">
              ¿Estás seguro? Esta acción no se puede deshacer. Se eliminarán todas las
              conversaciones y mensajes asociados.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowDeleteModal(null)}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                loading={deleting}
                onClick={() => handleDeleteBot(showDeleteModal)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
