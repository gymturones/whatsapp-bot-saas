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
