import React from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@/hooks';
import { Card, Button, Badge } from '@/components/UI';
import { PricingCard } from '@/components/DomainComponents';

const PRICING_PLANS = [
  {
    name: 'Free',
    price: 0,
    description: 'Para empezar',
    features: [
      '1 bot',
      'Unlimited conversations',
      'Unlimited messages',
      'Basic analytics',
      'Email support',
    ],
    popular: false,
  },
  {
    name: 'Starter',
    price: 19.99,
    description: 'Para pequeños negocios',
    features: [
      '5 bots',
      'Unlimited conversations',
      'Unlimited messages',
      'Advanced analytics',
      'Priority email support',
      'API access',
    ],
    popular: true,
  },
  {
    name: 'Pro',
    price: 49.99,
    description: 'Para empresas en crecimiento',
    features: [
      '25 bots',
      'Unlimited conversations',
      'Unlimited messages',
      'Advanced analytics & reports',
      'Phone support',
      'API access',
      'Custom integrations',
      'Webhook support',
    ],
    popular: false,
  },
  {
    name: 'Business',
    price: 99.99,
    description: 'Para empresas grandes',
    features: [
      '100+ bots',
      'Unlimited everything',
      'Custom analytics',
      '24/7 phone support',
      'Dedicated account manager',
      'Custom API rate limits',
      'Advanced security',
      'SLA guarantee',
    ],
    popular: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { mutate: checkout, loading } = useMutation('/api/payments/checkout', {
    method: 'POST',
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  const handleSelectPlan = async (planName: string) => {
    if (planName === 'Free') {
      // Free plan - just redirect
      router.push('/dashboard');
      return;
    }

    try {
      await checkout({
        plan: planName.toLowerCase(),
      });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error al procesar el pago');
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Planes Simples y Transparentes
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Elige el plan perfecto para tu negocio. Sin contratos a largo plazo,
          cancela cuando quieras.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_PLANS.map((plan) => (
          <PricingCard
            key={plan.name}
            plan={plan}
            onSelect={() => handleSelectPlan(plan.name)}
          />
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Preguntas Frecuentes
        </h2>

        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              q: '¿Puedo cambiar de plan en cualquier momento?',
              a: 'Sí, puedes actualizar o bajar de plan en cualquier momento. Los cambios se reflejan en tu próxima facturación.',
            },
            {
              q: '¿Qué pasa si necesito más bots?',
              a: 'Contáctanos y podemos ofrecerte un plan personalizado con límites más altos.',
            },
            {
              q: '¿Hay período de prueba?',
              a: 'Sí, el plan Free es permanente. Pruébalo sin costo y actualiza cuando estés listo.',
            },
            {
              q: '¿Se cobra automáticamente cada mes?',
              a: 'Sí, se cobra automáticamente en la fecha de tu suscripción. Puedes cancelar en cualquier momento.',
            },
            {
              q: '¿Ofrecen descuentos por pago anual?',
              a: 'Sí, si pagas anualmente ahorras 20%. Contáctanos para más detalles.',
            },
            {
              q: '¿Qué métodos de pago aceptan?',
              a: 'Aceptamos todas las tarjetas de crédito y débito a través de Stripe.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">¿Tienes dudas?</h2>
        <p className="mb-4">
          Nuestro equipo está disponible para ayudarte a elegir el plan perfecto.
        </p>
        <Button
          variant="secondary"
          onClick={() => (window.location.href = 'mailto:info@example.com')}
        >
          Contactar Soporte
        </Button>
      </div>
    </div>
  );
}
