# Medicina Natural · E-commerce + Chat Funnel

Sitio oficial de Medicina Natural, optimizado para venta de productos CBD con captura de leads via chat propio y derivación a WhatsApp. Basado en Next.js (App Router) y pensado para correr el frontend en Vercel mientras los bots y WebSocket viven en infraestructura propia/local.

## Qué incluye

- **Home verticalizada** para CBD (hero, beneficios, confianza social, vitrinas).
- **Widget de chat** con formulario (nombre + teléfono), mensajes automáticos y handoff a asesores.
- **CTA WhatsApp diferenciada** para consultas generales (tooltip, botón flotante).
- **Carrito persistente** con Zustand + sincronización opcional en Postgres (`cart_sessions`).
- **Checkout vía WhatsApp** (mensaje preformateado con resumen y totales).
- **Panel admin básico** (login, productos, stock, cupones) para operar rápido antes de migrar a un CRM.
- **APIs serverless** para productos, cupones, uploads y sync de carrito usando `@vercel/postgres` o Neon.

## Stack

- Next.js 15 · React 19 · TypeScript 5
- Tailwind CSS 4 · shadcn/ui · lucide-react
- Zustand con persistencia + sincronización opcional (hooks/use-cart-sync.ts)
- Base en PostgreSQL (Neon o Vercel Postgres). Preparado para bots/WebSocket externos.
- pnpm como package manager

## Estructura rápida

```
app/
  page.tsx               # landing CBD
  carrito/               # página carrito
  admin/**               # login + dashboard + CRUD
  api/**                 # endpoints serverless (cupones, productos, cart-sync, uploads, etc.)
components/
  chat-*.tsx             # widget completo (form, window, mensajes)
  cart-*.tsx             # drawer, summary, notification
  floating-whatsapp-button.tsx / whatsapp-channel-notification.tsx
lib/
  cart-store.ts          # Zustand store + validaciones + TTL
  mock-products.ts       # dataset temporal hasta conectar DB real
  whatsapp.ts            # helpers para generar mensajes
hooks/
  use-cart-sync.ts       # sync contra tabla cart_sessions
public/brand             # assets de Medicina Natural
branding-nuevo/          # kit de comunicación y paleta
```

## Requisitos

- **Node.js 20+** y **pnpm 8+** (el repo usa `pnpm-lock.yaml`).
- Cuenta en Neon o Vercel Postgres si querés persistencia real (opcional durante dev gracias a `mock-products`).
- Servicios locales para bot y WebSocket (o dejá URLs apuntando a tu VPS).

## Configuración

1. Copiá `ENV-LOCAL-TEMPLATE.txt` a `.env.local` y completá al menos:
   - `DATABASE_URL` / `POSTGRES_URL` (Neon o Postgres local).
   - `NEXT_PUBLIC_WA_PHONE` y credenciales admin temporales.
   - `WHATSAPP_BOT_URL` y `WS_URL` (`http://localhost:5000` / `4000` durante dev).
2. Instalá dependencias:
   ```bash
   pnpm install
   ```
3. Levantá el frontend:
   ```bash
   pnpm dev
   ```
4. Asegurate de tener tus servicios auxiliares ejecutándose:
   ```bash
   # Bot de WhatsApp / lead manager (fuera de este repo)
   pnpm --filter bot dev            # ejemplo
   # Servidor WS para notificaciones
   pnpm --filter ws-server dev      # ejemplo
   ```
5. Abrí [http://localhost:3000](http://localhost:3000) y probá el flujo: notificación → chat → formulario → mensaje automático → generación de link WhatsApp.

> **Nota:** Si no tienes la DB levantada todavía, `lib/mock-products.ts` alimenta la landing. Conecta `/app/api/products` cuando quieras pasar a datos reales.

## Deploy en nuevo repositorio + Vercel

1. **Inicializá un repo limpio** (no reutilices el historial de DripCore).
   ```bash
   rm -rf .git
   git init
   git checkout -b main
   git remote add origin <nuevo-url>
   ```
2. Revisá branding y documentos antes del primer commit (README actualizado, logos en `public/brand`, etc.).
3. Subí sólo los artefactos necesarios (respeta `.gitignore`, nunca subas `.env.local` ni `node_modules`).  
   ```bash
   git add .
   git commit -m "feat: medicina natural storefront"
   git push -u origin main
   ```
4. En Vercel crea un proyecto desde ese repo:
   - Build command: `pnpm install && pnpm build`
   - Output: `.next`
   - Runtime: Node 20
   - Variables: replica todas las de `.env.local` (usa valores productivos), agrega `WHATSAPP_BOT_URL` y `WS_URL` apuntando a tu VPS.
5. Si usas Neon, crea la base y luego ejecuta los seeders necesarios (`pnpm init-db`, `pnpm init-coupons`, etc.) desde la terminal de Vercel o local con `vercel env pull/push`.
6. Para conectar el bot local/VPS con WhatsApp oficial necesitás exponerlo (ngrok/cloudflared en dev, dominio con SSL en prod) y actualizar `WHATSAPP_BOT_URL` en Vercel.

Encontrarás un checklist más detallado en `docs/DEPLOY-VERCEL.md` (creado en este repo).

## Scripts útiles

- `pnpm dev` - Frontend local
- `pnpm build` / `pnpm start` - build y ejecución en modo producción
- `pnpm check-build` - verificación custom previa a despliegues
- `pnpm deploy-safe` - wrapper con validaciones (ver `scripts/deploy-safe.sh`)
- `pnpm init-db`, `pnpm init-coupons`, `pnpm init-cart-sessions` - inicializar tablas (necesitan URLs válidos)

## Seguridad y próximos pasos

- Cambiá `NEXT_PUBLIC_ADMIN_USER/NEXT_PUBLIC_ADMIN_PASS` antes de ir a producción. Idealmente migra a NextAuth o cualquier backend auth real.
- Reemplaza `lib/mock-products.ts` por una consulta real a Postgres/Web API para que el catálogo sea consistente.
- Auditoría de accesibilidad/SEO: el layout fue optimizado para CRO móvil pero conviene pasar Lighthouse una vez que cargues producto real.
- Define un plan de backup/monitoring para el bot local (PM2, systemd, logs centralizados).

---

Para detalles extra del branding, flujo conversacional, y roadmap mira:

- `branding-nuevo/informacion-medicina-natural.txt`
- `SISTEMA-COMPLETO.md`
- `ecommerce-cbd.md` (resumen histórico y decisiones tomadas)
