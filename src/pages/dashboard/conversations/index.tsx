import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase';

interface Conversation {
  id: string;
  whatsapp_contact: string;
  contact_name: string | null;
  status: string;
  message_count: number;
  last_message_at: string | null;
  bot: { name: string } | null;
}

export default function ConversationsPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push('/auth/login'); return; }

        const res = await fetch('/api/conversations', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) throw new Error('Error cargando conversaciones');
        const json = await res.json();
        setConversations(json.data?.conversations || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Conversaciones</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {conversations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay conversaciones todavía
          </h3>
          <p className="text-gray-500">
            Las conversaciones aparecerán aquí cuando tus bots reciban mensajes de WhatsApp.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {conversations.map((conv) => (
            <Link key={conv.id} href={`/dashboard/conversations/${conv.id}`}>
              <a className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                  {(conv.contact_name || conv.whatsapp_contact).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 truncate">
                      {conv.contact_name || conv.whatsapp_contact}
                    </p>
                    {conv.last_message_at && (
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {new Date(conv.last_message_at).toLocaleDateString('es-AR')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm text-gray-500">{conv.bot?.name || 'Bot'}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-400">{conv.message_count} mensajes</span>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                      conv.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {conv.status === 'active' ? 'Activa' : 'Cerrada'}
                    </span>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
