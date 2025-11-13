# 🗄️ CREAR BASE DE DATOS EN VERCEL - GUÍA PASO A PASO

## ✅ ESTADO ACTUAL

- ✅ Estás en el modal de "Create Database"
- ✅ Nombre: `nanomoringa` (correcto)
- ✅ Región: Washington, D.C., USA (East) - iad1 (correcto)
- ✅ Plan: Free (correcto)

---

## 🎯 PASOS PARA COMPLETAR

### 1. **CREAR LA BASE DE DATOS**

1. Verificar que el nombre sea `nanomoringa` (ya está puesto)
2. Verificar que la región sea `Washington, D.C., USA (East) - iad1` (ya está seleccionada)
3. Verificar que el plan sea `Free` (ya está seleccionado)
4. Click en **"Create Database"** (o botón similar al final del modal)

### 2. **ESPERAR A QUE SE CREE**

- Vercel creará la base de datos (tarda 1-2 minutos)
- Aparecerá un mensaje de éxito cuando esté lista

### 3. **OBTENER EL CONNECTION STRING**

Después de crear la base de datos, Vercel te mostrará:
- El **Connection String** (lo necesitás para las variables de entorno)
- O podés encontrarlo en:
  - Vercel Dashboard → Storage → Tu base de datos → Connection String
  - O en Neon Dashboard → Tu proyecto → Connection String

**El connection string se ve así:**
```
postgresql://user:password@ep-XXX-XXX.region.neon.tech/neondb?sslmode=require
```

### 4. **CONFIGURAR VARIABLES DE ENTORNO**

Después de obtener el connection string:

1. Ir a Vercel Dashboard → Tu proyecto → Settings → Environment Variables
2. Agregar estas variables:

```
DATABASE_URL = postgresql://user:password@ep-XXX-XXX.region.neon.tech/neondb?sslmode=require
POSTGRES_URL = postgresql://user:password@ep-XXX-XXX.region.neon.tech/neondb?sslmode=require
```

**⚠️ IMPORTANTE:** 
- Reemplazar `postgresql://user:password@ep-XXX-XXX.region.neon.tech/neondb?sslmode=require` con tu connection string real
- Usar el mismo valor para `DATABASE_URL` y `POSTGRES_URL`

---

## 📋 DESPUÉS DE CREAR LA BASE DE DATOS

### 1. **AGREGAR LAS OTRAS VARIABLES CRÍTICAS**

Además de `DATABASE_URL` y `POSTGRES_URL`, agregar estas variables:

```
NEXT_PUBLIC_WA_PHONE = 5491140895557
NEXT_PUBLIC_ADMIN_USER = admin
NEXT_PUBLIC_ADMIN_PASS = temporal123
NEXT_PUBLIC_SHIPPING_GBA = 10000
NEXT_PUBLIC_SHIPPING_INTERIOR = 35000
```

### 2. **INICIALIZAR LA BASE DE DATOS**

Después de configurar las variables de entorno:

```bash
# Opción 1: Desde tu terminal local
curl https://nanomoringa.vercel.app/api/init-db
curl https://nanomoringa.vercel.app/api/init-coupons
curl https://nanomoringa.vercel.app/api/init-cart-sessions

# Opción 2: Desde el navegador, abrir estas URLs:
# https://nanomoringa.vercel.app/api/init-db
# https://nanomoringa.vercel.app/api/init-coupons
# https://nanomoringa.vercel.app/api/init-cart-sessions
```

---

## 🎯 RESUMEN

1. ✅ Click en **"Create Database"** (o botón similar)
2. ⏳ Esperar a que se cree (1-2 minutos)
3. 📋 Copiar el **Connection String**
4. 🔧 Configurar `DATABASE_URL` y `POSTGRES_URL` en Vercel
5. 🔧 Configurar las otras variables críticas
6. 🚀 Inicializar la base de datos

---

**🌿 ¡COMPLETÁ LA CREACIÓN DE LA BASE DE DATOS Y DECIME CUÁNDO TERMINA!**
