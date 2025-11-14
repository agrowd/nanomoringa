import { NextResponse } from 'next/server'
import { getAllConversations, getMessagesByConversation } from '@/lib/whatsapp-db'

export async function GET() {
  try {
    const conversations = await getAllConversations()
    
    // Agregar último mensaje a cada conversación
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conv) => {
        const messages = await getMessagesByConversation(conv.id, 1)
        const lastMessage = messages[messages.length - 1]
        
        return {
          ...conv,
          lastMessage: lastMessage?.message || '',
          lastMessageTime: lastMessage?.created_at || conv.last_message_at,
          unreadCount: messages.filter(m => !m.read && m.sender_type === 'user').length
        }
      })
    )
    
    return NextResponse.json(conversationsWithLastMessage)
  } catch (error: any) {
    console.error('Error getting conversations:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

