import { NextResponse } from 'next/server'
import { getConversationByPhone, saveMessage, createOrUpdateConversation, updateSession } from '@/lib/whatsapp-db'

// Webhook para recibir eventos del bot
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event, data } = body
    
    switch (event) {
      case 'message_received':
        // Mensaje recibido del usuario
        const { phone, name, message, message_type, media_url, whatsapp_message_id } = data
        
        const conversation = await createOrUpdateConversation(
          phone,
          name || 'Sin nombre',
          'active'
        )
        
        await saveMessage({
          conversation_id: conversation.id,
          sender_type: 'user',
          sender_name: name,
          message_type: message_type || 'text',
          message,
          media_url,
          whatsapp_message_id,
          read: false
        })
        
        // Emitir evento SSE (se implementará después)
        break
        
      case 'message_sent':
        // Mensaje enviado por el bot
        const { phone: sentPhone, message: sentMessage, message_id } = data
        
        const sentConversation = await getConversationByPhone(sentPhone)
        if (sentConversation) {
          await saveMessage({
            conversation_id: sentConversation.id,
            sender_type: 'bot',
            message_type: 'text',
            message: sentMessage,
            whatsapp_message_id: message_id,
            whatsapp_status: 'sent',
            read: true
          })
        }
        break
        
      case 'status_update':
        // Actualizar estado del bot (conectado, QR, etc.)
        await updateSession('client-cbd-new', {
          status: data.status,
          qr_code: data.qr_code,
          phone_number: data.phone_number,
          last_connected_at: data.connected_at
        })
        break
        
      default:
        console.log('Unknown event:', event)
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

