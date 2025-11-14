# Configuración de Uploadthing

## ✅ Instalación completada

Los paquetes de Uploadthing ya están instalados:
- `uploadthing` - Librería principal
- `@uploadthing/react` - Componentes React

## 🔑 Configuración necesaria

### 1. Crear cuenta en Uploadthing

1. Ve a https://uploadthing.com
2. Crea una cuenta (es gratis)
3. Crea un nuevo proyecto
4. Copia las claves API que te dan

### 2. Agregar variables de entorno

Agrega estas variables a tu `.env.local` y a Vercel:

```env
UPLOADTHING_SECRET=sk_live_xxxxx  # Tu secret key de Uploadthing
UPLOADTHING_APP_ID=xxxxx          # Tu app ID de Uploadthing
```

### 3. Configurar en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las dos variables:
   - `UPLOADTHING_SECRET`
   - `UPLOADTHING_APP_ID`
4. Haz un nuevo deploy

## 📁 Archivos creados

- `app/api/uploadthing/core.ts` - Configuración de los uploaders (imágenes y videos)
- `app/api/uploadthing/route.ts` - Route handler para Next.js
- `lib/uploadthing.ts` - Componentes React exportados
- `components/media-manager.tsx` - Actualizado para usar Uploadthing

## 🎯 Ventajas de Uploadthing

✅ **Sin límites de tamaño** - Maneja videos de hasta 100MB sin problemas
✅ **Almacenamiento en la nube** - No ocupa espacio en la base de datos
✅ **URLs públicas** - Los archivos tienen URLs directas
✅ **Plan gratuito generoso** - Suficiente para empezar
✅ **Fácil de usar** - Componentes React listos para usar

## 🚀 Uso

El `MediaManager` ahora usa Uploadthing automáticamente. Solo necesitas:

1. Configurar las variables de entorno
2. Hacer deploy
3. ¡Listo! Los archivos se subirán a Uploadthing y se guardarán las URLs en la base de datos

## 📝 Notas

- Los videos ahora se almacenan en Uploadthing, no en base64
- Las URLs se guardan en la base de datos (campo `videos`)
- No hay límite de tamaño para guardar productos (solo el límite de Uploadthing: 100MB por video)

