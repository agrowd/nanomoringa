# 🎯 VARIABLES DE ENTORNO - EXPLICACIÓN SIMPLE

## ✅ LO QUE YA SABÉS

- **DATABASE_URL** = Conexión a la base de datos SQL (Neon)
- Sin esto, no se guardan productos, cupones, etc.

---

## 🎯 LAS OTRAS VARIABLES (EXPLICADAS SIMPLE)

### 1. **NEXT_PUBLIC_WA_PHONE** = Tu número de WhatsApp

**¿Para qué?**
- Cuando alguien hace click en "Consultar por WhatsApp", abre WhatsApp con TU número
- Si no la ponés, los botones de WhatsApp no funcionan

**Valor:** `5491140895557` (tu número)

**¿Necesitás ponerla?** ✅ SÍ, SÍ O SÍ

---

### 2. **NEXT_PUBLIC_ADMIN_USER** = Usuario para entrar al admin

**¿Para qué?**
- Para entrar al panel admin (`/admin`)
- Para agregar productos, ver ventas, gestionar cupones

**Valor:** `admin` (o el que quieras)

**¿Necesitás ponerla?** ✅ SÍ, SÍ O SÍ

---

### 3. **NEXT_PUBLIC_ADMIN_PASS** = Contraseña para entrar al admin

**¿Para qué?**
- La contraseña para entrar al panel admin
- Sin esto, no podés entrar al admin

**Valor:** `temporal123` (cambiala por una segura)

**¿Necesitás ponerla?** ✅ SÍ, SÍ O SÍ

---

### 4. **NEXT_PUBLIC_SHIPPING_GBA** = Precio de envío a GBA

**¿Para qué?**
- Define cuánto cobrar por envío a Gran Buenos Aires
- Se muestra en el carrito cuando alguien elige "GBA"

**Valor:** `10000` (o el precio que quieras)

**¿Necesitás ponerla?** ✅ SÍ, SÍ O SÍ

---

### 5. **NEXT_PUBLIC_SHIPPING_INTERIOR** = Precio de envío al interior

**¿Para qué?**
- Define cuánto cobrar por envío al interior del país
- Se muestra en el carrito cuando alguien elige "Interior"

**Valor:** `35000` (o el precio que quieras)

**¿Necesitás ponerla?** ✅ SÍ, SÍ O SÍ

---

### 6. **NEXT_PUBLIC_APP_URL** = URL de tu sitio

**¿Para qué?**
- Para que Google y redes sociales sepan la URL de tu sitio
- Para SEO (aparecer en búsquedas)

**Valor:** `https://nanomoringa.vercel.app`

**¿Necesitás ponerla?** ⚠️ NO ES CRÍTICO, PERO RECOMENDADO

---

### 7. **NEXTAUTH_URL** = URL para autenticación

**¿Para qué?**
- Para autenticación de usuarios (si en el futuro querés que la gente se registre)
- Por ahora no se usa mucho, pero Next.js lo necesita

**Valor:** `https://nanomoringa.vercel.app`

**¿Necesitás ponerla?** ⚠️ NO ES CRÍTICO, PERO RECOMENDADO

---

### 8. **NEXTAUTH_SECRET** = Clave secreta para autenticación

**¿Para qué?**
- Para encriptar datos de autenticación
- Por ahora no se usa mucho, pero Next.js lo necesita

**Valor:** Cualquier texto largo (mínimo 32 caracteres)

**¿Necesitás ponerla?** ⚠️ NO ES CRÍTICO, PERO RECOMENDADO

---

### 9. **WHATSAPP_BOT_URL** = URL del bot de WhatsApp

**¿Para qué?**
- Para cuando tengas el bot de WhatsApp corriendo
- El chat widget se conecta al bot para capturar leads

**Valor:** `http://localhost:5000` (o la URL de tu bot)

**¿Necesitás ponerla?** ⏳ NO ES CRÍTICO AHORA, PODÉS PONERLA DESPUÉS

---

### 10. **WS_URL** = URL del servidor WebSocket

**¿Para qué?**
- Para cuando tengas el servidor WebSocket corriendo
- Para notificaciones en tiempo real

**Valor:** `http://localhost:4000` (o la URL de tu servidor)

**¿Necesitás ponerla?** ⏳ NO ES CRÍTICO AHORA, PODÉS PONERLA DESPUÉS

---

## 🚀 RESUMEN: QUÉ CONFIGURAR AHORA

### ✅ **CRÍTICAS (SÍ O SÍ):**

1. **DATABASE_URL** - Para que se vean los productos
2. **POSTGRES_URL** - Igual que DATABASE_URL
3. **NEXT_PUBLIC_WA_PHONE** - Para que funcionen los botones de WhatsApp
4. **NEXT_PUBLIC_ADMIN_USER** - Para entrar al admin
5. **NEXT_PUBLIC_ADMIN_PASS** - Para entrar al admin
6. **NEXT_PUBLIC_SHIPPING_GBA** - Para calcular envíos
7. **NEXT_PUBLIC_SHIPPING_INTERIOR** - Para calcular envíos

### ⚠️ **RECOMENDADAS (MEJOR PONERLAS):**

8. **NEXT_PUBLIC_APP_URL** - Para SEO
9. **NEXTAUTH_URL** - Para evitar warnings
10. **NEXTAUTH_SECRET** - Para evitar warnings

### ⏳ **PUEDEN ESPERAR (DESPUÉS):**

11. **WHATSAPP_BOT_URL** - Cuando tengas el bot listo
12. **WS_URL** - Cuando tengas el bot listo
13. **NEXT_PUBLIC_APP_NAME** - Para SEO (no crítico)
14. **NEXT_PUBLIC_APP_DESCRIPTION** - Para SEO (no crítico)

---

## 📋 PLAN DE ACCIÓN

### **OPCIÓN 1: MÍNIMO (5 minutos)**

Configurá solo estas 7 variables:

```env
# Base de datos (poner tu connection string de Neon)
DATABASE_URL=postgresql://user:password@ep-XXX.region.neon.tech/neondb?sslmode=require
POSTGRES_URL=postgresql://user:password@ep-XXX.region.neon.tech/neondb?sslmode=require

# WhatsApp
NEXT_PUBLIC_WA_PHONE=5491140895557

# Admin (cambiar por valores seguros)
NEXT_PUBLIC_ADMIN_USER=admin
NEXT_PUBLIC_ADMIN_PASS=temporal123

# Envíos
NEXT_PUBLIC_SHIPPING_GBA=10000
NEXT_PUBLIC_SHIPPING_INTERIOR=35000
```

### **OPCIÓN 2: COMPLETO (10 minutos)**

Configurá todas las variables del archivo `ENV-VERCEL-TEMPLATE.txt`

---

## ❓ PREGUNTAS FRECUENTES

### **¿Qué pasa si no configuro todas las variables?**
- Si no configurás las **CRÍTICAS**: la app no funcionará correctamente
- Si no configurás las **RECOMENDADAS**: la app funcionará pero puede tener warnings
- Si no configurás las que **PUEDEN ESPERAR**: no pasa nada, funcionará igual

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
3. NEXT_PUBLIC_WA_PHONE (tu número de WhatsApp)
4. NEXT_PUBLIC_ADMIN_USER (un usuario seguro)
5. NEXT_PUBLIC_ADMIN_PASS (una contraseña segura)
6. NEXT_PUBLIC_SHIPPING_GBA (10000)
7. NEXT_PUBLIC_SHIPPING_INTERIOR (35000)

**Las demás las podés configurar después si querés.**

---

**🌿 ¡ESPERO QUE QUEDE CLARO! SI TENÉS DUDAS, PREGUNTÁME!**
