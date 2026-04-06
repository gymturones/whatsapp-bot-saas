import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/UI';

type PlanId = 'free' | 'starter' | 'pro' | 'business';

interface Plan {
  id: PlanId;
  name: string;
  price: number;
  description: string;
  features: string[];
  trial?: string;
  popular?: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Para probar sin compromiso',
    features: [
      '1 bot',
      '100 mensajes/mes',
      'Sin IA',
      'Soporte por email',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 10000,
    description: 'Ideal para pequeños negocios',
    popular: true,
    trial: '7 días gratis',
    badge: 'MAS POPULAR',
    features: [
      '5 bots',
      '1.000 mensajes/mes',
      'IA incluida',
      'Respuestas automáticas',
      'Soporte por email',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 25000,
    description: 'Para negocios en crecimiento',
    trial: '7 días gratis',
    features: [
      '25 bots',
      '10.000 mensajes/mes',
      'IA incluida',
      'Analytics avanzado',
      'Soporte prioritario',
      'Integraciones API',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 35000,
    description: 'Para empresas y equipos grandes',
    trial: '7 días gratis',
    features: [
      '100 bots',
      '100.000 mensajes/mes',
      'IA incluida',
      'Analytics completo',
      'Soporte 24/7',
      'Manager dedicado',
      'SLA garantizado',
      'Integraciones personalizadas',
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: '¿Puedo cancelar en cualquier momento?',
    a: 'Sí, podés cancelar tu suscripción cuando quieras desde tu panel de control. No hay contratos ni permanencia mínima.',
  },
  {
    q: '¿Cómo pago?',
    a: 'Aceptamos pagos con tarjeta de crédito y débito (Visa, Mastercard, American Express) a través de MercadoPago.',
  },
  {
    q: '¿Hay período de prueba?',
    a: 'Sí. Los planes Starter, Pro y Business incluyen 7 días de prueba gratis sin cargo. No necesitás tarjeta para empezar.',
  },
  {
    q: '¿Qué incluye el plan Free?',
    a: 'El plan Free te permite crear 1 bot con hasta 100 mensajes por mes, sin funciones de IA. Perfecto para probar la plataforma.',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

  const handleSelectPlan = async (planId: PlanId) => {
    if (planId === 'free') {
      router.push('/dashboard');
      return;
    }

    const token = typeof window !== 'undefined'
      ? (localStorage.getItem('sb_access_token') || localStorage.getItem('token'))
      : null;
    if (!token) {
      router.push('/auth/signup?redirect=/pricing');
      return;
    }

    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ plan: planId }),
      });

      if (res.status === 401) {
        localStorage.removeItem('sb_access_token');
        localStorage.removeItem('token');
        router.push('/auth/login?redirect=/pricing');
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error al iniciar el checkout:', error);
      alert('Hubo un error al procesar tu solicitud. Intentá de nuevo.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">

        {/* Encabezado */}
        <div className="text-center space-y-4">
          <span className="inline-block bg-green-500/15 text-green-400 border border-green-500/20 text-sm font-semibold px-4 py-1 rounded-full">
            Pagos 100% en pesos argentinos
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Planes para cada PYME
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Automatizá tu atención en WhatsApp desde hoy. Sin contratos, sin sorpresas.
            Cancelá cuando quieras.
          </p>
        </div>

        {/* Tarjetas de planes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border-2 transition-all hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular
                  ? 'bg-slate-800/80 border-green-500 shadow-green-500/10 shadow-lg'
                  : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
              }`}
            >
              {/* Badge popular */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Nombre y descripción */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                  <p className="text-sm text-slate-400 mt-1">{plan.description}</p>
                </div>

                {/* Precio */}
                <div className="mb-2">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-extrabold text-white">Gratis</span>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-bold text-slate-400">ARS</span>
                      <span className="text-4xl font-extrabold text-white">
                        ${plan.price.toLocaleString('es-AR')}
                      </span>
                      <span className="text-slate-500 text-sm mb-1">/mes</span>
                    </div>
                  )}
                </div>

                {/* Badge trial */}
                {plan.trial && (
                  <div className="mb-4">
                    <span className="bg-green-500/15 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/20">
                      {plan.trial}
                    </span>
                  </div>
                )}

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <svg
                        className="w-4 h-4 text-green-500 mt-0.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Botón */}
                <Button
                  variant={plan.popular ? 'primary' : 'secondary'}
                  size="md"
                  loading={loadingPlan === plan.id}
                  className="w-full"
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.id === 'free'
                    ? 'Empezar gratis'
                    : loadingPlan === plan.id
                    ? 'Redirigiendo...'
                    : plan.trial
                    ? `Probar ${plan.trial}`
                    : `Elegir ${plan.name}`}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Sello MercadoPago */}
        <div className="text-center">
          <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Pagos procesados de forma segura por <strong className="text-slate-300 ml-1">MercadoPago</strong>
          </p>
        </div>

        {/* FAQ */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Preguntas frecuentes
          </h2>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="font-semibold text-white text-sm">{item.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/20 rounded-2xl p-10 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">¿Tenés alguna duda?</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Nuestro equipo está listo para ayudarte a elegir el plan que mejor se adapta a tu negocio.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => { window.location.href = 'mailto:soporte@botpyme.com'; }}
          >
            Contactar soporte
          </Button>
        </div>

      </div>
    </div>
  );
}
