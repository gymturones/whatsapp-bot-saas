import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, useFetch, useMutation } from '@/hooks';
import { Card, Button, Spinner, Alert, Modal } from '@/components/UI';
import { BotCard, StatsCard } from '@/components/DomainComponents';

export default function DashboardPage() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [subscriptionBanner, setSubscriptionBanner] = useState<string | null>(null);

  // Detectar redirect post-pago desde MercadoPago con ?status=success&plan=xxx
  useEffect(() => {
    if (router.isReady && router.query.status === 'success') {
      const plan = typeof router.query.plan === 'string' ? router.query.plan : '';
      const planLabel = plan
        ? plan.charAt(0).toUpperCase() + plan.slice(1)
        : 'nuevo';
      setSubscriptionBanner(`¡Suscripción activada! Plan ${planLabel} activado correctamente.`);

      // Limpiar los query params sin recargar la página
      router.replace('/dashboard', undefined, { shallow: true });

      // Ocultar el banner después de 5 segundos
      const timer = setTimeout(() => {
        setSubscriptionBanner(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [router.isReady, router.query.status, router.query.plan]);

  // Fetch stats
  const { data: stats, loading: statsLoading } = useFetch('/api/stats');

  // Fetch bots
  const { data: botsData, loading: botsLoading } = useFetch(
    '/api/bots?page=1&limit=12'
  );

  // Delete bot
  const { mutate: deleteBot, loading: deleting } = useMutation(
    '/api/bots/[id]',
    {
      method: 'DELETE',
      onSuccess: () => {
        setShowDeleteModal(null);
        router.replace(router.asPath);
      },
    }
  );

  if (authLoading || statsLoading || botsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Banner post-pago MercadoPago */}
      {subscriptionBanner && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-300 text-green-800 rounded-xl px-5 py-4 shadow-sm">
          <svg
            className="w-6 h-6 text-green-600 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold text-sm">{subscriptionBanner}</p>
          <button
            className="ml-auto text-green-600 hover:text-green-800 transition-colors"
            onClick={() => setSubscriptionBanner(null)}
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Bienvenido de vuelta a tu panel de control
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => router.push('/dashboard/bots/new')}
        >
          + Crear Bot
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            label="Bots Activos"
            value={stats.bots || 0}
            icon="🤖"
          />
          <StatsCard
            label="Conversaciones"
            value={stats.conversations || 0}
            icon="💬"
          />
          <StatsCard
            label="Mensajes"
            value={stats.messages || 0}
            icon="📨"
          />
          <StatsCard
            label="Plan"
            value={
              stats.subscription_plan
                ? stats.subscription_plan.charAt(0).toUpperCase() +
                  stats.subscription_plan.slice(1)
                : 'Free'
            }
            icon="⭐"
          />
        </div>
      )}

      {/* Bots Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tus Bots</h2>

        {!botsData?.bots || botsData.bots.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4">Aún no tienes bots creados</p>
            <Button onClick={() => router.push('/dashboard/bots/new')}>
              Crear tu primer bot
            </Button>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {botsData.bots.map((bot: any) => (
                <BotCard
                  key={bot.id}
                  bot={bot}
                  onView={(id) => router.push(`/dashboard/bots/${id}`)}
                  onEdit={(id) => router.push(`/dashboard/bots/new?id=${id}`)}
                  onDelete={(id) => setShowDeleteModal(id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {botsData.pagination?.pages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from(
                  { length: botsData.pagination.pages },
                  (_, i) => i + 1
                ).map((page) => (
                  <Button
                    key={page}
                    variant={
                      botsData.pagination.page === page ? 'primary' : 'secondary'
                    }
                    size="sm"
                    onClick={() =>
                      router.push(`/dashboard?page=${page}`)
                    }
                  >
                    {page}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={!!showDeleteModal}
        title="Eliminar Bot"
        onClose={() => setShowDeleteModal(null)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={deleting}
              onClick={() => {
                if (showDeleteModal) {
                  deleteBot().catch(() => {});
                }
              }}
            >
              Eliminar
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          ¿Estás seguro? Esta acción no se puede deshacer. Se eliminarán todas las
          conversaciones y mensajes asociados.
        </p>
      </Modal>
    </div>
  );
}
