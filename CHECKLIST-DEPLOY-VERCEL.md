# ✅ CHECKLIST COMPLETO - DEPLOY EN VERCEL

## 🎯 ESTADO ACTUAL

- ✅ Repo conectado: `https://github.com/agrowd/nanomoringa.git`
- ✅ Dominio configurado: `nanomoringa.vercel.app`
- ✅ Código limpio y sin referencias a DripCore en archivos principales
- ✅ `next.config.mjs` corregido (warning eliminado)
- ✅ Package.json actualizado con scripts correctos

---

## 📋 PASO 1: VERIFICAR VARIABLES DE ENTORNO

### Variables necesarias en Vercel:

1. **Base de Datos:**
   - `DATABASE_URL` (tu connection string de Neon)
   - `POSTGRES_URL` (mismo que DATABASE_URL)
   - `POSTGRES_URL_NON_POOLING` (opcional, para transacciones)

2. **Frontend:**
   - `NEXT_PUBLIC_APP_URL=https://nanomoringa.vercel.app`
   - `NEXT_PUBLIC_APP_NAME=Medicina Natural`
   - `NEXT_PUBLIC_APP_DESCRIPTION=Productos CBD naturales y premium`

3. **WhatsApp:**
   - `NEXT_PUBLIC_WA_PHONE=5491140895557`

4. **Admin (CAMBIAR EN PRODUCCIÓN):**
   - `NEXT_PUBLIC_ADMIN_USER=admin` (cambiar por uno seguro)
   - `NEXT_PUBLIC_ADMIN_PASS=temporal123` (cambiar por uno seguro)

5. **NextAuth:**
   - `NEXTAUTH_URL=https://nanomoringa.vercel.app`
   - `NEXTAUTH_SECRET=` (generar uno seguro, mínimo 32 caracteres)

6. **Envíos:**
   - `NEXT_PUBLIC_SHIPPING_GBA=10000`
   - `NEXT_PUBLIC_SHIPPING_INTERIOR=35000`

7. **Servicios (Bot Local):**
   - `WHATSAPP_BOT_URL=http://localhost:5000` (o tu URL pública del bot)
   - `WS_URL=http://localhost:4000` (o tu URL pública del WS)

---

## 📋 PASO 2: CONFIGURAR VERCEL

### 2.1. Importar Repositorio

1. Ir a [vercel.com](https://vercel.com)
2. Click en **"Add New Project"**
3. Importar desde GitHub: `agrowd/nanomoringa`
4. Seleccionar el repositorio

### 2.2. Configuración del Proyecto

- **Framework Preset:** Next.js
- **Root Directory:** `./` (raíz)
- **Build Command:** `pnpm install && pnpm build`
- **Install Command:** `pnpm install`
- **Output Directory:** `.next`
- **Node Version:** 20.x

### 2.3. Variables de Entorno

1. Ir a **Project Settings → Environment Variables**
2. Agregar todas las variables del PASO 1
3. Seleccionar entornos: **Production**, **Preview**, **Development**
4. **IMPORTANTE:** Usar valores reales de producción (no localhost)

### 2.4. Dominio

1. Ir a **Settings → Domains**
2. Agregar dominio: `nanomoringa.vercel.app`
3. Verificar que esté asignado

---

## 📋 PASO 3: PRIMER DEPLOY

### Opción A: Desde Vercel Dashboard

1. Click en **"Deploy"**
2. Esperar que termine el build
3. Verificar logs por errores

### Opción B: Desde CLI

```bash
# Instalar Vercel CLI (si no lo tenés)
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 📋 PASO 4: INICIALIZAR BASE DE DATOS

Después del primer deploy exitoso:

```bash
# Inicializar tablas
curl https://nanomoringa.vercel.app/api/init-db

# Inicializar cupones
curl https://nanomoringa.vercel.app/api/init-coupons

# Inicializar sesiones de carrito
curl https://nanomoringa.vercel.app/api/init-cart-sessions
```

O desde la terminal de Vercel:
- Ir a **Deployments → [último deploy] → Functions**
- Ejecutar los endpoints manualmente

---

## 📋 PASO 5: VERIFICACIÓN POST-DEPLOY

### 5.1. Landing Page

- [ ] Abrir `https://nanomoringa.vercel.app`
- [ ] Verificar que carga correctamente
- [ ] Verificar hero, productos, footer

### 5.2. Chat Widget

- [ ] Click en botón de chat
- [ ] Completar formulario (nombre + teléfono)
- [ ] Verificar que el bot responde
- [ ] Verificar que el lead se captura

### 5.3. WhatsApp Button

- [ ] Click en botón WhatsApp flotante
- [ ] Verificar que abre WhatsApp con mensaje correcto
- [ ] Verificar número: `+54 9 11 4089-5557`

### 5.4. Carrito

- [ ] Agregar productos al carrito
- [ ] Abrir drawer de carrito
- [ ] Verificar totales
- [ ] Click en "Consultar por WhatsApp"
- [ ] Verificar mensaje generado

### 5.5. Admin Panel

- [ ] Ir a `https://nanomoringa.vercel.app/admin`
- [ ] Login con credenciales
- [ ] Verificar dashboard
- [ ] Verificar CRUD de productos

### 5.6. APIs

- [ ] `https://nanomoringa.vercel.app/api/health` → 200 OK
- [ ] `https://nanomoringa.vercel.app/api/products` → Lista productos
- [ ] `https://nanomoringa.vercel.app/api/coupons` → Lista cupones

---

## 📋 PASO 6: CONFIGURAR BOT LOCAL

### 6.1. Exponer Bot Públicamente

**Opción A: Túnel (Desarrollo)**
```bash
# Instalar cloudflared
# Windows: choco install cloudflared
# Mac: brew install cloudflared

# Exponer bot
cloudflared tunnel --url http://localhost:5000

# Copiar la URL generada (ej: https://xxx.trycloudflare.com)
# Actualizar WHATSAPP_BOT_URL en Vercel con esa URL
```

**Opción B: VPS (Producción)**
- Configurar Nginx reverse proxy
- SSL con Let's Encrypt
- Actualizar `WHATSAPP_BOT_URL` en Vercel

### 6.2. Verificar Conexión

```bash
# Desde Vercel o local
curl https://tu-bot-url.com/health
```

---

## 📋 PASO 7: SEGURIDAD POST-DEPLOY

### 7.1. Rotar Credenciales Admin

1. Generar credenciales seguras:
   - Usuario: mínimo 8 caracteres
   - Password: mínimo 16 caracteres, con mayúsculas, minúsculas, números y símbolos

2. Actualizar en Vercel:
   - `NEXT_PUBLIC_ADMIN_USER=nuevo_usuario`
   - `NEXT_PUBLIC_ADMIN_PASS=nueva_password_segura`

3. Hacer nuevo deploy

### 7.2. Rotar NEXTAUTH_SECRET

1. Generar secret seguro:
   ```bash
   openssl rand -base64 32
   ```

2. Actualizar en Vercel:
   - `NEXTAUTH_SECRET=tu_secret_generado`

3. Hacer nuevo deploy

---

## 🚨 TROUBLESHOOTING

### Error: "Build failed"

- Verificar logs en Vercel
- Verificar que todas las variables estén configuradas
- Verificar que `pnpm install` funcione localmente

### Error: "Database connection failed"

- Verificar `DATABASE_URL` en Vercel
- Verificar que la DB esté accesible desde internet
- Verificar SSL mode si es Neon

### Error: "Chat no envía leads"

- Verificar `WHATSAPP_BOT_URL` en Vercel
- Verificar que el bot esté corriendo
- Verificar CORS en el bot
- Verificar logs del bot

### Error: "Admin no funciona"

- Verificar `NEXT_PUBLIC_ADMIN_USER` y `NEXT_PUBLIC_ADMIN_PASS`
- Limpiar localStorage del navegador
- Verificar que las variables estén en Production

---

## ✅ CHECKLIST FINAL

- [ ] Repo subido a GitHub
- [ ] Proyecto creado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] Base de datos inicializada
- [ ] Landing page funciona
- [ ] Chat widget funciona
- [ ] WhatsApp button funciona
- [ ] Carrito funciona
- [ ] Admin panel funciona
- [ ] APIs responden correctamente
- [ ] Bot local expuesto y conectado
- [ ] Credenciales rotadas
- [ ] Dominio configurado

---

## 🎯 PRÓXIMOS PASOS

1. **Monitoreo:**
   - Configurar alertas en Vercel
   - Configurar logs del bot
   - Configurar métricas de conversión

2. **Optimización:**
   - Configurar CDN para imágenes
   - Optimizar bundle size
   - Configurar cache headers

3. **Marketing:**
   - Configurar Google Analytics
   - Configurar Facebook Pixel
   - Configurar SEO meta tags

---

**🌿 ¡TODO LISTO PARA DEPLOY!**

Seguí los pasos en orden y verificá cada punto antes de continuar.
