# ✅ CONFIGURAR VARIABLES DE ENTORNO - PASO A PASO

## 🎉 BASE DE DATOS CREADA

Ya tenés los connection strings. Ahora necesitás configurar las variables de entorno.

---

## 📋 PASO 1: IR A VARIABLES DE ENTORNO

1. En Vercel Dashboard, ir a tu proyecto
2. Click en **"Settings"** (arriba a la derecha)
3. Click en **"Environment Variables"** (menú izquierdo)

---

## 📋 PASO 2: AGREGAR VARIABLES DE BASE DE DATOS

### **1. DATABASE_URL**

1. Click en **"Add New"** o **"Add Variable"**
2. **Key:** `DATABASE_URL`
3. **Value:** 
   ```
   postgresql://neondb_owner:npg_iy8ojc7AFdNr@ep-red-glade-a4uwyanr-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **Environment:** Seleccionar **Production**, **Preview**, y **Development** (las 3)
5. Click en **"Save"**

### **2. POSTGRES_URL**

1. Click en **"Add New"** o **"Add Variable"**
2. **Key:** `POSTGRES_URL`
3. **Value:** 
   ```
   postgresql://neondb_owner:npg_iy8ojc7AFdNr@ep-red-glade-a4uwyanr-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
   (El mismo valor que DATABASE_URL)
4. **Environment:** Seleccionar **Production**, **Preview**, y **Development** (las 3)
5. Click en **"Save"**

### **3. POSTGRES_URL_NON_POOLING** (Opcional)

1. Click en **"Add New"** o **"Add Variable"**
2. **Key:** `POSTGRES_URL_NON_POOLING`
3. **Value:** 
   ```
   postgresql://neondb_owner:npg_iy8ojc7AFdNr@ep-red-glade-a4uwyanr.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
   (El valor de DATABASE_URL_UNPOOLED que te dio Vercel)
4. **Environment:** Seleccionar **Production**, **Preview**, y **Development** (las 3)
5. Click en **"Save"**

---

## 📋 PASO 3: AGREGAR VARIABLES CRÍTICAS

### **4. NEXT_PUBLIC_WA_PHONE**

1. Click en **"Add New"** o **"Add Variable"**
2. **Key:** `NEXT_PUBLIC_WA_PHONE`
3. **Value:** `5491140895557`
4. **Environment:** Seleccionar **Production**, **Preview**, y **Development** (las 3)
5. Click en **"Save"**

### **5. NEXT_PUBLIC_ADMIN_USER**

1. Click en **"Add New"** o **"Add Variable"**
2. **Key:** `NEXT_PUBLIC_ADMIN_USER`
3. **Value:** `admin`
4. **Environment:** Seleccionar **Production**, **Preview**, y **Development** (las 3)
5. Click en **"Save"**

### **6. NEXT_PUBLIC_ADMIN_PASS**

1. Click en **"Add New"** o **"Add Variable"**
2. **Key:** `NEXT_PUBLIC_ADMIN_PASS`
3. **Value:** `temporal123`
4. **Environment:** Seleccionar **Production**, **Preview**, y **Development** (las 3)
5. Click en **"Save"**

**⚠️ IMPORTANTE:** Después de probar que funciona, cambiá esta contraseña por una segura.

### **7. NEXT_PUBLIC_SHIPPING_GBA**

1. Click en **"Add New"** o **"Add Variable"**
2. **Key:** `NEXT_PUBLIC_SHIPPING_GBA`
3. **Value:** `10000`
4. **Environment:** Seleccionar **Production**, **Preview**, y **Development** (las 3)
5. Click en **"Save"**

### **8. NEXT_PUBLIC_SHIPPING_INTERIOR**

1. Click en **"Add New"** o **"Add Variable"**
2. **Key:** `NEXT_PUBLIC_SHIPPING_INTERIOR`
3. **Value:** `35000`
4. **Environment:** Seleccionar **Production**, **Preview**, y **Development** (las 3)
5. Click en **"Save"**

---

## 📋 PASO 4: AGREGAR VARIABLES RECOMENDADAS (Opcional)

### **9. NEXT_PUBLIC_APP_URL**

1. Click en **"Add New"** o **"Add Variable"**
2. **Key:** `NEXT_PUBLIC_APP_URL`
3. **Value:** `https://nanomoringa.vercel.app`
4. **Environment:** Seleccionar **Production**, **Preview**, y **Development** (las 3)
5. Click en **"Save"**

### **10. NEXTAUTH_URL**

1. Click en **"Add New"** o **"Add Variable"**
2. **Key:** `NEXTAUTH_URL`
3. **Value:** `https://nanomoringa.vercel.app`
4. **Environment:** Seleccionar **Production**, **Preview**, y **Development** (las 3)
5. Click en **"Save"**

### **11. NEXTAUTH_SECRET**

1. Click en **"Add New"** o **"Add Variable"**
2. **Key:** `NEXTAUTH_SECRET`
3. **Value:** `desarrollo-local-secret-medicina-natural-2025-cambiar-en-produccion`
4. **Environment:** Seleccionar **Production**, **Preview**, y **Development** (las 3)
5. Click en **"Save"**

---

## 📋 RESUMEN DE VARIABLES

### ✅ **CRÍTICAS (SÍ O SÍ):**

1. `DATABASE_URL` = `postgresql://neondb_owner:npg_iy8ojc7AFdNr@ep-red-glade-a4uwyanr-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`
2. `POSTGRES_URL` = `postgresql://neondb_owner:npg_iy8ojc7AFdNr@ep-red-glade-a4uwyanr-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`
3. `NEXT_PUBLIC_WA_PHONE` = `5491140895557`
4. `NEXT_PUBLIC_ADMIN_USER` = `admin`
5. `NEXT_PUBLIC_ADMIN_PASS` = `temporal123`
6. `NEXT_PUBLIC_SHIPPING_GBA` = `10000`
7. `NEXT_PUBLIC_SHIPPING_INTERIOR` = `35000`

### ⚠️ **RECOMENDADAS (MEJOR PONERLAS):**

8. `NEXT_PUBLIC_APP_URL` = `https://nanomoringa.vercel.app`
9. `NEXTAUTH_URL` = `https://nanomoringa.vercel.app`
10. `NEXTAUTH_SECRET` = `desarrollo-local-secret-medicina-natural-2025-cambiar-en-produccion`

### ⏳ **OPCIONAL (PUEDE ESPERAR):**

11. `POSTGRES_URL_NON_POOLING` = `postgresql://neondb_owner:npg_iy8ojc7AFdNr@ep-red-glade-a4uwyanr.us-east-1.aws.neon.tech/neondb?sslmode=require`

---

## 🎯 DESPUÉS DE CONFIGURAR

### 1. **ESPERAR EL REDEPLOY**

- Vercel hará un nuevo deploy automáticamente (tarda 1-2 minutos)
- Podés ver el progreso en la pestaña "Deployments"

### 2. **INICIALIZAR LA BASE DE DATOS**

Después de que termine el deploy, ejecutar:

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

### 3. **VERIFICAR QUE FUNCIONE**

1. Abrir: https://nanomoringa.vercel.app
2. Verificar que:
   - La página carga correctamente
   - Los botones de WhatsApp funcionan
   - Podés entrar al admin (`/admin`)

---

## ✅ CHECKLIST

- [ ] DATABASE_URL configurada
- [ ] POSTGRES_URL configurada
- [ ] NEXT_PUBLIC_WA_PHONE configurada
- [ ] NEXT_PUBLIC_ADMIN_USER configurada
- [ ] NEXT_PUBLIC_ADMIN_PASS configurada
- [ ] NEXT_PUBLIC_SHIPPING_GBA configurada
- [ ] NEXT_PUBLIC_SHIPPING_INTERIOR configurada
- [ ] NEXT_PUBLIC_APP_URL configurada (opcional)
- [ ] NEXTAUTH_URL configurada (opcional)
- [ ] NEXTAUTH_SECRET configurada (opcional)
- [ ] Base de datos inicializada
- [ ] Todo funciona correctamente

---

**🌿 ¡CONFIGURÁ LAS VARIABLES Y DECIME CUÁNDO TERMINAS!**
