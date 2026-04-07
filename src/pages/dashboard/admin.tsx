// src/pages/dashboard/admin.tsx — Admin Panel

import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useFetch } from '@/hooks'
import { Card, Button, Spinner } from '@/components/UI'

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'overview' | 'users' | 'bots'>('overview')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Panel de Administracion</h1>
          <p className="text-slate-400 text-sm mt-1">Monitoreo de BotPyme</p>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-900 rounded-xl p-1 border border-slate-800 w-fit">
        {(['overview', 'users', 'bots'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t === 'overview' ? 'Resumen' : t === 'users' ? 'Usuarios' : 'Bots'}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab />}
      {tab === 'users' && <UsersTab />}
      {tab === 'bots' && <BotsTab />}
    </div>
  )
}

function StatCard({ label, value, color = 'white' }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color === 'green' ? 'text-green-400' : color === 'blue' ? 'text-blue-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function OverviewTab() {
  const { data, loading, error } = useFetch<any>('/api/admin/stats')

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  if (error) return <div className="text-center py-12 text-red-400"><p>Error cargando estadísticas:</p><p className="text-sm mt-1 text-slate-500">{error}</p></div>

  const d = data || {}

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Usuarios" value={d?.userCount || 0} />
        <StatCard label="Bots" value={d?.botCount || 0} color="blue" />
        <StatCard label="Bots Activos" value={d?.activeBots || 0} color="green" />
        <StatCard label="Conversaciones" value={d?.conversationCount || 0} />
        <StatCard label="Mensajes" value={d?.messageCount || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-white font-semibold mb-3">Distribucion de planes</h3>
          <div className="space-y-2">
            {(d?.planDistribution || []).map((p: any) => (
              <div key={p.plan} className="flex justify-between items-center">
                <span className="text-slate-300 text-sm capitalize">{p.plan}</span>
                <span className="text-white font-medium">{p.count}</span>
              </div>
            ))}
            {(!d?.planDistribution?.length) && <p className="text-slate-500 text-sm">Sin datos</p>}
          </div>
        </Card>

        <Card>
          <h3 className="text-white font-semibold mb-3">Ultimos bots creados</h3>
          <div className="space-y-2">
            {(d?.recentBots || []).map((b: any) => (
              <div key={b.id} className="flex justify-between items-center">
                <div>
                  <p className="text-white text-sm font-medium">{b.name}</p>
                  <p className="text-slate-500 text-xs">{b.user?.email || 'N/A'}</p>
                </div>
                <span className={`text-xs ${b.is_active ? 'text-green-400' : 'text-slate-500'}`}>
                  {b.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            ))}
            {(!d?.recentBots?.length) && <p className="text-slate-500 text-sm">Sin datos</p>}
          </div>
        </Card>

        <Card>
          <h3 className="text-white font-semibold mb-3">Ultimos registros</h3>
          <div className="space-y-2">
            {(d?.recentUsers || []).map((u: any) => (
              <div key={u.id} className="flex justify-between items-center">
                <div>
                  <p className="text-white text-sm font-medium">{u.name || u.email}</p>
                  <p className="text-slate-500 text-xs">{u.email}</p>
                </div>
                <span className="text-xs text-slate-400">{new Date(u.created_at).toLocaleDateString('es-AR')}</span>
              </div>
            ))}
            {(!d?.recentUsers?.length) && <p className="text-slate-500 text-sm">Sin datos</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}

function UsersTab() {
  const router = useRouter()
  const page = Number(router.query.page) || 1
  const { data, loading, error } = useFetch<any>(`/api/admin/users?page=${page}&limit=20`)

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  if (error) return <div className="text-center py-12 text-red-400"><p>Error cargando usuarios:</p><p className="text-sm mt-1 text-slate-500">{error}</p></div>

  const d = data || {}
  const users = d.users || []
  const pagination = d.pagination || {}

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Usuario</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Empresa</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Plan</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Bots</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Registro</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-b border-slate-800 hover:bg-slate-800/40">
                <td className="py-3 px-2">
                  <p className="text-white font-medium">{u.name || '-'}</p>
                  <p className="text-slate-500 text-xs">{u.email}</p>
                </td>
                <td className="py-3 px-2 text-slate-300">{u.company_name || '-'}</td>
                <td className="py-3 px-2">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full capitalize">{u.subscription_plan}</span>
                </td>
                <td className="py-3 px-2 text-white">{u._count?.bots || 0}</td>
                <td className="py-3 px-2 text-slate-400">{new Date(u.created_at).toLocaleDateString('es-AR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-center text-slate-500 py-8">Sin usuarios</p>}
      </div>
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => router.push(`/dashboard/admin?tab=users&page=${page - 1}`)}>Anterior</Button>
          <span className="text-slate-400 py-2 text-sm">Pagina {page} de {pagination.pages}</span>
          <Button variant="secondary" size="sm" disabled={page >= pagination.pages} onClick={() => router.push(`/dashboard/admin?tab=users&page=${page + 1}`)}>Siguiente</Button>
        </div>
      )}
    </Card>
  )
}

function BotsTab() {
  const router = useRouter()
  const page = Number(router.query.page) || 1
  const { data, loading, error } = useFetch<any>(`/api/admin/bots?page=${page}&limit=20`)

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  if (error) return <div className="text-center py-12 text-red-400"><p>Error cargando bots:</p><p className="text-sm mt-1 text-slate-500">{error}</p></div>

  const d = data || {}
  const bots = d.bots || []
  const pagination = d.pagination || {}

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Bot</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Dueño</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Telefono</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Estado</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Mensajes</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Creado</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((b: any) => (
              <tr key={b.id} className="border-b border-slate-800 hover:bg-slate-800/40">
                <td className="py-3 px-2 text-white font-medium">{b.name}</td>
                <td className="py-3 px-2">
                  <p className="text-slate-300">{b.user?.name || '-'}</p>
                  <p className="text-slate-500 text-xs">{b.user?.email}</p>
                </td>
                <td className="py-3 px-2 text-slate-300 font-mono text-xs">{b.whatsapp_phone || '-'}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${b.is_active ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                    {b.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-3 px-2 text-white">{b.message_count || 0}</td>
                <td className="py-3 px-2 text-slate-400">{new Date(b.created_at).toLocaleDateString('es-AR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {bots.length === 0 && <p className="text-center text-slate-500 py-8">Sin bots</p>}
      </div>
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => router.push(`/dashboard/admin?tab=bots&page=${page - 1}`)}>Anterior</Button>
          <span className="text-slate-400 py-2 text-sm">Pagina {page} de {pagination.pages}</span>
          <Button variant="secondary" size="sm" disabled={page >= pagination.pages} onClick={() => router.push(`/dashboard/admin?tab=bots&page=${page + 1}`)}>Siguiente</Button>
        </div>
      )}
    </Card>
  )
}
