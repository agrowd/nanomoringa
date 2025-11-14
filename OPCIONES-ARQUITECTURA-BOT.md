# 🤖 OPCIONES DE ARQUITECTURA: INTEGRACIÓN BOT WHATSAPP

## 📊 SITUACIÓN ACTUAL

### Bot (`bot-nanomoringa`)
- ✅ Usa `whatsapp-web.js` con `LocalAuth`
- ✅ Detecta nuevos leads automáticamente
- ✅ Envía secuencia de mensajes automáticos
- ✅ Guarda leads procesados en `db.json` (simple-json-db)
- ✅ Procesa backlog de 6 horas al iniciar
- ❌ **NO tiene API REST** para comunicarse con el frontend
- ❌ **NO guarda en PostgreSQL** (solo db.json local)

### Frontend (Vercel)
- ✅ Chat widget que captura nombre + teléfono
- ✅ Componentes de chat listos
- ❌ **NO guarda leads en DB** (hay TODO en código)
- ❌ **NO se comunica con el bot**

### Base de Datos
- ✅ PostgreSQL en Neon (ya configurada)
- ❌ **NO tiene tablas para chat/conversaciones**

---

## 🎯 OPCIONES DE ARQUITECTURA

### **OPCIÓN 1: Bot en VPS + API REST + PostgreSQL** ⭐ RECOMENDADA

```
Frontend Vercel → API Routes Vercel → API REST Bot (VPS) → PostgreSQL (Neon)
                                                              ↓
                                                    Bot WhatsApp (VPS)
```

**Cómo funciona:**
1. El bot corre en el VPS (no en tu PC)
2. El bot expone una API REST (Express) en el VPS
3. Las API Routes de Vercel hacen fetch al bot en VPS
4. Ambos (bot y frontend) usan PostgreSQL en Neon
5. El bot escucha mensajes de WhatsApp y los guarda en DB
6. El frontend puede enviar mensajes al bot vía API
7. El bot puede enviar mensajes a WhatsApp

**Implementación:**
- Agregar Express al bot para API REST
- Crear tablas en PostgreSQL: `chat_conversations`, `chat_messages`, `leads`
- El bot guarda mensajes recibidos en PostgreSQL
- API Routes en Vercel: `/api/chat/send`, `/api/chat/messages`
- El bot expone: `POST /api/bot/send`, `GET /api/bot/messages`

**Ventajas:**
- ✅ Siempre disponible (bot en VPS)
- ✅ Base de datos centralizada (PostgreSQL)
- ✅ Sincronización bidireccional
- ✅ Historial completo de conversaciones
- ✅ Escalable

**Desventajas:**
- ⚠️ Requiere mover el bot al VPS
- ⚠️ Más complejo de debuggear (necesitás SSH)

**Costo:** VPS que ya tenés

---

### **OPCIÓN 2: Bot Local + API REST + Túnel (ngrok/Cloudflare)**

```
Frontend Vercel → API Routes Vercel → ngrok/Cloudflare Tunnel → Bot Local (tu PC)
                                                                      ↓
                                                              PostgreSQL (Neon)
```

**Cómo funciona:**
1. El bot corre en tu PC local
2. El bot expone API REST (Express) en localhost:3001
3. Usás ngrok o Cloudflare Tunnel para exponerlo públicamente
4. Las API Routes de Vercel hacen fetch al túnel público
5. Ambos usan PostgreSQL en Neon

**Implementación:**
- Agregar Express al bot para API REST
- Configurar ngrok/Cloudflare Tunnel
- Crear tablas en PostgreSQL
- El bot guarda mensajes en PostgreSQL

**Ventajas:**
- ✅ Fácil de debuggear (todo local)
- ✅ No requiere mover el bot
- ✅ Ideal para desarrollo

**Desventajas:**
- ❌ Depende de que tu PC esté encendida
- ❌ ngrok free cambia URL cada vez
- ❌ No es ideal para producción

**Costo:** ngrok free (limitado) o Cloudflare Tunnel (gratis)

---

### **OPCIÓN 3: Bot en VPS + WebSocket Server + PostgreSQL**

```
Frontend Vercel → WebSocket Client → WebSocket Server (VPS) ← Bot (WebSocket Client)
                                                                      ↓
                                                              PostgreSQL (Neon)
```

**Cómo funciona:**
1. Servidor WebSocket en VPS (puente/broker)
2. El bot se conecta como cliente WebSocket al servidor
3. El frontend se conecta al mismo servidor WebSocket
4. Mensajes en tiempo real bidireccionales
5. Ambos guardan en PostgreSQL

**Implementación:**
- Servidor WebSocket en VPS (Socket.io)
- El bot se conecta como cliente
- El frontend se conecta como cliente
- Mensajes en tiempo real

**Ventajas:**
- ✅ Tiempo real (WebSocket)
- ✅ Baja latencia
- ✅ Ideal para chat en vivo

**Desventajas:**
- ⚠️ Más complejo (3 componentes)
- ⚠️ Requiere servidor WebSocket adicional

**Costo:** VPS que ya tenés

---

### **OPCIÓN 4: Híbrida (Desarrollo + Producción)**

```
DESARROLLO:
Frontend Local → Bot Local (directo) → PostgreSQL

PRODUCCIÓN:
Frontend Vercel → Bot en VPS → PostgreSQL
```

**Cómo funciona:**
- Desarrollo: todo local, fácil de testear
- Producción: bot en VPS, frontend en Vercel
- Mismo código, diferentes configuraciones

**Ventajas:**
- ✅ Mejor de ambos mundos
- ✅ Desarrollo rápido
- ✅ Producción estable

**Desventajas:**
- ⚠️ Dos configuraciones
- ⚠️ Más mantenimiento

---

## 💡 MI RECOMENDACIÓN

### **Para empezar rápido: OPCIÓN 2 (Bot Local + ngrok)**
- Implementación más rápida
- No requiere mover el bot
- Ideal para validar la integración
- Luego migrar a producción

### **Para producción: OPCIÓN 1 (Bot en VPS + API REST)**
- Más estable
- Siempre disponible
- Mejor experiencia

---

## 📋 LO QUE HAY QUE HACER (Cualquier opción)

### 1. **Crear tablas en PostgreSQL**
```sql
-- Tabla de conversaciones
CREATE TABLE chat_conversations (
  id VARCHAR PRIMARY KEY,
  phone VARCHAR NOT NULL,
  name VARCHAR,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mensajes
CREATE TABLE chat_messages (
  id VARCHAR PRIMARY KEY,
  conversation_id VARCHAR REFERENCES chat_conversations(id),
  message_text TEXT NOT NULL,
  sender VARCHAR NOT NULL, -- 'user' o 'bot'
  from_whatsapp BOOLEAN DEFAULT false, -- true si viene de WhatsApp
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de leads
CREATE TABLE leads (
  id VARCHAR PRIMARY KEY,
  phone VARCHAR NOT NULL,
  name VARCHAR,
  source VARCHAR DEFAULT 'web', -- 'web' o 'whatsapp'
  status VARCHAR DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_contact_at TIMESTAMP
);
```

### 2. **Modificar el bot**
- Agregar Express para API REST
- Conectar a PostgreSQL (en lugar de db.json)
- Guardar mensajes recibidos en DB
- Exponer endpoints: `/api/bot/send`, `/api/bot/messages`, `/api/bot/status`

### 3. **Crear API Routes en Vercel**
- `/api/chat/send` - Enviar mensaje desde frontend
- `/api/chat/messages` - Obtener mensajes de una conversación
- `/api/chat/conversations` - Listar conversaciones
- `/api/chat/leads` - Listar leads

### 4. **Modificar chat widget**
- Guardar lead en PostgreSQL cuando se completa el formulario
- Enviar mensajes al bot vía API
- Recibir mensajes del bot (polling o WebSocket)

### 5. **Crear CRM Admin**
- Vista de conversaciones
- Chat en tiempo real
- Responder desde web
- Ver leads

---

## ❓ PREGUNTAS PARA DECIDIR

1. **¿Querés que el bot corra en el VPS o en tu PC?**
   - VPS = siempre disponible, más estable
   - PC = más fácil de debuggear, pero depende de que esté encendida

2. **¿Necesitás tiempo real o polling está bien?**
   - Tiempo real = WebSocket (más complejo)
   - Polling = más simple, pero con delay

3. **¿Querés empezar rápido o directo a producción?**
   - Rápido = Bot local + ngrok
   - Producción = Bot en VPS

---

## 🚀 PRÓXIMOS PASOS

Una vez que decidas la opción, te ayudo a:
1. Crear las tablas en PostgreSQL
2. Modificar el bot para agregar API REST
3. Crear las API Routes en Vercel
4. Conectar el chat widget con el bot
5. Crear el CRM admin

**¿Cuál opción preferís?** 🤔

