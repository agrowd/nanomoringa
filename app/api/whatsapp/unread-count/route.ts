import { NextResponse } from 'next/server'
import { getUnreadMessagesCount } from '@/lib/whatsapp-db'

export async function GET() {
  try {
    const count = await getUnreadMessagesCount()
    return NextResponse.json({ count })
  } catch (error: any) {
    console.error('Error getting unread messages count:', error)
    return NextResponse.json(
      { error: error.message, count: 0 },
      { status: 500 }
    )
  }
}

