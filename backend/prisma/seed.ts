// prisma/seed.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create subscription plans
  const plans = [
    {
      plan_id: 'free',
      plan_name: 'Free',
      price: 0,
      currency: 'ARS',
      features: ['1 bot', '100 mensajes/mes', 'Soporte por email'],
      max_bots: 1,
      max_messages_per_month: 100,
      ai_enabled: false,
      is_active: true,
    },
    {
      plan_id: 'starter',
      plan_name: 'Starter',
      price: 1999,
      currency: 'ARS',
      features: [
        '3 bots',
        '1,000 mensajes/mes',
        'Analytics básico',
        'Soporte por email',
      ],
      max_bots: 3,
      max_messages_per_month: 1000,
      ai_enabled: true,
      is_active: true,
    },
    {
      plan_id: 'pro',
      plan_name: 'Pro',
      price: 4999,
      currency: 'ARS',
      features: [
        '10 bots',
        '10,000 mensajes/mes',
        'Analytics avanzado',
        'Soporte prioritario',
      ],
      max_bots: 10,
      max_messages_per_month: 10000,
      ai_enabled: true,
      is_active: true,
    },
    {
      plan_id: 'business',
      plan_name: 'Business',
      price: 9999,
      currency: 'ARS',
      features: [
        '50 bots',
        '100,000 mensajes/mes',
        'Analytics ilimitado',
        'Soporte 24/7',
        'API access',
      ],
      max_bots: 50,
      max_messages_per_month: 100000,
      ai_enabled: true,
      is_active: true,
    },
  ]

  for (const plan of plans) {
    await prisma.subscription.upsert({
      where: { plan_id: plan.plan_id },
      update: {},
      create: plan as any,
    })
  }

  console.log('✅ Subscription plans seeded')
  console.log('✅ Database seeding completed')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
