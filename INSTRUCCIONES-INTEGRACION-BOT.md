# 🤖 INSTRUCCIONES PARA INTEGRAR EL BOT DE WHATSAPP

## 📋 RESUMEN

Este documento explica cómo modificar el bot (`bot-nanomoringa`) para que se conecte con la aplicación web y use PostgreSQL en lugar de `db.json`.

---

## 🎯 OBJETIVOS

1. ✅ Reemplazar `simple-json-db` por PostgreSQL
2. ✅ Leer cadena de mensajes desde la base de datos
3. ✅ Guardar todos los mensajes en PostgreSQL
4. ✅ Notificar a la web app cuando hay mensajes nuevos
5. ✅ Escuchar comandos desde la web app para enviar mensajes

---

## 📦 PASO 1: Instalar Dependencias en el Bot

En la carpeta `bot-nanomoringa`, instalar:

```bash
cd bot-nanomoringa
npm install pg axios
```

O si usas `pnpm`:
```bash
pnpm add pg axios
```

---

## 🔧 PASO 2: Crear Archivo de Configuración de BD

Crear `bot-nanomoringa/db-config.js`:

```javascript
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

module.exports = pool
```

---

## 📝 PASO 3: Crear Funciones de Base de Datos

Crear `bot-nanomoringa/db-functions.js`:

```javascript
const pool = require('./db-config')

// Verificar si un número ya fue procesado
async function isPhoneProcessed(phone) {
  try {
    const result = await pool.query(
      'SELECT id FROM whatsapp_conversations WHERE phone = $1',
      [phone]
    )
    return result.rows.length > 0
  } catch (error) {
    console.error('Error checking phone:', error)
    return false
  }
}

// Crear o actualizar conversación
async function createOrUpdateConversation(phone, name) {
  try {
    const result = await pool.query(
      `INSERT INTO whatsapp_conversations (phone, name, status, updated_at, last_message_at)
       VALUES ($1, $2, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (phone) 
       DO UPDATE SET 
         name = EXCLUDED.name,
         updated_at = CURRENT_TIMESTAMP,
         last_message_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [phone, name]
    )
    return result.rows[0]
  } catch (error) {
    console.error('Error creating conversation:', error)
    throw error
  }
}

// Guardar mensaje
async function saveMessage(data) {
  try {
    const result = await pool.query(
      `INSERT INTO whatsapp_messages (
        conversation_id, sender_type, sender_name,
        message_type, message, media_url,
        whatsapp_message_id, whatsapp_status, read
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        data.conversation_id,
        data.sender_type,
        data.sender_name,
        data.message_type || 'text',
        data.message,
        data.media_url || null,
        data.whatsapp_message_id || null,
        data.whatsapp_status || null,
        data.read || false
      ]
    )
    return result.rows[0]
  } catch (error) {
    console.error('Error saving message:', error)
    throw error
  }
}

// Obtener cadena de mensajes del bot
async function getBotMessages() {
  try {
    const result = await pool.query(
      'SELECT * FROM whatsapp_bot_messages WHERE is_active = true ORDER BY "order" ASC'
    )
    return result.rows
  } catch (error) {
    console.error('Error getting bot messages:', error)
    return []
  }
}

// Notificar a la web app
async function notifyWebApp(event, data) {
  const webAppUrl = process.env.WEB_APP_URL || 'https://nanomoringa.vercel.app'
  
  try {
    await fetch(`${webAppUrl}/api/whatsapp/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data })
    })
  } catch (error) {
    console.error('Error notifying web app:', error)
  }
}

// Actualizar estado de sesión
async function updateSession(status, qrCode, phoneNumber) {
  try {
    await pool.query(
      `INSERT INTO whatsapp_sessions (session_name, status, qr_code, phone_number, last_connected_at)
       VALUES ('client-cbd-new', $1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (session_name)
       DO UPDATE SET
         status = EXCLUDED.status,
         qr_code = EXCLUDED.qr_code,
         phone_number = EXCLUDED.phone_number,
         last_connected_at = CURRENT_TIMESTAMP`,
      [status, qrCode, phoneNumber]
    )
  } catch (error) {
    console.error('Error updating session:', error)
  }
}

module.exports = {
  isPhoneProcessed,
  createOrUpdateConversation,
  saveMessage,
  getBotMessages,
  notifyWebApp,
  updateSession
}
```

---

## 🔄 PASO 4: Modificar `index.js` del Bot

### 4.1 Reemplazar imports

**ANTES:**
```javascript
const JSONdb = require('simple-json-db');
const path = require('path');
const dbPath = path.join(__dirname, 'db.json');
const db = new JSONdb(dbPath);
```

**DESPUÉS:**
```javascript
const dbFunctions = require('./db-functions');
```

### 4.2 Modificar función `crearSecuenciaMensajes`

**ANTES:**
```javascript
function crearSecuenciaMensajes() {
  mensajesParaLeads = [
    { tipo: 'texto', contenido: 'Hola buenas...' },
    // ...
  ];
}
```

**DESPUÉS:**
```javascript
async function crearSecuenciaMensajes() {
  try {
    const messages = await dbFunctions.getBotMessages();
    mensajesParaLeads = messages.map(msg => ({
      tipo: msg.type === 'image' ? 'media' : 'texto',
      contenido: msg.content
    }));
    logWithTime('✅ Secuencia de mensajes cargada desde BD');
  } catch (error) {
    logWithTime(`❌ Error cargando mensajes: ${error.message}`);
    // Fallback a mensajes por defecto
    mensajesParaLeads = [
      { tipo: 'texto', contenido: 'Hola buenas. Ahí te paso información 👇' },
      // ... resto de mensajes por defecto
    ];
  }
}
```

### 4.3 Modificar función `enviarCadena`

**AGREGAR al inicio:**
```javascript
// Verificar si ya está procesado usando PostgreSQL
const yaProcesado = await dbFunctions.isPhoneProcessed(numero);
if (yaProcesado) {
  logWithTime(`🚫 ${formatearNumero(numero)} ya fue procesado anteriormente`);
  return;
}
```

**AGREGAR después de obtener contacto:**
```javascript
// Crear/actualizar conversación en BD
const conversation = await dbFunctions.createOrUpdateConversation(
  numero,
  nombre
);
```

**AGREGAR después de enviar cada mensaje:**
```javascript
// Guardar mensaje en BD
await dbFunctions.saveMessage({
  conversation_id: conversation.id,
  sender_type: 'bot',
  sender_name: 'Bot',
  message_type: item.tipo === 'media' ? 'image' : 'text',
  message: item.contenido,
  whatsapp_message_id: null, // Se puede obtener del mensaje enviado
  read: true
});
```

**AGREGAR al final (después de enviar toda la cadena):**
```javascript
// Notificar a la web app
await dbFunctions.notifyWebApp('message_sent', {
  phone: numero,
  name: nombre,
  message: 'Cadena de mensajes enviada',
  message_count: mensajesParaLeads.length
});
```

### 4.4 Modificar función `procesarMensaje`

**REEMPLAZAR:**
```javascript
if (db.has(chatId)) {
  // ...
  return;
}
```

**POR:**
```javascript
const yaProcesado = await dbFunctions.isPhoneProcessed(chatId);
if (yaProcesado) {
  logWithTime(`❌ FILTRO: ${nombreContacto} (${numeroFormateado}) - Ya está en base de datos`);
  return;
}
```

**AGREGAR después de detectar nuevo lead:**
```javascript
// Crear conversación
const conversation = await dbFunctions.createOrUpdateConversation(
  chatId,
  nombreContacto
);

// Guardar mensaje del usuario
await dbFunctions.saveMessage({
  conversation_id: conversation.id,
  sender_type: 'user',
  sender_name: nombreContacto,
  message_type: msg.hasMedia ? 'image' : 'text',
  message: msg.body || '',
  media_url: msg.hasMedia ? await msg.downloadMedia() : null,
  whatsapp_message_id: msg.id._serialized,
  read: false
});

// Notificar a la web app
await dbFunctions.notifyWebApp('message_received', {
  phone: chatId,
  name: nombreContacto,
  message: msg.body,
  message_type: msg.hasMedia ? 'image' : 'text'
});
```

### 4.5 Modificar eventos del cliente

**AGREGAR en `client.on('qr')`:**
```javascript
client.on('qr', async qr => {
  logWithTime('📱 Escanea el código QR con tu WhatsApp:');
  qrcode.generate(qr, { small: true });
  
  // Actualizar BD y notificar web app
  await dbFunctions.updateSession('connecting', qr, null);
  await dbFunctions.notifyWebApp('status_update', {
    status: 'connecting',
    qr_code: qr
  });
});
```

**AGREGAR en `client.on('ready')`:**
```javascript
client.on('ready', async () => {
  // ... código existente ...
  
  // Obtener número de teléfono
  const info = await client.info;
  const phoneNumber = info.wid.user;
  
  // Actualizar BD
  await dbFunctions.updateSession('connected', null, phoneNumber);
  await dbFunctions.notifyWebApp('status_update', {
    status: 'connected',
    phone_number: phoneNumber,
    connected_at: new Date().toISOString()
  });
});
```

**AGREGAR nuevo listener para mensajes del admin:**
```javascript
client.on('message_create', async (msg) => {
  // Detectar si el mensaje es nuestro (del admin)
  if (msg.fromMe) {
    const phone = msg.to;
    const conversation = await dbFunctions.createOrUpdateConversation(phone, 'Usuario');
    
    await dbFunctions.saveMessage({
      conversation_id: conversation.id,
      sender_type: 'admin',
      message_type: msg.hasMedia ? 'image' : 'text',
      message: msg.body || '',
      whatsapp_message_id: msg.id._serialized,
      read: true
    });
    
    await dbFunctions.notifyWebApp('message_sent', {
      phone,
      message: msg.body,
      message_type: msg.hasMedia ? 'image' : 'text'
    });
  }
});
```

---

## 🌐 PASO 5: Crear API Endpoint en el Bot para Recibir Comandos

Crear `bot-nanomoringa/server.js`:

```javascript
const express = require('express');
const app = express();
app.use(express.json());

// Endpoint para que la web app envíe mensajes
app.post('/api/send', async (req, res) => {
  try {
    const { phone, message, message_type, media_url } = req.body;
    
    if (!phone || !message) {
      return res.status(400).json({ error: 'phone and message required' });
    }
    
    // Enviar mensaje usando whatsapp-web.js
    const client = require('./index').getClient(); // Necesitarás exportar el client
    
    if (message_type === 'image' && media_url) {
      const { MessageMedia } = require('whatsapp-web.js');
      const media = await MessageMedia.fromUrl(media_url);
      await client.sendMessage(phone, media);
    } else {
      await client.sendMessage(phone, message);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Bot API server running on port ${PORT}`);
});
```

---

## 🔐 PASO 6: Variables de Entorno

Crear `.env` en `bot-nanomoringa`:

```env
DATABASE_URL=postgresql://user:password@ep-XXX.region.neon.tech/neondb?sslmode=require
WEB_APP_URL=https://nanomoringa.vercel.app
PORT=5000
```

---

## 🐳 PASO 7: Dockerfile para el Bot

Crear `bot-nanomoringa/Dockerfile`:

```dockerfile
FROM node:18-slim

# Instalar dependencias del sistema para Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

---

## 🚀 PASO 8: Deploy en VPS con Docker

1. **Subir código al VPS:**
```bash
scp -r bot-nanomoringa user@tu-vps:/opt/
```

2. **En el VPS, crear `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  whatsapp-bot:
    build: ./bot-nanomoringa
    container_name: whatsapp-bot
    restart: unless-stopped
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - WEB_APP_URL=${WEB_APP_URL}
      - PORT=5000
    volumes:
      - ./bot-nanomoringa/.wwebjs_auth:/app/.wwebjs_auth
      - ./bot-nanomoringa/.wwebjs_cache:/app/.wwebjs_cache
      - ./bot-nanomoringa/chrome-profile:/app/chrome-profile
    networks:
      - bot-network
```

3. **Ejecutar:**
```bash
docker-compose up -d
```

---

## ✅ CHECKLIST

- [ ] Instalar dependencias (`pg`, `axios`)
- [ ] Crear `db-config.js`
- [ ] Crear `db-functions.js`
- [ ] Modificar `index.js` para usar PostgreSQL
- [ ] Crear `server.js` para API
- [ ] Configurar variables de entorno
- [ ] Crear Dockerfile
- [ ] Deploy en VPS
- [ ] Probar conexión con BD
- [ ] Probar envío de mensajes
- [ ] Verificar sincronización con web app

---

## 🧪 TESTING

1. **Probar conexión a BD:**
```bash
node -e "require('./db-config').query('SELECT NOW()').then(r => console.log(r.rows))"
```

2. **Probar carga de mensajes:**
```bash
node -e "require('./db-functions').getBotMessages().then(msgs => console.log(msgs))"
```

3. **Probar envío desde web app:**
```bash
curl -X POST http://localhost:5000/api/send \
  -H "Content-Type: application/json" \
  -d '{"phone":"5491158082486","message":"Test"}'
```

---

## 📞 SOPORTE

Si hay problemas:
1. Verificar logs del bot: `docker logs whatsapp-bot`
2. Verificar conexión a BD
3. Verificar variables de entorno
4. Verificar que las tablas existan en PostgreSQL

