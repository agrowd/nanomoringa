import { NextResponse } from 'next/server'
import { getConversationByPhone, saveMessage, createOrUpdateConversation, updateSession } from '@/lib/whatsapp-db'
import { emitEvent } from '../events/route'

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
        
        const savedMessage = await saveMessage({
          conversation_id: conversation.id,
          sender_type: 'user',
          sender_name: name,
          message_type: message_type || 'text',
          message,
          media_url,
          whatsapp_message_id,
          read: false
        })
        
        // Emitir evento SSE
        emitEvent({
          type: 'message_received',
          data: {
            conversation_id: conversation.id,
            message_id: savedMessage.id,
            phone,
            name,
            message
          }
        })
        break
        
      case 'message_sent':
        // Mensaje enviado por el bot
        const { phone: sentPhone, message: sentMessage, message_id } = data
        
        const sentConversation = await getConversationByPhone(sentPhone)
        if (sentConversation) {
          const savedSentMessage = await saveMessage({
            conversation_id: sentConversation.id,
            sender_type: 'bot',
            message_type: 'text',
            message: sentMessage,
            whatsapp_message_id: message_id,
            whatsapp_status: 'sent',
            read: true
          })
          
          // Emitir evento SSE
          emitEvent({
            type: 'message_sent',
            data: {
              conversation_id: sentConversation.id,
              message_id: savedSentMessage.id,
              phone: sentPhone,
              message: sentMessage
            }
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
        
        // Emitir evento SSE
        emitEvent({
          type: 'status_update',
          data: {
            status: data.status,
            qr_code: data.qr_code,
            phone_number: data.phone_number
          }
        })
        break
        
      case 'message_status_update':
        // Actualizar estado de un mensaje (sent/delivered/read)
        const { message_id, status } = data
        if (message_id) {
          const { updateMessageStatus } = await import('@/lib/whatsapp-db')
          await updateMessageStatus(message_id, status)
        }
        
        // Emitir evento SSE
        emitEvent({
          type: 'message_status_update',
          data: { message_id, status }
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

