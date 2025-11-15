import { sql } from '@vercel/postgres'

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface WhatsAppConversation {
  id: number
  phone: string
  name: string
  status: 'active' | 'archived' | 'blocked'
  assigned_to?: number
  created_at: string
  updated_at: string
  last_message_at?: string
  tags?: string[]
}

export interface WhatsAppMessage {
  id: number
  conversation_id: number
  sender_type: 'user' | 'admin' | 'bot'
  sender_id?: number
  sender_name?: string
  message_type: 'text' | 'image' | 'video' | 'audio' | 'document'
  message: string
  media_url?: string
  media_caption?: string
  whatsapp_message_id?: string
  whatsapp_status?: 'sent' | 'delivered' | 'read' | 'failed'
  read: boolean
  read_at?: string
  created_at: string
  metadata?: Record<string, any>
}

export interface WhatsAppBotMessage {
  id: number
  type: 'text' | 'image'
  content: string
  delay: number
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WhatsAppSession {
  id: number
  session_name: string
  phone_number?: string
  qr_code?: string
  status: 'disconnected' | 'connecting' | 'connected'
  last_connected_at?: string
  created_at: string
}

// ─── Inicializar tablas ──────────────────────────────────────────────────────
export async function initWhatsAppDatabase() {
  try {
    // Tabla de conversaciones
    await sql`
      CREATE TABLE IF NOT EXISTS whatsapp_conversations (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        assigned_to INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_message_at TIMESTAMP,
        tags TEXT[]
      )
    `

    // Tabla de mensajes
    await sql`
      CREATE TABLE IF NOT EXISTS whatsapp_messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES whatsapp_conversations(id) ON DELETE CASCADE,
        sender_type VARCHAR(20) NOT NULL,
        sender_id INTEGER,
        sender_name VARCHAR(255),
        message_type VARCHAR(20) DEFAULT 'text',
        message TEXT NOT NULL,
        media_url TEXT,
        media_caption TEXT,
        whatsapp_message_id VARCHAR(255) UNIQUE,
        whatsapp_status VARCHAR(50),
        read BOOLEAN DEFAULT false,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        metadata JSONB
      )
    `

    // Tabla de mensajes del bot (cadena de mensajes)
    await sql`
      CREATE TABLE IF NOT EXISTS whatsapp_bot_messages (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        delay INTEGER DEFAULT 0,
        "order" INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Tabla de sesiones
    await sql`
      CREATE TABLE IF NOT EXISTS whatsapp_sessions (
        id SERIAL PRIMARY KEY,
        session_name VARCHAR(100) UNIQUE NOT NULL,
        phone_number VARCHAR(20),
        qr_code TEXT,
        status VARCHAR(50) DEFAULT 'disconnected',
        last_connected_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Índices para mejor performance
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_conversation ON whatsapp_messages(conversation_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_created ON whatsapp_messages(created_at)`
    await sql`CREATE INDEX IF NOT EXISTS idx_conversations_phone ON whatsapp_conversations(phone)`
    await sql`CREATE INDEX IF NOT EXISTS idx_bot_messages_order ON whatsapp_bot_messages("order")`

    console.log('✅ WhatsApp database tables initialized')
  } catch (error) {
    console.error('❌ Error initializing WhatsApp database:', error)
    throw error
  }
}

// ─── Conversaciones ──────────────────────────────────────────────────────────
export async function getConversationByPhone(phone: string): Promise<WhatsAppConversation | null> {
  try {
    const { rows } = await sql`
      SELECT * FROM whatsapp_conversations 
      WHERE phone = ${phone}
      LIMIT 1
    `
    return (rows[0] as WhatsAppConversation) || null
  } catch (error) {
    console.error('Error getting conversation:', error)
    return null
  }
}

export async function getConversationById(id: number): Promise<WhatsAppConversation | null> {
  try {
    const { rows } = await sql`
      SELECT * FROM whatsapp_conversations 
      WHERE id = ${id}
      LIMIT 1
    `
    return (rows[0] as WhatsAppConversation) || null
  } catch (error) {
    console.error('Error getting conversation by ID:', error)
    return null
  }
}

export async function createOrUpdateConversation(
  phone: string,
  name: string,
  status: string = 'active'
): Promise<WhatsAppConversation> {
  try {
    const { rows } = await sql`
      INSERT INTO whatsapp_conversations (phone, name, status, updated_at, last_message_at)
      VALUES (${phone}, ${name}, ${status}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (phone) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        updated_at = CURRENT_TIMESTAMP,
        last_message_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    return rows[0] as WhatsAppConversation
  } catch (error) {
    console.error('Error creating/updating conversation:', error)
    throw error
  }
}

export async function getAllConversations(): Promise<WhatsAppConversation[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM whatsapp_conversations 
      ORDER BY last_message_at DESC NULLS LAST, created_at DESC
    `
    return rows as WhatsAppConversation[]
  } catch (error) {
    console.error('Error getting conversations:', error)
    return []
  }
}

export async function updateConversationTags(conversationId: number, tags: string[]): Promise<void> {
  try {
    // PostgreSQL TEXT[] necesita un array directamente, no JSON
    await sql`
      UPDATE whatsapp_conversations 
      SET tags = ${tags}::text[], updated_at = CURRENT_TIMESTAMP
      WHERE id = ${conversationId}
    `
  } catch (error) {
    console.error('Error updating conversation tags:', error)
    throw error
  }
}

export async function getUnreadMessagesCount(): Promise<number> {
  try {
    const { rows } = await sql`
      SELECT COUNT(*) as count 
      FROM whatsapp_messages 
      WHERE sender_type = 'user' AND read = false
    `
    return parseInt(rows[0]?.count || '0')
  } catch (error) {
    console.error('Error getting unread messages count:', error)
    return 0
  }
}

// ─── Mensajes ────────────────────────────────────────────────────────────────
export async function saveMessage(message: Omit<WhatsAppMessage, 'id' | 'created_at'>): Promise<WhatsAppMessage> {
  try {
    const { rows } = await sql`
      INSERT INTO whatsapp_messages (
        conversation_id, sender_type, sender_id, sender_name,
        message_type, message, media_url, media_caption,
        whatsapp_message_id, whatsapp_status, read, metadata
      )
      VALUES (
        ${message.conversation_id}, ${message.sender_type}, 
        ${message.sender_id || null}, ${message.sender_name || null},
        ${message.message_type}, ${message.message}, 
        ${message.media_url || null}, ${message.media_caption || null},
        ${message.whatsapp_message_id || null}, ${message.whatsapp_status || null},
        ${message.read || false}, ${message.metadata ? JSON.stringify(message.metadata) : null}
      )
      RETURNING *
    `
    return rows[0] as WhatsAppMessage
  } catch (error) {
    console.error('Error saving message:', error)
    throw error
  }
}

export async function updateMessageStatus(
  messageId: number,
  whatsappStatus: 'sent' | 'delivered' | 'read' | 'failed'
): Promise<void> {
  try {
    await sql`
      UPDATE whatsapp_messages 
      SET whatsapp_status = ${whatsappStatus},
          read = ${whatsappStatus === 'read' ? true : false},
          read_at = ${whatsappStatus === 'read' ? new Date().toISOString() : null}
      WHERE id = ${messageId}
    `
  } catch (error) {
    console.error('Error updating message status:', error)
  }
}

export async function hasBotMessages(conversationId: number): Promise<boolean> {
  try {
    const { rows } = await sql`
      SELECT COUNT(*) as count FROM whatsapp_messages 
      WHERE conversation_id = ${conversationId} AND sender_type = 'bot'
      LIMIT 1
    `
    return parseInt(rows[0]?.count || '0') > 0
  } catch (error) {
    console.error('Error checking bot messages:', error)
    return false
  }
}

export async function getMessagesByConversation(
  conversationId: number,
  limit: number = 100
): Promise<WhatsAppMessage[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM whatsapp_messages 
      WHERE conversation_id = ${conversationId}
      ORDER BY created_at ASC
      LIMIT ${limit}
    `
    return rows as WhatsAppMessage[]
  } catch (error) {
    console.error('Error getting messages:', error)
    return []
  }
}

export async function markMessageAsRead(messageId: number): Promise<void> {
  try {
    await sql`
      UPDATE whatsapp_messages 
      SET read = true, read_at = CURRENT_TIMESTAMP
      WHERE id = ${messageId}
    `
  } catch (error) {
    console.error('Error marking message as read:', error)
  }
}

// ─── Bot Messages (Cadena de mensajes) ───────────────────────────────────────
export async function getBotMessages(): Promise<WhatsAppBotMessage[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM whatsapp_bot_messages 
      WHERE is_active = true
      ORDER BY "order" ASC
    `
    return rows as WhatsAppBotMessage[]
  } catch (error) {
    console.error('Error getting bot messages:', error)
    return []
  }
}

export async function saveBotMessages(messages: Omit<WhatsAppBotMessage, 'id' | 'created_at' | 'updated_at'>[]): Promise<void> {
  try {
    // Desactivar todos los mensajes actuales
    await sql`UPDATE whatsapp_bot_messages SET is_active = false`

    // Insertar nuevos mensajes
    for (const msg of messages) {
      await sql`
        INSERT INTO whatsapp_bot_messages (type, content, delay, "order", is_active)
        VALUES (${msg.type}, ${msg.content}, ${msg.delay}, ${msg.order}, ${msg.is_active})
      `
    }
  } catch (error) {
    console.error('Error saving bot messages:', error)
    throw error
  }
}

// ─── Sesiones ────────────────────────────────────────────────────────────────
export async function updateSession(
  sessionName: string,
  updates: Partial<Omit<WhatsAppSession, 'id' | 'created_at'>>
): Promise<WhatsAppSession> {
  try {
    const { rows } = await sql`
      INSERT INTO whatsapp_sessions (session_name, phone_number, qr_code, status, last_connected_at)
      VALUES (${sessionName}, ${updates.phone_number || null}, ${updates.qr_code || null}, 
              ${updates.status || 'disconnected'}, 
              ${updates.last_connected_at ? new Date(updates.last_connected_at).toISOString() : null})
      ON CONFLICT (session_name)
      DO UPDATE SET
        phone_number = COALESCE(EXCLUDED.phone_number, whatsapp_sessions.phone_number),
        qr_code = COALESCE(EXCLUDED.qr_code, whatsapp_sessions.qr_code),
        status = COALESCE(EXCLUDED.status, whatsapp_sessions.status),
        last_connected_at = COALESCE(EXCLUDED.last_connected_at, whatsapp_sessions.last_connected_at)
      RETURNING *
    `
    return rows[0] as WhatsAppSession
  } catch (error) {
    console.error('Error updating session:', error)
    throw error
  }
}

export async function getSession(sessionName: string): Promise<WhatsAppSession | null> {
  try {
    const { rows } = await sql`
      SELECT * FROM whatsapp_sessions 
      WHERE session_name = ${sessionName}
      LIMIT 1
    `
    return (rows[0] as WhatsAppSession) || null
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

// ─── Verificar si un número ya fue procesado ───────────────────────────────
export async function isPhoneProcessed(phone: string): Promise<boolean> {
  try {
    const conversation = await getConversationByPhone(phone)
    return conversation !== null
  } catch (error) {
    console.error('Error checking if phone is processed:', error)
    return false
  }
}

