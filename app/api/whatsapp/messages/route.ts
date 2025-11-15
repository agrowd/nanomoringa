import { NextResponse } from 'next/server'
import { getConversationByPhone, getMessagesByConversation, saveMessage, createOrUpdateConversation } from '@/lib/whatsapp-db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    const conversationId = searchParams.get('conversationId')
    
    if (!phone && !conversationId) {
      return NextResponse.json(
        { error: 'phone or conversationId required' },
        { status: 400 }
      )
    }
    
    let messages
    if (conversationId) {
      messages = await getMessagesByConversation(parseInt(conversationId))
    } else if (phone) {
      const conversation = await getConversationByPhone(phone)
      if (!conversation) {
        return NextResponse.json([])
      }
      messages = await getMessagesByConversation(conversation.id)
    } else {
      return NextResponse.json([])
    }
    
    return NextResponse.json(messages)
  } catch (error: any) {
    console.error('Error getting messages:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, name, sender_type, message, message_type, media_url, whatsapp_message_id } = body
    
    if (!phone || !message) {
      return NextResponse.json(
        { error: 'phone and message required' },
        { status: 400 }
      )
    }
    
    // Crear o actualizar conversación
    const conversation = await createOrUpdateConversation(
      phone,
      name || 'Sin nombre',
      'active'
    )
    
    // Verificar si es el primer mensaje del usuario y no hay mensajes del bot
    const isFirstUserMessage = sender_type === 'user'
    let shouldTriggerChain = false
    
    if (isFirstUserMessage) {
      const { hasBotMessages } = await import('@/lib/whatsapp-db')
      const hasBot = await hasBotMessages(conversation.id)
      if (!hasBot) {
        shouldTriggerChain = true
      }
    }
    
    // Guardar mensaje
    const savedMessage = await saveMessage({
      conversation_id: conversation.id,
      sender_type: sender_type || 'user',
      sender_name: name,
      message_type: message_type || 'text',
      message,
      media_url,
      whatsapp_message_id,
      read: sender_type === 'admin' || sender_type === 'bot'
    })
    
    // Si es el primer mensaje del usuario y no hay mensajes del bot, activar cadena
    if (shouldTriggerChain) {
      try {
        // Importar y llamar directamente la función de envío de cadena
        const { getBotMessages } = await import('@/lib/whatsapp-db')
        const botMessages = await getBotMessages()
        
        if (botMessages.length > 0) {
          const botUrl = process.env.WHATSAPP_BOT_URL || 'http://localhost:7002'
          
          // Enviar cada mensaje con su delay
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
                console.log(`✅ Bot message ${i + 1} sent to ${name} (${phone})`)
              } else {
                console.error(`Error sending bot message ${i + 1}:`, await response.text())
              }
            } catch (error) {
              console.error(`Error sending bot message ${i + 1}:`, error)
            }
          }
          
          console.log(`✅ Chain sent for new user: ${name} (${phone})`)
        }
      } catch (chainError) {
        console.error('Error triggering chain:', chainError)
        // No fallar si hay error, solo loguear
      }
    }
    
    return NextResponse.json({
      ...savedMessage,
      conversation_id: conversation.id
    })
  } catch (error: any) {
    console.error('Error saving message:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

