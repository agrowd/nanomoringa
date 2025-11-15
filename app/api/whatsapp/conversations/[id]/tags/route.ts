import { NextResponse } from 'next/server'
import { updateConversationTags } from '@/lib/whatsapp-db'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = parseInt(params.id)
    const body = await request.json()
    const { tags } = body
    
    if (!Array.isArray(tags)) {
      return NextResponse.json(
        { error: 'tags must be an array' },
        { status: 400 }
      )
    }
    
    await updateConversationTags(conversationId, tags)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating conversation tags:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

