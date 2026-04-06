import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm, useMutation, useFetch } from '@/hooks';
import { Card, Button, Input, Alert, Spinner } from '@/components/UI';

export default function SettingsPage() {
  const router = useRouter();
  const { loading: authLoading, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch user profile
  const { data: profileData, loading: profileLoading } = useFetch('/api/auth/me');

  // Update profile
  const { mutate: updateProfile, loading: updating } = useMutation(
    '/api/users/profile',
    {
      method: 'PUT',
      onSuccess: () => {
        setSuccessMsg('Perfil actualizado correctamente');
        setTimeout(() => setSuccessMsg(''), 3000);
      },
    }
  );

  // Generate API Key
  const { mutate: generateApiKey, loading: generating } = useMutation(
    '/api/users/api-keys',
    {
      method: 'POST',
      onSuccess: (data: any) => {
        setApiKey(data?.data?.key || data?.key || 'Generada (verificar en API)');
        setShowApiKey(true);
      },
    }
  );

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
      try {
        await updateProfile({
          current_password: values.current_password,
          new_password: values.new_password,
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const profileForm = useForm({
    initialValues: {
      email: user?.email || profileData?.email || '',
      full_name: user?.user_metadata?.name || profileData?.name || '',
      company_name: profileData?.company_name || '',
    },
    onSubmit: (values) => updateProfile(values),
  });

  // Sync form when user data loads
  useEffect(() => {
    if (user || profileData) {
      profileForm.setValues({
        email: user?.email || profileData?.email || '',
        full_name: user?.user_metadata?.name || profileData?.name || '',
        company_name: profileData?.company_name || '',
      });
    }
  }, [user, profileData]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    await logout();
  };

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {successMsg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Configuración</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        {['profile', 'security', 'api', 'billing'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors text-sm ${
              activeTab === tab
                ? 'border-b-2 border-green-500 text-green-400'
                : 'text-slate-400 hover:text-white'
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
          <h2 className="text-xl font-semibold text-white mb-6">Información de Perfil</h2>
          <form onSubmit={profileForm.handleSubmit} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={profileForm.values.email}
              onChange={profileForm.handleChange}
              disabled
              helperText="El email no se puede cambiar"
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
            <Button type="submit" loading={updating}>
              Guardar Cambios
            </Button>
          </form>

          <div className="border-t border-slate-700 mt-8 pt-6">
            <h3 className="text-lg font-semibold text-white mb-2">Cerrar sesión</h3>
            <p className="text-sm text-slate-400 mb-4">
              Cerrá la sesión en este dispositivo.
            </p>
            <Button variant="danger" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card>
          <h2 className="text-xl font-semibold text-white mb-6">Cambiar Contraseña</h2>
          <form onSubmit={changePasswordForm.handleSubmit} className="space-y-4">
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
              helperText="Mínimo 6 caracteres"
            />
            <Input
              label="Confirmar Nueva Contraseña"
              name="confirm_password"
              type="password"
              value={changePasswordForm.values.confirm_password}
              onChange={changePasswordForm.handleChange}
            />
            <Button type="submit" loading={updating}>
              Cambiar Contraseña
            </Button>
          </form>
        </Card>
      )}

      {/* API Tab */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-white mb-4">Claves API</h2>
            <p className="text-slate-400 mb-4">
              Las claves API te permiten acceder a la API de BotPyme
              programáticamente.
            </p>
            <Button onClick={() => generateApiKey()} loading={generating}>
              + Generar Nueva Clave
            </Button>

            {showApiKey && apiKey && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <p className="font-semibold text-yellow-300 text-sm">Copiá tu clave API ahora</p>
                <p className="text-xs text-yellow-400/70 mt-1">
                  No vas a poder verla nuevamente por razones de seguridad.
                </p>
                <code className="block bg-slate-900 text-green-400 p-3 rounded mt-2 text-sm break-all font-mono">
                  {apiKey}
                </code>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <Card>
          <h2 className="text-xl font-semibold text-white mb-6">Facturación</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <p className="font-semibold text-blue-300">
                Plan Actual:{' '}
                {profileData?.subscription_plan
                  ? profileData.subscription_plan.charAt(0).toUpperCase() +
                    profileData.subscription_plan.slice(1)
                  : 'Free'}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Estás en el plan gratuito. Actualizá para acceder a más bots, mensajes y funciones de IA.
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
