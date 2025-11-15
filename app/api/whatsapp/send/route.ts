import { NextResponse } from 'next/server'
import { getConversationByPhone, saveMessage, createOrUpdateConversation } from '@/lib/whatsapp-db'

// Este endpoint será llamado por el bot cuando necesite enviar un mensaje
// O por la web app para enviar mensajes a través del bot
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, message, message_type, media_url, sender_type = 'admin', reply_to_message_id } = body
    
    if (!phone || (!message && !media_url)) {
      return NextResponse.json(
        { error: 'phone and message or media_url required' },
        { status: 400 }
      )
    }
    
    // Obtener o crear conversación
    let conversation = await getConversationByPhone(phone)
    if (!conversation) {
      conversation = await createOrUpdateConversation(phone, 'Usuario', 'active')
    }
    
    // Guardar mensaje en BD
    const savedMessage = await saveMessage({
      conversation_id: conversation.id,
      sender_type,
      message_type: message_type || 'text',
      message: message || '',
      media_url,
      read: true, // Los mensajes que enviamos están leídos
      metadata: reply_to_message_id ? { reply_to: reply_to_message_id } : undefined
    })
    
    // Notificar al bot para que envíe el mensaje
    const botUrl = process.env.WHATSAPP_BOT_URL || 'http://localhost:7002'
    try {
      await fetch(`${botUrl}/api/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          message: message || '',
          message_type,
          media_url,
          conversation_id: conversation.id,
          reply_to_message_id
        })
      })
    } catch (botError) {
      console.error('Error notifying bot:', botError)
      // Continuar aunque el bot no esté disponible
    }
    
    return NextResponse.json({
      success: true,
      message: savedMessage
    })
  } catch (error: any) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

