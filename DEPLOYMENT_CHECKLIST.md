🚀 CHECKLIST PASO A PASO - DE DESARROLLO A PRODUCCIÓN

═══════════════════════════════════════════════════════════════════════════════

FASE 1: SETUP LOCAL (30 minutos)
════════════════════════════════════════════════════════════════════════════════

□ 1.1 Abrir terminal en /whatsapp-bot-saas/backend

□ 1.2 Instalar dependencias
    npm install

□ 1.3 Crear archivo .env.local
    cp .env.example .env.local

□ 1.4 Editar .env.local con tus credenciales:
    - DATABASE_URL=postgresql://user:pass@host:5432/db
    - NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
    - NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
    - SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
    - STRIPE_SECRET_KEY=sk_test_xxx...
    - STRIPE_PUBLISHABLE_KEY=pk_test_xxx...
    - STRIPE_WEBHOOK_SECRET=whsec_xxx...
    - Otros valores según .env.example

□ 1.5 Crear base de datos (primero crea proyecto en Supabase)
    npm run db:push

□ 1.6 Seed de planes de suscripción
    npm run db:seed

□ 1.7 Verificar tipos TypeScript
    npm run type-check

□ 1.8 Ejecutar en desarrollo
    npm run dev
    # Abre http://localhost:3000

□ 1.9 Probar flujos básicos:
    [ ] Ir a /auth/login
    [ ] Probar signup
    [ ] Acceder a dashboard
    [ ] Verificar que se aplica el layout
    [ ] Ver stats vacíos

═══════════════════════════════════════════════════════════════════════════════

FASE 2: CONFIGURACIÓN EXTERNA (1 hora)
════════════════════════════════════════════════════════════════════════════════

SUPABASE SETUP
──────────────

□ 2.1 Ir a https://supabase.com
    [ ] Crear cuenta
    [ ] Crear proyecto nuevo
    [ ] Esperar que se cree (5 min)

□ 2.2 Obtener credenciales:
    [ ] Settings → API → Project URL → copiar a DATABASE_URL
    [ ] Settings → API → Key (anon) → copiar a NEXT_PUBLIC_SUPABASE_ANON_KEY
    [ ] Settings → API → Key (service_role) → copiar a SUPABASE_SERVICE_ROLE_KEY

□ 2.3 Configurar autenticación:
    [ ] Authentication → Providers
    [ ] Habilitar Email/Password (debe estar por defecto)
    [ ] Settings → Email Templates → Personalizar si quieres

□ 2.4 Crear Storage (opcional para uploads):
    [ ] Storage → Create bucket → "documents"
    [ ] Policies → Make public (si quieres)

STRIPE SETUP
────────────

□ 2.5 Ir a https://stripe.com
    [ ] Crear/loguear cuenta
    [ ] Dashboard → API Keys
    [ ] Copiar Secret Key → STRIPE_SECRET_KEY
    [ ] Copiar Publishable Key → STRIPE_PUBLISHABLE_KEY

□ 2.6 Crear productos de pago:
    [ ] Products → Create product
    [ ] Crear 3 productos:
         - Starter ($19.99/mes)
         - Pro ($49.99/mes)
         - Business ($99.99/mes)
    [ ] Copiar los Price IDs

□ 2.7 Configurar webhooks (después cuando esté en producción):
    [ ] Webhooks → Create endpoint
    [ ] URL: https://tu-dominio.vercel.app/api/webhooks/stripe
    [ ] Events: payment_intent.succeeded, customer.subscription.updated

WHATSAPP SETUP
───────────────

□ 2.8 Ir a https://developers.facebook.com
    [ ] Crear app
    [ ] Agregar producto "WhatsApp"
    [ ] Seguir wizard

□ 2.9 Obtener credenciales (en desarrollo puede ser de prueba):
    [ ] Business Account ID
    [ ] Phone Number ID
    [ ] Access Token
    [ ] Verify Token (generar uno aleatorio)

═══════════════════════════════════════════════════════════════════════════════

FASE 3: TESTING LOCAL (30 minutos)
════════════════════════════════════════════════════════════════════════════════

□ 3.1 Probar signup completo:
    [ ] Go to http://localhost:3000/auth/signup
    [ ] Llenar formulario
    [ ] Verificar que se crea usuario en Supabase
    [ ] Verificar que redirige a /dashboard

□ 3.2 Probar login:
    [ ] Logout (botón en settings)
    [ ] Ir a /auth/login
    [ ] Loguear con credenciales
    [ ] Verificar que va a /dashboard

□ 3.3 Probar crear bot:
    [ ] Dashboard → Crear Bot
    [ ] Llenar formulario
    [ ] Verificar que aparece en grid
    [ ] Abrir detalles
    [ ] Editar

□ 3.4 Probar respuestas automáticas:
    [ ] En detalles del bot → Agregar respuesta
    [ ] Crear respuesta con palabra clave
    [ ] Verificar que aparece en lista
    [ ] Editar y eliminar

□ 3.5 Probar settings:
    [ ] Dashboard → Settings
    [ ] Cambiar perfil
    [ ] Cambiar contraseña
    [ ] Ver opción de API keys

□ 3.6 Probar pricing:
    [ ] Ir a /pricing
    [ ] Ver los 4 planes
    [ ] Click en "Elegir plan" (no debe hacer nada en dev)

□ 3.7 Verificar error handling:
    [ ] Ir a /dashboard/bots/invalid-id
    [ ] Debe mostrar "Bot no encontrado"
    [ ] Network error? Debe mostrar Alert

═══════════════════════════════════════════════════════════════════════════════

FASE 4: PREPARAR PARA VERCEL (15 minutos)
════════════════════════════════════════════════════════════════════════════════

□ 4.1 Build y verificar que compila:
    npm run build
    npm run start
    # Si hay errors, fix antes de continuar

□ 4.2 Crear GitHub repo (si no existe):
    [ ] Ir a https://github.com
    [ ] New repository
    [ ] Nombre: whatsapp-bot-saas
    [ ] Public o Private (tu elección)

□ 4.3 Subir código a GitHub:
    git init
    git add .
    git commit -m "Initial commit - WhatsApp Bot SaaS production ready"
    git branch -M main
    git remote add origin https://github.com/tu-usuario/whatsapp-bot-saas.git
    git push -u origin main

□ 4.4 Verificar .gitignore tiene:
    [ ] node_modules
    [ ] .env.local
    [ ] .next
    [ ] dist
    [ ] build

═══════════════════════════════════════════════════════════════════════════════

FASE 5: DEPLOYMENT A VERCEL (30 minutos)
════════════════════════════════════════════════════════════════════════════════

□ 5.1 Ir a https://vercel.com
    [ ] Login o crear cuenta
    [ ] Import project from GitHub
    [ ] Seleccionar tu repositorio
    [ ] Vercel detecta que es Next.js

□ 5.2 Configurar environment variables:
    [ ] En Vercel → Environment Variables
    [ ] Agregar TODAS las variables de .env.local:
         DATABASE_URL=...
         NEXT_PUBLIC_SUPABASE_URL=...
         NEXT_PUBLIC_SUPABASE_ANON_KEY=...
         SUPABASE_SERVICE_ROLE_KEY=...
         STRIPE_SECRET_KEY=...
         STRIPE_PUBLISHABLE_KEY=...
         STRIPE_WEBHOOK_SECRET=...
         WHATSAPP_BUSINESS_ACCOUNT_ID=...
         WHATSAPP_BUSINESS_PHONE_NUMBER_ID=...
         WHATSAPP_ACCESS_TOKEN=...
         WHATSAPP_VERIFY_TOKEN=...
         NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
         JWT_SECRET=... (generar con: openssl rand -base64 32)
         NODE_ENV=production

□ 5.3 Hacer deploy:
    [ ] Click "Deploy"
    [ ] Esperar que compile (5-10 min)
    [ ] Verificar que se deployó exitosamente
    [ ] Copiar URL de producción

□ 5.4 Probar en producción:
    [ ] Abrir https://tu-proyecto.vercel.app
    [ ] Probar signup/login
    [ ] Probar crear bot
    [ ] Verificar que funciona igual que local

□ 5.5 Actualizar Stripe webhook URL (si aún no lo hiciste):
    [ ] Ir a Stripe Dashboard
    [ ] Webhooks → Create endpoint
    [ ] URL: https://tu-proyecto.vercel.app/api/webhooks/stripe
    [ ] Events: payment_intent.succeeded, etc
    [ ] Copiar webhook secret → actualizar env var

□ 5.6 Actualizar WhatsApp webhook URL:
    [ ] Ir a Facebook Developers
    [ ] Webhook URL: https://tu-proyecto.vercel.app/api/webhooks/whatsapp
    [ ] Verify Token: el que pusiste en .env
    [ ] Subscribe to messages

═══════════════════════════════════════════════════════════════════════════════

FASE 6: CONFIGURACIÓN DEL DOMINIO (opcional pero recomendado)
════════════════════════════════════════════════════════════════════════════════

□ 6.1 Si tienes dominio personalizado:
    [ ] Vercel → Settings → Domains
    [ ] Agregar tu dominio (ej: saas.gymturones.com)
    [ ] Seguir instrucciones para DNS

□ 6.2 Si usas Vercel domains:
    [ ] Puedes usar vercel.app (gratis)
    [ ] Vercel auto-asigna un subdominio

□ 6.3 Verificar SSL (debe estar automático):
    [ ] HTTPS debe funcionar
    [ ] Certificate auto-renovado por Let's Encrypt

═══════════════════════════════════════════════════════════════════════════════

FASE 7: POST-DEPLOYMENT CHECKLIST
════════════════════════════════════════════════════════════════════════════════

□ 7.1 Verificar logs:
    [ ] Vercel → Analytics
    [ ] Revisar que no hay errores
    [ ] Revisar performance

□ 7.2 Pruebas finales en producción:
    [ ] Crear cuenta nueva
    [ ] Crear bot
    [ ] Agregar respuestas
    [ ] Ver estadísticas
    [ ] Cambiar plan en pricing (test mode)

□ 7.3 Configurar errores (opcional):
    [ ] Sentry / LogRocket para tracking de errores
    [ ] Agregar email de notificación

□ 7.4 Backups:
    [ ] Supabase → Backups → Enable (auto-backups)
    [ ] Descargar backup manual

□ 7.5 Monitoreo:
    [ ] Uptime.com o similar para monitorear
    [ ] Alertas de downtime

═══════════════════════════════════════════════════════════════════════════════

FASE 8: MONETIZACIÓN (después de deployment)
════════════════════════════════════════════════════════════════════════════════

□ 8.1 Vender la Guía PDF:
    [ ] Descargar PDF: /mnt/user-data/outputs/Guia_Automatizacion_PyMEs_2025.pdf
    [ ] Crear cuenta Gumroad.com
    [ ] Subir PDF
    [ ] Precio: $35 USD
    [ ] Compartir link

□ 8.2 Activar Stripe en producción:
    [ ] Ir a Stripe → Activate account
    [ ] Completar información bancaria
    [ ] Verificar cuenta (24-48 horas)
    [ ] Cambiar claves de test a producción

□ 8.3 Marketing:
    [ ] Crear landing page
    [ ] Email marketing
    [ ] Social media
    [ ] LinkedIn outreach

═══════════════════════════════════════════════════════════════════════════════

✅ TODOS LOS CHECKS COMPLETOS = LISTO PARA USAR

═══════════════════════════════════════════════════════════════════════════════

🆘 TROUBLESHOOTING RÁPIDO

Si algo falla en Vercel:
  1. Ver logs: Vercel → Deployments → Click en el deploy fallido
  2. Verificar env variables
  3. Verificar DATABASE_URL existe
  4. npm run build localmente para reproducir

Si no funciona auth:
  1. Verificar NEXT_PUBLIC_SUPABASE_URL correcto
  2. Verificar NEXT_PUBLIC_SUPABASE_ANON_KEY correcto
  3. Ir a Supabase → Authentication → ver si se creó usuario

Si no funciona Stripe:
  1. Verificar STRIPE_SECRET_KEY en producción
  2. Verificar endpoints están en whitelist en Stripe
  3. Webhook secret debe coincidir

═══════════════════════════════════════════════════════════════════════════════

📞 SOPORTE

Si necesitas ayuda:
  - Email: martin@gymturones.com
  - GitHub Issues: para bugs
  - Stack Overflow: para problemas de Next.js/React

═══════════════════════════════════════════════════════════════════════════════

🎉 Una vez completados todos los checks: ¡Felicidades! Tu SaaS está en línea

═══════════════════════════════════════════════════════════════════════════════
