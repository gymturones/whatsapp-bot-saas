// /preview — Comparación de logos
import React from 'react'
import Head from 'next/head'

export default function PreviewPage() {
  return (
    <>
      <Head><title>Preview Logo - BotPyme</title></Head>
      <div style={{ minHeight: '100vh', background: '#09090b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', padding: 40 }}>
        <h1 style={{ color: '#fafafa', fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Comparación de Logo</h1>
        <p style={{ color: '#71717a', fontSize: 16, marginBottom: 60 }}>Mismo logo con casco de obra blanco agregado arriba</p>

        <div style={{ display: 'flex', gap: 80, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Original */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 160, height: 160, background: '#18181b', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #27272a', marginBottom: 20 }}>
              <img src="/favicon.svg" alt="Original" width="120" height="120" />
            </div>
            <p style={{ color: '#a1a1aa', fontSize: 18, fontWeight: 700 }}>Original</p>
            <p style={{ color: '#52525b', fontSize: 14, marginTop: 4 }}>/favicon.svg</p>
          </div>

          {/* Con casco */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 160, height: 160, background: '#18181b', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #27272a', marginBottom: 20 }}>
              <img src="/logo-casco.svg" alt="Con casco" width="120" height="120" />
            </div>
            <p style={{ color: '#a1a1aa', fontSize: 18, fontWeight: 700 }}>Con casco</p>
            <p style={{ color: '#52525b', fontSize: 14, marginTop: 4 }}>/logo-casco.svg</p>
          </div>
        </div>

        {/* Preview en contexto navbar */}
        <div style={{ marginTop: 80, width: '100%', maxWidth: 600 }}>
          <p style={{ color: '#71717a', fontSize: 14, marginBottom: 16, textAlign: 'center' }}>Preview en navbar:</p>
          <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 16, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/logo-casco.svg" alt="Logo" width="32" height="32" />
              <span style={{ color: '#fafafa', fontWeight: 800, fontSize: 18 }}>BotPyme</span>
            </div>
            <div style={{ display: 'flex', gap: 24, fontSize: 14 }}>
              <span style={{ color: '#a1a1aa' }}>Características</span>
              <span style={{ color: '#a1a1aa' }}>Precios</span>
              <span style={{ color: '#a1a1aa' }}>FAQ</span>
              <span style={{ color: '#22c55e', fontWeight: 700, cursor: 'pointer' }}>Comenzar gratis</span>
            </div>
          </div>
        </div>

        {/* Preview en sidebar */}
        <div style={{ marginTop: 40, width: '100%', maxWidth: 280 }}>
          <p style={{ color: '#71717a', fontSize: 14, marginBottom: 16, textAlign: 'center' }}>Preview en sidebar:</p>
          <div style={{ background: '#111113', border: '1px solid #27272a', borderRadius: 16, padding: '24px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
              <img src="/logo-casco.svg" alt="Logo" width="28" height="28" />
              <span style={{ color: '#fafafa', fontWeight: 800, fontSize: 15 }}>BotPyme</span>
            </div>
            {['Dashboard', 'Bots', 'Conversaciones', 'Configuración'].map((item, i) => (
              <div key={item} style={{ padding: '10px 12px', borderRadius: 10, marginBottom: 4, fontSize: 14, fontWeight: 500, color: i === 0 ? '#22c55e' : '#a1a1aa', background: i === 0 ? '#22c55e18' : 'transparent' }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: '#3f3f46', fontSize: 13, marginTop: 60 }}>/preview — Si te gusta, digo de reemplazar el favicon original</p>
      </div>
    </>
  )
}
