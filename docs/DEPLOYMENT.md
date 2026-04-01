# 🚀 DEPLOYMENT A VERCEL - GUÍA COMPLETA

Este documento tiene TODO lo que necesitas para subir el bot a producción en Vercel.

## ⏱️ Tiempo Total: 45-60 minutos

---

## PASO 1: PREPARAR EL CÓDIGO (5 min)

### 1.1 Verificar estructura de carpetas

Asegúrate que tienes:
```
whatsapp-bot-saas/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
└── guia-pdf/
```

### 1.2 Test local

```bash
cd backend
npm install
npm run build
```

Si todo compila sin errores, ¡estás listo!

---

## PASO 2: CONFIGURAR SERVICIOS EXTERNOS (20 min)

### 2.1 Supabase (Base de Datos)

1. Ir a https://supabase.com
2. Sign up / Login
3. Crear nuevo proyecto:
   - Name: "whatsapp-bot-saas"
   - Database password: (guardar bien)
   - Region: América del Sur
4. Esperar a que se cree (2-3 min)
5. Ir a Project Settings > Database
6. Copiar `Connection string` (formato `postgresql://...`)

### 2.2 Stripe (Pagos)

1. Ir a https://stripe.com
2. Login / Sign up
3. Dashboard > Developers > API Keys
4. Copiar:
   - `Secret Key` → `STRIPE_SECRET_KEY`
   - `Publishable Key` → `STRIPE_PUBLISHABLE_KEY`

5. Crear Productos en Stripe:
   ```
   Dashboard > Products > Add Product
   ```
   
   **Producto 1: Starter**
   - Name: "WhatsApp Bot - Starter"
   - Price: $19.99/mes (monthly)
   - Copiar Price ID → `STRIPE_STARTER_PRICE_ID`
   
   **Producto 2: Pro**
   - Name: "WhatsApp Bot - Pro"
   - Price: $49.99/mes (monthly)
   - Copiar Price ID → `STRIPE_PRO_PRICE_ID`
   
   **Producto 3: Business**
   - Name: "WhatsApp Bot - Business"
   - Price: $99.99/mes (monthly)
   - Copiar Price ID → `STRIPE_BUSINESS_PRICE_ID`

### 2.3 WhatsApp Business API (Meta)

**Opción A: Test con Twilio (más fácil para empezar)**

1. Ir a https://www.twilio.com
2. Sign up (free trial)
3. Console > WhatsApp Sandbox
4. Copiar:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_PHONE_NUMBER` (ej: +1234567890)

**Opción B: Meta WhatsApp Cloud API (producción)**

1. Ir a https://developers.facebook.com
2. My Apps > Create App
3. App Type: "Business"
4. Add Products > WhatsApp
5. Ir a Dashboard > WhatsApp
6. Copiar:
   - `WHATSAPP_BUSINESS_ACCOUNT_ID`
   - `WHATSAPP_BUSINESS_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN`

7. Generar verificación token:
   ```bash
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```
   Copiar resultado → `WHATSAPP_VERIFY_TOKEN`

---

## PASO 3: CONFIGURAR VERCEL (10 min)

### 3.1 Connect Repository

1. Ir a https://vercel.com
2. Login / Sign up
3. Import Project
4. Seleccionar tu repositorio de GitHub (o GitLab)
5. Root Directory: `backend`
6. Framework: `Next.js`
7. Click "Deploy"

### 3.2 Configurar Variables de Ambiente

En Vercel Dashboard:

1. Project Settings > Environment Variables
2. Agregar estas variables:

```
DATABASE_URL = postgresql://...  (de Supabase)
NEXT_PUBLIC_SUPABASE_URL = https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY = ...
SUPABASE_SERVICE_ROLE_KEY = ...

STRIPE_SECRET_KEY = sk_...
STRIPE_PUBLISHABLE_KEY = pk_...
STRIPE_STARTER_PRICE_ID = price_...
STRIPE_PRO_PRICE_ID = price_...
STRIPE_BUSINESS_PRICE_ID = price_...
STRIPE_WEBHOOK_SECRET = whsec_...

WHATSAPP_VERIFY_TOKEN = (random string)
WHATSAPP_BUSINESS_ACCOUNT_ID = ...
WHATSAPP_BUSINESS_PHONE_NUMBER_ID = ...
WHATSAPP_ACCESS_TOKEN = ...

NEXT_PUBLIC_APP_URL = https://tu-dominio.vercel.app
JWT_SECRET = (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
NODE_ENV = production
```

3. Click "Save"
4. Re-deploy:
   ```
   Deployments > Click latest > Redeploy
   ```

---

## PASO 4: SETUP DATABASE (10 min)

### 4.1 Conectar Prisma a Supabase

```bash
cd backend

# Crear migraciones
npx prisma db push

# Seed data (planes de suscripción)
npx prisma db seed
```

Esto crea todas las tablas en Supabase automáticamente.

### 4.2 Verificar en Supabase Studio

1. Supabase Dashboard > SQL Editor
2. Ver tablas creadas:
   - `users`
   - `bots`
   - `conversations`
   - `messages`
   - `subscription`
   - etc

---

## PASO 5: CONFIGURAR WEBHOOKS (10 min)

### 5.1 Webhook de Stripe

En Stripe Dashboard:

1. Developers > Webhooks
2. Add endpoint:
   - URL: `https://tu-dominio.vercel.app/api/webhooks/stripe`
   - Events: 
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`
3. Copy Signing Secret → `STRIPE_WEBHOOK_SECRET`

### 5.2 Webhook de WhatsApp

En Meta Dashboard:

1. WhatsApp > Configuration
2. Webhook URL: `https://tu-dominio.vercel.app/api/webhooks/whatsapp`
3. Verify Token: (el que generaste)
4. Subscribe to fields: `messages`, `message_status`, `message_template_status_update`

---

## PASO 6: TESTING (5 min)

### Test 1: Landing Page
```
Visita: https://tu-dominio.vercel.app
Deberías ver la landing page
```

### Test 2: Sign Up / Login
```
1. Hacer sign up
2. Verificar email en Supabase (optional)
3. Hacer login
4. Deberías estar en /dashboard
```

### Test 3: Stripe Webhook
```
Stripe Dashboard > Webhooks > Send test event
Event: customer.subscription.created
Deberías ver evento en logs
```

### Test 4: WhatsApp
```
Enviar mensaje a tu número desde WhatsApp
Deberías recibir respuesta automática
```

---

## PASO 7: PRODUCCIÓN (Final Checklist)

- [ ] Supabase conectado
- [ ] Stripe configurado
- [ ] WhatsApp API funcionando
- [ ] Landing page en producción
- [ ] Login/Signup funcionando
- [ ] Dashboard accesible
- [ ] Webhooks configurados
- [ ] Base de datos seeded
- [ ] Variables de ambiente correctas
- [ ] Dominio propio (opcional pero recomendado)

---

## 🆘 TROUBLESHOOTING

### "Build failed in Vercel"
```
✓ Verificar que tsconfig.json existe
✓ Verificar que package.json tiene todos los scripts
✓ Verificar DATABASE_URL está correcta
```

### "Supabase connection error"
```
✓ Copiar DATABASE_URL completo (con contraseña)
✓ Asegurarse que IP está permitida en Supabase
```

### "Stripe webhook not working"
```
✓ Verificar STRIPE_WEBHOOK_SECRET es correcto
✓ Revisar logs en Stripe > Webhooks
```

### "WhatsApp messages not received"
```
✓ Verificar que WHATSAPP_VERIFY_TOKEN es correcto
✓ Verificar que webhook URL es accesible (https)
✓ Verificar que número está verificado en Meta
```

---

## 📊 MONITOREO

### Ver Logs en Vercel
```
Deployments > [Latest] > Logs
```

### Ver Logs de Base de Datos
```
Supabase > Logs
```

### Ver Errores de Stripe
```
Stripe > Logs > API Logs
```

---

## 🎉 ¡LISTO!

Tu bot WhatsApp SaaS está en producción.

**Próximos pasos:**
1. Crear dominio propio (ej: whatsappbot.com)
2. Configurar email transaccional (Resend)
3. Agregar Google Analytics
4. Crear documentación para usuarios
5. Setup de soporte (email, chat)

---

**¿Preguntas?** 
Ver `/docs/` para más información o contactar soporte.

**Fecha**: Marzo 2025
