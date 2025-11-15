# 📋 PENDIENTES FINALES - INTEGRACIÓN WHATSAPP BOT

## ✅ FRONTEND COMPLETADO

### 1. Navbar y Navegación
- ✅ Títulos visibles en desktop
- ✅ Menú collapse solo en mobile
- ✅ Logo responsive
- ✅ Búsqueda funcional

### 2. Homepage
- ✅ Hero section con logo y títulos
- ✅ Video con controles de audio
- ✅ Galería de imágenes
- ✅ Productos destacados
- ✅ Secciones de beneficios
- ✅ CTAs funcionales

### 3. Productos
- ✅ Galería con imágenes y videos
- ✅ Modal de videos e imágenes
- ✅ Reordenamiento de medios
- ✅ Crop editor para imágenes
- ✅ Variantes de productos

### 4. Chat y WhatsApp Admin
- ✅ Chat flotante conectado
- ✅ Interfaz de chat de admin (`/admin/whatsapp`)
- ✅ Página de configuración (`/admin/whatsapp-configuracion`)
- ✅ Editor de mensajes del bot
- ✅ QR code display
- ✅ SSE para tiempo real
- ✅ Sonidos de mensajes
- ✅ Visto/leído sincronizado
- ✅ Threading de respuestas
- ✅ Envío de imágenes

### 5. Otros
- ✅ Favicon personalizado
- ✅ Diseño responsive
- ✅ Carrito de compras
- ✅ Sistema de cupones

---

## ❌ BACKEND/BOT PENDIENTE

### 1. Inicializar Base de Datos ⚠️ PRIORITARIO
**Estado:** Pendiente
**Acción requerida:**
```bash
# Ejecutar desde el navegador o curl:
curl -X POST https://nanomoringa.vercel.app/api/whatsapp/init-db
```

O simplemente visitar:
```
https://nanomoringa.vercel.app/api/whatsapp/init-db
```

Esto creará las tablas necesarias:
- `whatsapp_sessions` - Estado del bot (QR, conexión)
- `chat_conversations` - Conversaciones
- `chat_messages` - Mensajes individuales
- `bot_messages` - Cadena de mensajes del bot

---

### 2. Deploy del Bot en VPS ⚠️ PRIORITARIO
**Estado:** Bot modificado pero no desplegado
**Ubicación:** `bot-nanomoringa/`
**Archivos listos:**
- ✅ `index.js` - Lógica del bot modificada
- ✅ `server.js` - API server para recibir comandos
- ✅ `db-functions.js` - Funciones de PostgreSQL
- ✅ `db-config.js` - Configuración de BD
- ✅ `Dockerfile` - Containerización
- ✅ `docker-compose.yml` - Orquestación
- ✅ `README.md` - Documentación

**Pasos para deploy:**

1. **Subir código al VPS:**
```bash
# Desde tu máquina local
scp -P 5782 -r bot-nanomoringa/ user@149.50.128.73:/path/to/bot
```

2. **Conectar al VPS:**
```bash
ssh -p 5782 user@149.50.128.73
```

3. **Instalar Docker (si no está instalado):**
```bash
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

4. **Configurar variables de entorno:**
Crear archivo `.env` en `bot-nanomoringa/`:
```env
DATABASE_URL=postgresql://user:password@host:5432/database
WEB_APP_URL=https://nanomoringa.vercel.app
PORT=7002
```

5. **Construir y ejecutar:**
```bash
cd bot-nanomoringa
docker-compose up -d
```

6. **Verificar logs:**
```bash
docker-compose logs -f
```

---

### 3. Configurar Variables de Entorno en Vercel ⚠️ PRIORITARIO
**Estado:** Pendiente
**Variables a agregar:**

En Vercel → Settings → Environment Variables:

```env
WHATSAPP_BOT_URL=http://149.50.128.73:7002
```

O si tienes un dominio:
```env
WHATSAPP_BOT_URL=https://bot.tudominio.com
```

**Nota:** `DATABASE_URL` y `POSTGRES_URL` ya deberían estar configuradas.

---

### 4. Migrar Datos de db.json (Opcional)
**Estado:** Opcional (si hay datos previos)
**Archivo:** `bot-nanomoringa/db.json`
**Script:** `scripts/migrate-db-json-to-postgres.js`

Si tienes datos previos en `db.json`:
```bash
node scripts/migrate-db-json-to-postgres.js
```

---

### 5. Testing End-to-End ⚠️ IMPORTANTE
**Estado:** Pendiente

**Checklist de testing:**

1. **Inicializar BD:**
   - ✅ Ejecutar `/api/whatsapp/init-db`
   - ✅ Verificar que las tablas se crearon

2. **Verificar conexión del bot:**
   - ✅ Bot se conecta a PostgreSQL
   - ✅ Bot carga mensajes desde BD
   - ✅ Bot guarda mensajes en BD

3. **Verificar QR code:**
   - ✅ QR aparece en `/admin/whatsapp-configuracion`
   - ✅ QR se puede escanear
   - ✅ Bot se conecta después de escanear

4. **Verificar mensajes:**
   - ✅ Mensajes recibidos se guardan en BD
   - ✅ Mensajes enviados se guardan en BD
   - ✅ Mensajes aparecen en `/admin/whatsapp`

5. **Verificar tiempo real:**
   - ✅ SSE funciona (mensajes aparecen en tiempo real)
   - ✅ Sonidos de mensajes funcionan
   - ✅ Visto/leído se sincroniza

6. **Verificar envío desde admin:**
   - ✅ Enviar mensaje desde `/admin/whatsapp`
   - ✅ Mensaje llega a WhatsApp
   - ✅ Mensaje aparece en la conversación

7. **Verificar chat flotante:**
   - ✅ Chat flotante funciona
   - ✅ Mensajes se guardan en BD
   - ✅ Mensajes aparecen en admin

8. **Verificar threading:**
   - ✅ Responder mensaje específico funciona
   - ✅ Mensaje aparece como respuesta en WhatsApp

9. **Verificar imágenes:**
   - ✅ Enviar imagen desde admin funciona
   - ✅ Imagen llega a WhatsApp
   - ✅ Imagen se guarda en BD

---

## 🎯 ORDEN DE EJECUCIÓN RECOMENDADO

### Paso 1: Inicializar BD (5 min)
```bash
# Desde el navegador
https://nanomoringa.vercel.app/api/whatsapp/init-db
```

### Paso 2: Configurar Variables en Vercel (5 min)
- Agregar `WHATSAPP_BOT_URL` en Vercel

### Paso 3: Deploy del Bot en VPS (30 min)
- Subir código
- Configurar variables de entorno
- Ejecutar Docker

### Paso 4: Testing Básico (15 min)
- Verificar conexión del bot
- Verificar QR code
- Verificar mensajes

### Paso 5: Testing Completo (30 min)
- Testing end-to-end
- Verificar todas las funcionalidades

---

## 📝 NOTAS IMPORTANTES

### Puerto del Bot
El bot debe estar accesible desde Vercel. Si el VPS tiene firewall:
```bash
# Permitir puerto 7002
sudo ufw allow 7002/tcp
```

### Base de Datos
Asegúrate de que la `DATABASE_URL` en el bot sea la misma que en Vercel (Neon PostgreSQL).

### SSL/HTTPS
Si usas HTTPS para el bot, asegúrate de tener certificado SSL válido (Let's Encrypt).

### Dominio (Opcional)
Si quieres usar un dominio en lugar de IP:
1. Configurar DNS A record apuntando a la IP del VPS
2. Configurar Nginx como reverse proxy
3. Configurar SSL con Let's Encrypt

---

## 🚀 RESUMEN

**Frontend:** ✅ 100% Completo
**Backend:** ⚠️ 80% Completo (falta deploy y testing)

**Próximos pasos:**
1. Inicializar BD
2. Deploy del bot
3. Configurar variables
4. Testing

**Tiempo estimado:** 1-2 horas

---

## 📞 SOPORTE

Si hay problemas:
1. Verificar logs del bot: `docker-compose logs -f`
2. Verificar logs de Vercel: Deployment → Functions → Logs
3. Verificar conexión a BD desde el bot
4. Verificar variables de entorno
5. Verificar firewall del VPS

---

**Última actualización:** 2025-11-14
**Estado:** Frontend completo, Backend pendiente de deploy

