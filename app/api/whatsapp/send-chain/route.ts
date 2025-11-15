import { NextResponse } from 'next/server'
import { getBotMessages, getConversationByPhone, saveMessage, createOrUpdateConversation } from '@/lib/whatsapp-db'

// Endpoint para enviar la cadena de mensajes del bot desde Vercel
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, name } = body
    
    if (!phone) {
      return NextResponse.json(
        { error: 'phone required' },
        { status: 400 }
      )
    }
    
    // Obtener o crear conversación
    let conversation = await getConversationByPhone(phone)
    if (!conversation) {
      conversation = await createOrUpdateConversation(phone, name || 'Sin nombre', 'active')
    }
    
    // Obtener mensajes del bot desde la BD
    const botMessages = await getBotMessages()
    
    if (botMessages.length === 0) {
      return NextResponse.json(
        { error: 'No hay mensajes del bot configurados' },
        { status: 400 }
      )
    }
    
    const botUrl = process.env.WHATSAPP_BOT_URL || 'http://localhost:7002'
    
    // Enviar cada mensaje con su delay
    const sentMessages = []
    for (let i = 0; i < botMessages.length; i++) {
      const botMsg = botMessages[i]
      
      // Esperar el delay antes de enviar (excepto el primero)
      if (i > 0 && botMsg.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, botMsg.delay * 1000))
      }
      
      try {
        // Enviar mensaje al bot
        const response = await fetch(`${botUrl}/api/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            message: botMsg.type === 'image' ? '' : botMsg.content,
            message_type: botMsg.type,
            media_url: botMsg.type === 'image' ? botMsg.content : undefined,
            conversation_id: conversation.id,
            sender_type: 'bot'
          })
        })
        
        if (response.ok) {
          const result = await response.json()
          sentMessages.push({
            order: botMsg.order,
            whatsapp_message_id: result.whatsapp_message_id
          })
        } else {
          console.error(`Error sending message ${i + 1}:`, await response.text())
        }
      } catch (error) {
        console.error(`Error sending message ${i + 1}:`, error)
      }
    }
    
    return NextResponse.json({
      success: true,
      messages_sent: sentMessages.length,
      total_messages: botMessages.length
    })
  } catch (error: any) {
    console.error('Error sending message chain:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

