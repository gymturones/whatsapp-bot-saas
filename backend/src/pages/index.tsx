// src/pages/index.tsx

import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

const Home: NextPage = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí integrar con lista de emails (Mailchimp, Resend, etc)
    console.log('Email:', email)
    setSubmitted(true)
    setTimeout(() => setEmail(''), 3000)
  }

  return (
    <>
      <Head>
        <title>WhatsApp Bot SaaS - Automatiza tu PyME</title>
        <meta
          name="description"
          content="Automatiza respuestas de WhatsApp para tu PyME. Sin programar, sin instalaciones. Desde $15/mes."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* NAVBAR */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">WhatsApp Bot</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900">
              FAQ
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Sign In
            </Link>
            <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Get Started
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Automatiza WhatsApp
            <br />
            <span className="text-blue-600">sin programar</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Responde automáticamente en WhatsApp 24/7. Aumenta ventas, ahorra
            tiempo, dedica energía a crecer.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="/auth/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium text-lg">
              Comenzar gratis →
            </Link>
            <button className="border-2 border-gray-300 text-gray-900 px-8 py-3 rounded-lg hover:border-gray-400 transition font-medium text-lg">
              Ver demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
            <div>
              <div className="text-3xl font-bold text-gray-900">1,250+</div>
              <div className="text-gray-600">PyMEs activas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">5.2M+</div>
              <div className="text-gray-600">Mensajes procesados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">4.9/5</div>
              <div className="text-gray-600">Calificación</div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Características principales
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Respuestas automáticas
              </h3>
              <p className="text-gray-600">
                Configura respuestas para preguntas frecuentes. Tu bot atiende
                24/7 sin ayuda.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Analytics en tiempo real
              </h3>
              <p className="text-gray-600">
                Ve métricas de mensajes, conversaciones y tasa de respuesta
                automática.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Integraciones
              </h3>
              <p className="text-gray-600">
                Conecta con Stripe, Shopify, Google Sheets y más. Sin código.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Filtrado inteligente
              </h3>
              <p className="text-gray-600">
                Solo recibe notificaciones de mensajes que requieren atención
                humana.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="max-w-5xl mx-auto px-6 py-20 bg-gray-50 rounded-2xl">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Planes simples
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Elige el plan que mejor se adapte a tu PyME
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/mes</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span> 1 bot
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span> 100 mensajes/mes
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✗</span> Analytics
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✗</span> Soporte prioritario
                </li>
              </ul>

              <button className="w-full border-2 border-gray-300 text-gray-900 py-2 rounded-lg hover:border-gray-400 transition font-medium">
                Empezar
              </button>
            </div>

            {/* Starter */}
            <div className="bg-blue-600 text-white rounded-lg p-8 border-2 border-blue-600 transform md:scale-105">
              <div className="bg-blue-700 text-sm px-3 py-1 rounded-full w-fit mb-4">
                Más popular
              </div>

              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$19</span>
                <span className="opacity-90">/mes</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> 3 bots
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> 1,000 mensajes/mes
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Analytics básico
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Email support
                </li>
              </ul>

              <button className="w-full bg-white text-blue-600 py-2 rounded-lg hover:bg-gray-100 transition font-medium">
                Comenzar
              </button>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$49</span>
                <span className="text-gray-600">/mes</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span> 10 bots
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span> 10K mensajes/mes
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span> Analytics avanzado
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span> Soporte prioritario
                </li>
              </ul>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                Comenzar
              </button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            ¿Listo para automatizar?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Crea tu cuenta gratis. No necesitas tarjeta de crédito.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {submitted ? '✓ Confirmado!' : 'Enviar'}
            </button>
          </form>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-200 bg-gray-50 py-8 px-6">
          <div className="max-w-5xl mx-auto text-center text-gray-600 text-sm">
            <p>© 2025 WhatsApp Bot SaaS. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Home
