# 🚀 WhatsApp Bot SaaS - Setup Completo

Guía paso a paso para dejar el proyecto en producción.

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta Supabase
- Cuenta Stripe
- Cuenta WhatsApp Business API (Meta)
- Dominio (para producción)

## 1️⃣ Setup Inicial

### 1.1 Clonar Repo

```bash
git clone <repo>
cd whatsapp-bot-saas/backend
npm install
```

### 1.2 Variables de Ambiente

Copiar `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Luego llenar cada variable (ver sección 2).

## 2️⃣ Configurar Servicios

### 2.1 Supabase

1. Ir a https://supabase.com y crear nuevo proyecto
2. Copiar estas variables al `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. Setup de la base de datos:

```bash
# Crear la base de datos
npm run db:push

# (Opcional) Abrir Prisma Studio
npm run db:studio
```

### 2.2 Stripe (Pagos)

1. Ir a https://stripe.com/dashboard
2. Obtener:
   - `STRIPE_SECRET_KEY` (desde Settings > API Keys)
   - `STRIPE_PUBLISHABLE_KEY`

3. Crear productos y precios en Stripe:
   - Product: "WhatsApp Bot - Starter"
     - Price: $19.99/mes → Copiar Price ID a `STRIPE_STARTER_PRICE_ID`
   - Product: "WhatsApp Bot - Pro"
     - Price: $49.99/mes → Copiar Price ID a `STRIPE_PRO_PRICE_ID`
   - Product: "WhatsApp Bot - Business"
     - Price: $99.99/mes → Copiar Price ID a `STRIPE_BUSINESS_PRICE_ID`

4. Setup Webhook en Stripe:
   - Ir a Developers > Webhooks
   - Click "Add endpoint"
   - URL: `https://tu-dominio.com/api/webhooks/stripe`
   - Events: `customer.subscription.*`, `invoice.*`
   - Copiar Signing Secret a `STRIPE_WEBHOOK_SECRET`

### 2.3 WhatsApp Business API (Meta)

#### Opción A: Usar Twilio (Recomendado para comenzar)

1. Crear cuenta en https://www.twilio.com
2. Obtener:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_PHONE_NUMBER`

3. Verificar número WhatsApp en Twilio

#### Opción B: Meta WhatsApp Cloud API (Para producción)

1. Ir a https://developers.facebook.com/
2. Crear app de tipo "Business"
3. Agregar producto "WhatsApp"
4. En Dashboard, obtener:
   - `WHATSAPP_BUSINESS_ACCOUNT_ID`
   - `WHATSAPP_BUSINESS_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN`
5. Generar token de verificación (random string):
   ```bash
   openssl rand -base64 32
   ```
   Copiar a `WHATSAPP_VERIFY_TOKEN`

6. Setup Webhook en Meta:
   - Ir a App > Settings > Basic > App Domains
   - Agregar tu dominio
   - Ir a WhatsApp > Configuration
   - Webhook URL: `https://tu-dominio.com/api/webhooks/whatsapp`
   - Verify Token: (el que generaste)

### 2.4 OpenAI (Opcional - para respuestas con IA)

1. Crear cuenta en https://platform.openai.com
2. Obtener API Key
3. Copiar a `OPENAI_API_KEY`

## 3️⃣ Correr Localmente

```bash
npm run dev
```

La app estará en `http://localhost:3000`

### Test de Webhook Localmente

Usar ngrok para exponer localhost:

```bash
# Instalar ngrok
brew install ngrok  # o descargarlo desde ngrok.com

# Ejecutar
ngrok http 3000

# Copiar URL generada (ej: https://abc123.ngrok.io)
# Usar en Webhook URLs de WhatsApp y Stripe
```

## 4️⃣ Deployment a Vercel

### 4.1 Preparar Código

```bash
# Asegurarse que todo builds correctamente
npm run build
npm run type-check
```

### 4.2 Conectar Vercel

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel
```

Vercel pedirá:
- Nombre del proyecto
- Framework: Next.js
- Root directory: `backend`

### 4.3 Variables de Ambiente en Vercel

En Vercel Dashboard:
1. Project Settings > Environment Variables
2. Agregar TODAS las variables de `.env.local`
3. Re-deploy con `vercel --prod`

### 4.4 Actualizar Webhooks

En Stripe y WhatsApp, actualizar URLs de webhook:

```
https://tu-proyecto.vercel.app/api/webhooks/stripe
https://tu-proyecto.vercel.app/api/webhooks/whatsapp
```

## 5️⃣ Verificar Setup

Checklist:

- [ ] Database conectado (prisma studio funciona)
- [ ] Stripe webhooks recibiendo eventos
- [ ] WhatsApp webhooks configurados
- [ ] Login/Signup funciona
- [ ] Stripe checkout funciona
- [ ] Webhook de WhatsApp recibe mensajes

## 6️⃣ Crear Admin User

```bash
npx ts-node scripts/create-admin.ts
```

Se creará un usuario de prueba.

## 7️⃣ Monitoreo

### Logs

```bash
# Vercel
vercel logs --prod

# Local
npm run dev  # Ver console
```

### Database

```bash
# Abrir Prisma Studio
npm run db:studio
```

## 8️⃣ Próximos Pasos

1. **Landing Page**: Crear página de marketing
2. **Email Marketing**: Agregar Resend para emails automáticos
3. **Documentation**: Crear docs para usuarios
4. **Analytics**: Agregar Plausible/Mixpanel
5. **Support**: Chat de soporte o email
6. **Branding**: Personalizar con logo y colores

## 🆘 Troubleshooting

### "Webhook verification failed"

- Verificar que `WHATSAPP_VERIFY_TOKEN` es correcto
- Asegurarse que la URL del webhook es pública

### "Stripe charge failed"

- Verificar `STRIPE_SECRET_KEY` es correcto
- Revisar logs en Stripe Dashboard

### "Database connection error"

- Verificar `DATABASE_URL` está correcto
- Asegurarse que Supabase está online

### "Messages not being received"

- Verificar que WhatsApp number está verified en Meta
- Check webhook logs en Meta Dashboard

---

¿Preguntas? Ver docs adicionales en `/docs`
