# 🌿 PROPUESTA: MIGRACIÓN A MEDICINA NATURAL CBD

## 📋 ÍNDICE
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Análisis del Proyecto Actual](#análisis-del-proyecto-actual)
3. [Sistema de Chat y WhatsApp Bot](#sistema-de-chat-y-whatsapp-bot)
4. [Arquitectura Propuesta](#arquitectura-propuesta)
5. [Cambios en la Landing](#cambios-en-la-landing)
6. [Sistema CRM Integrado](#sistema-crm-integrado)
7. [Infraestructura VPS + Docker](#infraestructura-vps-docker)
8. [Roadmap de Implementación](#roadmap-de-implementación)
9. [Consideraciones Técnicas](#consideraciones-técnicas)

---

## 🎯 RESUMEN EJECUTIVO

### Objetivo
Transformar el e-commerce de DripCore en una landing de venta para productos CBD de "Medicina Natural", con sistema de chat integrado, bot de WhatsApp y CRM para gestión de leads.

### Desafíos Principales
1. **Contacto dual**: Responder desde web admin y WhatsApp físico
2. **Meta Ads**: Evitar mucho texto para no ser detectado
3. **Lead management**: Capturar nombre + teléfono efectivamente
4. **Deploy**: VPS con Debian + Docker

### Solución Propuesta
Sistema híbrido con chat web + bot WhatsApp + CRM unificado que sincroniza conversaciones en tiempo real.

---

## 🔍 ANÁLISIS DEL PROYECTO ACTUAL

### Ventajas del Sistema Base
✅ **Arquitectura sólida**: Next.js 15 + PostgreSQL
✅ **UI moderna**: Fácil de adaptar
✅ **Admin funcional**: Base para CRM
✅ **Sistema de productos**: Reutilizable para CBD
✅ **Responsive**: Funciona en mobile/desktop

### Cambios Necesarios
❌ Remover branding de DripCore
❌ Adaptar catálogo para productos CBD
❌ Agregar sistema de chat
❌ Integrar bot de WhatsApp
❌ Crear CRM para gestión de conversaciones
❌ Optimizar landing para Meta Ads (menos texto)
❌ Agregar soporte para videos
❌ Adaptar checkout para productos CBD

---

## 💬 SISTEMA DE CHAT Y WHATSAPP BOT

### Arquitectura del Chat

#### Opción 1: Sistema Dual Unificado (RECOMENDADA)
```
Usuario Web → Chat Widget → Backend API → Base de Datos
                                ↓
                          WhatsApp Bot (whatsapp-web.js)
                                ↓
                          WhatsApp Ventas (QR)
                                ↓
                          Respuestas sincronizadas ← Admin Web CRM
```

**Ventajas:**
- Conversaciones centralizadas en DB
- Respuesta desde web o WhatsApp
- Sincronización en tiempo real
- Historial completo
- Sin duplicación de mensajes

**Funcionamiento:**
1. Usuario ingresa nombre + teléfono en chat web
2. Se crea lead en DB
3. Bot de WhatsApp envía mensaje inicial al número
4. Admin puede responder desde:
   - CRM web (se envía via bot)
   - WhatsApp físico (se sincroniza a DB)
5. Usuario responde desde WhatsApp
6. Mensaje se muestra en CRM web

#### Opción 2: Sistema Separado con Webhook
```
Chat Web → API → DB → Notificación WhatsApp
WhatsApp físico → Webhook → API → DB → CRM Web
```

**Ventajas:**
- Más simple de implementar
- Menos acoplamiento
- Fácil debugging

**Desventajas:**
- Conversaciones pueden desincronizarse
- Requiere webhook público

### Stack Técnico para Chat

#### Frontend (Chat Widget)
```typescript
// Componentes necesarios
- ChatWidget.tsx          // Widget flotante
- ChatWindow.tsx          // Ventana de chat
- ChatForm.tsx            // Formulario nombre + teléfono
- ChatMessages.tsx        // Lista de mensajes
- ChatInput.tsx           // Input de mensajes
```

**Tecnologías:**
- React + TypeScript
- Socket.io-client (tiempo real)
- Zustand (estado del chat)
- Tailwind CSS (estilos)

#### Backend (WhatsApp Bot)
```javascript
// whatsapp-web.js + Express
- bot-server.js           // Servidor principal
- whatsapp-client.js      // Cliente de WhatsApp
- message-handler.js      // Manejador de mensajes
- webhook-handler.js      // Webhook entrante
- socket-server.js        // Socket.io server
```

**Dependencias:**
```json
{
  "whatsapp-web.js": "^1.23.0",
  "express": "^4.18.2",
  "socket.io": "^4.6.1",
  "qrcode-terminal": "^0.12.0",
  "pg": "^8.11.0"
}
```

### Base de Datos - Nuevas Tablas

#### Tabla: `chat_conversations`
```sql
CREATE TABLE chat_conversations (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  assigned_to INT REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP,
  tags TEXT[]
);
```

#### Tabla: `chat_messages`
```sql
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INT REFERENCES chat_conversations(id),
  sender_type VARCHAR(20) NOT NULL, -- 'user', 'admin', 'bot'
  sender_id INT,
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'video', 'audio'
  media_url TEXT,
  read BOOLEAN DEFAULT false,
  whatsapp_message_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabla: `whatsapp_sessions`
```sql
CREATE TABLE whatsapp_sessions (
  id SERIAL PRIMARY KEY,
  session_name VARCHAR(100) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  qr_code TEXT,
  status VARCHAR(50) DEFAULT 'disconnected',
  last_connected_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints Necesarios

#### Chat Web API
```typescript
POST   /api/chat/start              // Iniciar conversación
POST   /api/chat/send                // Enviar mensaje
GET    /api/chat/messages/:phone    // Obtener mensajes
GET    /api/chat/conversations       // Listar conversaciones (admin)
PATCH  /api/chat/mark-read/:id      // Marcar como leído
```

#### WhatsApp Bot API
```typescript
POST   /api/whatsapp/webhook         // Webhook de mensajes entrantes
GET    /api/whatsapp/qr              // Obtener QR code
GET    /api/whatsapp/status          // Estado de conexión
POST   /api/whatsapp/send            // Enviar mensaje (desde admin)
POST   /api/whatsapp/restart         // Reiniciar bot
```

---

## 🏗️ ARQUITECTURA PROPUESTA

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Landing    │  │  Chat Widget │  │  Admin CRM   │     │
│  │   (Pública)  │  │  (Flotante)  │  │  (Privada)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    API ROUTES (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Products    │  │     Chat     │  │   WhatsApp   │     │
│  │     API      │  │     API      │  │   Webhook    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   WEBSOCKET SERVER                           │
│                    (Socket.io)                               │
│              Real-time sync de mensajes                      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Products   │  │    Chats     │  │   Messages   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              WHATSAPP BOT SERVICE (Node.js)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │whatsapp-web  │  │   Message    │  │   Session    │     │
│  │     .js      │  │   Handler    │  │   Manager    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  WHATSAPP (Teléfono físico)                  │
│                    Escaneo de QR Code                        │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Conversación

#### Flujo 1: Usuario inicia conversación desde web
```
1. Usuario hace clic en chat widget
2. Formulario pide nombre + teléfono
3. Se crea conversación en DB
4. Bot envía mensaje de bienvenida a WhatsApp del usuario
5. Usuario responde desde WhatsApp
6. Bot recibe mensaje → guarda en DB → emite via Socket.io
7. Admin ve mensaje en CRM web en tiempo real
8. Admin responde desde CRM web
9. API recibe respuesta → Bot envía a WhatsApp → guarda en DB
10. Usuario recibe mensaje en WhatsApp
```

#### Flujo 2: Admin responde desde WhatsApp físico
```
1. Usuario envía mensaje a WhatsApp
2. Bot detecta mensaje entrante
3. Guarda en DB
4. Emite via Socket.io
5. CRM web actualiza en tiempo real
6. Admin abre WhatsApp en su teléfono y responde
7. Bot detecta mensaje saliente
8. Guarda en DB con sender_type='admin'
9. Emite via Socket.io
10. CRM web actualiza mostrando respuesta
```

---

## 🎨 CAMBIOS EN LA LANDING

### Estructura Nueva Landing

#### Hero Section (Primera Pantalla)
```
┌─────────────────────────────────────────────────┐
│  LOGO                              [CHAT] [WA]  │
├─────────────────────────────────────────────────┤
│                                                  │
│         [VIDEO HERO - Autoplay]                 │
│     Aceite de CBD - Medicina Natural            │
│                                                  │
│         [Ver Productos] [Consultar]             │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Características:**
- Video hero en autoplay (mudo)
- Título corto y directo
- 2 CTAs principales
- Diseño limpio y minimalista

#### Sección Productos
```
┌─────────────────────────────────────────────────┐
│           Nuestros Productos CBD                 │
│                                                  │
│  [Card Producto 1]  [Card Producto 2]           │
│  - Video/GIF        - Video/GIF                 │
│  - Nombre           - Nombre                     │
│  - Precio           - Precio                     │
│  - [Consultar]      - [Consultar]               │
└─────────────────────────────────────────────────┘
```

**Características:**
- Videos cortos de productos (15-30 seg)
- Mínimo texto
- Precio visible
- CTA directo a chat

#### Sección Beneficios (Visual)
```
┌─────────────────────────────────────────────────┐
│              Por qué CBD                         │
│                                                  │
│  [Icono 1]    [Icono 2]    [Icono 3]           │
│  Natural      Efectivo      Seguro              │
│                                                  │
│  [Video testimonial - 30 seg]                   │
└─────────────────────────────────────────────────┘
```

**Características:**
- Iconos + palabras clave
- Sin textos largos
- Video testimonial corto

#### Footer Simple
```
┌─────────────────────────────────────────────────┐
│  [Instagram] [Facebook] [TikTok]                │
│  Medicina Natural © 2025                         │
└─────────────────────────────────────────────────┘
```

### Optimización para Meta Ads

#### Estrategia de Contenido
1. **Máximo 20 palabras por sección**
2. **Videos en lugar de texto**
3. **Imágenes con overlays simples**
4. **CTAs directos sin explicaciones**
5. **Sin claims médicos específicos**

#### Elementos Visuales Prioritarios
- 🎥 Video hero (producto en uso)
- 🎬 Videos de productos (15-30 seg)
- 📸 Fotos lifestyle (personas usando)
- 🎨 Infografías simples (beneficios)
- 🎭 Testimoniales en video

#### Textos Sugeridos (Breves)
```
Hero: "Bienestar natural con CBD"
Productos: "Encuentra tu solución"
Beneficios: "Calidad certificada"
CTA: "Consulta gratis"
Footer: "Medicina Natural 2025"
```

### Soporte para Videos

#### Implementación Técnica
```typescript
// Nuevo tipo de producto con videos
interface ProductCBD {
  id: string
  name: string
  description: string // CORTA
  price: number
  images: string[]
  videos: {
    url: string
    type: 'hero' | 'demo' | 'testimonial'
    duration: number
    thumbnail: string
  }[]
  cbd_info: {
    concentration: string // "500mg", "1000mg"
    volume: string        // "30ml", "60ml"
    uso: string          // "Sublingual", "Tópico"
  }
}
```

#### Componente Video Player
```typescript
// components/video-player.tsx
- Autoplay (muted)
- Loop
- Controles opcionales
- Responsive
- Fallback a imagen
- Lazy loading
```

---

## 💼 SISTEMA CRM INTEGRADO

### Panel Admin CRM

#### Vista Principal
```
┌─────────────────────────────────────────────────────────────┐
│  MEDICINA NATURAL - CRM                    [Admin] [Logout]  │
├─────────────────────────────────────────────────────────────┤
│  📊 Dashboard  💬 Chats  📦 Productos  ⚙️ Config            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐  ┌──────────────────────────────────┐ │
│  │  Conversaciones │  │    Chat Activo                    │ │
│  │                 │  │                                    │ │
│  │  🟢 Juan P.    │  │  👤 Juan Pérez                   │ │
│  │     +549...     │  │  📱 +5491123456789               │ │
│  │     Hace 2 min  │  │  🏷️  Lead nuevo                  │ │
│  │                 │  │                                    │ │
│  │  🟡 María G.   │  │  ┌─────────────────────────────┐ │ │
│  │     +549...     │  │  │ Hola, quiero consultar...   │ │ │
│  │     Hace 1h     │  │  │ por el aceite de CBD        │ │ │
│  │                 │  │  └─────────────────────────────┘ │ │
│  │  ⚪ Carlos R.  │  │                                    │ │
│  │     +549...     │  │  ┌─────────────────────────────┐ │ │
│  │     Ayer        │  │  │ ¡Hola Juan! 👋              │ │ │
│  │                 │  │  │ Te comento sobre el aceite  │ │ │
│  │  [+ Nueva]      │  │  └─────────────────────────────┘ │ │
│  │                 │  │                                    │ │
│  │  Filtros:       │  │  [Escribir mensaje...] [Enviar]  │ │
│  │  ⚪ Todos       │  │                                    │ │
│  │  🟢 Activos    │  │  [Plantillas]  [Adjuntar]         │ │
│  │  🟡 Pendientes │  │                                    │ │
│  │  ⚪ Cerrados   │  │  💡 Respuesta rápida:             │ │
│  │                 │  │  - Info productos                 │ │
│  │  Buscar:        │  │  - Precios                        │ │
│  │  [🔍 Nombre]   │  │  - Envíos                         │ │
│  └─────────────────┘  └──────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

#### Funcionalidades del CRM

**Gestión de Conversaciones:**
- Lista de conversaciones en tiempo real
- Filtros por estado (activo, pendiente, cerrado)
- Búsqueda por nombre/teléfono
- Etiquetas personalizadas
- Asignación a vendedores

**Chat en Tiempo Real:**
- Sincronización bidireccional con WhatsApp
- Indicador de escritura
- Indicador de lectura
- Historial completo
- Adjuntar imágenes/documentos

**Respuestas Rápidas:**
- Plantillas predefinidas
- Información de productos
- Precios
- Términos de envío
- Links a productos

**Datos del Lead:**
- Nombre
- Teléfono
- Fecha de contacto
- Mensajes totales
- Estado (nuevo, contactado, cliente)
- Notas internas

**Estadísticas:**
- Leads del día
- Conversaciones activas
- Tiempo promedio de respuesta
- Tasa de conversión
- Productos más consultados

### Implementación Técnica CRM

#### Componentes Necesarios
```
app/admin/crm/
├── page.tsx                    // Vista principal
├── components/
│   ├── conversation-list.tsx   // Lista de chats
│   ├── chat-window.tsx         // Ventana de chat
│   ├── message-item.tsx        // Item de mensaje
│   ├── chat-input.tsx          // Input de mensaje
│   ├── quick-replies.tsx       // Respuestas rápidas
│   ├── lead-info.tsx           // Info del lead
│   └── stats-widget.tsx        // Estadísticas
```

#### Socket.io Integration
```typescript
// lib/socket-client.ts
import io from 'socket.io-client'

export const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
  auth: { token: adminToken }
})

socket.on('new_message', (message) => {
  // Actualizar estado del chat
})

socket.on('message_read', (messageId) => {
  // Marcar mensaje como leído
})

socket.on('typing', (conversationId) => {
  // Mostrar indicador
})
```

---

## 🐳 INFRAESTRUCTURA VPS + DOCKER

### Arquitectura de Contenedores

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Frontend + API (Next.js)
  nextjs:
    build: 
      context: .
      dockerfile: Dockerfile.nextjs
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - WS_URL=http://websocket:4000
    depends_on:
      - postgres
      - websocket
    restart: unless-stopped
    volumes:
      - ./public/uploads:/app/public/uploads

  # WebSocket Server (Socket.io)
  websocket:
    build:
      context: .
      dockerfile: Dockerfile.websocket
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - postgres
    restart: unless-stopped

  # WhatsApp Bot Service
  whatsapp-bot:
    build:
      context: .
      dockerfile: Dockerfile.whatsapp
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - WS_URL=http://websocket:4000
    volumes:
      - ./whatsapp-sessions:/app/sessions
    depends_on:
      - postgres
      - websocket
    restart: unless-stopped

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=medicinanatural
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped

  # Nginx (Reverse Proxy)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - nextjs
    restart: unless-stopped

volumes:
  postgres-data:
```

### Dockerfiles

#### Dockerfile.nextjs
```dockerfile
FROM node:20-alpine AS base

# Dependencias
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Dockerfile.websocket
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY services/websocket/package*.json ./
RUN npm ci --only=production

COPY services/websocket/ .

EXPOSE 4000

CMD ["node", "server.js"]
```

#### Dockerfile.whatsapp
```dockerfile
FROM node:20-alpine

# Dependencias del sistema para Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY services/whatsapp-bot/package*.json ./
RUN npm ci --only=production

COPY services/whatsapp-bot/ .

EXPOSE 5000

CMD ["node", "bot.js"]
```

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream nextjs {
        server nextjs:3000;
    }

    upstream websocket {
        server websocket:4000;
    }

    server {
        listen 80;
        server_name medicinanatural.com www.medicinanatural.com;

        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name medicinanatural.com www.medicinanatural.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Next.js
        location / {
            proxy_pass http://nextjs;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # WebSocket
        location /socket.io/ {
            proxy_pass http://websocket;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
    }
}
```

### Estructura de Directorios para VPS

```
/opt/medicina-natural/
├── docker-compose.yml
├── .env
├── Dockerfile.nextjs
├── Dockerfile.websocket
├── Dockerfile.whatsapp
├── nginx.conf
├── ssl/
│   ├── cert.pem
│   └── key.pem
├── app/                      # Código Next.js
├── services/
│   ├── websocket/           # Servidor Socket.io
│   └── whatsapp-bot/        # Bot de WhatsApp
├── whatsapp-sessions/       # Sesiones persistentes
└── backups/                 # Backups de DB
```

### Scripts de Deploy

#### deploy.sh
```bash
#!/bin/bash
set -e

echo "🚀 Deploying Medicina Natural..."

# Pull latest code
git pull origin main

# Build and restart containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Cleanup
docker system prune -f

echo "✅ Deploy completed!"
```

#### backup.sh
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/medicina-natural/backups"

echo "📦 Creating backup..."

# Backup database
docker-compose exec -T postgres pg_dump -U admin medicinanatural > \
    "$BACKUP_DIR/db_backup_$DATE.sql"

# Backup uploads
tar -czf "$BACKUP_DIR/uploads_backup_$DATE.tar.gz" \
    /opt/medicina-natural/app/public/uploads

echo "✅ Backup completed: $DATE"
```

---

## 📅 ROADMAP DE IMPLEMENTACIÓN

### Fase 1: Preparación (Semana 1)
**Objetivo:** Análisis y setup inicial

- [ ] Recibir branding completo en `branding-nuevo/`
- [ ] Analizar información de empresa y productos
- [ ] Definir paleta de colores y tipografía
- [ ] Preparar base de datos local
- [ ] Setup de VPS (Debian + Docker)

**Entregables:**
- Documentación de branding
- VPS configurado
- DB schema definido

### Fase 2: Migración de Branding (Semana 2)
**Objetivo:** Adaptar diseño a Medicina Natural

- [ ] Reemplazar logo y colores
- [ ] Actualizar textos (brevísimos)
- [ ] Configurar productos CBD
- [ ] Agregar videos a productos
- [ ] Optimizar hero section

**Entregables:**
- Landing adaptada
- Productos CBD configurados
- Videos integrados

### Fase 3: Sistema de Chat Web (Semana 3)
**Objetivo:** Implementar chat widget

- [ ] Crear componente ChatWidget
- [ ] Formulario de captura (nombre + teléfono)
- [ ] API de chat (/api/chat/*)
- [ ] Guardar conversaciones en DB
- [ ] Diseño responsive

**Entregables:**
- Chat widget funcional
- API de chat operativa
- DB con conversaciones

### Fase 4: WhatsApp Bot (Semana 4)
**Objetivo:** Integrar whatsapp-web.js

- [ ] Setup de whatsapp-web.js
- [ ] Generar QR code
- [ ] Conectar con WhatsApp
- [ ] Recibir mensajes
- [ ] Enviar mensajes
- [ ] Webhook de sincronización

**Entregables:**
- Bot conectado y funcional
- QR code escaneado
- Mensajes bidireccionales

### Fase 5: CRM Admin (Semana 5)
**Objetivo:** Panel de gestión de conversaciones

- [ ] Vista de conversaciones
- [ ] Chat en tiempo real
- [ ] Respuestas rápidas
- [ ] Información de leads
- [ ] Estadísticas básicas

**Entregables:**
- CRM funcional
- Sincronización con WhatsApp
- Respuestas desde web

### Fase 6: Sincronización en Tiempo Real (Semana 6)
**Objetivo:** Socket.io para tiempo real

- [ ] Setup de Socket.io server
- [ ] Conexión desde frontend
- [ ] Sincronización de mensajes
- [ ] Indicadores de escritura
- [ ] Notificaciones

**Entregables:**
- WebSocket operativo
- Mensajes en tiempo real
- Indicadores funcionando

### Fase 7: Docker y Deploy (Semana 7)
**Objetivo:** Containerización y deploy

- [ ] Crear Dockerfiles
- [ ] Configurar docker-compose
- [ ] Setup de Nginx
- [ ] Configurar SSL
- [ ] Scripts de deploy

**Entregables:**
- Contenedores funcionando
- Deploy automatizado
- HTTPS configurado

### Fase 8: Testing y Optimización (Semana 8)
**Objetivo:** Pruebas y ajustes finales

- [ ] Testing de flujos completos
- [ ] Optimización de performance
- [ ] Testing de carga
- [ ] Backup y restore
- [ ] Documentación final

**Entregables:**
- Sistema testeado
- Performance optimizado
- Documentación completa

---

## 🔧 CONSIDERACIONES TÉCNICAS

### Reto 1: Sincronización Bidireccional

**Problema:** Si el admin responde desde WhatsApp físico, ¿cómo detectarlo?

**Solución:**
```javascript
// En whatsapp-web.js
client.on('message_create', async (msg) => {
  // Detectar si el mensaje es saliente (del admin)
  if (msg.fromMe) {
    // Guardar en DB como respuesta del admin
    await saveMessage({
      conversation_id: getConversationByPhone(msg.to),
      sender_type: 'admin',
      message: msg.body,
      whatsapp_message_id: msg.id._serialized
    })
    
    // Emitir a Socket.io para actualizar CRM web
    io.emit('admin_message', {
      conversation_id: conversation.id,
      message: msg.body
    })
  }
})
```

### Reto 2: Múltiples Admins Respondiendo

**Problema:** ¿Qué pasa si hay varios admins?

**Solución:** Sistema de asignación
```sql
ALTER TABLE chat_conversations 
ADD COLUMN assigned_to INT REFERENCES admin_users(id);

-- Reglas de asignación
1. Auto-asignar al primer admin que responda
2. Permitir reasignación manual
3. Notificar solo al admin asignado
```

### Reto 3: WhatsApp Bot Desconectado

**Problema:** ¿Qué pasa si el bot se desconecta?

**Solución:** Sistema de monitoreo
```javascript
// Healthcheck cada 30 segundos
setInterval(async () => {
  const state = await client.getState()
  
  if (state !== 'CONNECTED') {
    // Notificar a admins
    await notifyAdmins('WhatsApp bot desconectado')
    
    // Intentar reconexión
    await client.initialize()
  }
  
  // Guardar estado en DB
  await updateBotStatus(state)
}, 30000)
```

### Reto 4: Escalabilidad

**Problema:** ¿Cómo escalar con muchos usuarios?

**Solución:**
1. **Redis para caché**: Conversaciones activas en memoria
2. **Queue system**: Procesar mensajes con Bull.js
3. **Load balancing**: Múltiples instancias de Next.js
4. **CDN**: Videos y assets estáticos

### Reto 5: Meta Ads Compliance

**Problema:** Evitar detección de robots

**Checklist:**
- [ ] Máximo 20 palabras por sección
- [ ] Videos prioritarios sobre texto
- [ ] Sin claims médicos específicos
- [ ] CTAs simples y directos
- [ ] Imágenes lifestyle > product shots
- [ ] Testimonios en video
- [ ] No mencionar "tratamiento" o "cura"
- [ ] Usar "bienestar" en lugar de "salud"

### Reto 6: Persistencia de Sesión WhatsApp

**Problema:** Evitar escanear QR cada vez

**Solución:**
```javascript
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: 'medicina-natural',
    dataPath: './whatsapp-sessions'
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox']
  }
})

// Persistir en volume de Docker
// volumes:
//   - ./whatsapp-sessions:/app/sessions
```

### Reto 7: Manejo de Multimedia

**Problema:** Enviar imágenes de productos desde CRM

**Solución:**
```javascript
// Desde CRM admin
const sendProductImage = async (phone, productId) => {
  const product = await getProduct(productId)
  const media = await MessageMedia.fromUrl(product.images[0])
  
  await client.sendMessage(phone, media, {
    caption: `${product.name}\n$${product.price}`
  })
}
```

---

## 🎯 RESUMEN DE PROPUESTA

### Sistema Completo Incluye:

✅ **Landing optimizada para Meta Ads**
- Mínimo texto
- Videos protagonistas
- CTAs directos
- Productos CBD destacados

✅ **Chat Web Widget**
- Captura nombre + teléfono
- Interfaz amigable
- Responsive

✅ **WhatsApp Bot (whatsapp-web.js)**
- Sincronización bidireccional
- Mensajes entrantes/salientes
- Sesión persistente

✅ **CRM Admin**
- Gestión de conversaciones
- Chat en tiempo real
- Respuestas rápidas
- Estadísticas

✅ **WebSocket en Tiempo Real**
- Socket.io
- Sincronización instantánea
- Indicadores de estado

✅ **Infraestructura VPS + Docker**
- 4 contenedores (Next.js, WebSocket, Bot, PostgreSQL)
- Nginx reverse proxy
- HTTPS con SSL
- Backups automáticos

### Ventajas de Esta Solución:

🚀 **Unificada**: Todo en un solo sistema
💬 **Tiempo real**: Sin delays en mensajes
📱 **Dual**: Responder desde web o WhatsApp
📊 **CRM integrado**: No necesitas herramientas externas
🔒 **Segura**: SSL, autenticación, validaciones
📈 **Escalable**: Docker permite escalar servicios
🎯 **Optimizada**: Para Meta Ads (poco texto)

### Próximos Pasos:

1. **Agregar contenido en `branding-nuevo/`**
   - Información de empresa
   - Logos y colores
   - Fotos de productos
   - Videos
   - Textos

2. **Revisar y aprobar esta propuesta**
   - Confirmar arquitectura
   - Ajustar lo necesario
   - Definir prioridades

3. **Iniciar Fase 1**
   - Setup de VPS
   - Configuración inicial
   - Preparar base de datos

---

## 📞 PREGUNTAS PARA DEFINIR

Antes de comenzar, necesito que definas:

1. **WhatsApp:**
   - ¿Ya tienes el número de WhatsApp de ventas?
   - ¿Será un número diferente al principal?
   - ¿Cuántos admins responderán?

2. **Productos:**
   - ¿Cuántos productos CBD inicialmente?
   - ¿Qué información es crítica mostrar?
   - ¿Restricciones legales a considerar?

3. **Videos:**
   - ¿Cuántos videos tienes disponibles?
   - ¿Duración promedio?
   - ¿Hosting de videos? (YouTube, Vimeo, self-hosted)

4. **VPS:**
   - ¿Ya tienes el VPS contratado?
   - ¿Especificaciones? (RAM, CPU, Storage)
   - ¿Dominio configurado?

5. **Presupuesto:**
   - ¿Restricciones de hosting?
   - ¿Servicios externos permitidos?

---

**Una vez que agregues el contenido en `branding-nuevo/` y respondas las preguntas, comenzamos con la implementación.**

¿Te parece bien esta propuesta? ¿Algún ajuste o pregunta?

