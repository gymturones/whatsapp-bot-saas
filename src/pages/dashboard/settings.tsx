import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, useFetch, useMutation } from '@/hooks';
import { Card, Button, Input, Spinner } from '@/components/UI';

export default function SettingsPage() {
  const router = useRouter();
  const { loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch user profile
  const { data: profileData, loading: profileLoading, refetch } = useFetch<any>('/api/users/profile');
  const profile = profileData?.data || profileData;

  // Update profile mutation
  const { mutate: updateProfile, loading: updating } = useMutation('/api/users/profile', {
    method: 'PUT',
    onSuccess: () => {
      setSuccessMsg('Perfil actualizado correctamente');
      setTimeout(() => setSuccessMsg(''), 3000);
      refetch?.();
    },
  });

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setCompany(profile.company_name || '');
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ full_name: name, company_name: company });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (passwords.newPass !== passwords.confirm) {
      setPwError('Las contraseñas no coinciden');
      return;
    }
    if (passwords.newPass.length < 6) {
      setPwError('Mínimo 6 caracteres');
      return;
    }
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: passwords.newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setSuccessMsg('Contraseña actualizada');
      setPasswords({ current: '', newPass: '', confirm: '' });
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setPwError(err.message || 'Error al cambiar contraseña');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
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
        <div className="p-4 bg-green-500/15 border border-green-500/30 rounded-xl text-green-400 text-sm">
          {successMsg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Configuración</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 rounded-xl p-1 border border-slate-800 w-fit">
        {['profile', 'security', 'billing'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'profile' ? 'Perfil' : tab === 'security' ? 'Seguridad' : 'Facturación'}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <h2 className="text-xl font-semibold text-white mb-6">Información de Perfil</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Email"
              value={profile?.email || ''}
              disabled
              helperText="El email no se puede cambiar"
            />
            <Input
              label="Nombre Completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Empresa"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <Button type="submit" loading={updating}>
              Guardar Cambios
            </Button>
          </form>

          <div className="border-t border-slate-700 mt-8 pt-6">
            <h3 className="text-lg font-semibold text-white mb-2">Cerrar sesión</h3>
            <p className="text-sm text-slate-400 mb-4">Cerrá la sesión en este dispositivo.</p>
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
          {pwError && (
            <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {pwError}
            </div>
          )}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Nueva Contraseña"
              type="password"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
              helperText="Mínimo 6 caracteres"
            />
            <Input
              label="Confirmar Nueva Contraseña"
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
            <Button type="submit">
              Cambiar Contraseña
            </Button>
          </form>
        </Card>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <Card>
          <h2 className="text-xl font-semibold text-white mb-6">Facturación</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <p className="font-semibold text-blue-300">
                Plan Actual: {(profile?.subscription_plan || 'free').charAt(0).toUpperCase() + (profile?.subscription_plan || 'free').slice(1)}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {(profile?.subscription_plan || 'free') === 'free'
                  ? 'Estás en el plan gratuito. Actualizá para acceder a más bots, mensajes y funciones de IA.'
                  : 'Tenés acceso a todas las funciones de tu plan.'}
              </p>
            </div>
            {(profile?.subscription_plan || 'free') === 'free' && (
              <Button onClick={() => router.push('/pricing')}>Ver Planes</Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
