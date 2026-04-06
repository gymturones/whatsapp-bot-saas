// src/pages/preview.tsx — Preview de nueva paleta de colores
// Rojo (#ef4444) en vez de verde, negro/gris oscuro en vez de azul

import React from 'react'
import Head from 'next/head'

const R = '#ef4444' // red-500
const RD = '#dc2626' // red-600
const BG = '#09090b' // zinc-950
const CARD = '#18181b' // zinc-900
const BORDER = '#27272a' // zinc-800
const TEXT = '#fafafa' // zinc-50
const SUB = '#a1a1aa' // zinc-400
const MUTED = '#71717a' // zinc-500

export default function PreviewPage() {
  return (
    <>
      <Head>
        <title>Preview - BotPyme</title>
        <link rel="icon" href="/logo-preview.svg" />
      </Head>
      <div style={{ minHeight: '100vh', background: BG, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>

        {/* Navbar */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: `${BG}cc`, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: R, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${R}44` }}>
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                  <path d="M6 18 L6 13 Q6 8 16 7 Q26 8 26 13 L26 18 Z" fill="white"/>
                  <rect x="5" y="17" width="22" height="3" rx="1" fill="#ccc"/>
                  <rect x="17" y="21" width="10" height="7" rx="2" fill="#e5e7eb"/>
                  <polygon points="19,28 21,31 23,28" fill="#e5e7eb"/>
                </svg>
              </div>
              <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em' }}>BotPyme</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 14, fontWeight: 500 }}>
              <a href="#features" style={{ color: SUB, textDecoration: 'none' }}>Características</a>
              <a href="#pricing" style={{ color: SUB, textDecoration: 'none' }}>Precios</a>
              <a href="#faq" style={{ color: SUB, textDecoration: 'none' }}>FAQ</a>
              <a href="#" style={{ color: SUB, textDecoration: 'none' }}>Iniciar sesión</a>
              <a href="#" style={{ background: R, color: 'white', padding: '10px 20px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', boxShadow: `0 4px 14px ${R}44` }}>Comenzar gratis</a>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: `radial-gradient(ellipse 70% 60% at 50% -10%, ${R}1a, ${BG})` }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
            <div style={{ maxWidth: 640 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, border: `1px solid ${R}33`, background: `${R}14`, marginBottom: 32 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: R }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: R, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Hecho para PYMES argentinas</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 900, color: MUTED, letterSpacing: '-0.02em', marginBottom: 8 }}>AUTOMATIZÁ TU</p>
              <h1 style={{ fontSize: 72, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 16 }}>
                <span style={{ background: `linear-gradient(to right, #f87171, ${R}, #ef4444)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WHATSAPP</span>
              </h1>
              <p style={{ fontSize: 36, fontWeight: 900, color: TEXT, letterSpacing: '-0.02em', marginBottom: 24 }}>con Inteligencia Artificial</p>
              <p style={{ fontSize: 18, color: SUB, lineHeight: 1.7, marginBottom: 40, maxWidth: 500 }}>
                Cada mensaje sin respuesta es un cliente que se va con tu competencia.<br/>
                <span style={{ color: R, fontWeight: 600 }}>Tu bot trabaja 24/7</span> — sin programar, sin complicaciones.
              </p>
              <div style={{ display: 'flex', gap: 16 }}>
                <a href="#" style={{ background: R, color: 'white', padding: '16px 32px', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: `0 8px 24px ${R}33`, display: 'inline-flex', alignItems: 'center', gap: 8 }}>Empezar gratis →</a>
                <a href="#" style={{ border: `1px solid ${BORDER}`, color: SUB, padding: '16px 32px', borderRadius: 14, fontWeight: 600, fontSize: 16, textDecoration: 'none' }}>Ver cómo funciona</a>
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section style={{ padding: '0 24px 96px' }}>
          <div style={{ maxWidth: 640, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, padding: '24px 32px', border: `1px solid ${BORDER}`, borderRadius: 16, background: `${CARD}88`, backdropFilter: 'blur(8px)' }}>
            {[
              { val: '7 días', label: 'Prueba gratis' },
              { val: 'Sin contrato', label: 'Cancelás cuando querés' },
              { val: 'Soporte', label: '100% en español' },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: R }}>{item.val}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" style={{ padding: '96px 24px', borderTop: `1px solid ${BORDER}22` }}>
          <div style={{ maxWidth: 1152, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <h2 style={{ fontSize: 44, fontWeight: 900, color: TEXT, letterSpacing: '-0.03em', marginBottom: 16 }}>
                La infraestructura para<br/><span style={{ background: `linear-gradient(to right, #f87171, ${R})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>automatizar tu negocio</span>
              </h2>
              <p style={{ fontSize: 18, color: SUB }}>Todo lo que necesitás para atender más clientes sin contratar más personal.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { num: '01', title: 'Respuestas 24/7 automáticas', desc: 'Tu bot atiende clientes a cualquier hora. Configuralo en minutos con nuestro editor visual.' },
                { num: '02', title: 'Analytics en tiempo real', desc: 'Dashboards con métricas de conversaciones, mensajes y horarios pico.' },
                { num: '03', title: 'IA incluida en todos los planes', desc: 'IA que entiende lenguaje natural y responde preguntas complejas sobre tu negocio.' },
                { num: '04', title: 'Seguro y confiable', desc: 'Datos protegidos con los estándares de seguridad más altos. Uptime 99.9%.' },
              ].map(f => (
                <div key={f.num} style={{ padding: 32, background: `${CARD}99`, borderRadius: 16, border: `1px solid ${BORDER}` }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${R}14`, border: `1px solid ${R}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{f.num}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 12 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: SUB, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" style={{ padding: '96px 24px', borderTop: `1px solid ${BORDER}22` }}>
          <div style={{ maxWidth: 1152, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <h2 style={{ fontSize: 44, fontWeight: 900, color: TEXT, letterSpacing: '-0.03em' }}>Planes para cada PyME</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, alignItems: 'start' }}>
              {[
                { name: 'Starter', price: '$10.000', highlight: true, features: ['5 bots', '1.000 mensajes/mes', 'IA incluida', 'Analytics básico', 'Soporte por email'] },
                { name: 'Pro', price: '$25.000', highlight: false, features: ['25 bots', '10.000 mensajes/mes', 'IA avanzada', 'Analytics completo', 'Integraciones API', 'Soporte prioritario'] },
                { name: 'Business', price: '$35.000', highlight: false, features: ['100 bots', '100.000 mensajes/mes', 'IA avanzada', 'Analytics completo', 'Soporte 24/7', 'Manager dedicado', 'SLA garantizado'] },
              ].map(plan => (
                <div key={plan.name} style={{
                  background: plan.highlight ? `linear-gradient(to bottom, ${R}1f, ${CARD}cc)` : `${CARD}99`,
                  border: `1px solid ${plan.highlight ? `${R}55` : BORDER}`,
                  borderRadius: 20, padding: 32, position: 'relative',
                  boxShadow: plan.highlight ? `0 0 40px ${R}11` : 'none',
                  transform: plan.highlight ? 'translateY(-8px)' : 'none',
                }}>
                  {plan.highlight && (
                    <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)' }}>
                      <span style={{ background: R, color: 'white', fontSize: 12, fontWeight: 700, padding: '4px 16px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Más popular</span>
                    </div>
                  )}
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: TEXT, marginBottom: 4 }}>{plan.name}</h3>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 44, fontWeight: 800, color: TEXT }}>{plan.price}</span>
                    <span style={{ color: MUTED, marginLeft: 4 }}>/mes</span>
                  </div>
                  <p style={{ fontSize: 12, color: `${R}99`, marginBottom: 24 }}>7 días de prueba gratis</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: plan.highlight ? TEXT : SUB }}>
                        <span style={{ color: R, fontWeight: 700 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <a href="#" style={{
                    display: 'block', textAlign: 'center', padding: '12px', borderRadius: 12, fontWeight: 700, textDecoration: 'none',
                    background: plan.highlight ? R : 'white', color: plan.highlight ? 'white' : '#18181b',
                    boxShadow: plan.highlight ? `0 4px 14px ${R}44` : 'none',
                  }}>
                    Empezar 7 días gratis
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section style={{ padding: '96px 24px', borderTop: `1px solid ${BORDER}22` }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: TEXT, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Tu panel de control
            </h2>
            <p style={{ fontSize: 18, color: SUB }}>Todo lo que necesitás para gestionar tus bots, en un solo lugar.</p>
          </div>
          <div style={{ maxWidth: 1100, margin: '0 auto', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            {/* Mock sidebar + content */}
            <div style={{ display: 'flex', minHeight: 500 }}>
              {/* Sidebar */}
              <div style={{ width: 240, background: '#111113', borderRight: `1px solid ${BORDER}`, padding: '24px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, padding: '0 8px' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: R }} />
                  <span style={{ fontWeight: 800, fontSize: 16, color: TEXT }}>BotPyme</span>
                </div>
                {[
                  { label: 'Dashboard', active: true },
                  { label: 'Bots', active: false },
                  { label: 'Conversaciones', active: false },
                  { label: 'Configuración', active: false },
                  { label: 'Admin', active: false },
                ].map(item => (
                  <div key={item.label} style={{
                    padding: '10px 12px', borderRadius: 10, marginBottom: 4, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                    background: item.active ? `${R}18` : 'transparent',
                    color: item.active ? R : SUB,
                  }}>
                    {item.label}
                  </div>
                ))}
                <div style={{ marginTop: 'auto', padding: '12px', borderTop: `1px solid ${BORDER}`, fontSize: 13, color: MUTED }}>
                  gymturones@gmail.com
                </div>
              </div>
              {/* Content */}
              <div style={{ flex: 1, padding: 32 }}>
                <h3 style={{ fontSize: 28, fontWeight: 800, color: TEXT, marginBottom: 8 }}>Dashboard</h3>
                <p style={{ fontSize: 14, color: SUB, marginBottom: 32 }}>Bienvenido de vuelta</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
                  {[
                    { label: 'Bots Activos', value: '3', icon: '🤖' },
                    { label: 'Conversaciones', value: '847', icon: '💬' },
                    { label: 'Mensajes', value: '2.4k', icon: '📨' },
                    { label: 'Plan', value: 'Pro', icon: '⭐' },
                  ].map(s => (
                    <div key={s.label} style={{ background: `${CARD}cc`, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: TEXT }}>{s.value}</div>
                      <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <h4 style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 16 }}>Tus Bots</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  {[
                    { name: 'GT Training Club', phone: '+54 9 11 5565-8525', active: true, msgs: 423 },
                    { name: 'Bot de Ventas', phone: '+54 9 11 4444-5555', active: true, msgs: 287 },
                    { name: 'Soporte Técnico', phone: '+54 9 11 3333-4444', active: false, msgs: 137 },
                  ].map(b => (
                    <div key={b.name} style={{ background: `${CARD}cc`, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontWeight: 700, color: TEXT }}>{b.name}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100,
                          background: b.active ? `${R}18` : `${BORDER}`,
                          color: b.active ? R : MUTED,
                        }}>{b.active ? 'Activo' : 'Pausado'}</span>
                      </div>
                      <div style={{ fontSize: 12, color: MUTED, fontFamily: 'monospace' }}>{b.phone}</div>
                      <div style={{ fontSize: 13, color: SUB, marginTop: 8 }}>{b.msgs} mensajes</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette Reference */}
        <section style={{ padding: '96px 24px', borderTop: `1px solid ${BORDER}22` }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: TEXT, marginBottom: 32 }}>Paleta de colores</h2>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { color: R, label: 'Principal (Red-500)', hex: '#ef4444' },
                { color: RD, label: 'Hover (Red-600)', hex: '#dc2626' },
                { color: BG, label: 'Fondo (Zinc-950)', hex: '#09090b' },
                { color: CARD, label: 'Cards (Zinc-900)', hex: '#18181b' },
                { color: BORDER, label: 'Bordes (Zinc-800)', hex: '#27272a' },
                { color: TEXT, label: 'Texto principal (Zinc-50)', hex: '#fafafa' },
                { color: SUB, label: 'Texto secundario (Zinc-400)', hex: '#a1a1aa' },
                { color: MUTED, label: 'Texto muted (Zinc-500)', hex: '#71717a' },
              ].map(c => (
                <div key={c.hex} style={{ textAlign: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 14, background: c.color, border: `1px solid ${BORDER}`, margin: '0 auto 8px' }} />
                  <div style={{ fontSize: 11, color: SUB }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: MUTED, fontFamily: 'monospace' }}>{c.hex}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: `1px solid ${BORDER}44`, padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ color: MUTED, fontSize: 14 }}>© 2026 BotPyme — Preview de paleta rojo + negro</p>
        </footer>
      </div>
    </>
  )
}
