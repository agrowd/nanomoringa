import { NextResponse } from 'next/server'
import { markMessageAsRead } from '@/lib/whatsapp-db'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const messageId = parseInt(params.id)
    await markMessageAsRead(messageId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error marking message as read:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

