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
  color: string;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Para probar sin compromiso',
    color: 'gray',
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
    price: 1999,
    description: 'Ideal para pequeños negocios',
    color: 'blue',
    popular: true,
    trial: '7 días gratis',
    badge: 'MAS POPULAR',
    features: [
      '3 bots',
      '1.000 mensajes/mes',
      'IA incluida',
      'Respuestas automáticas',
      'Soporte por email',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 4999,
    description: 'Para negocios en crecimiento',
    color: 'indigo',
    trial: '7 días gratis',
    features: [
      '10 bots',
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
    price: 9999,
    description: 'Para empresas y equipos grandes',
    color: 'purple',
    trial: '7 días gratis',
    features: [
      '50 bots',
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
    a: 'Sí, podés cancelar tu suscripción cuando quieras desde tu panel de control. No hay contratos ni permanencia mínima. Si cancelás, seguís teniendo acceso hasta el final del período pagado.',
  },
  {
    q: '¿Cómo pago?',
    a: 'Aceptamos pagos con tarjeta de crédito y débito (Visa, Mastercard, American Express) a través de MercadoPago, el sistema de pagos más seguro de Argentina. También podés pagar en cuotas con tu tarjeta.',
  },
  {
    q: '¿Hay período de prueba?',
    a: 'Sí. Los planes Starter, Pro y Business incluyen 7 días de prueba gratis sin cargo. No necesitás tarjeta para empezar la prueba. Si no estás conforme, cancelás y no te cobramos nada.',
  },
  {
    q: '¿Qué incluye el plan Free?',
    a: 'El plan Free te permite crear 1 bot con hasta 100 mensajes por mes, sin funciones de IA. Es perfecto para probar la plataforma antes de decidir si querés escalar a un plan pago.',
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

    // Verificar si está logueado revisando la sesión
    // Si no hay sesión, redirigir a login con redirect de vuelta a pricing
    const sessionRes = await fetch('/api/auth/me').catch(() => null);
    if (!sessionRes || sessionRes.status === 401) {
      router.push('/auth/login?redirect=/pricing');
      return;
    }

    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });

      if (res.status === 401) {
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">

        {/* Encabezado */}
        <div className="text-center space-y-4">
          <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1 rounded-full">
            Pagos 100% en pesos argentinos
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Planes para cada PyME
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Automatizá tu atención en WhatsApp desde hoy. Sin contratos, sin sorpresas.
            Cancelá cuando quieras.
          </p>
        </div>

        {/* Tarjetas de planes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col bg-white rounded-2xl shadow-sm border-2 transition-shadow hover:shadow-lg ${
                plan.popular
                  ? 'border-blue-500 shadow-blue-100'
                  : 'border-gray-200'
              }`}
            >
              {/* Badge popular */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide shadow">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Nombre y descripción */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                </div>

                {/* Precio */}
                <div className="mb-2">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-extrabold text-gray-900">Gratis</span>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold text-gray-700">ARS</span>
                      <span className="text-4xl font-extrabold text-gray-900">
                        ${plan.price.toLocaleString('es-AR')}
                      </span>
                      <span className="text-gray-400 text-sm mb-1">/mes</span>
                    </div>
                  )}
                </div>

                {/* Badge trial */}
                {plan.trial && (
                  <div className="mb-4">
                    <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                      {plan.trial}
                    </span>
                  </div>
                )}

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
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
          <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Pagos procesados de forma segura por <strong className="text-gray-600 ml-1">MercadoPago</strong>
          </p>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Preguntas frecuentes
          </h2>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-sm">{item.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 text-white text-center space-y-4">
          <h2 className="text-2xl font-bold">¿Tenés alguna duda?</h2>
          <p className="text-blue-100 max-w-md mx-auto">
            Nuestro equipo está listo para ayudarte a elegir el plan que mejor se adapta a tu negocio.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => { window.location.href = 'mailto:soporte@ejemplo.com'; }}
          >
            Contactar soporte
          </Button>
        </div>

      </div>
    </div>
  );
}
