import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, useMutation } from '@/hooks';
import { Card, Button, Input, Alert, Spinner } from '@/components/UI';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Update profile
  const { mutate: updateProfile, loading: updating } = useMutation(
    '/api/users/profile',
    { method: 'PUT' }
  );

  // Generate API Key
  const { mutate: generateApiKey, loading: generating } = useMutation(
    '/api/users/api-keys',
    {
      method: 'POST',
      onSuccess: (data) => {
        setApiKey(data.key);
        setShowApiKey(true);
      },
    }
  );

  // Change password
  const changePasswordForm = useForm({
    initialValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
    onSubmit: async (values) => {
      if (values.new_password !== values.confirm_password) {
        alert('Las contraseñas no coinciden');
        return;
      }
      await updateProfile(values);
    },
  });

  const profileForm = useForm({
    initialValues: {
      email: 'martin@gymturones.com',
      company_name: 'GYMTURONES',
      full_name: 'Martín Gazzera',
    },
    onSubmit: updateProfile,
  });

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {['profile', 'security', 'api', 'billing'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'profile' && 'Perfil'}
            {tab === 'security' && 'Seguridad'}
            {tab === 'api' && 'API'}
            {tab === 'billing' && 'Facturación'}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <h2 className="text-xl font-semibold mb-6">Información de Perfil</h2>
          <form
            onSubmit={profileForm.handleSubmit}
            className="space-y-4"
          >
            <Input
              label="Email"
              name="email"
              type="email"
              value={profileForm.values.email}
              onChange={profileForm.handleChange}
            />
            <Input
              label="Nombre Completo"
              name="full_name"
              value={profileForm.values.full_name}
              onChange={profileForm.handleChange}
            />
            <Input
              label="Empresa"
              name="company_name"
              value={profileForm.values.company_name}
              onChange={profileForm.handleChange}
            />
            <Button
              type="submit"
              loading={updating}
            >
              Guardar Cambios
            </Button>
          </form>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card>
          <h2 className="text-xl font-semibold mb-6">Seguridad</h2>
          <form
            onSubmit={changePasswordForm.handleSubmit}
            className="space-y-4"
          >
            <Input
              label="Contraseña Actual"
              name="current_password"
              type="password"
              value={changePasswordForm.values.current_password}
              onChange={changePasswordForm.handleChange}
            />
            <Input
              label="Nueva Contraseña"
              name="new_password"
              type="password"
              value={changePasswordForm.values.new_password}
              onChange={changePasswordForm.handleChange}
            />
            <Input
              label="Confirmar Contraseña"
              name="confirm_password"
              type="password"
              value={changePasswordForm.values.confirm_password}
              onChange={changePasswordForm.handleChange}
            />
            <Button
              type="submit"
              loading={updating}
            >
              Cambiar Contraseña
            </Button>
          </form>
        </Card>
      )}

      {/* API Tab */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Claves API</h2>
            <p className="text-gray-600 mb-4">
              Las claves API te permiten acceder a la API de WhatsApp Bot
              programáticamente.
            </p>
            <Button
              onClick={() => generateApiKey()}
              loading={generating}
            >
              + Generar Nueva Clave
            </Button>

            {showApiKey && (
              <Alert variant="warning" className="mt-4">
                <p className="font-semibold">Copia tu clave API ahora</p>
                <p className="text-sm mt-2">
                  No podrás verla nuevamente por razones de seguridad.
                </p>
                <code className="block bg-gray-900 text-white p-3 rounded mt-2 text-sm break-all">
                  {apiKey}
                </code>
              </Alert>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">Documentación API</h2>
            <p className="text-gray-600 mb-4">
              Consulta nuestra documentación para aprender cómo integrar la API.
            </p>
            <Button
              variant="secondary"
              onClick={() => window.open('https://docs.example.com', '_blank')}
            >
              Ver Documentación
            </Button>
          </Card>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <Card>
          <h2 className="text-xl font-semibold mb-6">Facturación</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-900">Plan Actual: Free</p>
              <p className="text-sm text-blue-700 mt-1">
                Estás en el plan gratuito. Actualiza para acceder a más
                características.
              </p>
            </div>
            <Button onClick={() => router.push('/pricing')}>
              Ver Planes
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
