import { NextResponse } from 'next/server'
import { getBotMessages, saveBotMessages } from '@/lib/whatsapp-db'

export async function GET() {
  try {
    const messages = await getBotMessages()
    return NextResponse.json(messages)
  } catch (error: any) {
    console.error('Error getting bot messages:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages } = body
    
    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'messages must be an array' },
        { status: 400 }
      )
    }
    
    // Formatear mensajes con order
    const formattedMessages = messages.map((msg: any, index: number) => ({
      type: msg.type || 'text',
      content: msg.content || msg.message || '',
      delay: msg.delay || 0,
      order: index + 1,
      is_active: true
    }))
    
    await saveBotMessages(formattedMessages)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Bot messages saved successfully' 
    })
  } catch (error: any) {
    console.error('Error saving bot messages:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

