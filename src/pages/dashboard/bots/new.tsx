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
    isEdit ? `/api/bots/${botId}` : '/api/bots',
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

          <Input
            label="Número de Teléfono"
            name="phone_number"
            required
            disabled={isEdit}
            placeholder="ej: 5491123456789"
            value={form.values.phone_number}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.phone_number ? form.errors.phone_number : undefined}
            helperText={isEdit ? 'No se puede cambiar el número después de crear el bot' : ''}
          />

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
