// src/pages/index.tsx

import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

const Home: NextPage = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newsletterError, setNewsletterError] = useState('')
  const [navOpen, setNavOpen] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setNewsletterError('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Error al suscribirse')
      setSubmitted(true)
      setEmail('')
    } catch {
      setNewsletterError('Hubo un error. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>BotPyme — Automatizá tu WhatsApp y vendé más</title>
        <meta
          name="description"
          content="Automatizá las respuestas de WhatsApp de tu PyME con inteligencia artificial. Ahorrá tiempo, atendé 24/7 y vendé más. 7 días de prueba gratis. Pagás con MercadoPago."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <div className="min-h-screen bg-slate-950 text-white overflow-x-clip">

        {/* ── NAVBAR ── */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                <img src="/logo-casco.svg" alt="BotPyme" className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight">BotPyme</span>
            </div>

            {/* Links desktop */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#caracteristicas" className="text-slate-400 hover:text-white transition-colors">Características</a>
              <a href="#precios" className="text-slate-400 hover:text-white transition-colors">Precios</a>
              <a href="#faq" className="text-slate-400 hover:text-white transition-colors">FAQ</a>
            </div>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-2">
                Iniciar sesión
              </Link>
              <Link href="/auth/signup" className="bg-green-500 hover:bg-green-400 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-green-500/25">
                Comenzar gratis
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
              onClick={() => setNavOpen(!navOpen)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {navOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {navOpen && (
            <div className="md:hidden border-t border-slate-800/40 bg-slate-900/60 backdrop-blur-xl px-6 py-5 space-y-4">
              <a href="#caracteristicas" className="block text-sm font-medium text-slate-300" onClick={() => setNavOpen(false)}>Características</a>
              <a href="#precios" className="block text-sm font-medium text-slate-300" onClick={() => setNavOpen(false)}>Precios</a>
              <a href="#faq" className="block text-sm font-medium text-slate-300" onClick={() => setNavOpen(false)}>FAQ</a>
              <Link href="/auth/signup" className="block text-center bg-green-500 text-white font-bold py-3 rounded-lg">
                Comenzar gratis
              </Link>
            </div>
          )}
        </nav>

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex items-center pt-20 pb-16 px-6 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(34,197,94,0.12),rgba(2,6,23,0))]" />
            <div className="absolute top-1/4 right-0 w-[35vw] h-[35vw] bg-green-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[25vw] h-[25vw] bg-blue-500/5 rounded-full blur-3xl" />
            {/* Grid pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

              {/* Left — Headline */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-10">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-bold text-green-400 tracking-widest uppercase">Hecho para PYMES argentinas</span>
                </div>

                {/* Headline */}
                <div className="mb-8">
                  <p className="text-2xl font-black text-slate-400 tracking-tight mb-2">AUTOMATIZÁ TU</p>
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-normal mb-4 text-green-400">
                    WHATSAPP
                  </h1>
                  <p className="text-3xl md:text-4xl font-black text-white tracking-tight whitespace-nowrap">
                    con Inteligencia Artificial
                  </p>
                </div>

                <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-lg">
                  Cada mensaje sin respuesta es un cliente que se va con tu competencia.<br/>
                  <span className="text-green-400 font-semibold">Tu bot trabaja 24/7</span> para que vos no pierdas ni una sola venta — sin programar, sin complicaciones.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-xl shadow-green-500/25 hover:shadow-green-400/30 hover:-translate-y-0.5 transform">
                    Empezar gratis →
                  </Link>
                  <a href="#demo" className="inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all">
                    Ver cómo funciona
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Right — Stats cards */}
              <div className="relative hidden lg:flex flex-col gap-4 items-end">
                {/* Card 1 */}
                <div className="w-72 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-400 text-sm font-medium">Mensajes respondidos</span>
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  </div>
                  <div className="text-5xl font-black text-green-400 mb-1">24/7</div>
                  <div className="text-slate-500 text-sm">Sin interrupciones</div>
                </div>

                {/* Card 2 */}
                <div className="w-72 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-400 text-sm font-medium">Tiempo de respuesta</span>
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-5xl font-black text-white mb-1">&lt;3<span className="text-3xl text-slate-400">seg</span></div>
                  <div className="text-slate-500 text-sm">Respuesta instantánea con IA</div>
                </div>

                {/* Card 3 */}
                <div className="w-72 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex -space-x-2">
                      {['#25D366','#128C7E','#075E54'].map((c, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold" style={{backgroundColor: c}}>
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
                        +
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-black text-white mb-1">PyMEs ya automatizando</div>
                  <div className="text-slate-500 text-sm">Negocios que confían en BotPyme</div>
                </div>
              </div>
            </div>

            {/* Trust bar */}
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl border border-slate-800 rounded-2xl bg-slate-900/50 px-8 py-5 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-green-400">7 días</div>
                <div className="text-xs text-slate-500 mt-0.5">Prueba gratis</div>
              </div>
              <div className="text-center border-x border-slate-800 px-4">
                <div className="text-2xl font-extrabold text-green-400">Sin contrato</div>
                <div className="text-xs text-slate-500 mt-0.5">Cancelás cuando querés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-green-400">Soporte</div>
                <div className="text-xs text-slate-500 mt-0.5">100% en español</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CARACTERÍSTICAS ── */}
        <section id="caracteristicas" className="relative py-24 px-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(34,197,94,0.04),rgba(2,6,23,0))] -z-10" />
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plataforma</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                La infraestructura para<br />
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">automatizar tu negocio</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Todo lo que necesitás para atender más clientes sin contratar más personal.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Feature 1 */}
              <div className="group p-8 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-green-500/30 hover:bg-slate-900/80 transition-all">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                  <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">01</div>
                <h3 className="text-xl font-bold text-white mb-3">Respuestas 24/7 automáticas</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  Tu bot atiende clientes a cualquier hora. Mientras dormís, el negocio sigue funcionando. Configuralo en minutos con nuestro editor visual.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-green-500/30 hover:bg-slate-900/80 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">02</div>
                <h3 className="text-xl font-bold text-white mb-3">Analytics en tiempo real</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  Dashboards con métricas de conversaciones, mensajes automáticos, horarios pico y tasa de conversión. Tomá decisiones basadas en datos.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-green-500/30 hover:bg-slate-900/80 transition-all">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">03</div>
                <h3 className="text-xl font-bold text-white mb-3">IA incluida en todos los planes</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  Inteligencia artificial que entiende lenguaje natural, responde preguntas complejas y aprende de tus productos y servicios. Sin costo adicional.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group p-8 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-green-500/30 hover:bg-slate-900/80 transition-all">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">04</div>
                <h3 className="text-xl font-bold text-white mb-3">Seguro y confiable</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  Tus datos y los de tus clientes están protegidos. Cumplimos con los estándares de seguridad más altos. Uptime del 99.9% garantizado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── DEMO / HOW IT WORKS ── */}
        <section id="demo" className="py-24 px-6 border-t border-slate-800/60">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Así funciona</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Tres pasos y tu bot<br />
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">está listo para vender</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { n: '01', title: 'Conectá tu WhatsApp', desc: 'Seguís los pasos del dashboard para conectar tu número de negocio a Meta. Sin instalar nada, sin tocar código.' },
                { n: '02', title: 'Configurá tus respuestas', desc: 'Usá el editor visual o escribí las instrucciones en lenguaje natural. La IA aprende de tu negocio en minutos.' },
                { n: '03', title: '¡Empezá a vender!', desc: 'Tu bot trabaja solo. Vos recibís notificaciones solo cuando el cliente necesita atención humana.' },
              ].map((step) => (
                <div key={step.n} className="relative p-8 bg-slate-900/60 rounded-2xl border border-slate-800">
                  <div className="text-6xl font-black text-slate-800 mb-6 leading-none">{step.n}</div>
                  <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRECIOS ── */}
        <section id="precios" className="py-24 px-6 border-t border-slate-800/60">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Precios</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                Planes para cada PyME
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Empezá gratis y escalá cuando tu negocio lo necesite. Sin sorpresas, sin letra chica. Pagás con MercadoPago.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-start">

              {/* Free */}
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-8 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-extrabold text-white mb-1">Free</h3>
                  <p className="text-sm text-slate-500">Para empezar a explorar</p>
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-white">$0</span>
                  <span className="text-slate-500 ml-1">/mes</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {['1 bot de WhatsApp', '100 mensajes por mes', 'Respuestas automáticas básicas'].map(item => (
                    <li key={item} className="flex items-start text-slate-300 text-sm">
                      <span className="text-green-400 font-bold mr-2 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                  {['Analytics', 'IA avanzada', 'Soporte prioritario'].map(item => (
                    <li key={item} className="flex items-start text-slate-600 text-sm">
                      <span className="font-bold mr-2 mt-0.5">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup?plan=free" className="block text-center border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold py-3 rounded-xl transition-colors">
                  Crear cuenta gratis
                </Link>
              </div>

              {/* Starter — Destacado */}
              <div className="relative bg-gradient-to-b from-green-500/20 to-slate-900/80 rounded-2xl border border-green-500/40 p-8 flex flex-col shadow-2xl shadow-green-500/10 md:-mt-4 md:mb-4">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-lg shadow-green-500/30">
                    Más popular
                  </span>
                </div>
                <div className="mb-6 mt-2">
                  <h3 className="text-2xl font-extrabold text-white mb-1">Starter</h3>
                  <p className="text-green-400/70 text-sm">Para PyMEs que están creciendo</p>
                </div>
                <div className="mb-2">
                  <span className="text-5xl font-extrabold text-white">$10.000</span>
                  <span className="text-slate-400 ml-1">/mes</span>
                </div>
                <p className="text-green-400/60 text-xs mb-6">7 días de prueba gratis — sin tarjeta</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {['5 bots de WhatsApp', '1.000 mensajes por mes', 'IA incluida', 'Analytics básico', 'Soporte por email'].map(item => (
                    <li key={item} className="flex items-start text-white text-sm">
                      <span className="text-green-400 font-bold mr-2 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                  <li className="flex items-start text-slate-600 text-sm">
                    <span className="font-bold mr-2 mt-0.5">✗</span>
                    Integraciones avanzadas
                  </li>
                </ul>
                <Link href="/auth/signup?plan=starter" className="block text-center bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-green-500/25">
                  Empezar 7 días gratis
                </Link>
              </div>

              {/* Pro */}
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-8 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-extrabold text-white mb-1">Pro</h3>
                  <p className="text-sm text-slate-500">Para negocios que escalan</p>
                </div>
                <div className="mb-2">
                  <span className="text-5xl font-extrabold text-white">$25.000</span>
                  <span className="text-slate-500 ml-1">/mes</span>
                </div>
                <p className="text-slate-600 text-xs mb-6">7 días de prueba gratis — sin tarjeta</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    '25 bots de WhatsApp',
                    '10.000 mensajes por mes',
                    'IA avanzada + entrenamiento',
                    'Analytics completo',
                    'Integraciones (Sheets, WooCommerce)',
                    'Soporte prioritario por WhatsApp',
                  ].map(item => (
                    <li key={item} className="flex items-start text-slate-300 text-sm">
                      <span className="text-green-400 font-bold mr-2 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup?plan=pro" className="block text-center bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 rounded-xl transition-colors">
                  Empezar 7 días gratis
                </Link>
              </div>
            </div>

            {/* Business mention */}
            <div className="mt-8 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 text-center">
              <p className="text-slate-300">
                ¿Tenés una empresa grande o franquicia?{' '}
                <span className="font-extrabold text-green-400">Plan Business desde $35.000/mes</span>
                {' '}con bots ilimitados y gerente de cuenta dedicado.
              </p>
              <a href="mailto:ventas@botpyme.com.ar" className="inline-block mt-3 text-green-400 hover:text-green-300 font-semibold text-sm transition-colors">
                Contactar ventas →
              </a>
            </div>

            <p className="text-center text-slate-600 text-sm mt-6">
              Pagás con <span className="font-semibold text-slate-400">MercadoPago</span> — tarjeta, transferencia o efectivo. Sin compromisos.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-24 px-6 border-t border-slate-800/60">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">FAQ</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Preguntas frecuentes</h2>
            </div>

            <div className="space-y-3">
              {[
                { q: '¿Necesito saber programar para usar BotPyme?', a: 'Para nada. BotPyme está diseñado para que cualquier dueño o empleado de PyME pueda configurarlo sin conocimientos técnicos. Todo se hace desde un panel visual, en español, con instrucciones paso a paso.' },
                { q: '¿Cómo funciona la prueba gratis de 7 días?', a: 'Cuando te registrás en cualquier plan pago, tenés 7 días para probarlo gratis sin pagar nada. Al finalizar el período, si querés seguir se te cobra el plan elegido. Si no, cancelás y no se te cobra nada.' },
                { q: '¿Con qué métodos de pago puedo pagar?', a: 'Todos los pagos se procesan a través de MercadoPago. Podés pagar con tarjeta de crédito o débito, transferencia bancaria o efectivo en puntos de pago (Rapipago, Pago Fácil).' },
                { q: '¿Qué pasa si necesito más mensajes de los incluidos?', a: 'Podés subir de plan en cualquier momento desde el dashboard. También podemos trabajar en un plan personalizado si tu negocio tiene necesidades especiales.' },
                { q: '¿Es legal usar un bot de WhatsApp para mi negocio?', a: 'Sí, siempre que se use de forma responsable. Nuestros bots responden mensajes que los clientes ya te enviaron, lo cual está dentro de las políticas de WhatsApp Business.' },
                { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí, siempre. No hay contratos de permanencia. Cancelás desde tu panel en dos clicks.' },
                { q: '¿El soporte es en español argentino?', a: 'Por supuesto, che. Nuestro equipo de soporte es 100% argentino y atiende de lunes a sábados de 9 a 20 hs por WhatsApp y email.' },
              ].map(({ q, a }) => (
                <details key={q} className="group bg-slate-900/60 rounded-xl border border-slate-800 hover:border-slate-700 p-5 cursor-pointer transition-colors">
                  <summary className="font-semibold text-white text-sm list-none flex items-center justify-between gap-4">
                    {q}
                    <span className="text-green-400 text-lg flex-shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                  </summary>
                  <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="py-24 px-6 border-t border-slate-800/60">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-green-500/15 to-emerald-500/5 border border-green-500/20 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                ¿Listo para automatizar<br />tu negocio?
              </h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                Dejanos tu email y te enviamos todo lo que necesitás para arrancar. Sin spam, solo lo que te sirve.
              </p>

              {submitted ? (
                <div className="bg-green-500/10 border border-green-500/30 text-white rounded-2xl px-8 py-6">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="font-bold text-xl">¡Gracias! Te mandamos un email ahora.</p>
                  <p className="text-slate-400 text-sm mt-1">Revisá tu bandeja de entrada.</p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-5 py-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-green-500 focus:outline-none text-white text-base placeholder-slate-500 transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-xl transition-colors disabled:opacity-70 whitespace-nowrap shadow-lg shadow-green-500/25"
                  >
                    {loading ? 'Enviando...' : 'Empezar gratis'}
                  </button>
                </form>
              )}

              {newsletterError && (
                <p className="text-red-400 text-sm mt-3">{newsletterError}</p>
              )}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-slate-800/60 py-10 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <img src="/logo-casco.svg" alt="BotPyme" className="w-4 h-4" />
                </div>
                <span className="text-white font-extrabold text-lg">BotPyme</span>
              </div>

              {/* Links */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <a href="#caracteristicas" className="text-slate-500 hover:text-slate-300 transition-colors">Características</a>
                <a href="#precios" className="text-slate-500 hover:text-slate-300 transition-colors">Precios</a>
                <a href="#faq" className="text-slate-500 hover:text-slate-300 transition-colors">FAQ</a>
                <a href="/privacy" className="text-slate-500 hover:text-slate-300 transition-colors">Privacidad</a>
                <a href="/terminos" className="text-slate-500 hover:text-slate-300 transition-colors">Términos</a>
              </div>

              <p className="text-slate-600 text-sm">© 2026 BotPyme.</p>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}

export default Home
