import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useFetch, useMutation, useForm } from '@/hooks';
import { Card, Button, Input, Textarea, Alert, Spinner } from '@/components/UI';

type ModalMode = 'closed' | 'create' | 'edit';

interface BotResponse {
  id: string;
  bot_id: string;
  trigger: string;
  response: string;
  trigger_type: string;
  is_active: boolean;
  created_at: string;
}

export default function BotDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [showDeleteBotModal, setShowDeleteBotModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('closed');
  const [editingResponse, setEditingResponse] = useState<BotResponse | null>(null);
  const [deleteResponseId, setDeleteResponseId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [refreshKey, setRefreshKey] = useState(0);

  const botId = typeof id === 'string' ? id : '';
  const fetchUrl = botId ? `/api/bots/${botId}?_=${refreshKey}` : '';
  const responsesUrl = botId ? `/api/bot-responses?botId=${botId}&_=${refreshKey}` : '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: botData, loading: botLoading } = useFetch<any>(botId ? fetchUrl : '');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bot: any = botData?.data || botData?.bot || botData;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: responsesData, loading: responsesLoading } = useFetch<any>(responsesUrl);
  const responses: BotResponse[] = responsesData?.data?.responses || responsesData?.responses || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: responsesData, loading: responsesLoading } = useFetch<any>(responsesUrl);
  const responses: BotResponse[] = responsesData?.data?.responses || responsesData?.responses || [];

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  // Toggle bot active status
  const { mutate: toggleBot, loading: toggling } = useMutation(`/api/bots/${botId}`, {
    method: 'PUT',
    onSuccess: () => {
      triggerRefresh();
      setSuccessMsg('Estado del bot actualizado');
      setTimeout(() => setSuccessMsg(''), 3000);
    },
    onError: (err: string) => setErrorMsg(err),
  });

  // Delete bot
  const { mutate: deleteBot, loading: deleting } = useMutation(`/api/bots/${botId}`, {
    method: 'DELETE',
    onSuccess: () => router.push('/dashboard'),
    onError: (err: string) => setErrorMsg(err),
  });

  // Create/Update response
  const responseForm = useForm({
    initialValues: { trigger: '', response: '', trigger_type: 'keyword' },
    onSubmit: async (values) => {
      try {
        if (modalMode === 'create') {
          await fetch('/api/bot-responses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ bot_id: botId, ...values }),
          });
        } else if (modalMode === 'edit' && editingResponse) {
          await fetch(`/api/bot-responses?id=${editingResponse.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify(values),
          });
        }
        closeModal();
        triggerRefresh();
        setSuccessMsg(modalMode === 'create' ? 'Respuesta creada' : 'Respuesta actualizada');
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch {
        setErrorMsg('Error al guardar la respuesta');
      }
    },
  });

  // Delete response
  const handleDeleteResponse = async (responseId: string) => {
    try {
      await fetch(`/api/bot-responses?id=${responseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setDeleteResponseId(null);
      triggerRefresh();
      setSuccessMsg('Respuesta eliminada');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      setErrorMsg('Error al eliminar la respuesta');
    }
  };

  const openCreateModal = () => {
    responseForm.setValues({ trigger: '', response: '', trigger_type: 'keyword' });
    setModalMode('create');
  };

  const openEditModal = (r: BotResponse) => {
    setEditingResponse(r);
    responseForm.setValues({ trigger: r.trigger, response: r.response, trigger_type: r.trigger_type });
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode('closed');
    setEditingResponse(null);
    setErrorMsg('');
  };

  if (botLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg">Bot no encontrado</p>
        <Button variant="secondary" className="mt-4" onClick={() => router.push('/dashboard')}>
          Volver al Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{bot.name}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                bot.is_active ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
              }`}>
                {bot.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            {bot.description && <p className="text-slate-400 text-sm mt-1">{bot.description}</p>}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="secondary" onClick={() => router.push(`/dashboard/bots/new?id=${botId}`)}>
            Editar Bot
          </Button>
          <Button
            variant={bot.is_active ? 'secondary' : 'primary'}
            loading={toggling}
            onClick={() => toggleBot({ ...bot, is_active: !bot.is_active })}
          >
            {bot.is_active ? 'Desactivar' : 'Activar'}
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteBotModal(true)}>
            Eliminar
          </Button>
        </div>
      </div>

      {/* Success/Error messages */}
      {successMsg && (
        <Alert variant="success">{successMsg}</Alert>
      )}
      {errorMsg && (
        <Alert variant="error">{errorMsg}</Alert>
      )}

      {/* Info del bot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Informacion del Bot</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-slate-400 text-sm">Telefono</dt>
              <dd className="text-white text-sm font-mono">{bot.whatsapp_phone || bot.phone_number || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400 text-sm">Auto-respuesta</dt>
              <dd className="text-sm">
                <span className={bot.auto_reply_enabled ? 'text-green-400' : 'text-slate-500'}>
                  {bot.auto_reply_enabled ? 'Habilitada' : 'Deshabilitada'}
                </span>
              </dd>
            </div>
            <div className="border-t border-slate-700 pt-3 mt-3">
              <dt className="text-slate-400 text-sm mb-1">Mensaje de bienvenida</dt>
              <dd className="text-white text-sm bg-slate-800/60 p-2 rounded">{bot.greeting_message || bot.welcome_message || '-'}</dd>
            </div>
            <div>
              <dt className="text-slate-400 text-sm mb-1">Mensaje de fallback</dt>
              <dd className="text-white text-sm bg-slate-800/60 p-2 rounded">{bot.fallback_message || '-'}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Configuracion de IA</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-slate-400 text-sm">Modelo</dt>
              <dd className="text-white text-sm">{bot.ai_model || 'gpt-3.5-turbo'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400 text-sm">Creatividad (temperatura)</dt>
              <dd className="text-white text-sm">{bot.ai_temperature ?? 0.7}</dd>
            </div>
            {bot.ai_instructions && (
              <div className="border-t border-slate-700 pt-3 mt-3">
                <dt className="text-slate-400 text-sm mb-1">Instrucciones del sistema</dt>
                <dd className="text-white text-sm bg-slate-800/60 p-2 rounded whitespace-pre-wrap">{bot.ai_instructions}</dd>
              </div>
            )}
            {!bot.ai_instructions && (
              <div className="border-t border-slate-700 pt-3 mt-3">
                <p className="text-slate-500 text-sm">No hay instrucciones configuradas. Edita el bot para agregarlas.</p>
              </div>
            )}
          </dl>
        </Card>
      </div>

      {/* Respuestas automaticas */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Respuestas Automaticas</h2>
            <p className="text-slate-400 text-sm mt-1">Reglas que el bot usa antes de consultar la IA</p>
          </div>
          <Button onClick={openCreateModal}>Agregar Respuesta</Button>
        </div>

        {responsesLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : responses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No hay respuestas automaticas configuradas</p>
            <p className="text-slate-500 text-sm mt-1">Agrega reglas para que el bot responda con mensajes predefinidos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {responses.map((r: BotResponse) => (
              <div key={r.id} className="flex items-start justify-between p-4 bg-slate-800/60 rounded-xl border border-slate-700">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded font-medium">
                      {r.trigger_type === 'keyword' ? 'Palabra clave' : r.trigger_type === 'contains' ? 'Contiene' : 'Regex'}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded font-medium ${r.is_active ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                      {r.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <p className="text-white font-medium truncate">{r.trigger}</p>
                  <p className="text-slate-400 text-sm truncate mt-1">{r.response}</p>
                </div>
                <div className="flex gap-1 ml-3 shrink-0">
                  <button
                    onClick={() => openEditModal(r)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteResponseId(r.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal: Crear/Editar respuesta */}
      {modalMode !== 'closed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={closeModal} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-lg font-semibold text-white">
              {modalMode === 'create' ? 'Agregar Respuesta' : 'Editar Respuesta'}
            </h3>
            {errorMsg && <Alert variant="error">{errorMsg}</Alert>}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Tipo de disparador</label>
              <select
                name="trigger_type"
                value={responseForm.values.trigger_type}
                onChange={responseForm.handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="keyword">Palabra clave</option>
                <option value="contains">Contiene</option>
                <option value="regex">Expresion regular</option>
              </select>
            </div>
            <Input
              label="Palabra clave / patron"
              name="trigger"
              required
              placeholder="ej: precio, horario, ubicacion"
              value={responseForm.values.trigger}
              onChange={responseForm.handleChange}
            />
            <Textarea
              label="Respuesta del bot"
              name="response"
              required
              placeholder="El mensaje que el bot enviara cuando detecte el patron"
              value={responseForm.values.response}
              onChange={responseForm.handleChange}
              rows={3}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
              <Button loading={responseForm.loading} onClick={() => responseForm.handleSubmit()}>
                {modalMode === 'create' ? 'Crear' : 'Guardar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar eliminar bot */}
      {showDeleteBotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowDeleteBotModal(false)} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-white">Eliminar Bot</h3>
            <p className="text-slate-400">
              Vas a eliminar <span className="text-white font-medium">{bot.name}</span> y todas sus conversaciones y respuestas automaticas. Esta accion no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setShowDeleteBotModal(false)}>Cancelar</Button>
              <Button variant="danger" loading={deleting} onClick={() => deleteBot()}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar eliminar respuesta */}
      {deleteResponseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setDeleteResponseId(null)} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-white">Eliminar Respuesta</h3>
            <p className="text-slate-400">Esta respuesta automatica se eliminara permanentemente.</p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setDeleteResponseId(null)}>Cancelar</Button>
              <Button variant="danger" onClick={() => handleDeleteResponse(deleteResponseId)}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
