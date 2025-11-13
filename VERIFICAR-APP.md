# ✅ VERIFICAR QUE LA APP FUNCIONE

## 🎯 CHECKLIST DE VERIFICACIÓN

### 1. **VERIFICAR QUE LA APP CARGUE**

Abrir en el navegador:
- https://nanomoringa.vercel.app

**Verificar:**
- [ ] La página carga correctamente
- [ ] Se ve el hero con "Medicina Natural"
- [ ] Se ven productos (o mensaje de "no hay productos")
- [ ] El header y footer se ven bien

---

### 2. **VERIFICAR BOTONES DE WHATSAPP**

**Verificar:**
- [ ] Botón flotante de WhatsApp (abajo derecha) funciona
- [ ] Al hacer click, abre WhatsApp con el número correcto
- [ ] El mensaje prellenado es correcto

---

### 3. **VERIFICAR CHAT WIDGET**

**Verificar:**
- [ ] Botón de chat (arriba del WhatsApp) funciona
- [ ] Al hacer click, se abre el chat
- [ ] El formulario (nombre + teléfono) funciona
- [ ] El bot responde automáticamente

---

### 4. **VERIFICAR CARRITO**

**Verificar:**
- [ ] Se pueden agregar productos al carrito
- [ ] El drawer de carrito se abre correctamente
- [ ] Se muestran los totales correctamente
- [ ] Los envíos se calculan correctamente (GBA: $10.000, Interior: $35.000)
- [ ] El botón "Consultar por WhatsApp" funciona

---

### 5. **VERIFICAR ADMIN PANEL**

Abrir en el navegador:
- https://nanomoringa.vercel.app/admin

**Verificar:**
- [ ] Se muestra la pantalla de login
- [ ] Login con usuario: `admin` y contraseña: `nanomoringa2025`
- [ ] Se entra al dashboard correctamente
- [ ] Se pueden ver las secciones (productos, cupones, stock, etc.)

---

### 6. **VERIFICAR APIs**

Abrir en el navegador:

- https://nanomoringa.vercel.app/api/health
  - Debe responder: `{"status":"ok"}` o similar

- https://nanomoringa.vercel.app/api/products
  - Debe responder con una lista de productos (puede estar vacía)

- https://nanomoringa.vercel.app/api/coupons
  - Debe responder con una lista de cupones (puede estar vacía)

---

### 7. **INICIALIZAR BASE DE DATOS**

Si las APIs no funcionan o no hay productos, inicializar la base de datos:

Abrir en el navegador (en este orden):

1. https://nanomoringa.vercel.app/api/init-db
   - Debe responder: `{"success":true}` o similar

2. https://nanomoringa.vercel.app/api/init-coupons
   - Debe responder: `{"success":true}` o similar

3. https://nanomoringa.vercel.app/api/init-cart-sessions
   - Debe responder: `{"success":true}` o similar

**Después de inicializar, verificar nuevamente:**
- [ ] La API de productos responde correctamente
- [ ] La API de cupones responde correctamente

---

## 🚨 PROBLEMAS COMUNES

### **La app no carga**
- Verificar que el deploy esté completo en Vercel
- Verificar los logs en Vercel Dashboard → Deployments → [último deploy] → Functions

### **Los botones de WhatsApp no funcionan**
- Verificar que `NEXT_PUBLIC_WA_PHONE` esté configurada correctamente
- Verificar que el valor sea `5491140895557` (sin espacios ni símbolos)

### **No se puede entrar al admin**
- Verificar que `NEXT_PUBLIC_ADMIN_USER` sea `admin`
- Verificar que `NEXT_PUBLIC_ADMIN_PASS` sea `nanomoringa2025`
- Limpiar el localStorage del navegador (F12 → Application → Local Storage → Clear)

### **Las APIs no funcionan**
- Verificar que `DATABASE_URL` y `POSTGRES_URL` estén configuradas
- Verificar que los connection strings sean correctos
- Inicializar la base de datos (paso 7)

### **No se ven productos**
- Verificar que la base de datos esté inicializada
- Verificar que haya productos en la base de datos
- Si no hay productos, agregarlos desde el admin panel

---

## ✅ TODO LISTO

Si todo funciona correctamente:
- ✅ La app está desplegada y funcionando
- ✅ Las variables de entorno están configuradas
- ✅ La base de datos está conectada
- ✅ Todo está listo para usar

---

**🌿 ¡VERIFICÁ TODO Y DECIME SI HAY ALGÚN PROBLEMA!**
