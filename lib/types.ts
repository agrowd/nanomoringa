export interface Product {
  id: string
  name: string
  slug: string
  description: string
  long_description?: string
  longDescription?: string // Para compatibilidad con el frontend
  price: number
  compare_at?: number
  compareAt?: number // Para compatibilidad con el frontend
  category: string
  sizes: string[]
  colors: string[]
  images: string[]
  videos?: string[] // Nuevo campo para videos
  tags: string[]
  stock: number
  featured: boolean
  sku: string
  created_at: string
  createdAt: string // Para compatibilidad con el frontend
  // Campos para ofertas
  is_on_sale?: boolean
  sale_price?: number
  sale_start_date?: string
  sale_end_date?: string
  sale_duration_days?: number
}

export interface CartItem {
  id: string
  name: string
  price: number
  qty: number
  variant: {
    size: string
    color: string
  }
  image: string
}

export interface Cart {
  items: CartItem[]
}

export interface Coupon {
  id: number
  code: string
  name: string
  description?: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase: number
  maxUses?: number
  currentUses: number
  expiresAt?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

// WhatsApp Types
export interface WhatsAppConversation {
  id: string
  phone: string
  name?: string
  lastMessageText?: string
  lastMessageAt: Date
  unreadCount: number
  status: 'active' | 'archived' | 'blocked'
  createdAt: Date
  updatedAt: Date
}

export interface WhatsAppMessage {
  id: string
  conversationId: string
  messageText: string
  sender: 'user' | 'admin'
  fromWhatsApp: boolean
  timestamp: Date
  messageType: 'text' | 'image' | 'audio' | 'video' | 'document'
  mediaUrl?: string
}

export interface WhatsAppBotStatus {
  isConnected: boolean
  qrCode?: string | null
  phoneNumber?: string
  lastUpdate?: Date
}
