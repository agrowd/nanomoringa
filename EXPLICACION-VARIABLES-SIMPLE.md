# 📖 EXPLICACIÓN SIMPLE DE LAS VARIABLES DE ENTORNO

## 🎯 RESUMEN RÁPIDO

**Todas las variables son para que la app sepa:**
- Dónde está (URL)
- Cómo conectarse a la base de datos
- Qué número de WhatsApp usar
- Cómo hacer login en el admin
- Cuánto cobrar por envíos

---

## 🔍 QUÉ HACE CADA VARIABLE (EXPLICADO SIMPLE)

### 1. **BASE DE DATOS (CRÍTICO - NECESITÁS ESTO)**

```env
DATABASE_URL=postgresql://user:password@ep-XXX.region.neon.tech/neondb?sslmode=require
POSTGRES_URL=postgresql://user:password@ep-XXX.region.neon.tech/neondb?sslmode=require
```

**¿Para qué?**
- Guarda los productos que mostrás en la web
- Guarda los cupones de descuento
- Guarda los carritos de compra abandonados

**¿Qué pasa si no la ponés?**
- ❌ No se ven productos
- ❌ No funcionan los cupones
- ❌ No se guarda nada

**✅ NECESITÁS ESTA VARIABLE SÍ O SÍ**

---

### 2. **FRONTEND (OPCIONAL - YA FUNCIONA SIN ELLAS)**

```env
NEXT_PUBLIC_APP_URL=https://nanomoringa.vercel.app
NEXT_PUBLIC_APP_NAME=Medicina Natural
NEXT_PUBLIC_APP_DESCRIPTION=Productos CBD naturales y premium
```

**¿Para qué?**
- Para que Google y redes sociales sepan el nombre de tu sitio
- Para compartir enlaces que se vean bien
- Para SEO (aparecer en búsquedas)

**¿Qué pasa si no las ponés?**
- ⚠️ Funciona igual, pero puede que no aparezca bien en Google
- ⚠️ Los links compartidos pueden no tener título bonito

**⚠️ NO ES CRÍTICO, PERO RECOMENDADO**

---

### 3. **WHATSAPP (CRÍTICO - NECESITÁS ESTO)**

```env
NEXT_PUBLIC_WA_PHONE=5491140895557
```

**¿Para qué?**
- Cuando alguien hace click en "Consultar por WhatsApp", abre WhatsApp con TU número
- Cuando alguien hace click en el botón flotante de WhatsApp, abre TU número

**¿Qué pasa si no la ponés?**
- ❌ Los botones de WhatsApp no funcionan
- ❌ No se puede contactar por WhatsApp

**✅ NECESITÁS ESTA VARIABLE SÍ O SÍ**

---

### 4. **ADMIN (CRÍTICO - NECESITÁS ESTO)**

```env
NEXT_PUBLIC_ADMIN_USER=admin
NEXT_PUBLIC_ADMIN_PASS=temporal123
```

**¿Para qué?**
- Para entrar al panel admin (`/admin`)
- Para agregar productos, ver ventas, gestionar cupones

**¿Qué pasa si no las ponés?**
- ❌ No podés entrar al admin
- ❌ No podés agregar productos
- ❌ No podés ver nada

**✅ NECESITÁS ESTAS VARIABLES SÍ O SÍ**

**⚠️ IMPORTANTE:** Cambiá los valores por otros seguros (no uses "admin" y "temporal123" en producción)

---

### 5. **NEXTAUTH (NO ES CRÍTICO - PUEDE ESPERAR)**

```env
NEXTAUTH_URL=https://nanomoringa.vercel.app
NEXTAUTH_SECRET=desarrollo-local-secret-medicina-natural-2025-cambiar-en-produccion
```

**¿Para qué?**
- Para autenticación de usuarios (si en el futuro querés que la gente se registre)
- Por ahora no se usa mucho, pero Next.js lo necesita

**¿Qué pasa si no las ponés?**
- ⚠️ Puede que dé warnings en los logs
- ⚠️ Pero la app funciona igual

**⚠️ NO ES CRÍTICO AHORA, PERO MEJOR PONERLAS**

---

### 6. **ENVÍOS (CRÍTICO - NECESITÁS ESTO)**

```env
NEXT_PUBLIC_SHIPPING_GBA=10000
NEXT_PUBLIC_SHIPPING_INTERIOR=35000
```

**¿Para qué?**
- Define cuánto cobrar por envío a GBA (Gran Buenos Aires)
- Define cuánto cobrar por envío al interior del país
- Se muestra en el carrito cuando alguien elige dónde quiere recibir

**¿Qué pasa si no las ponés?**
- ❌ El carrito no sabe cuánto cobrar por envío
- ❌ Los precios pueden estar mal

**✅ NECESITÁS ESTAS VARIABLES SÍ O SÍ**

---

### 7. **BOT LOCAL (NO ES CRÍTICO AHORA - PUEDE ESPERAR)**

```env
WHATSAPP_BOT_URL=http://localhost:5000
WS_URL=http://localhost:4000
```

**¿Para qué?**
- Para cuando tengas el bot de WhatsApp corriendo en tu computadora o VPS
- El chat widget se conecta al bot para capturar leads
- Por ahora el chat funciona sin el bot (solo muestra mensajes automáticos)

**¿Qué pasa si no las ponés?**
- ⚠️ El chat funciona igual (pero sin conectarse al bot real)
- ⚠️ Los leads no se capturan automáticamente

**⚠️ NO ES CRÍTICO AHORA, PODÉS PONERLAS DESPUÉS**

---

## 🎯 RESUMEN: QUÉ NECESITÁS CONFIGURAR AHORA

### ✅ **CRÍTICAS (SÍ O SÍ):**

1. **DATABASE_URL** - Para que se vean los productos
2. **NEXT_PUBLIC_WA_PHONE** - Para que funcionen los botones de WhatsApp
3. **NEXT_PUBLIC_ADMIN_USER** - Para entrar al admin
4. **NEXT_PUBLIC_ADMIN_PASS** - Para entrar al admin
5. **NEXT_PUBLIC_SHIPPING_GBA** - Para calcular envíos
6. **NEXT_PUBLIC_SHIPPING_INTERIOR** - Para calcular envíos

### ⚠️ **RECOMENDADAS (MEJOR PONERLAS):**

7. **NEXT_PUBLIC_APP_URL** - Para SEO
8. **NEXTAUTH_URL** - Para evitar warnings
9. **NEXTAUTH_SECRET** - Para evitar warnings

### ⏳ **PUEDEN ESPERAR (DESPUÉS):**

10. **WHATSAPP_BOT_URL** - Cuando tengas el bot listo
11. **WS_URL** - Cuando tengas el bot listo
12. **NEXT_PUBLIC_APP_NAME** - Para SEO (no crítico)
13. **NEXT_PUBLIC_APP_DESCRIPTION** - Para SEO (no crítico)

---

## 🚀 PLAN DE ACCIÓN SIMPLE

### **OPCIÓN 1: MÍNIMO PARA QUE FUNCIONE (5 minutos)**

Configurá solo estas 6 variables:

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
- Si no configurás las CRÍTICAS: la app no funcionará correctamente
- Si no configurás las RECOMENDADAS: la app funcionará pero puede tener warnings
- Si no configurás las que PUEDEN ESPERAR: no pasa nada, funcionará igual

### **¿Puedo configurarlas después?**
- Sí, podés configurarlas en cualquier momento
- Después de configurarlas, Vercel hace un nuevo deploy automáticamente

### **¿Cómo sé si están bien configuradas?**
- Si la app carga y se ven los productos: DATABASE_URL está bien
- Si los botones de WhatsApp funcionan: NEXT_PUBLIC_WA_PHONE está bien
- Si podés entrar al admin: NEXT_PUBLIC_ADMIN_USER y NEXT_PUBLIC_ADMIN_PASS están bien

---

## 🎯 RECOMENDACIÓN FINAL

**Configurá las 6 variables CRÍTICAS ahora:**
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
