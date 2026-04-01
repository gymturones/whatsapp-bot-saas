# WhatsApp Bot SaaS - Plataforma de Automatización

## 🚀 Descripción General

Plataforma completa y production-ready de SaaS para crear y gestionar bots de WhatsApp con respuestas automáticas, conversaciones, mensajes y estadísticas en tiempo real.

**Stack Tecnológico:**
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + TypeScript
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **Autenticación**: Supabase Auth + JWT
- **Pagos**: Stripe
- **Hosting**: Vercel + Supabase
- **WhatsApp**: WhatsApp Business API

---

## ✨ Características Principales

### ✅ Completamente Implementado

**Autenticación y Autorización**
- Signup/Login con validación
- JWT tokens para API
- Middleware de autenticación
- Protección de rutas

**Gestión de Bots**
- Crear, editar, listar, eliminar bots
- Configurar mensajes de bienvenida
- Gestionar respuestas automáticas por palabra clave
- Estadísticas por bot (conversaciones, mensajes)
- Activar/desactivar bots

**Conversaciones**
- Historial completo de conversaciones
- Mensajes entrantes y salientes
- Información del cliente (nombre, teléfono)
- Notas en conversaciones

**Dashboard**
- Estadísticas globales (bots, conversaciones, mensajes)
- Grid responsive de bots
- Acceso rápido a conversaciones recientes
- Información del plan actual
- Paginación

**Suscripciones y Pagos**
- Integración Stripe
- 4 planes (Free, Starter, Pro, Business)
- Limitación de features según plan
- Limitación de bots según plan

**Configuración de Usuario**
- Perfil (email, nombre, empresa)
- Cambio de contraseña
- Generación de API keys
- Gestión de facturación

**UI/UX**
- 16+ componentes UI reutilizables
- Diseño responsive (mobile, tablet, desktop)
- Navbar y Sidebar
- Error boundaries
- Loading states

---

## 📦 Estructura del Proyecto

```
whatsapp-bot-saas/
├── backend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.tsx              # Landing page
│   │   │   ├── pricing.tsx            # Página de precios
│   │   │   ├── auth/
│   │   │   │   ├── login.tsx
│   │   │   │   └── signup.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── index.tsx          # Dashboard principal
│   │   │   │   ├── settings.tsx       # Configuración
│   │   │   │   ├── bots/
│   │   │   │   │   ├── new.tsx        # Crear/editar bot
│   │   │   │   │   └── [id].tsx       # Detalles del bot
│   │   │   │   └── conversations/
│   │   │   │       └── [id].tsx       # Vista de conversación
│   │   │   └── api/
│   │   │       ├── bots/
│   │   │       │   ├── list.ts        # GET/POST bots
│   │   │       │   └── [id].ts        # GET/PUT/DELETE bot
│   │   │       ├── conversations/
│   │   │       │   └── index.ts
│   │   │       ├── bot-responses/
│   │   │       │   └── index.ts
│   │   │       ├── messages/
│   │   │       │   └── send.ts
│   │   │       ├── stats.ts
│   │   │       ├── webhooks/
│   │   │       │   ├── whatsapp.ts
│   │   │       │   └── stripe.ts
│   │   │       └── payments/
│   │   │           └── checkout.ts
│   │   ├── components/
│   │   │   ├── UI.tsx                 # Botones, Inputs, Cards, etc
│   │   │   ├── DomainComponents.tsx   # BotCard, ConversationList, etc
│   │   │   ├── Navigation.tsx         # Navbar, Sidebar, Breadcrumbs
│   │   │   ├── DashboardLayout.tsx    # Layout wrapper
│   │   │   ├── ErrorBoundary.tsx      # Error handling
│   │   │   └── index.ts               # Exportar todo
│   │   ├── hooks/
│   │   │   └── index.ts               # useFetch, useMutation, useAuth, useForm
│   │   ├── utils/
│   │   │   └── helpers.ts             # 50+ funciones auxiliares
│   │   ├── validators/
│   │   │   └── schemas.ts             # Validaciones Zod
│   │   ├── middleware/
│   │   │   └── auth.ts                # Autenticación, validación
│   │   ├── lib/
│   │   │   ├── supabase.ts
│   │   │   ├── whatsapp.ts
│   │   │   └── stripe.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── styles/
│   │       └── globals.css            # Tailwind + custom styles
│   ├── prisma/
│   │   ├── schema.prisma              # 14 modelos de DB
│   │   └── seed.ts                    # Seed de planes
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
├── docs/
│   ├── SETUP.md
│   ├── DEPLOYMENT.md
│   └── API.md
├── guia-pdf/
│   └── contenido.md
├── scripts/
│   └── generate_guide_pdf.py
└── README.md
```

---

## 🚀 Quick Start

### Requisitos Previos
- Node.js 18+
- npm o yarn
- Cuenta en Supabase
- Cuenta en Stripe

### 1. Clonar e Instalar

```bash
cd whatsapp-bot-saas/backend
npm install
```

### 2. Configurar Variables de Ambiente

```bash
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

**Variables necesarias:**
- `DATABASE_URL` - URL de Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - URL pública de Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clave anónima
- `SUPABASE_SERVICE_ROLE_KEY` - Clave de servicio
- `STRIPE_SECRET_KEY` - Clave secreta de Stripe
- `STRIPE_PUBLISHABLE_KEY` - Clave pública
- `STRIPE_WEBHOOK_SECRET` - Webhook secret
- Otros según `.env.example`

### 3. Configurar Base de Datos

```bash
npm run db:push       # Crear tablas
npm run db:seed       # Seed de planes de suscripción
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
# Abre http://localhost:3000
```

---

## 📊 Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Ejecutar servidor (puerto 3000)
npm run build            # Compilar para producción
npm run start            # Ejecutar build compilado
npm run type-check       # Verificar tipos TS

# Base de Datos
npm run db:push          # Sincronizar schema
npm run db:pull          # Pull schema from DB
npm run db:seed          # Ejecutar seed de planes
npm run db:studio        # Abrir Prisma Studio (GUI)

# Linting & Format
npm run lint             # ESLint
npm run format           # Prettier

# Otros
npm run clean            # Limpiar build y node_modules
```

---

## 🏗️ Arquitectura

### Frontend
- **Pages**: Componentes de página en `/pages`
- **Components**: Componentes reutilizables
- **Hooks**: Custom hooks (useFetch, useMutation, useAuth, etc)
- **Utils**: Helpers y funciones auxiliares
- **Types**: TypeScript interfaces

### Backend (API Routes)
- **Auth**: Endpoints de autenticación
- **Bots**: CRUD de bots
- **Conversations**: Gestión de conversaciones
- **Messages**: Envío y recepción de mensajes
- **Webhooks**: WhatsApp y Stripe
- **Pagos**: Integración con Stripe

### Base de Datos (Prisma)
```
User              # Usuarios de la app
Bot               # Bots creados por usuario
Conversation      # Conversaciones por bot
Message           # Mensajes en conversaciones
BotResponse       # Respuestas automáticas
Subscription      # Suscripción del usuario
Payment           # Pagos realizados
ApiKey            # Keys para API access
```

---

## 🔐 Autenticación

### Flujo de Login
1. Usuario entra email/contraseña en `/auth/login`
2. Backend valida contra Supabase Auth
3. Si válido, se genera JWT token
4. Token se almacena en localStorage
5. Requests a API incluyen: `Authorization: Bearer <token>`
6. Middleware verifica token

### Protección de Rutas
- Rutas en `/dashboard` requieren token
- `useAuth()` hook redirige a login si no está autenticado
- Middleware en API verifica permisos

---

## 💳 Planes y Precios

| Plan | Precio | Bots | Conversaciones | Apoyo |
|------|--------|------|-------------------|--------|
| Free | $0 | 1 | Unlimited | Email |
| Starter | $19.99/mes | 5 | Unlimited | Email Priority |
| Pro | $49.99/mes | 25 | Unlimited | Phone |
| Business | $99.99/mes | 100+ | Unlimited | 24/7 |

**Implementación:**
- Planes en `src/lib/stripe.ts`
- Checkout en `/api/payments/checkout`
- Webhook en `/api/webhooks/stripe`
- Estado guardado en tabla `subscription`

---

## 🔗 Integración WhatsApp

### Webhook
- **URL**: `/api/webhooks/whatsapp`
- **GET**: Verificación de token
- **POST**: Procesar mensajes

### Flujo
1. Cliente envía mensaje al número del bot
2. WhatsApp envía POST al webhook
3. Se extrae el contenido
4. Se busca conversación (o crea nueva)
5. Se busca respuesta automática
6. Se envía respuesta via WhatsApp API
7. Se registra en BD

---

## 📡 API Endpoints

### Autenticación
```
POST   /api/auth/login          # Login
POST   /api/auth/signup         # Registro
POST   /api/auth/logout         # Logout
```

### Bots
```
GET    /api/bots                # Listar bots del usuario
POST   /api/bots                # Crear bot
GET    /api/bots/[id]           # Detalles del bot
PUT    /api/bots/[id]           # Actualizar bot
DELETE /api/bots/[id]           # Eliminar bot
```

### Conversaciones
```
GET    /api/conversations?botId=...   # Listar conversaciones
GET    /api/conversations/[id]        # Ver conversación
PUT    /api/conversations/[id]        # Actualizar
DELETE /api/conversations/[id]        # Eliminar
```

### Respuestas Automáticas
```
GET    /api/bot-responses?botId=...   # Listar respuestas
POST   /api/bot-responses             # Crear respuesta
PUT    /api/bot-responses/[id]        # Actualizar
DELETE /api/bot-responses/[id]        # Eliminar
```

### Mensajes
```
POST   /api/messages/send              # Enviar mensaje
GET    /api/stats?botId=...            # Estadísticas
```

### Webhooks
```
GET/POST /api/webhooks/whatsapp        # Webhook WhatsApp
POST     /api/webhooks/stripe          # Webhook Stripe
```

### Pagos
```
POST   /api/payments/checkout           # Crear checkout Stripe
```

---

## 🧪 Validaciones

Proyecto usa **Zod** para validación:

```typescript
// Crear bot
const validated = CreateBotSchema.parse(req.body);
// Si error: HTTP 400 con detalles

// Schemas en src/validators/schemas.ts
```

Schemas disponibles:
- `SignUpSchema` / `LoginSchema`
- `CreateBotSchema` / `UpdateBotSchema`
- `CreateBotResponseSchema`
- `SendMessageSchema`
- Y más...

---

## 🎨 Componentes UI

### Componentes Base (src/components/UI.tsx)
- `Button` - Con variantes (primary, secondary, danger, ghost)
- `Input` - Con label, error, helper text
- `Textarea` - Área de texto
- `Select` - Dropdown
- `Card` - Cards con sombra
- `Modal` - Modales
- `Alert` - Alertas (4 variantes)
- `Badge` - Status badges
- `Spinner` - Loading spinner
- `Table` - Tablas con estado

### Componentes de Dominio (src/components/DomainComponents.tsx)
- `BotCard` - Tarjeta de bot
- `ConversationList` - Lista de conversaciones
- `MessageThread` - Hilo de mensajes
- `MessageItem` - Mensaje individual
- `BotResponseItem` - Respuesta automática
- `StatsCard` - Card de estadísticas
- `PricingCard` - Card de plan

### Navegación (src/components/Navigation.tsx)
- `Navbar` - Barra superior
- `Sidebar` - Navegación lateral
- `Breadcrumbs` - Migajas de pan

---

## 🧠 Custom Hooks (src/hooks/index.ts)

```typescript
// Fetch data
const { data, loading, error } = useFetch('/api/bots');

// Mutaciones (POST, PUT, DELETE)
const { mutate, loading, error } = useMutation('/api/bots', {
  method: 'POST',
  onSuccess: (data) => console.log('Created!'),
});

// Autenticación
const { user, loading, logout } = useAuth();

// Formularios
const form = useForm({
  initialValues: { name: '' },
  onSubmit: async (values) => { /* ... */ },
});

// Local Storage
const [value, setValue] = useLocalStorage('key', defaultValue);

// Debounce
const debouncedSearch = useDebounce(searchQuery, 300);

// Async operations
const { execute, status, value } = useAsync(asyncFn);
```

---

## 🛠️ Development

### Agregar una Nueva Página
1. Crear en `src/pages/dashboard/...`
2. Usar hooks de data (`useFetch`, `useMutation`)
3. Importar componentes
4. Layout se aplica automáticamente

### Agregar un Nuevo Endpoint
1. Crear en `src/pages/api/...`
2. Usar `withMiddleware()` para proteger
3. Validar con Zod
4. Retornar con `sendSuccess()` o `sendError()`

### Agregar un Nuevo Componente
1. Crear en `src/components/`
2. Exportar en `src/components/index.ts`
3. Importar y usar

---

## 🚀 Deployment

### A Vercel (Recomendado)

```bash
# Si ya tienes cuenta:
npm install -g vercel
vercel

# Ir a Vercel Dashboard
# Project Settings → Environment Variables
# Agregar todas las variables de .env.local
```

### Pasos Manuales
1. Conectar GitHub a Vercel
2. Importar proyecto
3. Agregar environment variables
4. Deploy automático en cada push

---

## 📈 Performance

- **Frontend**: Code splitting automático (Next.js)
- **Backend**: API caching con headers HTTP
- **Database**: Índices en campos comunes
- **Assets**: Optimización de imágenes

---

## 🔒 Seguridad

- ✅ Autenticación en API
- ✅ Validación de inputs (Zod)
- ✅ CORS configurado
- ✅ JWT tokens con expiración
- ✅ Rate limiting en endpoints
- ✅ SQL injection prevención (Prisma)

---

## 🐛 Troubleshooting

### Error de Supabase
```
Verificar .env.local y URLs de Supabase
npm run db:push
```

### Port 3000 en uso
```
PORT=3001 npm run dev
```

### Problemas con tipos TS
```
npm run type-check
```

### Limpiar caché
```
npm run clean
npm install
npm run dev
```

---

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Stripe API](https://stripe.com/docs/api)

---

## 📞 Soporte

- Email: martin@gymturones.com
- WhatsApp: +54 9 3875 XXXXXX
- GitHub Issues: Para bugs y features

---

**Status**: ✅ Production Ready

**Última actualización**: Marzo 22, 2025  
**Versión**: 1.0.0
