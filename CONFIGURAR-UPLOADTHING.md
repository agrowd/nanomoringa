# 🔑 Configuración de Uploadthing - PASOS

## ✅ Clave SECRET recibida
```
UPLOADTHING_SECRET=sk_live_xxxxx  # Tu secret key de Uploadthing
```

## 📋 PASO 1: Obtener el APP_ID

1. Ve a https://uploadthing.com/dashboard
2. Entra a tu proyecto
3. Ve a "Settings" o "API Keys"
4. Copia el **APP_ID** (generalmente es algo como `xxxxx` o `xxxxx-xxxxx`)

## 📝 PASO 2: Agregar al .env.local (LOCAL)

Edita tu archivo `.env.local` y agrega estas dos líneas:

```env
UPLOADTHING_SECRET=sk_live_xxxxx  # Tu secret key de Uploadthing
UPLOADTHING_APP_ID=xxxxx          # Tu app ID de Uploadthing
```

## ☁️ PASO 3: Configurar en Vercel (PRODUCCIÓN)

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto `nanomoringa`
3. Ve a **Settings** → **Environment Variables**
4. Agrega estas dos variables:

   **Variable 1:**
   - Name: `UPLOADTHING_SECRET`
   - Value: `sk_live_xxxxx` (tu secret key de Uploadthing)
   - Environment: `Production`, `Preview`, `Development` (marca las tres)

   **Variable 2:**
   - Name: `UPLOADTHING_APP_ID`
   - Value: `TU_APP_ID_AQUI` (el que copiaste del dashboard)
   - Environment: `Production`, `Preview`, `Development` (marca las tres)

5. Haz clic en **Save**
6. Ve a **Deployments** y haz un nuevo deploy (o espera a que se redepliegue automáticamente)

## ✅ PASO 4: Verificar

Una vez configurado:
1. Reinicia el servidor local: `pnpm dev`
2. Ve a `/admin/productos/nuevo` o edita un producto
3. Intenta subir una imagen o video
4. Debería funcionar sin errores

## 🆘 Si hay problemas

- Verifica que las variables estén escritas exactamente igual (sin espacios)
- Asegúrate de que el APP_ID sea correcto
- Revisa la consola del navegador para ver errores
- Verifica que el deploy en Vercel se haya completado

