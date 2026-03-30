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
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white text-gray-900">

        {/* ── NAVBAR ── */}
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">B</span>
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">BotPyme</span>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#caracteristicas" className="text-gray-600 hover:text-blue-600 transition-colors">Características</a>
              <a href="#precios" className="text-gray-600 hover:text-blue-600 transition-colors">Precios</a>
              <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</a>
            </div>

            {/* Auth buttons */}
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <a className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2">
                  Iniciar sesión
                </a>
              </Link>
              <Link href="/auth/signup">
                <a className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  Comenzar gratis
                </a>
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50">
          <div className="max-w-5xl mx-auto px-6 py-24 text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
              <span>🇦🇷</span>
              <span>Hecho para PyMEs argentinas</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Automatizá tu WhatsApp.
              <br />
              <span className="text-blue-600">Ahorrá tiempo. Vendé más.</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Tu bot de WhatsApp con IA responde clientes las 24 horas, todos los días.
              Sin programar, sin instalaciones. Empezá en minutos y pagás con MercadoPago.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link href="/auth/signup">
                <a className="bg-blue-600 text-white text-lg font-semibold px-9 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                  Comenzar gratis →
                </a>
              </Link>
              <a
                href="#demo"
                className="border-2 border-gray-300 text-gray-800 text-lg font-semibold px-9 py-4 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-colors"
              >
                Ver demo
              </a>
            </div>

            {/* Trust stats */}
            <div className="inline-grid grid-cols-3 gap-x-12 gap-y-4 border border-gray-200 bg-white rounded-2xl px-10 py-6 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-blue-600">7 días</div>
                <div className="text-sm text-gray-500 mt-0.5">Prueba gratis</div>
              </div>
              <div className="text-center border-x border-gray-200 px-8">
                <div className="text-2xl font-extrabold text-blue-600">Sin contrato</div>
                <div className="text-sm text-gray-500 mt-0.5">Cancelás cuando querés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-blue-600">Soporte</div>
                <div className="text-sm text-gray-500 mt-0.5">100% en español</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CARACTERÍSTICAS ── */}
        <section id="caracteristicas" className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Todo lo que necesitás para atender mejor
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Herramientas pensadas para negocios argentinos que quieren crecer sin complicaciones.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors">
                <span className="text-3xl group-hover:grayscale-0">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Respuestas 24/7 automáticas</h3>
              <p className="text-gray-600 leading-relaxed">
                Tu bot atiende clientes a cualquier hora, cualquier día. Mientras dormís, el negocio sigue funcionando. Configuralo en minutos con nuestro editor visual.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics en tiempo real</h3>
              <p className="text-gray-600 leading-relaxed">
                Dashboards claros con métricas de conversaciones, mensajes automáticos, horarios pico y tasa de conversión. Tomá decisiones basadas en datos.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">IA incluida en todos los planes</h3>
              <p className="text-gray-600 leading-relaxed">
                Inteligencia artificial que entiende lenguaje natural, responde preguntas complejas y aprende de tus productos y servicios. Sin costo adicional.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Seguro y confiable</h3>
              <p className="text-gray-600 leading-relaxed">
                Tus datos y los de tus clientes están protegidos. Cumplimos con los estándares de seguridad más altos. Uptime del 99.9% garantizado.
              </p>
            </div>
          </div>
        </section>

        {/* ── DEMO SECTION ── */}
        <section id="demo" className="bg-gray-50 py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Así funciona BotPyme
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Configuración simple, resultados inmediatos. Tres pasos y listo.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-5">1</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Conectá tu WhatsApp</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Escaneá un QR desde el dashboard. Sin instalar nada, sin tocar código.</p>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-5">2</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Configurá tus respuestas</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Usá el editor visual o dejá que la IA aprenda de tu catálogo y preguntas frecuentes.</p>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-5">3</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">¡Empezá a vender!</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Tu bot trabaja solo. Vos recibís alertas solo cuando el cliente necesita atención humana.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRECIOS ── */}
        <section id="precios" className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Planes para cada PyME
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Empezá gratis y escalá cuando tu negocio lo necesite. Sin sorpresas, sin letra chica.
              Pagás con MercadoPago.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">

            {/* Free */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">Free</h3>
                <p className="text-sm text-gray-500">Para empezar a explorar</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-extrabold text-gray-900">$0</span>
                <span className="text-gray-500 ml-1">/mes</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start text-gray-700 text-sm">
                  <span className="text-green-500 font-bold mr-2 mt-0.5">✓</span>
                  <span>1 bot de WhatsApp</span>
                </li>
                <li className="flex items-start text-gray-700 text-sm">
                  <span className="text-green-500 font-bold mr-2 mt-0.5">✓</span>
                  <span>100 mensajes por mes</span>
                </li>
                <li className="flex items-start text-gray-700 text-sm">
                  <span className="text-green-500 font-bold mr-2 mt-0.5">✓</span>
                  <span>Respuestas automáticas básicas</span>
                </li>
                <li className="flex items-start text-gray-400 text-sm">
                  <span className="font-bold mr-2 mt-0.5">✗</span>
                  <span>Analytics</span>
                </li>
                <li className="flex items-start text-gray-400 text-sm">
                  <span className="font-bold mr-2 mt-0.5">✗</span>
                  <span>IA avanzada</span>
                </li>
                <li className="flex items-start text-gray-400 text-sm">
                  <span className="font-bold mr-2 mt-0.5">✗</span>
                  <span>Soporte prioritario</span>
                </li>
              </ul>
              <Link href="/auth/signup?plan=free">
                <a className="block text-center border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-colors">
                  Crear cuenta gratis
                </a>
              </Link>
            </div>

            {/* Starter — Destacado */}
            <div className="bg-blue-600 rounded-2xl p-8 flex flex-col shadow-xl relative md:-mt-4 md:mb-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wide shadow">
                  Más popular
                </span>
              </div>
              <div className="mb-6 mt-2">
                <h3 className="text-2xl font-extrabold text-white mb-1">Starter</h3>
                <p className="text-blue-200 text-sm">Para PyMEs que están creciendo</p>
              </div>
              <div className="mb-2">
                <span className="text-5xl font-extrabold text-white">$1.999</span>
                <span className="text-blue-200 ml-1">/mes</span>
              </div>
              <p className="text-blue-200 text-xs mb-6">7 días de prueba gratis — sin tarjeta</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start text-white text-sm">
                  <span className="font-bold mr-2 mt-0.5">✓</span>
                  <span>3 bots de WhatsApp</span>
                </li>
                <li className="flex items-start text-white text-sm">
                  <span className="font-bold mr-2 mt-0.5">✓</span>
                  <span>2.000 mensajes por mes</span>
                </li>
                <li className="flex items-start text-white text-sm">
                  <span className="font-bold mr-2 mt-0.5">✓</span>
                  <span>IA incluida</span>
                </li>
                <li className="flex items-start text-white text-sm">
                  <span className="font-bold mr-2 mt-0.5">✓</span>
                  <span>Analytics básico</span>
                </li>
                <li className="flex items-start text-white text-sm">
                  <span className="font-bold mr-2 mt-0.5">✓</span>
                  <span>Soporte por email</span>
                </li>
                <li className="flex items-start text-blue-300 text-sm">
                  <span className="font-bold mr-2 mt-0.5">✗</span>
                  <span>Integraciones avanzadas</span>
                </li>
              </ul>
              <Link href="/auth/signup?plan=starter">
                <a className="block text-center bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors shadow">
                  Empezar 7 días gratis
                </a>
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">Pro</h3>
                <p className="text-sm text-gray-500">Para negocios que escalan</p>
              </div>
              <div className="mb-2">
                <span className="text-5xl font-extrabold text-gray-900">$4.999</span>
                <span className="text-gray-500 ml-1">/mes</span>
              </div>
              <p className="text-gray-400 text-xs mb-6">7 días de prueba gratis — sin tarjeta</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start text-gray-700 text-sm">
                  <span className="text-green-500 font-bold mr-2 mt-0.5">✓</span>
                  <span>10 bots de WhatsApp</span>
                </li>
                <li className="flex items-start text-gray-700 text-sm">
                  <span className="text-green-500 font-bold mr-2 mt-0.5">✓</span>
                  <span>10.000 mensajes por mes</span>
                </li>
                <li className="flex items-start text-gray-700 text-sm">
                  <span className="text-green-500 font-bold mr-2 mt-0.5">✓</span>
                  <span>IA avanzada + entrenamiento</span>
                </li>
                <li className="flex items-start text-gray-700 text-sm">
                  <span className="text-green-500 font-bold mr-2 mt-0.5">✓</span>
                  <span>Analytics completo</span>
                </li>
                <li className="flex items-start text-gray-700 text-sm">
                  <span className="text-green-500 font-bold mr-2 mt-0.5">✓</span>
                  <span>Integraciones (Sheets, WooCommerce, etc.)</span>
                </li>
                <li className="flex items-start text-gray-700 text-sm">
                  <span className="text-green-500 font-bold mr-2 mt-0.5">✓</span>
                  <span>Soporte prioritario por WhatsApp</span>
                </li>
              </ul>
              <Link href="/auth/signup?plan=pro">
                <a className="block text-center bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                  Empezar 7 días gratis
                </a>
              </Link>
            </div>

          </div>

          {/* Business mention */}
          <div className="mt-10 text-center bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <p className="text-gray-700 font-medium">
              ¿Tenés una empresa grande o franquicia?
              <span className="font-extrabold text-blue-600"> Plan Business desde $9.999/mes</span> con bots ilimitados, mensajes ilimitados y gerente de cuenta dedicado.
            </p>
            <a href="mailto:ventas@botpyme.com.ar" className="inline-block mt-3 text-blue-600 font-semibold hover:underline text-sm">
              Contactar ventas →
            </a>
          </div>

          {/* Payment note */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Pagás con <span className="font-semibold text-gray-600">MercadoPago</span> — tarjeta, transferencia o efectivo. Sin compromisos. Cancelás cuando querés.
          </p>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="bg-gray-50 py-24">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Preguntas frecuentes</h2>
              <p className="text-lg text-gray-600">Todo lo que querés saber antes de empezar.</p>
            </div>

            <div className="space-y-4">

              {/* Q1 */}
              <details className="group bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer">
                <summary className="font-bold text-gray-900 text-base list-none flex items-center justify-between">
                  ¿Necesito saber programar para usar BotPyme?
                  <span className="text-blue-600 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Para nada. BotPyme está diseñado para que cualquier dueño o empleado de PyME pueda configurarlo sin conocimientos técnicos. Todo se hace desde un panel visual, en español, con instrucciones paso a paso.
                </p>
              </details>

              {/* Q2 */}
              <details className="group bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer">
                <summary className="font-bold text-gray-900 text-base list-none flex items-center justify-between">
                  ¿Cómo funciona la prueba gratis de 7 días?
                  <span className="text-blue-600 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Cuando te registrás en cualquier plan pago (Starter, Pro o Business), tenés 7 días para probarlo gratis sin pagar nada. Al finalizar el período, si querés seguir se te cobra el plan elegido. Si no, cancelás y no se te cobra nada.
                </p>
              </details>

              {/* Q3 */}
              <details className="group bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer">
                <summary className="font-bold text-gray-900 text-base list-none flex items-center justify-between">
                  ¿Con qué métodos de pago puedo pagar?
                  <span className="text-blue-600 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Todos los pagos se procesan a través de <strong>MercadoPago</strong>. Podés pagar con tarjeta de crédito o débito, transferencia bancaria, Mercado Pago o efectivo en puntos de pago (Rapipago, Pago Fácil). Sin complicaciones.
                </p>
              </details>

              {/* Q4 */}
              <details className="group bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer">
                <summary className="font-bold text-gray-900 text-base list-none flex items-center justify-between">
                  ¿Qué pasa si necesito más mensajes de los incluidos en mi plan?
                  <span className="text-blue-600 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Si llegás al límite de mensajes de tu plan, podés subir de plan cuando quieras desde el dashboard. También podemos trabajar en un plan personalizado si tu negocio tiene necesidades especiales. Escribinos.
                </p>
              </details>

              {/* Q5 */}
              <details className="group bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer">
                <summary className="font-bold text-gray-900 text-base list-none flex items-center justify-between">
                  ¿Es legal usar un bot de WhatsApp para mi negocio?
                  <span className="text-blue-600 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Sí, siempre que se use de forma responsable y no se envíe spam. Nuestros bots responden mensajes que los clientes ya te enviaron, lo cual está completamente dentro de las políticas de uso de WhatsApp. Muchas PyMEs argentinas ya lo usan sin problemas.
                </p>
              </details>

              {/* Q6 */}
              <details className="group bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer">
                <summary className="font-bold text-gray-900 text-base list-none flex items-center justify-between">
                  ¿Puedo cancelar en cualquier momento?
                  <span className="text-blue-600 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Sí, siempre. No hay contratos de permanencia ni penalidades. Cancelás desde tu panel de cuenta en dos clicks. Si cancelás antes de que termine el mes ya pagado, seguís teniendo acceso hasta el final del período.
                </p>
              </details>

              {/* Q7 */}
              <details className="group bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer">
                <summary className="font-bold text-gray-900 text-base list-none flex items-center justify-between">
                  ¿El soporte es en español argentino?
                  <span className="text-blue-600 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Por supuesto, che. Nuestro equipo de soporte es 100% argentino y atiende de lunes a sábados de 9 a 20 hs por WhatsApp y email. Hablamos tu idioma, entendemos tu negocio.
                </p>
              </details>

            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="bg-blue-600 py-24">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Empezá a automatizar hoy
            </h2>
            <p className="text-blue-100 text-lg mb-10 leading-relaxed">
              Dejanos tu email y te enviamos todo lo que necesitás para arrancar.
              Sin spam, solo lo que te sirve.
            </p>

            {submitted ? (
              <div className="bg-white/20 border border-white/40 text-white rounded-2xl px-8 py-6">
                <div className="text-4xl mb-3">🎉</div>
                <p className="font-bold text-xl">¡Gracias! Te mandamos un email ahora.</p>
                <p className="text-blue-100 text-sm mt-1">Revisá tu bandeja de entrada (y el spam por las dudas).</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-4 rounded-xl border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white text-gray-900 text-base"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-70 whitespace-nowrap shadow"
                >
                  {loading ? 'Enviando...' : 'Quiero empezar gratis'}
                </button>
              </form>
            )}

            {newsletterError && (
              <p className="text-red-200 text-sm mt-3">{newsletterError}</p>
            )}

            <p className="text-blue-200 text-xs mt-5">
              Al suscribirte aceptás nuestra política de privacidad. Sin spam, prometido.
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-gray-900 text-gray-400 py-10 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-base font-bold">B</span>
                </div>
                <span className="text-white font-extrabold text-lg">BotPyme</span>
              </div>

              {/* Links */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <a href="#caracteristicas" className="hover:text-white transition-colors">Características</a>
                <a href="#precios" className="hover:text-white transition-colors">Precios</a>
                <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                <a href="/privacidad" className="hover:text-white transition-colors">Privacidad</a>
                <a href="/terminos" className="hover:text-white transition-colors">Términos</a>
              </div>

              {/* Copyright */}
              <p className="text-sm text-gray-500 text-center">
                © 2025 BotPyme. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}

export default Home
