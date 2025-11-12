# 🌿 PROPUESTA MEDICINA NATURAL V2 - SISTEMA ANTI-BANEO

## 🚨 CONSIDERACIONES CRÍTICAS

### Problema Principal: Banneos de WhatsApp por CBD
- Los números de WhatsApp pueden ser baneados por vender CBD
- El número debe ser **descartable y reemplazable**
- La línea principal debe estar **protegida**
- El chat web debe **seguir funcionando** aunque cambie el número

### Solución Arquitectónica
**Sistema de números virtuales intercambiables con persistencia de conversaciones**

---

## 🏗️ ARQUITECTURA ANTI-BANEO

```
┌─────────────────────────────────────────────────────────────────┐
│                    USUARIOS (Web)                                │
│              Chat Widget (Número virtual)                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND + BASE DE DATOS                       │
│  - Conversaciones persistentes                                   │
│  - Leads guardados                                               │
│  - Mensajes históricos                                           │
│  - Configuración de autorespuestas                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              WHATSAPP BOT (Número intercambiable)                │
│  - Sesión en archivo                                             │
│  - Escaneo QR desde CRM                                          │
│  - Cambio de número transparente                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│           WHATSAPP FÍSICO (Número descartable)                   │
│              Se cambia cuando hay baneo                          │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo con Cambio de Número

**Escenario Normal:**
```
1. Usuario chatea desde web
2. Guarda conversación en DB
3. Bot envía a WhatsApp Número A
4. Usuario responde
5. Todo funciona normal
```

**Escenario de Baneo:**
```
1. Número A es baneado
2. Admin entra al CRM
3. Click en "Cambiar Sesión WhatsApp"
4. Borra sesión actual
5. Escanea QR con Número B (nuevo)
6. El chat web SIGUE FUNCIONANDO
7. Nuevos leads van a Número B
8. Conversaciones existentes migran a Número B
9. Usuario final no nota el cambio
```

---

## 📊 BASE DE DATOS

### Opción Recomendada: PostgreSQL en VPS

**Por qué PostgreSQL en VPS:**
- ✅ Control total de los datos
- ✅ No hay límites de almacenamiento
- ✅ Backups completos
- ✅ GRATIS (en tu VPS)
- ✅ Soporte para JSON (autorespuestas)
- ✅ Relaciones complejas
- ✅ Escalable

**Alternativas (No recomendadas para este caso):**
- ❌ Neon/Vercel Postgres: Tienen límites gratuitos
- ❌ Supabase: Límites en proyecto gratuito
- ❌ MongoDB: Menos estructura, no ideal para CRM

### Schema Completo de Base de Datos

```sql
-- ============================================
-- TABLA: whatsapp_sessions
-- Gestión de números de WhatsApp
-- ============================================
CREATE TABLE whatsapp_sessions (
  id SERIAL PRIMARY KEY,
  session_name VARCHAR(100) UNIQUE NOT NULL DEFAULT 'main',
  phone_number VARCHAR(20),
  status VARCHAR(50) DEFAULT 'disconnected', -- 'connected', 'disconnected', 'qr_pending'
  qr_code TEXT, -- QR en base64 para mostrar en CRM
  qr_generated_at TIMESTAMP,
  last_connected_at TIMESTAMP,
  banned_at TIMESTAMP, -- Marca cuando fue baneado
  banned_reason TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: chat_conversations
-- Conversaciones con leads
-- ============================================
CREATE TABLE chat_conversations (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  
  -- Estado de la conversación
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'waiting', 'closed', 'archived'
  
  -- Asignación
  assigned_to INT REFERENCES admin_users(id),
  
  -- Origen
  source VARCHAR(50) DEFAULT 'web_chat', -- 'web_chat', 'whatsapp_direct', 'facebook', etc.
  
  -- Número de WhatsApp que se usó
  whatsapp_session_id INT REFERENCES whatsapp_sessions(id),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP,
  last_user_message_at TIMESTAMP,
  last_admin_message_at TIMESTAMP,
  
  -- Métricas
  messages_count INT DEFAULT 0,
  response_time_avg INT, -- segundos promedio de respuesta
  
  -- Etiquetas y notas
  tags TEXT[],
  notes TEXT,
  
  -- Autorespuestas
  autoresponder_completed BOOLEAN DEFAULT false,
  autoresponder_step INT DEFAULT 0,
  autoresponder_last_sent TIMESTAMP,
  
  -- Valor estimado (para tracking)
  estimated_value DECIMAL(10,2),
  
  -- Datos adicionales
  metadata JSONB -- Para guardar info extra: productos consultados, etc.
);

-- ============================================
-- TABLA: chat_messages
-- Mensajes de las conversaciones
-- ============================================
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INT REFERENCES chat_conversations(id) ON DELETE CASCADE,
  
  -- Remitente
  sender_type VARCHAR(20) NOT NULL, -- 'user', 'admin', 'bot'
  sender_id INT, -- ID del admin si aplica
  sender_name VARCHAR(255),
  
  -- Contenido
  message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'video', 'audio', 'document'
  message TEXT NOT NULL,
  media_url TEXT,
  media_caption TEXT,
  
  -- WhatsApp
  whatsapp_message_id VARCHAR(255) UNIQUE,
  whatsapp_status VARCHAR(50), -- 'sent', 'delivered', 'read', 'failed'
  
  -- Estado
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Metadata
  metadata JSONB -- Info adicional: coordenadas, contacto compartido, etc.
);

-- ============================================
-- TABLA: autoresponder_sequences
-- Secuencias de respuestas automáticas
-- ============================================
CREATE TABLE autoresponder_sequences (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  
  -- Configuración
  steps JSONB NOT NULL, -- Array de pasos configurables
  fallback_message TEXT,
  fallback_after_minutes INT DEFAULT 30,
  
  -- Horarios
  active_hours JSONB, -- {"start": "09:00", "end": "18:00", "days": [1,2,3,4,5]}
  
  -- Métricas
  times_used INT DEFAULT 0,
  completion_rate DECIMAL(5,2), -- % que completan la secuencia
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ejemplo de steps JSONB:
-- [
--   {
--     "step": 1,
--     "type": "text",
--     "content": "¡Hola! Gracias por contactarnos 👋",
--     "delay_seconds": 0
--   },
--   {
--     "step": 2,
--     "type": "text",
--     "content": "Te cuento sobre nuestros productos con CBD...",
--     "delay_seconds": 3
--   },
--   {
--     "step": 3,
--     "type": "image",
--     "media_url": "https://...",
--     "caption": "Este es nuestro aceite más vendido",
--     "delay_seconds": 5
--   },
--   {
--     "step": 4,
--     "type": "text",
--     "content": "¿Te interesa algún producto en particular?",
--     "delay_seconds": 3
--   }
-- ]

-- ============================================
-- TABLA: admin_users
-- Usuarios administradores
-- ============================================
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin', -- 'owner', 'admin', 'agent'
  
  -- Permisos
  can_manage_sessions BOOLEAN DEFAULT false, -- Cambiar número de WhatsApp
  can_edit_autoresponder BOOLEAN DEFAULT false,
  can_view_all_conversations BOOLEAN DEFAULT true,
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: leads
-- Registro de todos los leads
-- ============================================
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  
  -- Origen
  source VARCHAR(50), -- 'web_chat', 'whatsapp', 'facebook', 'instagram'
  landing_page VARCHAR(255), -- URL de donde vino
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  
  -- Estado
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
  
  -- Conversación asociada
  conversation_id INT REFERENCES chat_conversations(id),
  
  -- Datos del producto de interés
  interested_products TEXT[],
  
  -- Notas
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  converted_at TIMESTAMP,
  
  -- Metadata
  metadata JSONB
);

-- ============================================
-- TABLA: products (Adaptada para CBD)
-- ============================================
CREATE TABLE products (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  
  -- Precios
  price INTEGER NOT NULL,
  compare_at INTEGER,
  
  -- Categoría
  category VARCHAR NOT NULL, -- 'aceites', 'cremas', 'capsulas', 'gotas'
  
  -- Info CBD específica
  cbd_concentration VARCHAR(50), -- "500mg", "1000mg", "1500mg"
  cbd_type VARCHAR(50), -- "Full Spectrum", "Broad Spectrum", "Isolate"
  volume VARCHAR(50), -- "30ml", "60ml"
  uso VARCHAR(100), -- "Sublingual", "Tópico", "Oral"
  
  -- Variantes
  sizes TEXT[] NOT NULL DEFAULT '{}',
  colors TEXT[] NOT NULL DEFAULT '{}',
  
  -- Media
  images TEXT[] NOT NULL DEFAULT '{}',
  videos JSONB DEFAULT '[]', -- [{"url": "", "type": "hero", "thumbnail": ""}]
  
  -- Tags
  tags TEXT[] NOT NULL DEFAULT '{}',
  
  -- Stock
  stock INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  sku VARCHAR NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Ofertas
  is_on_sale BOOLEAN NOT NULL DEFAULT false,
  sale_price INTEGER,
  sale_start_date TIMESTAMP,
  sale_end_date TIMESTAMP,
  sale_duration_days INTEGER DEFAULT 7,
  
  -- Compliance
  legal_disclaimer TEXT, -- Aviso legal específico del producto
  age_restriction BOOLEAN DEFAULT true, -- +18
  prescription_required BOOLEAN DEFAULT false
);

-- ============================================
-- ÍNDICES para Performance
-- ============================================

-- Conversaciones
CREATE INDEX idx_conversations_phone ON chat_conversations(phone);
CREATE INDEX idx_conversations_status ON chat_conversations(status);
CREATE INDEX idx_conversations_assigned ON chat_conversations(assigned_to);
CREATE INDEX idx_conversations_last_message ON chat_conversations(last_message_at DESC);

-- Mensajes
CREATE INDEX idx_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX idx_messages_created ON chat_messages(created_at DESC);
CREATE INDEX idx_messages_read ON chat_messages(read) WHERE read = false;

-- Leads
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- Productos
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_sale ON products(is_on_sale) WHERE is_on_sale = true;

-- ============================================
-- TRIGGERS para Timestamps Automáticos
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversations_timestamp
  BEFORE UPDATE ON chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sessions_timestamp
  BEFORE UPDATE ON whatsapp_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_autoresponder_timestamp
  BEFORE UPDATE ON autoresponder_sequences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

---

## 💬 RESPUESTAS DEL DUEÑO: 2 OPCIONES

### Opción A: CRM como Quasi-WhatsApp (RECOMENDADA)

**Ventajas:**
- ✅ Todo centralizado en el CRM
- ✅ Historial completo visible
- ✅ No necesita tener WhatsApp abierto
- ✅ Respuestas más profesionales
- ✅ Puede responder desde computadora
- ✅ Plantillas y respuestas rápidas
- ✅ Métricas de respuesta
- ✅ No se pierde si cambia de teléfono

**Desventajas:**
- ⚠️ Debe estar en la computadora/web

**Implementación:**
```typescript
// CRM Admin - Vista de Chat
interface ChatInterface {
  // Similar a WhatsApp Web
  - Lista de conversaciones a la izquierda
  - Chat activo a la derecha
  - Input de mensaje (texto, emoji, adjuntos)
  - Indicador de "escribiendo..."
  - Mensajes con timestamps
  - Estado de entrega (enviado, entregado, leído)
  - Respuestas rápidas
  - Plantillas predefinidas
}
```

### Opción B: WhatsApp Físico + Sincronización

**Ventajas:**
- ✅ Responde desde su celular
- ✅ Notificaciones push nativas
- ✅ Puede usar mientras está fuera

**Desventajas:**
- ⚠️ Si pierde el teléfono, pierde acceso
- ⚠️ Puede desincronizarse
- ⚠️ Mensajes duplicados posibles
- ⚠️ El número puede ser baneado

### Recomendación: **OPCIÓN A + App Móvil Progresiva (PWA)**

```
┌──────────────────────────────────────────┐
│    CRM Web (Computadora)                 │
│    - Respuestas completas                │
│    - Gestión de leads                    │
│    - Configuración                       │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│    CRM PWA (Móvil)                       │
│    - Notificaciones push                 │
│    - Chat rápido                         │
│    - Vista simplificada                  │
└──────────────────────────────────────────┘
```

**Con PWA el dueño puede:**
- Instalar el CRM en su celular como app
- Recibir notificaciones push
- Responder rápido desde el móvil
- Sin depender de WhatsApp físico
- Sin riesgo de baneo de su número personal

---

## 🤖 SISTEMA DE AUTORESPUESTAS

### Panel de Configuración en CRM

```
┌─────────────────────────────────────────────────────────────┐
│  MEDICINA NATURAL - Autorespuestas                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📋 Secuencias Configuradas                                 │
│  ┌────────────────────────────────────────────────────┐    │
│  │ ✅ Secuencia 1: Bienvenida General                 │    │
│  │    Pasos: 4 | Usado: 156 veces | Activo           │    │
│  │    [Editar] [Duplicar] [Estadísticas]             │    │
│  ├────────────────────────────────────────────────────┤    │
│  │ ⚪ Secuencia 2: Horario No Laboral                │    │
│  │    Pasos: 2 | Usado: 45 veces | Inactivo          │    │
│  │    [Editar] [Activar]                              │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  [+ Nueva Secuencia]                                        │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  📝 Editando: Secuencia 1 - Bienvenida General             │
│                                                              │
│  ┌─ Paso 1 ──────────────────────────────────────────┐    │
│  │ Tipo: [Texto ▼]                                    │    │
│  │ ┌────────────────────────────────────────────────┐ │    │
│  │ │ ¡Hola! Gracias por contactarnos 👋            │ │    │
│  │ │ Soy del equipo de Medicina Natural            │ │    │
│  │ └────────────────────────────────────────────────┘ │    │
│  │ Delay: [0] segundos                                │    │
│  │ [🗑️ Eliminar Paso]                                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─ Paso 2 ──────────────────────────────────────────┐    │
│  │ Tipo: [Texto ▼]                                    │    │
│  │ ┌────────────────────────────────────────────────┐ │    │
│  │ │ Te voy a contar sobre nuestros productos      │ │    │
│  │ │ con CBD de máxima calidad 🌿                  │ │    │
│  │ └────────────────────────────────────────────────┘ │    │
│  │ Delay: [3] segundos                                │    │
│  │ [🗑️ Eliminar Paso]                                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─ Paso 3 ──────────────────────────────────────────┐    │
│  │ Tipo: [Imagen ▼]                                   │    │
│  │ [📎 Seleccionar Imagen]                            │    │
│  │ 🖼️ aceite-cbd-principal.jpg                        │    │
│  │ Caption:                                            │    │
│  │ ┌────────────────────────────────────────────────┐ │    │
│  │ │ Este es nuestro aceite más vendido            │ │    │
│  │ │ 💧 500mg de CBD Full Spectrum                 │ │    │
│  │ └────────────────────────────────────────────────┘ │    │
│  │ Delay: [5] segundos                                │    │
│  │ [🗑️ Eliminar Paso]                                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─ Paso 4 ──────────────────────────────────────────┐    │
│  │ Tipo: [Audio ▼]                                    │    │
│  │ [🎤 Seleccionar Audio] o [🔴 Grabar]              │    │
│  │ 🔊 presentacion-productos.mp3 (0:45)               │    │
│  │ Delay: [8] segundos                                │    │
│  │ [🗑️ Eliminar Paso]                                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  [+ Agregar Paso]                                           │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  ⏱️ Fallback (Si no responde)                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Esperar: [30] minutos sin respuesta                │    │
│  │ Enviar mensaje:                                     │    │
│  │ ┌─────────────────────────────────────────────────┐│    │
│  │ │ Entiendo que estés ocupado/a 😊                ││    │
│  │ │ Cuando quieras consultar algo, aquí estoy      ││    │
│  │ │ ¡Que tengas un excelente día! 🌟               ││    │
│  │ └─────────────────────────────────────────────────┘│    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  🕐 Horarios Activos                                        │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Días: [✓] Lun [✓] Mar [✓] Mié [✓] Jue [✓] Vie    │    │
│  │       [✓] Sáb [ ] Dom                              │    │
│  │ Horario: De [09:00] a [20:00]                      │    │
│  │ Zona horaria: GMT-3 (Buenos Aires)                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  [💾 Guardar Secuencia] [👁️ Vista Previa] [❌ Cancelar]   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Tipos de Contenido Soportados

```typescript
interface AutoresponderStep {
  step: number
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'buttons'
  content?: string // Para texto
  media_url?: string // Para multimedia
  caption?: string // Para imagen/video
  delay_seconds: number // Tiempo antes de enviar
  buttons?: Array<{ // Para mensajes interactivos (si lo soporta WhatsApp Business)
    id: string
    text: string
  }>
}

interface AutoresponderSequence {
  id: number
  name: string
  description: string
  is_active: boolean
  steps: AutoresponderStep[]
  fallback_message: string
  fallback_after_minutes: number
  active_hours: {
    start: string // "09:00"
    end: string   // "20:00"
    days: number[] // [1,2,3,4,5,6] (1=Lunes, 7=Domingo)
    timezone: string
  }
}
```

### Lógica de Autorespuestas

```javascript
// services/whatsapp-bot/autoresponder.js

class Autoresponder {
  async handleNewContact(conversation) {
    // 1. Verificar horario activo
    if (!this.isWithinActiveHours()) {
      await this.sendAfterHoursMessage(conversation)
      return
    }
    
    // 2. Obtener secuencia activa
    const sequence = await this.getActiveSequence()
    if (!sequence) return
    
    // 3. Ejecutar pasos con delays
    for (const step of sequence.steps) {
      // Esperar el delay configurado
      await this.delay(step.delay_seconds * 1000)
      
      // Verificar si el usuario respondió
      const userReplied = await this.checkUserReply(conversation.id)
      if (userReplied) {
        // Si respondió, marcar como "interactuando" y detener autorespuestas
        await this.markAsInteracting(conversation.id)
        break
      }
      
      // Enviar mensaje según el tipo
      await this.sendStep(conversation, step)
      
      // Guardar progreso
      await this.updateProgress(conversation.id, step.step)
    }
    
    // 4. Activar fallback timer
    await this.scheduleFallback(conversation, sequence.fallback_after_minutes)
  }
  
  async sendStep(conversation, step) {
    const { phone } = conversation
    
    switch (step.type) {
      case 'text':
        await this.client.sendMessage(phone, step.content)
        break
        
      case 'image':
        const image = await MessageMedia.fromUrl(step.media_url)
        await this.client.sendMessage(phone, image, { caption: step.caption })
        break
        
      case 'video':
        const video = await MessageMedia.fromUrl(step.media_url)
        await this.client.sendMessage(phone, video, { caption: step.caption })
        break
        
      case 'audio':
        const audio = await MessageMedia.fromUrl(step.media_url)
        await this.client.sendMessage(phone, audio, { sendAudioAsVoice: true })
        break
        
      case 'document':
        const doc = await MessageMedia.fromUrl(step.media_url)
        await this.client.sendMessage(phone, doc)
        break
    }
    
    // Guardar mensaje en DB
    await this.saveMessage({
      conversation_id: conversation.id,
      sender_type: 'bot',
      message_type: step.type,
      message: step.content || step.caption,
      media_url: step.media_url
    })
  }
  
  async scheduleFallback(conversation, minutes) {
    // Usar setTimeout o queue job (Bull.js)
    setTimeout(async () => {
      // Verificar si hubo respuesta en el tiempo
      const lastUserMessage = await this.getLastUserMessage(conversation.id)
      const timeSinceLastMessage = Date.now() - lastUserMessage.created_at
      
      if (timeSinceLastMessage >= minutes * 60 * 1000) {
        // No respondió, enviar fallback
        const sequence = await this.getActiveSequence()
        await this.client.sendMessage(
          conversation.phone,
          sequence.fallback_message
        )
      }
    }, minutes * 60 * 1000)
  }
}
```

---

## 🔄 GESTIÓN DE SESIÓN WHATSAPP EN CRM

### Panel de Gestión de Sesión

```
┌─────────────────────────────────────────────────────────────┐
│  MEDICINA NATURAL - Gestión WhatsApp                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📱 Sesión Actual                                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Estado: 🟢 Conectado                              │    │
│  │ Número: +549 11 XXXX-XXXX                          │    │
│  │ Conectado desde: 15/10/2025 10:30                  │    │
│  │ Mensajes enviados hoy: 47                          │    │
│  │ Última actividad: Hace 2 minutos                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  🚨 ZONA DE CAMBIO DE NÚMERO                                │
│  ┌────────────────────────────────────────────────────┐    │
│  │ ⚠️ ATENCIÓN: Esta acción cerrará la sesión actual │    │
│  │                                                     │    │
│  │ ¿Por qué cambiar?                                  │    │
│  │ [ ] Número baneado                                 │    │
│  │ [ ] Cambio de línea                                │    │
│  │ [ ] Mantenimiento preventivo                       │    │
│  │ [ ] Otro: _____________________                    │    │
│  │                                                     │    │
│  │ [🔴 Cerrar Sesión y Generar Nuevo QR]             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  📊 Historial de Sesiones                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Sesión #3 - +549 11 XXXX-1111                      │    │
│  │ Activa: 10/10/25 - 15/10/25 (5 días)              │    │
│  │ Razón cierre: Número baneado                       │    │
│  │ Mensajes totales: 234                              │    │
│  ├────────────────────────────────────────────────────┤    │
│  │ Sesión #2 - +549 11 XXXX-2222                      │    │
│  │ Activa: 01/10/25 - 10/10/25 (9 días)              │    │
│  │ Razón cierre: Cambio preventivo                    │    │
│  │ Mensajes totales: 412                              │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  💡 Recomendaciones                                         │
│  • Cambiar número cada 7-10 días preventivamente           │
│  • Usar números descartables                               │
│  • No superar 200 mensajes por día                         │
│  • Evitar envíos masivos                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Cambio de Sesión

```
1. Admin hace clic en "Cerrar Sesión"
   ↓
2. Sistema confirma acción
   ↓
3. Borra sesión de whatsapp-web.js
   ↓
4. Marca sesión anterior como "cerrada" en DB
   ↓
5. Genera nuevo QR code
   ↓
6. Muestra QR en pantalla
   ↓
7. Admin escanea con nuevo número
   ↓
8. whatsapp-web.js se conecta
   ↓
9. Guarda nueva sesión en DB
   ↓
10. Bot vuelve a estar operativo
```

### Componente de QR Scanner

```typescript
// app/admin/whatsapp/session/page.tsx
'use client'

export default function WhatsAppSessionPage() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'qr_pending'>('disconnected')
  
  const handleResetSession = async () => {
    if (!confirm('¿Estás seguro? Esto cerrará la sesión actual de WhatsApp')) {
      return
    }
    
    try {
      // Llamar API para resetear
      const response = await fetch('/api/whatsapp/reset-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'manual_reset' })
      })
      
      if (response.ok) {
        setStatus('qr_pending')
        // Conectar a WebSocket para recibir QR en tiempo real
        const socket = io()
        socket.on('qr_generated', (qr) => {
          setQrCode(qr)
        })
        socket.on('session_connected', () => {
          setStatus('connected')
          setQrCode(null)
          toast.success('WhatsApp conectado exitosamente')
        })
      }
    } catch (error) {
      toast.error('Error al resetear sesión')
    }
  }
  
  return (
    <div className="container">
      {status === 'connected' && (
        <div className="alert alert-success">
          ✅ WhatsApp Conectado
        </div>
      )}
      
      {status === 'qr_pending' && qrCode && (
        <div className="qr-container">
          <h2>Escanea este código QR</h2>
          <QRCode value={qrCode} size={300} />
          <p>Usa WhatsApp en tu nuevo número</p>
        </div>
      )}
      
      {status === 'connected' && (
        <Button 
          onClick={handleResetSession}
          variant="destructive"
        >
          🔴 Cerrar Sesión y Generar Nuevo QR
        </Button>
      )}
    </div>
  )
}
```

### API para Gestión de Sesión

```typescript
// app/api/whatsapp/reset-session/route.ts
export async function POST(request: Request) {
  try {
    const { reason } = await request.json()
    
    // 1. Marcar sesión actual como cerrada
    await sql`
      UPDATE whatsapp_sessions 
      SET status = 'disconnected',
          banned_reason = ${reason},
          banned_at = CURRENT_TIMESTAMP
      WHERE is_active = true
    `
    
    // 2. Llamar al bot para destruir sesión
    const botResponse = await fetch('http://whatsapp-bot:5000/destroy-session', {
      method: 'POST'
    })
    
    // 3. Crear nueva sesión
    await sql`
      INSERT INTO whatsapp_sessions (session_name, status)
      VALUES ('main', 'qr_pending')
    `
    
    // 4. Inicializar nuevo cliente de WhatsApp
    await fetch('http://whatsapp-bot:5000/initialize', {
      method: 'POST'
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## 👥 PANEL DE LEADS EN CRM

### Vista de Leads

```
┌─────────────────────────────────────────────────────────────┐
│  MEDICINA NATURAL - Leads                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 Estadísticas Rápidas                                    │
│  ┌─────────┬─────────┬─────────┬─────────┐                │
│  │ Nuevos  │ Contact.│ Calif.  │ Convert.│                │
│  │   47    │   23    │   12    │    8    │                │
│  │ (Hoy)   │(Semana) │(Semana) │ (Mes)   │                │
│  └─────────┴─────────┴─────────┴─────────┘                │
│                                                              │
│  🔍 Filtros                                                 │
│  Estado: [Todos ▼]  Origen: [Todos ▼]  Fecha: [Hoy ▼]    │
│  Buscar: [🔍 Nombre o teléfono...]                         │
│                                                              │
│  📋 Lista de Leads                                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 🟢 Juan Pérez                                      │    │
│  │ 📱 +549 11 2345-6789                               │    │
│  │ 📅 18/10/2025 14:30 | 🌐 Web Chat                 │    │
│  │ 💬 "Consulta sobre aceite CBD 500mg"              │    │
│  │ 📦 Interesado en: Aceite Full Spectrum            │    │
│  │ Estado: Nuevo | Asignado a: Sin asignar           │    │
│  │ [💬 Ver Chat] [👤 Asignar] [📝 Notas]            │    │
│  ├────────────────────────────────────────────────────┤    │
│  │ 🟡 María González                                  │    │
│  │ 📱 +549 11 3456-7890                               │    │
│  │ 📅 18/10/2025 12:15 | 🌐 Web Chat                 │    │
│  │ 💬 "Precio de crema para dolores"                 │    │
│  │ 📦 Interesado en: Crema Tópica                    │    │
│  │ Estado: Contactado | Asignado a: Admin           │    │
│  │ [💬 Ver Chat] [✓ Marcar Calificado] [📝 Notas]  │    │
│  ├────────────────────────────────────────────────────┤    │
│  │ ⚪ Carlos Rodríguez                               │    │
│  │ 📱 +549 11 4567-8901                               │    │
│  │ 📅 17/10/2025 18:45 | 🌐 Web Chat                 │    │
│  │ 💬 "Info sobre envíos al interior"                │    │
│  │ 📦 Interesado en: Cápsulas CBD                    │    │
│  │ Estado: Calificado | Asignado a: Admin           │    │
│  │ [💬 Ver Chat] [💰 Marcar Convertido] [📝]        │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  [⬅️ Anterior] Página 1 de 8 [Siguiente ➡️]               │
│  [📤 Exportar CSV] [📊 Generar Reporte]                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Estados de Lead

```
Nuevo (🟢)
  ↓
Contactado (🟡)
  ↓
Calificado (🔵)
  ↓
Convertido (✅) / Perdido (❌)
```

### API de Leads

```typescript
// app/api/leads/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const source = searchParams.get('source')
  const date = searchParams.get('date') // 'today', 'week', 'month'
  const search = searchParams.get('search')
  
  let query = sql`SELECT * FROM leads WHERE 1=1`
  
  if (status && status !== 'all') {
    query = sql`${query} AND status = ${status}`
  }
  
  if (source && source !== 'all') {
    query = sql`${query} AND source = ${source}`
  }
  
  if (date === 'today') {
    query = sql`${query} AND created_at >= CURRENT_DATE`
  } else if (date === 'week') {
    query = sql`${query} AND created_at >= CURRENT_DATE - INTERVAL '7 days'`
  }
  
  if (search) {
    query = sql`${query} AND (name ILIKE ${`%${search}%`} OR phone ILIKE ${`%${search}%`})`
  }
  
  query = sql`${query} ORDER BY created_at DESC LIMIT 50`
  
  const result = await query
  
  return NextResponse.json(result.rows)
}
```

---

## 🏗️ DOCKER-COMPOSE ACTUALIZADO

```yaml
version: '3.8'

services:
  # PostgreSQL - Base de datos principal
  postgres:
    image: postgres:15-alpine
    container_name: medicina-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: medicinanatural
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d medicinanatural"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Next.js - Frontend + API Routes
  nextjs:
    build: 
      context: .
      dockerfile: Dockerfile.nextjs
    container_name: medicina-nextjs
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://admin:${DB_PASSWORD}@postgres:5432/medicinanatural
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - WS_URL=http://websocket:4000
      - WHATSAPP_BOT_URL=http://whatsapp-bot:5000
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    volumes:
      - ./public/uploads:/app/public/uploads
      - ./logs:/app/logs

  # WebSocket Server - Socket.io para tiempo real
  websocket:
    build:
      context: ./services/websocket
      dockerfile: Dockerfile
    container_name: medicina-websocket
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://admin:${DB_PASSWORD}@postgres:5432/medicinanatural
      - PORT=4000
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs

  # WhatsApp Bot - whatsapp-web.js
  whatsapp-bot:
    build:
      context: ./services/whatsapp-bot
      dockerfile: Dockerfile
    container_name: medicina-whatsapp-bot
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://admin:${DB_PASSWORD}@postgres:5432/medicinanatural
      - WS_URL=http://websocket:4000
      - PORT=5000
    depends_on:
      postgres:
        condition: service_healthy
      websocket:
        condition: service_started
    restart: unless-stopped
    volumes:
      - ./whatsapp-sessions:/app/sessions
      - ./logs:/app/logs
    # Recursos limitados para prevenir uso excesivo
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'

  # Nginx - Reverse Proxy + SSL
  nginx:
    image: nginx:alpine
    container_name: medicina-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./public:/usr/share/nginx/html/public
    depends_on:
      - nextjs
    restart: unless-stopped

  # Redis (Opcional) - Para caché y queues
  redis:
    image: redis:7-alpine
    container_name: medicina-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped
    command: redis-server --appendonly yes

volumes:
  postgres-data:
  redis-data:
```

---

## 📝 RESUMEN DE SOLUCIONES

### ✅ Número WhatsApp Descartable
- Panel en CRM para cambiar sesión
- Historial de sesiones
- QR code generado en tiempo real
- Conversaciones siguen en DB aunque cambie número

### ✅ Base de Datos
- **PostgreSQL en VPS** (recomendado)
- Schema completo diseñado
- Tablas: conversaciones, mensajes, leads, sesiones, autorespuestas
- Índices para performance
- Triggers automáticos

### ✅ Respuestas del Dueño
- **Opción A (Recomendada)**: CRM como Quasi-WhatsApp
- PWA para móvil con notificaciones push
- No depende de WhatsApp físico
- Sin riesgo de baneo del número personal

### ✅ Autorespuestas Configurables
- Editor visual en CRM
- Tipos: texto, imagen, video, audio
- Delays configurables entre mensajes
- Fallback si no responde
- Horarios activos
- Múltiples secuencias

### ✅ Panel de Leads
- Vista completa de todos los leads
- Estados: nuevo, contactado, calificado, convertido
- Filtros y búsqueda
- Estadísticas
- Exportar a CSV

---

## 🚀 PRÓXIMOS PASOS

1. **Agrega el branding completo** en la carpeta `branding-nuevo/`

2. **Responde estas preguntas:**
   - ¿Confirmas PostgreSQL en VPS como base de datos?
   - ¿El dueño usará CRM web/PWA o necesita WhatsApp físico?
   - ¿Cuántas secuencias de autorespuestas necesitas inicialmente?
   - ¿Cada cuántos días planeas cambiar el número preventivamente?

3. **Revisión final de la propuesta** y empezamos implementación

¿Te parece bien esta solución actualizada? ¿Algún ajuste necesario?

