# 🚀 EJECUTAR AHORA - DEPLOY EN VERCEL

## ✅ ESTADO ACTUAL

- ✅ Repo conectado: `https://github.com/agrowd/nanomoringa.git`
- ✅ Código actualizado y listo
- ✅ Checklist creado: `CHECKLIST-DEPLOY-VERCEL.md`
- ✅ Template de variables: `ENV-VERCEL-TEMPLATE.txt`

---

## 📋 PASOS INMEDIATOS

### 1. ABRIR VERCEL

1. Ir a [vercel.com](https://vercel.com)
2. Login con tu cuenta
3. Click en **"Add New Project"**

### 2. IMPORTAR REPOSITORIO

1. Seleccionar **"Import Git Repository"**
2. Buscar: `agrowd/nanomoringa`
3. Click en **"Import"**

### 3. CONFIGURAR PROYECTO

**Framework:** Next.js (detectado automáticamente)

**Build Settings:**
- **Build Command:** `pnpm install && pnpm build`
- **Output Directory:** `.next`
- **Install Command:** `pnpm install`
- **Node Version:** 20.x

**Root Directory:** `./` (dejar vacío)

### 4. CONFIGURAR VARIABLES DE ENTORNO

**ANTES de hacer click en "Deploy":**

1. Click en **"Environment Variables"**
2. Abrir `ENV-VERCEL-TEMPLATE.txt` en tu editor
3. Copiar cada línea y pegarla en Vercel

**IMPORTANTE:**
- Completar `DATABASE_URL` con tu connection string real de Neon
- Cambiar `NEXT_PUBLIC_ADMIN_USER` y `NEXT_PUBLIC_ADMIN_PASS` por valores seguros
- Cambiar `NEXTAUTH_SECRET` por uno seguro (mínimo 32 caracteres)

**Para generar NEXTAUTH_SECRET:**
```bash
# En PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 5. DEPLOY

1. Click en **"Deploy"**
2. Esperar que termine el build (2-5 minutos)
3. Verificar que no haya errores en los logs

### 6. INICIALIZAR BASE DE DATOS

Después del deploy exitoso, ejecutar:

```bash
# Opción 1: Desde tu terminal local
curl https://nanomoringa.vercel.app/api/init-db
curl https://nanomoringa.vercel.app/api/init-coupons
curl https://nanomoringa.vercel.app/api/init-cart-sessions

# Opción 2: Desde Vercel Dashboard
# Ir a Deployments → [último deploy] → Functions
# Ejecutar cada endpoint manualmente
```

### 7. VERIFICAR

1. Abrir `https://nanomoringa.vercel.app`
2. Verificar que carga correctamente
3. Probar chat widget
4. Probar carrito
5. Probar admin panel

---

## 🎯 CHECKLIST COMPLETO

Ver el archivo `CHECKLIST-DEPLOY-VERCEL.md` para el checklist completo con todos los detalles.

---

## 🚨 SI HAY ERRORES

### Build Failed
- Verificar logs en Vercel
- Verificar que todas las variables estén configuradas
- Verificar que `pnpm install` funcione localmente

### Database Connection Failed
- Verificar `DATABASE_URL` en Vercel
- Verificar que la DB esté accesible desde internet
- Verificar SSL mode si es Neon

### Chat No Funciona
- Verificar `WHATSAPP_BOT_URL` en Vercel
- Verificar que el bot esté corriendo (si está en local, usar túnel)
- Verificar CORS en el bot

---

## 📞 PRÓXIMOS PASOS DESPUÉS DEL DEPLOY

1. **Configurar Bot Local:**
   - Exponer bot con túnel (cloudflared/ngrok) o VPS
   - Actualizar `WHATSAPP_BOT_URL` en Vercel

2. **Rotar Credenciales:**
   - Cambiar `NEXT_PUBLIC_ADMIN_USER` y `NEXT_PUBLIC_ADMIN_PASS`
   - Cambiar `NEXTAUTH_SECRET`
   - Hacer nuevo deploy

3. **Monitoreo:**
   - Configurar alertas en Vercel
   - Configurar logs del bot

---

**🌿 ¡TODO LISTO! SEGUÍ LOS PASOS Y DECIME SI NECESITÁS AYUDA!**
