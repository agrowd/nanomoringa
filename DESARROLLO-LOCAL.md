# 🖥️ DESARROLLO LOCAL - MEDICINA NATURAL

## 🎯 OBJETIVO

Configurar y probar **TODO** el sistema en local antes de deployar al VPS.

**Ventajas:**
- ✅ Desarrollo más rápido
- ✅ Testing inmediato
- ✅ No afecta producción
- ✅ Fácil de debuggear
- ✅ Cambios instantáneos

---

## 📋 PREREQUISITOS

### 1. Node.js y pnpm
```bash
# Verificar Node.js (v20+)
node --version

# Si no está instalado, descargar de: https://nodejs.org/

# Instalar pnpm globalmente
npm install -g pnpm

# Verificar
pnpm --version
```

### 2. PostgreSQL Local
**Opción A: PostgreSQL en tu máquina (Recomendado para desarrollo)**
```bash
# Windows:
# Descargar de: https://www.postgresql.org/download/windows/
# Instalar PostgreSQL 15
# Durante instalación, recordar password de postgres

# Verificar instalación:
psql --version
```

**Opción B: Neon Database (Gratis, en la nube)**
- Ir a https://neon.tech
- Crear cuenta gratuita
- Crear base de datos
- Copiar connection string

**Opción C: Supabase (Gratis, en la nube)**
- Ir a https://supabase.com
- Crear cuenta gratuita
- Crear proyecto
- Copiar connection string

**Para desarrollo local, recomiendo Opción A o B**

### 3. Git
```bash
# Verificar
git --version

# Si no está, descargar de: https://git-scm.com/
```

---

## 🚀 SETUP PASO A PASO

### PASO 1: Instalar Dependencias

```bash
# En el directorio del proyecto:
cd c:\Users\Try Hard\Desktop\Nexte\medicinanatural-ecommerce-vps

# Instalar todas las dependencias
pnpm install

# Esto puede tardar 2-3 minutos
```

### PASO 2: Configurar Base de Datos

#### Si usas PostgreSQL local:
```bash
# Abrir pgAdmin o psql
psql -U postgres

# Crear base de datos
CREATE DATABASE medicinanatural;

# Salir
\q

# Tu connection string será:
# postgresql://postgres:TU_PASSWORD@localhost:5432/medicinanatural
```

#### Si usas Neon/Supabase:
- Ya tienes el connection string
- Ejemplo: `postgresql://user:pass@host.region.neon.tech/neondb?sslmode=require`

### PASO 3: Crear archivo .env.local

Voy a crear el archivo con las variables necesarias:

```env
# Base de Datos
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/medicinanatural"
POSTGRES_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/medicinanatural"

# WhatsApp
NEXT_PUBLIC_WA_PHONE=5491140895557

# Admin (cambiar después)
NEXT_PUBLIC_ADMIN_USER=admin
NEXT_PUBLIC_ADMIN_PASS=temporal123

# URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=desarrollo-local-secret-cambiar-en-produccion

# Envíos (placeholder)
NEXT_PUBLIC_SHIPPING_GBA=10000
NEXT_PUBLIC_SHIPPING_INTERIOR=35000

# WhatsApp Bot (localhost)
WHATSAPP_BOT_URL=http://localhost:5000
WS_URL=http://localhost:4000
```

### PASO 4: Inicializar Base de Datos

Una vez tengas la base de datos configurada, ejecutamos:

```bash
# Esto creará todas las tablas necesarias
pnpm run init-db
# O si no funciona, creamos un script para esto
```

### PASO 5: Actualizar Branding

Voy a crear un script para actualizar los colores y logo:

```bash
# Copiar logo a public
# Actualizar colores en globals.css
# Cambiar tipografías en layout.tsx
```

### PASO 6: Correr el proyecto

```bash
# Modo desarrollo (con hot reload)
pnpm dev

# Abrir en navegador:
# http://localhost:3000
```

---

## 📝 ORDEN DE DESARROLLO

### FASE 1: Branding y UI (Día 1-2)
```
✅ Actualizar colores en globals.css
✅ Cambiar logo en header/footer
✅ Actualizar favicon
✅ Cambiar tipografías
✅ Adaptar hero section
✅ Remover contenido DripCore
```

### FASE 2: Productos (Día 3-4)
```
✅ Crear 4 productos en base de datos
✅ Subir imágenes a /public/uploads/productos/
✅ Adaptar ProductCard component
✅ Adaptar página de producto
✅ Verificar catálogo
```

### FASE 3: Chat Web (Día 5-6)
```
✅ Crear componente ChatWidget
✅ API routes de chat
✅ Guardar conversaciones en DB
✅ Diseño adaptado a Medicina Natural
```

### FASE 4: WhatsApp Bot Local (Día 7-8)
```
✅ Setup whatsapp-web.js en local
✅ Generar QR y escanear
✅ Autorespuestas básicas
✅ Testing de flujos
```

### FASE 5: CRM (Día 9-10)
```
✅ Panel de conversaciones
✅ Lista de leads
✅ Responder desde web
✅ Editor de autorespuestas
```

### FASE 6: Testing Local (Día 11-12)
```
✅ Probar todos los flujos
✅ Fix de bugs
✅ Optimizaciones
✅ Preparar para deploy
```

---

## 🛠️ COMANDOS ÚTILES

### Desarrollo
```bash
# Iniciar servidor de desarrollo
pnpm dev

# Build de producción (para probar antes de deploy)
pnpm build

# Correr build localmente
pnpm start

# Linter
pnpm lint
```

### Base de Datos
```bash
# Inicializar base de datos
curl http://localhost:3000/api/init-db

# Ver productos
curl http://localhost:3000/api/products

# Ver cupones
curl http://localhost:3000/api/coupons
```

### WhatsApp Bot (cuando lo configuremos)
```bash
# Iniciar bot en otro terminal
cd services/whatsapp-bot
node bot.js
```

---

## 📂 ESTRUCTURA DE TRABAJO

### Archivos a Modificar (Prioridad)

**1. Colores y Estilos:**
```
app/globals.css              ← Paleta de colores
```

**2. Layout y Logo:**
```
app/layout.tsx               ← Tipografías
components/header.tsx        ← Logo y navbar
components/footer.tsx        ← Footer
public/favicon.svg           ← Favicon
```

**3. Página Principal:**
```
app/page.tsx                 ← Hero section
```

**4. Productos:**
```
app/catalogo/page.tsx        ← Catálogo
app/producto/[slug]/page.tsx ← Detalle producto
components/product-card.tsx  ← Card de producto
```

**5. Base de Datos:**
```
lib/db.ts                    ← Funciones de DB
lib/types.ts                 ← Tipos TypeScript
```

---

## 🎨 CAMBIOS DE BRANDING (Primero)

### 1. Colores (globals.css)
```css
/* Cambiar de DripCore a Medicina Natural */
--background: 38 32 10;        /* #F6F0DE beige */
--primary: 150 47 20;          /* #294E3A verde oscuro */
--accent: 135 35 42;           /* #4A8F53 verde medio */
```

### 2. Logo (header.tsx)
```typescript
// Cambiar:
<Image src="/brand/dripcore-logo.svg" ... />
// Por:
<Image src="/brand/medicina-natural-logo.png" ... />
```

### 3. Textos (page.tsx)
```typescript
// Cambiar todos los textos de streetwear a CBD
// Ejemplo:
"Bienestar Natural con CBD"
"Acompañamos tu rutina diaria con productos de calidad"
```

---

## ✅ CHECKLIST DE SETUP LOCAL

### Instalación Base
- [ ] Node.js 20+ instalado
- [ ] pnpm instalado
- [ ] PostgreSQL local o Neon configurado
- [ ] Git instalado

### Configuración Proyecto
- [ ] `pnpm install` ejecutado correctamente
- [ ] Archivo `.env.local` creado
- [ ] Base de datos conectada
- [ ] Tablas creadas (`init-db`)
- [ ] Proyecto corre en `localhost:3000`

### Branding Actualizado
- [ ] Colores cambiados en `globals.css`
- [ ] Logo reemplazado
- [ ] Favicon actualizado
- [ ] Tipografías configuradas
- [ ] Hero section adaptado

### Productos
- [ ] Imágenes subidas a `/public/uploads/productos/`
- [ ] 4 productos creados en DB
- [ ] Catálogo muestra productos
- [ ] Páginas de detalle funcionan

### Funcionalidades
- [ ] Chat widget visible
- [ ] Formulario captura datos
- [ ] WhatsApp bot conectado (QR escaneado)
- [ ] Autorespuestas funcionando
- [ ] CRM accesible en `/admin`

---

## 🐛 TROUBLESHOOTING

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Error: "Database connection failed"
```bash
# Verificar que PostgreSQL está corriendo
# Windows: Buscar "Services" → PostgreSQL
# Verificar connection string en .env.local
```

### Error: "Port 3000 already in use"
```bash
# Matar proceso en puerto 3000
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# O usar otro puerto:
PORT=3001 pnpm dev
```

### Error al compilar
```bash
# Limpiar cache
rm -rf .next
pnpm build
```

---

## 📅 TIMELINE LOCAL (12 días)

```
DÍA 1-2:   Setup + Branding ✅
DÍA 3-4:   Productos ✅
DÍA 5-6:   Chat Web ✅
DÍA 7-8:   WhatsApp Bot ✅
DÍA 9-10:  CRM ✅
DÍA 11-12: Testing y fixes ✅

Después → Deploy al VPS
```

---

## 🚀 VENTAJAS DE DESARROLLAR LOCAL PRIMERO

1. **Velocidad:** Cambios instantáneos, no esperar deploy
2. **Testing:** Probar todo sin riesgos
3. **Debug:** Fácil de debuggear con DevTools
4. **Costo:** $0, no consumir recursos de VPS
5. **Aprendizaje:** Entender cómo funciona todo
6. **Iteración:** Hacer cambios rápido
7. **Confianza:** Cuando subas al VPS, sabrás que funciona

---

## ✅ CUANDO ESTÉ TODO LISTO EN LOCAL

### Entonces haremos:
1. **Docker:** Containerizar todo
2. **Testing:** Build de producción local
3. **Deploy:** Subir al VPS (149.50.128.73)
4. **DNS:** Apuntar dominio
5. **SSL:** Configurar HTTPS
6. **Monitoring:** Configurar alertas
7. **Go Live:** 🚀

---

## 📞 PRÓXIMO PASO INMEDIATO

**¿Qué necesito que hagas AHORA?**

1. **Verificar Node.js:**
   ```bash
   node --version
   # Debe ser v20 o superior
   ```

2. **Decidir base de datos:**
   - ¿PostgreSQL local? (más control, más setup)
   - ¿Neon gratis? (fácil, ya funciona)
   - ¿Supabase gratis? (fácil, más features)

3. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

Una vez confirmes estos 3 puntos, empezamos con los cambios de branding y colores. 

**¿Cuál base de datos preferís usar para desarrollo local?** 🚀

