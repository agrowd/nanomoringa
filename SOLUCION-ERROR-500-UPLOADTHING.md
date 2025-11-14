# 🔧 Solución Error 500 en Uploadthing

## ❌ Error actual:
```
POST /api/uploadthing?actionType=upload&slug=videoUploader 500 (Internal Server Error)
```

## 🔍 Posibles causas:

### 1. Variable de entorno no configurada correctamente

**Verifica en Vercel:**
1. Ve a **Settings** → **Environment Variables**
2. Asegúrate de que exista **UNA** de estas variables:
   - `UPLOADTHING_TOKEN` = `sk_live_11ef9d903e1c1fa088943e39b5fa64618a543fe37d2c7e2b59d2873048b3ce95`
   - **O** `UPLOADTHING_SECRET` = `sk_live_11ef9d903e1c1fa088943e39b5fa64618a543fe37d2c7e2b59d2873048b3ce95`

3. **IMPORTANTE:** Marca las tres opciones:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

### 2. Deploy no completado

Después de agregar la variable:
1. Ve a **Deployments**
2. Haz clic en el último deployment
3. Si está "Building" o "Queued", espera a que termine
4. Si falló, revisa los logs

### 3. Verificar logs de Vercel

1. Ve a **Deployments**
2. Selecciona el último deployment
3. Ve a **Functions** → `/api/uploadthing`
4. Revisa los logs para ver el error exacto

## ✅ Pasos para solucionar:

### Paso 1: Verificar variable en Vercel
```
Settings → Environment Variables
Buscar: UPLOADTHING_TOKEN o UPLOADTHING_SECRET
```

### Paso 2: Si no existe, agregarla
- Name: `UPLOADTHING_TOKEN`
- Value: `sk_live_11ef9d903e1c1fa088943e39b5fa64618a543fe37d2c7e2b59d2873048b3ce95`
- Environments: Production, Preview, Development

### Paso 3: Forzar nuevo deploy
1. Ve a **Deployments**
2. Haz clic en los tres puntos (⋯) del último deployment
3. Selecciona **Redeploy**

### Paso 4: Esperar y probar
1. Espera 1-2 minutos a que termine el deploy
2. Prueba subir un archivo nuevamente
3. Si sigue fallando, revisa los logs

## 🆘 Si sigue fallando:

1. **Revisa los logs de Vercel** para ver el error exacto
2. **Verifica que el APP_ID también esté configurado** (aunque puede que no sea necesario)
3. **Prueba con una imagen pequeña primero** (menos de 1MB) para descartar problemas de tamaño

## 📝 Nota:

El código ahora verifica automáticamente si las variables están configuradas y mostrará un error en los logs de Vercel si faltan.

