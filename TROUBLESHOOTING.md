# 🔧 Guía de Resolución de Problemas - DripCore

## Problemas Comunes y Soluciones

### 🚨 Error de Aplicación (Application Error)

**Síntomas:**
- Mensaje "Application error: a client-side exception has occurred"
- El carrito no se abre
- Errores 500 en la consola

**Soluciones:**
1. **Limpiar cache del navegador:**
   ```bash
   # Chrome/Edge: Ctrl + Shift + R
   # Firefox: Ctrl + F5
   ```

2. **Redeploy con cache limpio:**
   ```bash
   pnpm run deploy
   # o
   vercel --prod --yes --force
   ```

3. **Verificar APIs:**
   ```bash
   pnpm run test-apis
   ```

### 🔄 Problemas de Cache

**Síntomas:**
- Los cambios no se reflejan
- Comportamiento inconsistente
- Errores de versión anterior

**Soluciones:**
1. **Cache del navegador:**
   - Abrir DevTools (F12)
   - Click derecho en Refresh → "Empty Cache and Hard Reload"

2. **Cache de Vercel:**
   ```bash
   vercel --prod --yes --force
   ```

3. **Headers de cache configurados** en `next.config.mjs`

### 🗄️ Problemas de Base de Datos

**Síntomas:**
- Error 500 en APIs
- "relation does not exist"
- Datos no se guardan

**Soluciones:**
1. **Inicializar tablas:**
   ```bash
   pnpm run init-db
   pnpm run init-coupons
   ```

2. **Verificar variables de entorno** en Vercel Dashboard

3. **Verificar conexión:**
   ```bash
   curl https://dripcore.vercel.app/api/health
   ```

### 🎫 Problemas de Cupones

**Síntomas:**
- Error 500 al validar cupones
- Mensajes técnicos en lugar de amigables
- Cupones no se aplican

**Soluciones:**
1. **Inicializar tabla de cupones:**
   ```bash
   pnpm run init-coupons
   ```

2. **Verificar API:**
   ```bash
   curl "https://dripcore.vercel.app/api/coupons?code=TEST&validate=true"
   ```

3. **Crear cupón de prueba:**
   - Ir a `/admin/cupones`
   - Crear un cupón con código "TEST"

### 🏗️ Problemas de Build

**Síntomas:**
- Build falla en Vercel
- Errores de sintaxis
- Dependencias faltantes

**Soluciones:**
1. **Verificar build localmente:**
   ```bash
   pnpm run check-build
   pnpm build
   ```

2. **Verificar sintaxis:**
   - Buscar archivos con `Unexpected token`
   - Verificar imports faltantes
   - Revisar JSX mal formado

3. **Limpiar dependencias:**
   ```bash
   rm -rf node_modules
   rm pnpm-lock.yaml
   pnpm install
   ```

### 📱 Problemas de Móvil

**Síntomas:**
- Menú no funciona
- Botones no responden
- Layout roto

**Soluciones:**
1. **Verificar z-index** en componentes
2. **Probar en diferentes dispositivos**
3. **Verificar media queries**

## 🛠️ Comandos Útiles

```bash
# Deploy seguro con verificaciones
pnpm run deploy-safe

# Verificar build antes de deploy
pnpm run check-build

# Deploy rápido
pnpm run deploy

# Inicializar base de datos
pnpm run init-db

# Inicializar cupones
pnpm run init-coupons

# Probar APIs
pnpm run test-apis
```

## 📞 Contacto y Soporte

Si los problemas persisten:

1. **Revisar logs** en Vercel Dashboard
2. **Verificar variables de entorno**
3. **Probar en modo incógnito**
4. **Verificar en diferentes navegadores**

## 🔍 Debugging

### Logs importantes a revisar:
- Consola del navegador (F12)
- Network tab para requests fallidos
- Vercel Function Logs
- Build Logs en Vercel

### URLs de verificación:
- https://dripcore.vercel.app/api/health
- https://dripcore.vercel.app/api/products
- https://dripcore.vercel.app/api/coupons
