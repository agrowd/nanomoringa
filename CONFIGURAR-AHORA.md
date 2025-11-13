# 🚀 CONFIGURAR VARIABLES EN VERCEL - GUÍA RÁPIDA

## ✅ LO QUE YA HICISTE

- ✅ Configuraste el dominio `nanomoringa.vercel.app`
- ✅ El deploy está funcionando

---

## 🎯 QUÉ FALTA CONFIGURAR

### **7 VARIABLES CRÍTICAS** (sin estas, la app no funciona bien)

---

## 📋 PASO A PASO (5 minutos)

### 1. **IR A VERCEL**

1. Abrir: https://vercel.com/agrowds-projects/medicinanatural-ecommerce-vps
2. Click en **"Settings"** (arriba a la derecha)
3. Click en **"Environment Variables"** (menú izquierdo)

### 2. **AGREGAR LAS 7 VARIABLES CRÍTICAS**

Copiar y pegar cada una de estas variables:

#### **1. DATABASE_URL** (Base de datos)
```
DATABASE_URL
```
**Valor:** Tu connection string de Neon (ejemplo: `postgresql://user:password@ep-XXX.region.neon.tech/neondb?sslmode=require`)

**¿Dónde conseguirlo?**
- Ir a https://neon.tech
- Login en tu cuenta
- Seleccionar tu proyecto
- Copiar el "Connection String"

**⚠️ IMPORTANTE:** Sin esto, no se ven productos, no funcionan cupones, no se guarda nada.

---

#### **2. POSTGRES_URL** (Base de datos - igual que DATABASE_URL)
```
POSTGRES_URL
```
**Valor:** Igual que DATABASE_URL

**⚠️ IMPORTANTE:** Sin esto, la app no puede conectarse a la base de datos.

---

#### **3. NEXT_PUBLIC_WA_PHONE** (Tu número de WhatsApp)
```
NEXT_PUBLIC_WA_PHONE
```
**Valor:** `5491140895557`

**¿Para qué?**
- Cuando alguien hace click en "Consultar por WhatsApp", abre WhatsApp con TU número
- Sin esto, los botones de WhatsApp no funcionan

**⚠️ IMPORTANTE:** Sin esto, los botones de WhatsApp no funcionan.

---

#### **4. NEXT_PUBLIC_ADMIN_USER** (Usuario para entrar al admin)
```
NEXT_PUBLIC_ADMIN_USER
```
**Valor:** `admin` (o el usuario que quieras)

**¿Para qué?**
- Para entrar al panel admin (`/admin`)
- Sin esto, no podés entrar al admin

**⚠️ IMPORTANTE:** Sin esto, no podés entrar al admin.

---

#### **5. NEXT_PUBLIC_ADMIN_PASS** (Contraseña para entrar al admin)
```
NEXT_PUBLIC_ADMIN_PASS
```
**Valor:** `temporal123` (cambiala por una segura después)

**¿Para qué?**
- La contraseña para entrar al panel admin
- Sin esto, no podés entrar al admin

**⚠️ IMPORTANTE:** Sin esto, no podés entrar al admin.

**🔒 SEGURIDAD:** Después de configurar, cambiala por una contraseña segura.

---

#### **6. NEXT_PUBLIC_SHIPPING_GBA** (Precio de envío a GBA)
```
NEXT_PUBLIC_SHIPPING_GBA
```
**Valor:** `10000`

**¿Para qué?**
- Define cuánto cobrar por envío a Gran Buenos Aires
- Se muestra en el carrito cuando alguien elige "GBA"

**⚠️ IMPORTANTE:** Sin esto, el carrito no sabe cuánto cobrar por envío.

---

#### **7. NEXT_PUBLIC_SHIPPING_INTERIOR** (Precio de envío al interior)
```
NEXT_PUBLIC_SHIPPING_INTERIOR
```
**Valor:** `35000`

**¿Para qué?**
- Define cuánto cobrar por envío al interior del país
- Se muestra en el carrito cuando alguien elige "Interior"

**⚠️ IMPORTANTE:** Sin esto, el carrito no sabe cuánto cobrar por envío.

---

## 📝 RESUMEN DE VALORES

```
DATABASE_URL = postgresql://user:password@ep-XXX.region.neon.tech/neondb?sslmode=require
POSTGRES_URL = postgresql://user:password@ep-XXX.region.neon.tech/neondb?sslmode=require
NEXT_PUBLIC_WA_PHONE = 5491140895557
NEXT_PUBLIC_ADMIN_USER = admin
NEXT_PUBLIC_ADMIN_PASS = temporal123
NEXT_PUBLIC_SHIPPING_GBA = 10000
NEXT_PUBLIC_SHIPPING_INTERIOR = 35000
```

---

## 🎯 DESPUÉS DE CONFIGURAR

### 1. **VERIFICAR QUE FUNCIONE**

1. Esperar 1-2 minutos (Vercel hace un nuevo deploy automáticamente)
2. Abrir: https://nanomoringa.vercel.app
3. Verificar que:
   - La página carga correctamente
   - Los botones de WhatsApp funcionan
   - Podés entrar al admin (`/admin`)

### 2. **INICIALIZAR BASE DE DATOS**

Después de configurar las variables, ejecutar:

```bash
curl https://nanomoringa.vercel.app/api/init-db
curl https://nanomoringa.vercel.app/api/init-coupons
curl https://nanomoringa.vercel.app/api/init-cart-sessions
```

O desde el navegador, abrir estas URLs:
- https://nanomoringa.vercel.app/api/init-db
- https://nanomoringa.vercel.app/api/init-coupons
- https://nanomoringa.vercel.app/api/init-cart-sessions

---

## ❓ PREGUNTAS FRECUENTES

### **¿Dónde consigo el DATABASE_URL?**
1. Ir a https://neon.tech
2. Login en tu cuenta
3. Seleccionar tu proyecto
4. Copiar el "Connection String"
5. Pegarlo en Vercel como valor de `DATABASE_URL`

### **¿Qué pasa si no configuro estas variables?**
- **DATABASE_URL**: No se ven productos, no funcionan cupones, no se guarda nada
- **NEXT_PUBLIC_WA_PHONE**: Los botones de WhatsApp no funcionan
- **NEXT_PUBLIC_ADMIN_USER/PASS**: No podés entrar al admin
- **NEXT_PUBLIC_SHIPPING_***: El carrito no sabe cuánto cobrar por envío

### **¿Puedo configurarlas después?**
- Sí, podés configurarlas en cualquier momento
- Después de configurarlas, Vercel hace un nuevo deploy automáticamente

### **¿Cómo sé si están bien configuradas?**
- Si la app carga y se ven los productos: **DATABASE_URL** está bien
- Si los botones de WhatsApp funcionan: **NEXT_PUBLIC_WA_PHONE** está bien
- Si podés entrar al admin: **NEXT_PUBLIC_ADMIN_USER** y **NEXT_PUBLIC_ADMIN_PASS** están bien

---

## 🎯 RECOMENDACIÓN FINAL

**Configurá las 7 variables CRÍTICAS ahora:**
1. DATABASE_URL (con tu connection string de Neon)
2. POSTGRES_URL (igual que DATABASE_URL)
3. NEXT_PUBLIC_WA_PHONE (5491140895557)
4. NEXT_PUBLIC_ADMIN_USER (admin)
5. NEXT_PUBLIC_ADMIN_PASS (temporal123)
6. NEXT_PUBLIC_SHIPPING_GBA (10000)
7. NEXT_PUBLIC_SHIPPING_INTERIOR (35000)

**Las demás variables las podés configurar después si querés (no son críticas).**

---

**🌿 ¡ESPERO QUE QUEDE CLARO! SI TENÉS DUDAS, PREGUNTÁME!**
