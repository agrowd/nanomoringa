# 🚀 INICIO RÁPIDO - DESARROLLO LOCAL

## ✅ PRE-REQUISITOS VERIFICADOS

- ✅ Node.js v22.16.0 instalado
- ✅ pnpm v10.12.4 instalado

---

## 🎯 PASOS PARA EMPEZAR (15 minutos)

### PASO 1: Instalar Dependencias (5 min)

```bash
# Ya estás en el directorio correcto
pnpm install
```

Esto instalará todas las dependencias del proyecto (React, Next.js, PostgreSQL client, etc.)

---

### PASO 2: Configurar Base de Datos (5 min)

Tenés 2 opciones:

#### OPCIÓN A: Neon (MÁS FÁCIL - Recomendado para empezar rápido)
1. Ir a https://neon.tech
2. Crear cuenta con email o GitHub
3. Crear nuevo proyecto "medicinanatural"
4. Copiar el "Connection String"
5. Lo usaremos en el siguiente paso

#### OPCIÓN B: PostgreSQL Local
1. Descargar PostgreSQL de https://www.postgresql.org/download/windows/
2. Instalar (recordar password de postgres)
3. Abrir pgAdmin o psql
4. Crear base de datos: `CREATE DATABASE medicinanatural;`

**Para empezar rápido, te recomiendo Opción A (Neon)**

---

### PASO 3: Crear archivo .env.local (2 min)

```bash
# Crear el archivo
type nul > .env.local

# O crear manualmente en VS Code:
# Archivo → Nuevo → Guardar como ".env.local"
```

Copiar este contenido en el archivo `.env.local`:

```env
# Base de Datos (Poner tu connection string de Neon)
DATABASE_URL="postgresql://user:password@ep-XXX.region.neon.tech/neondb?sslmode=require"
POSTGRES_URL="postgresql://user:password@ep-XXX.region.neon.tech/neondb?sslmode=require"

# WhatsApp
NEXT_PUBLIC_WA_PHONE=5491140895557

# Admin
NEXT_PUBLIC_ADMIN_USER=admin
NEXT_PUBLIC_ADMIN_PASS=temporal123

# URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-cambiar-en-produccion

# Envíos
NEXT_PUBLIC_SHIPPING_GBA=10000
NEXT_PUBLIC_SHIPPING_INTERIOR=35000

# Servicios
WHATSAPP_BOT_URL=http://localhost:5000
WS_URL=http://localhost:4000
```

**IMPORTANTE:** Reemplazar `DATABASE_URL` con tu connection string real.

---

### PASO 4: Inicializar Base de Datos (1 min)

Primero arranca el servidor:

```bash
pnpm dev
```

Luego en otro terminal (o en el navegador):

```bash
# Opción 1: Desde navegador
# Ir a: http://localhost:3000/api/init-db

# Opción 2: Desde terminal
curl http://localhost:3000/api/init-db
```

Esto creará todas las tablas necesarias (products, coupons, conversations, etc.)

---

### PASO 5: Ver el Proyecto (1 min)

Abrir navegador en:
```
http://localhost:3000
```

Deberías ver la página actual de DripCore. ¡Perfecto! Ya funciona.

---

## 🎨 PRÓXIMOS PASOS: ADAPTAR A MEDICINA NATURAL

Ahora que funciona, vamos a adaptarlo paso a paso:

### 1. COLORES (10 min)
Archivo: `app/globals.css`
- Cambiar paleta DripCore → Medicina Natural

### 2. LOGO (5 min)
Archivos: `components/header.tsx`, `components/footer.tsx`
- Reemplazar logo

### 3. TEXTOS (15 min)
Archivo: `app/page.tsx`
- Cambiar de streetwear a CBD
- Adaptar hero section

### 4. PRODUCTOS (30 min)
- Crear 4 productos CBD en base de datos
- Subir imágenes

### 5. CHAT (1 hora)
- Crear widget de chat
- API de conversaciones

---

## 🐛 SI ALGO NO FUNCIONA

### Error: "pnpm: command not found"
```bash
npm install -g pnpm
```

### Error: "Cannot connect to database"
- Verificar que copiaste bien el DATABASE_URL
- Verificar que Neon esté activo
- Probar conexión desde Neon dashboard

### Error: "Port 3000 in use"
```bash
# Matar proceso
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Error al instalar dependencias
```bash
# Limpiar y reinstalar
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

---

## ✅ CHECKLIST RÁPIDO

- [ ] `pnpm install` ejecutado sin errores
- [ ] Archivo `.env.local` creado con DATABASE_URL correcto
- [ ] `pnpm dev` corriendo sin errores
- [ ] http://localhost:3000 carga correctamente
- [ ] http://localhost:3000/api/init-db ejecutado
- [ ] Puedo ver productos en http://localhost:3000/catalogo

---

## 🎯 ¿QUÉ SIGUE?

Una vez que tengas todo funcionando:

1. **Te aviso** y empezamos a cambiar colores
2. **Cambiamos** el logo y branding
3. **Adaptamos** los textos
4. **Creamos** los productos CBD
5. **Probamos** todo en local
6. **Deployamos** al VPS cuando esté perfecto

---

## 📞 SI NECESITÁS AYUDA

**Errores comunes:** Ver sección "SI ALGO NO FUNCIONA" arriba

**¿Tenés un error diferente?**
- Copia el mensaje de error completo
- Decime en qué paso estás
- Te ayudo a resolverlo

---

**Tiempo estimado total:** 15-20 minutos
**Resultado:** Proyecto funcionando en local ✅

🚀 **DALE, EMPECEMOS CON `pnpm install`**

