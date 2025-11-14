# 📱 PLAN DE IMPLEMENTACIÓN: SISTEMA WHATSAPP COMPLETO

## 🎯 FUNCIONALIDADES REQUERIDAS

### 1. **Flujo de Leads Automático**
- Usuario completa formulario en chat widget (nombre + teléfono)
- **Automáticamente** el bot envía la secuencia de mensajes predeterminados
- Todo se guarda en PostgreSQL

### 2. **Dashboard de WhatsApp (`/admin/whatsapp`)**
Dos secciones principales:

#### **A. QR Code Scanner**
- Muestra el QR del bot en tiempo real
- Estado: "Conectado" (verde) o "Desconectado" (rojo)
- Botón "Cerrar Sesión" para desconectar y volver a escanear
- El QR se actualiza automáticamente cuando el bot lo genera

#### **B. Chats/Conversaciones (Simil WhatsApp)**
- Lista de todos los chats (como WhatsApp)
- Click en un chat → Abre conversación
- Puede responder desde ahí
- Los mensajes se envían a través del bot
- Todo se guarda en PostgreSQL
- Interfaz tipo WhatsApp

---

## 🏗️ ARQUITECTURA

```
┌─────────────────┐
│  Frontend Vercel│
│  /admin/whatsapp│
└────────┬────────┘
         │
         │ HTTP/WebSocket
         │
┌────────▼─────────────────┐
│  Bot en VPS               │
│  - whatsapp-web.js       │
│  - Express API REST      │
│  - WebSocket Server      │
└────────┬──────────────────┘
         │
         │ Guarda/lee
         │
┌────────▼────────┐
│  PostgreSQL     │
│  (Neon)         │
└─────────────────┘
```

---

## 📋 PASOS DE IMPLEMENTACIÓN

### **FASE 1: Base de Datos**

#### 1.1 Crear tablas en PostgreSQL

```sql
-- Tabla de conversaciones/chats
CREATE TABLE whatsapp_conversations (
  id VARCHAR PRIMARY KEY,
  phone VARCHAR NOT NULL UNIQUE,
  name VARCHAR,
  last_message_text TEXT,
  last_message_at TIMESTAMP,
  unread_count INTEGER DEFAULT 0,
  status VARCHAR DEFAULT 'active', -- 'active', 'archived', 'blocked'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mensajes
CREATE TABLE whatsapp_messages (
  id VARCHAR PRIMARY KEY,
  conversation_id VARCHAR NOT NULL REFERENCES whatsapp_conversations(id),
  message_text TEXT NOT NULL,
  sender VARCHAR NOT NULL, -- 'user' o 'admin'
  from_whatsapp BOOLEAN DEFAULT false, -- true si viene de WhatsApp real
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  message_type VARCHAR DEFAULT 'text', -- 'text', 'image', 'audio', etc.
  media_url TEXT
);

-- Tabla de leads
CREATE TABLE whatsapp_leads (
  id VARCHAR PRIMARY KEY,
  phone VARCHAR NOT NULL,
  name VARCHAR,
  source VARCHAR DEFAULT 'web', -- 'web' o 'whatsapp'
  status VARCHAR DEFAULT 'new', -- 'new', 'contacted', 'converted'
  auto_messages_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_contact_at TIMESTAMP
);

-- Tabla de estado del bot
CREATE TABLE whatsapp_bot_status (
  id VARCHAR PRIMARY KEY DEFAULT 'bot-status',
  is_connected BOOLEAN DEFAULT false,
  qr_code TEXT,
  last_qr_update TIMESTAMP,
  phone_number VARCHAR,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### **FASE 2: Modificar el Bot**

#### 2.1 Agregar dependencias al bot

```json
{
  "dependencies": {
    "whatsapp-web.js": "^1.33.2",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "socket.io": "^4.7.2",
    "@vercel/postgres": "^0.5.1",
    "dotenv": "^16.3.1"
  }
}
```

#### 2.2 Estructura del bot modificado

```
bot-nanomoringa/
├── index.js (modificado)
├── server.js (NUEVO - Express + Socket.io)
├── bot-handler.js (NUEVO - Lógica del bot)
├── db-handler.js (NUEVO - PostgreSQL)
└── package.json
```

#### 2.3 Funcionalidades del bot

**`server.js`** - API REST + WebSocket:
- `GET /api/bot/status` - Estado del bot (conectado/desconectado)
- `GET /api/bot/qr` - Obtener QR code actual
- `POST /api/bot/logout` - Cerrar sesión
- `GET /api/conversations` - Listar conversaciones
- `GET /api/conversations/:phone/messages` - Mensajes de un chat
- `POST /api/conversations/:phone/send` - Enviar mensaje
- `POST /api/leads` - Crear nuevo lead (desde frontend)
- WebSocket: `bot-status`, `new-message`, `qr-update`

**`bot-handler.js`** - Lógica del bot:
- Detectar nuevos mensajes
- Enviar secuencia automática cuando se crea un lead
- Guardar mensajes en PostgreSQL
- Emitir eventos WebSocket

**`db-handler.js`** - PostgreSQL:
- Guardar mensajes
- Guardar conversaciones
- Guardar leads
- Actualizar estado del bot

---

### **FASE 3: API Routes en Vercel**

#### 3.1 Crear `/app/api/whatsapp/` routes

**`/app/api/whatsapp/status/route.ts`**
```typescript
// GET - Obtener estado del bot
export async function GET() {
  // Hacer fetch al bot en VPS
  const response = await fetch(`${process.env.BOT_API_URL}/api/bot/status`)
  return response.json()
}
```

**`/app/api/whatsapp/qr/route.ts`**
```typescript
// GET - Obtener QR code
export async function GET() {
  const response = await fetch(`${process.env.BOT_API_URL}/api/bot/qr`)
  return response.json()
}
```

**`/app/api/whatsapp/logout/route.ts`**
```typescript
// POST - Cerrar sesión
export async function POST() {
  const response = await fetch(`${process.env.BOT_API_URL}/api/bot/logout`, {
    method: 'POST'
  })
  return response.json()
}
```

**`/app/api/whatsapp/conversations/route.ts`**
```typescript
// GET - Listar conversaciones
// POST - Crear conversación (cuando se crea un lead)
```

**`/app/api/whatsapp/conversations/[phone]/messages/route.ts`**
```typescript
// GET - Obtener mensajes de un chat
// POST - Enviar mensaje
```

**`/app/api/whatsapp/leads/route.ts`**
```typescript
// POST - Crear nuevo lead (desde chat widget)
// Esto dispara el envío automático de mensajes
```

---

### **FASE 4: Modificar Chat Widget**

#### 4.1 Actualizar `components/chat-form.tsx`

Cuando se completa el formulario:
1. Guardar lead en PostgreSQL
2. Enviar a `/api/whatsapp/leads` (esto dispara el bot)
3. El bot automáticamente envía la secuencia

---

### **FASE 5: Dashboard de WhatsApp**

#### 5.1 Crear `/app/admin/whatsapp/page.tsx`

**Estructura:**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Sección 1: QR Code */}
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Estado del Bot</CardTitle>
        <StatusBadge isConnected={isConnected} />
      </div>
    </CardHeader>
    <CardContent>
      {!isConnected && <QRCodeDisplay qrCode={qrCode} />}
      <Button onClick={handleLogout}>Cerrar Sesión</Button>
    </CardContent>
  </Card>

  {/* Sección 2: Chats */}
  <Card>
    <CardHeader>
      <CardTitle>Conversaciones</CardTitle>
    </CardHeader>
    <CardContent>
      <ConversationsList />
    </CardContent>
  </Card>
</div>
```

#### 5.2 Componentes necesarios

**`components/admin/whatsapp-status.tsx`**
- Muestra estado conectado/desconectado
- Badge verde/rojo

**`components/admin/whatsapp-qr.tsx`**
- Muestra QR code
- Se actualiza automáticamente vía WebSocket

**`components/admin/whatsapp-conversations.tsx`**
- Lista de chats (como WhatsApp)
- Click → Abre conversación

**`components/admin/whatsapp-chat-window.tsx`**
- Ventana de chat (simil WhatsApp)
- Enviar mensajes
- Ver historial

---

### **FASE 6: WebSocket para Tiempo Real**

#### 6.1 Frontend se conecta a WebSocket del bot

```typescript
// En el dashboard
const socket = io(process.env.NEXT_PUBLIC_BOT_WS_URL)

socket.on('bot-status', (status) => {
  setIsConnected(status.isConnected)
})

socket.on('qr-update', (qr) => {
  setQrCode(qr)
})

socket.on('new-message', (message) => {
  // Actualizar conversación
})
```

---

## 🔧 CONFIGURACIÓN

### Variables de Entorno

**Vercel:**
```env
BOT_API_URL=https://tu-vps.com:3001
BOT_WS_URL=https://tu-vps.com:3001
POSTGRES_URL=tu-neon-url
```

**Bot (VPS):**
```env
POSTGRES_URL=tu-neon-url
PORT=3001
```

---

## 📝 FLUJO COMPLETO

### 1. Usuario completa formulario
```
Usuario → Chat Widget → /api/whatsapp/leads → Bot VPS → Envía mensajes automáticos
```

### 2. Admin ve conversaciones
```
Admin → /admin/whatsapp → Lista de chats → Click chat → Ver/Responder
```

### 3. Admin responde
```
Admin → Escribe mensaje → /api/whatsapp/conversations/[phone]/send → Bot VPS → WhatsApp
```

### 4. Usuario responde en WhatsApp
```
WhatsApp → Bot VPS → Guarda en PostgreSQL → WebSocket → Frontend actualiza
```

---

## 🚀 ORDEN DE IMPLEMENTACIÓN

1. ✅ Crear tablas en PostgreSQL
2. ✅ Modificar bot: agregar Express + Socket.io
3. ✅ Crear API Routes en Vercel
4. ✅ Modificar chat widget para crear leads
5. ✅ Crear dashboard `/admin/whatsapp`
6. ✅ Conectar WebSocket para tiempo real
7. ✅ Testing completo

---

## ❓ PREGUNTAS

1. **¿El bot va a correr en el VPS que ya tenés?**
2. **¿Qué puerto querés usar para la API del bot?** (sugerencia: 3001)
3. **¿Querés que el QR se actualice automáticamente o con botón?** (sugerencia: automático vía WebSocket)

---

**¿Empezamos con la Fase 1 (Base de Datos)?** 🚀

