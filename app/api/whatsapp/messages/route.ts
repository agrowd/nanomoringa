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
    
    return NextResponse.json(savedMessage)
  } catch (error: any) {
    console.error('Error saving message:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

