import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm, useFetch, useMutation } from '@/hooks';
import { Card, Button, Input, Textarea, Alert } from '@/components/UI';
import { CreateBotSchema, type CreateBotInput } from '@/validators/schemas';

export default function BotFormPage() {
  const router = useRouter();
  const { id } = router.query;
  const isEdit = !!id && router.isReady;
  const botId = typeof id === 'string' ? id : '';

  const { data: bot } = useFetch(isEdit ? `/api/bots/${botId}` : null);

  const { mutate, loading, error } = useMutation(
    isEdit && botId ? `/api/bots/${botId}` : '/api/bots',
    {
      method: isEdit ? 'PUT' : 'POST',
      onSuccess: () => {
        router.push('/dashboard');
      },
    }
  );

  const form = useForm({
    initialValues: {
      name: bot?.name || '',
      description: bot?.description || '',
      phone_number: bot?.phone_number || '',
      welcome_message: bot?.welcome_message || 'Hola, ¿en qué puedo ayudarte?',
      fallback_message: bot?.fallback_message || 'No entendí tu mensaje',
      ai_instructions: bot?.ai_instructions || '',
      ai_model: bot?.ai_model || 'gpt-3.5-turbo',
      ai_temperature: bot?.ai_temperature ?? 0.7,
      auto_reply_enabled: bot?.auto_reply_enabled ?? true,
    },
    onSubmit: async (values) => {
      try {
        // Mapear campos del form a campos del schema Prisma
        const payload = {
          name: values.name,
          description: values.description || undefined,
          whatsapp_phone: values.phone_number,
          greeting_message: values.welcome_message || 'Hola! 👋 ¿En qué puedo ayudarte?',
          fallback_message: values.fallback_message || 'Lo siento, no entendí. ¿Podrías reformular tu pregunta?',
          auto_reply_enabled: values.auto_reply_enabled ?? true,
          is_active: true,
          ai_instructions: values.ai_instructions || undefined,
          ai_model: values.ai_model || 'gpt-3.5-turbo',
          ai_temperature: typeof values.ai_temperature === 'number' ? values.ai_temperature : 0.7,
        };
        const validated = CreateBotSchema.parse(payload);
        await mutate(validated);
      } catch (error: any) {
        console.error('Validation error:', error);
      }
    },
  });

  useEffect(() => {
    if (bot) {
      form.setValues({
        name: bot.name,
        description: bot.description || '',
        phone_number: bot.phone_number || bot.whatsapp_phone || '',
        welcome_message: bot.welcome_message || bot.greeting_message || 'Hola, ¿en qué puedo ayudarte?',
        fallback_message: bot.fallback_message || 'No entendí tu mensaje',
        ai_instructions: bot.ai_instructions || '',
        ai_model: bot.ai_model || 'gpt-3.5-turbo',
        ai_temperature: bot.ai_temperature ?? 0.7,
        auto_reply_enabled: bot.auto_reply_enabled ?? true,
      });
    }
  }, [bot]);

  if (!router.isReady) return null;

  if (!router.isReady) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {isEdit ? 'Editar Bot' : 'Crear Nuevo Bot'}
        </h1>
        <p className="text-slate-400 mt-1">
          {isEdit ? 'Modificá la configuración de tu bot' : 'Configurá tu bot de WhatsApp con IA'}
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <Card>
        <form onSubmit={form.handleSubmit} className="space-y-6">
          <Input
            label="Nombre del Bot"
            name="name"
            required
            placeholder="ej: Soporte Ventas"
            value={form.values.name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.name ? form.errors.name : undefined}
          />

          <Textarea
            label="Descripción"
            name="description"
            placeholder="ej: Bot para responder preguntas de clientes"
            value={form.values.description}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.description ? form.errors.description : undefined}
          />

          {/* Número de WhatsApp Business */}
          <div className="border-t border-slate-700 pt-6 mt-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Conectar WhatsApp Business</h3>
                <p className="text-xs text-slate-400 mt-0.5">El número debe ser WhatsApp Business (no WhatsApp personal)</p>
              </div>
            </div>

            {isEdit ? (
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Número conectado</p>
                    <p className="text-white font-mono font-medium mt-1">+54 9 {form.values.phone_number || '---'}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-500/15 text-green-400 text-xs rounded-full font-medium">Conectado</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-[1fr_1fr] gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Código de país</label>
                    <input
                      type="text"
                      value="54 9"
                      disabled
                      className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-600 text-slate-400 rounded-lg text-sm font-mono cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 mt-1">Argentina (+54 9)</p>
                  </div>
                  <div></div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Código de área (sin 0)</label>
                    <input
                      type="text"
                      name="area_code"
                      required
                      maxLength={4}
                      placeholder="11"
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-slate-600"
                      onChange={(e) => {
                        const area = e.target.value.replace(/\D/g, '');
                        const num = form.values.phone_number.replace(/\D/g, '');
                        form.setValues({ ...form.values, phone_number: area + num });
                        form.handleChange(e);
                      }}
                    />
                    <p className="text-xs text-slate-500 mt-1">Ejemplo: 11 (para Buenos Aires)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Número de WhatsApp (sin 15)</label>
                    <input
                      type="text"
                      name="phone_number"
                      required
                      maxLength={8}
                      placeholder="55658525"
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-slate-600"
                      onChange={(e) => {
                        const area = form.values.phone_number.replace(/\D/g, '');
                        const cleanArea = area.length > 2 ? area.substring(0, 2) : area.substring(0, 1);
                        const cleanNum = e.target.value.replace(/\D/g, '');
                        form.setValues({ ...form.values, phone_number: cleanArea + cleanNum });
                        form.handleChange(e);
                      }}
                    />
                    <p className="text-xs text-slate-500 mt-1">Ejemplo: 55658525</p>
                  </div>
                </div>
                <input type="hidden" name="phone_number_hidden" />
                <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-3">
                  <p className="text-xs text-slate-400">
                    <span className="text-slate-300 font-medium">Número final:</span>{' '}
                    <span className="font-mono text-white">54911</span><span className="text-slate-500" id="phone-preview-rest">______</span>
                    <span className="text-slate-500 block mt-0.5">Sin espacios, sin guiones, sin 0, sin 15</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <Textarea
            label="Mensaje de Bienvenida"
            name="welcome_message"
            required
            placeholder="Mensaje que verá el cliente al iniciar una conversación"
            value={form.values.welcome_message}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.welcome_message ? form.errors.welcome_message : undefined}
          />

          <Textarea
            label="Mensaje de Fallback"
            name="fallback_message"
            required
            placeholder="Mensaje si no se reconoce el comando"
            value={form.values.fallback_message}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.fallback_message ? form.errors.fallback_message : undefined}
          />

          {/* Toggle respuesta automática */}
          <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-xl border border-slate-700">
            <div>
              <p className="font-medium text-white text-sm">Respuesta automática</p>
              <p className="text-xs text-slate-400 mt-0.5">El bot responde automáticamente a los mensajes entrantes</p>
            </div>
            <button
              type="button"
              onClick={() => form.setValues({ ...form.values, auto_reply_enabled: !form.values.auto_reply_enabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                form.values.auto_reply_enabled ? 'bg-green-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.values.auto_reply_enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sección IA */}
          <div className="border-t border-slate-700 pt-6 mt-6">
            <h2 className="text-xl font-bold text-white mb-1">Inteligencia Artificial</h2>
            <p className="text-sm text-slate-400 mb-4">
              Configurá cómo responde la IA cuando no hay una respuesta manual cargada.
            </p>

            <div className="space-y-4">
              <Textarea
                label="Instrucciones para la IA (system prompt)"
                name="ai_instructions"
                placeholder="Ej: Sos el asistente virtual de 'Mi Negocio'. Vendemos ropa deportiva. Horario: lunes a viernes 9 a 18. Respondé siempre en español, de forma amable y concisa."
                value={form.values.ai_instructions}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Modelo de IA
                  </label>
                  <select
                    name="ai_model"
                    value={form.values.ai_model}
                    onChange={form.handleChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (rápido y económico)</option>
                    <option value="gpt-4">GPT-4 (más inteligente, más caro)</option>
                    <option value="gpt-4o-mini">GPT-4o Mini (equilibrado)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Creatividad ({form.values.ai_temperature})
                  </label>
                  <input
                    type="range"
                    name="ai_temperature"
                    min="0"
                    max="1"
                    step="0.1"
                    value={form.values.ai_temperature}
                    onChange={form.handleChange}
                    className="w-full mt-2 accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Preciso</span>
                    <span>Creativo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" loading={loading}>
              {isEdit ? 'Guardar Cambios' : 'Crear Bot'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/dashboard')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
