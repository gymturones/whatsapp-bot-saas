import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm, useFetch, useMutation } from '@/hooks';
import { Card, Button, Input, Textarea, Alert } from '@/components/UI';
import { CreateBotSchema, type CreateBotInput } from '@/validators/schemas';

export default function BotFormPage() {
  const router = useRouter();
  const { id } = router.query;
  const isEdit = !!id;

  // Fetch bot if editing
  const { data: bot } = useFetch(isEdit ? `/api/bots/${id}` : null);

  // Mutation
  const { mutate, loading, error } = useMutation(
    isEdit ? `/api/bots/${id}` : '/api/bots',
    {
      method: isEdit ? 'PUT' : 'POST',
      onSuccess: () => {
        router.push('/dashboard/bots');
      },
    }
  );

  // Form
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
    },
    onSubmit: async (values) => {
      try {
        // Validar
        const validated = CreateBotSchema.parse(values);
        await mutate(validated);
      } catch (error: any) {
        console.error('Validation error:', error);
      }
    },
  });

  // Update form cuando carga el bot
  useEffect(() => {
    if (bot) {
      form.setValues({
        name: bot.name,
        description: bot.description || '',
        phone_number: bot.phone_number,
        welcome_message: bot.welcome_message,
        fallback_message: bot.fallback_message,
        ai_instructions: bot.ai_instructions || '',
        ai_model: bot.ai_model || 'gpt-3.5-turbo',
        ai_temperature: bot.ai_temperature ?? 0.7,
      });
    }
  }, [bot]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">
        {isEdit ? 'Editar Bot' : 'Crear Nuevo Bot'}
      </h1>

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
            helperText={
              isEdit ? 'No se puede cambiar el número después de crear el bot' : ''
            }
          />

          <Textarea
            label="Mensaje de Bienvenida"
            name="welcome_message"
            required
            placeholder="Mensaje que verá el cliente al iniciar una conversación"
            value={form.values.welcome_message}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={
              form.touched.welcome_message ? form.errors.welcome_message : undefined
            }
          />

          <Textarea
            label="Mensaje de Fallback"
            name="fallback_message"
            required
            placeholder="Mensaje si no se reconoce el comando"
            value={form.values.fallback_message}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={
              form.touched.fallback_message ? form.errors.fallback_message : undefined
            }
          />

          {/* Sección IA */}
          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Inteligencia Artificial</h2>
            <p className="text-sm text-gray-500 mb-4">
              Configurá cómo responde la IA cuando no hay una respuesta manual cargada.
            </p>

            <div className="space-y-4">
              <Textarea
                label="Instrucciones para la IA (system prompt)"
                name="ai_instructions"
                placeholder="Ej: Sos el asistente virtual de 'Mi Negocio'. Vendemos ropa deportiva. Horario: lunes a viernes 9 a 18. Dirección: Av. Corrientes 1234. Respondé siempre en español, de forma amable y concisa. Si te preguntan algo que no sabés, decí que se comuniquen al 1155667788."
                value={form.values.ai_instructions}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modelo de IA
                  </label>
                  <select
                    name="ai_model"
                    value={form.values.ai_model}
                    onChange={form.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (rápido y económico)</option>
                    <option value="gpt-4">GPT-4 (más inteligente, más caro)</option>
                    <option value="gpt-4o-mini">GPT-4o Mini (equilibrado)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
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
              onClick={() => router.push('/dashboard/bots')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
