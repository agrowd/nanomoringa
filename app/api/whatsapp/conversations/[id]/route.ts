import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = parseInt(params.id)
    
    if (!conversationId || isNaN(conversationId)) {
      return NextResponse.json(
        { error: 'Invalid conversation ID' },
        { status: 400 }
      )
    }
    
    // Eliminar mensajes primero (por la foreign key)
    await sql`
      DELETE FROM whatsapp_messages 
      WHERE conversation_id = ${conversationId}
    `
    
    // Eliminar la conversación
    const { rowCount } = await sql`
      DELETE FROM whatsapp_conversations 
      WHERE id = ${conversationId}
    `
    
    if (rowCount === 0) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Conversation deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

