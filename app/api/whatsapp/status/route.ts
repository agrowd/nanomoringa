import { NextResponse } from 'next/server'
import { getSession } from '@/lib/whatsapp-db'

export async function GET() {
  try {
    const session = await getSession('client-cbd-new')
    
    return NextResponse.json({
      connected: session?.status === 'connected',
      qrCode: session?.qr_code || null,
      phoneNumber: session?.phone_number || null,
      status: session?.status || 'disconnected',
      lastConnectedAt: session?.last_connected_at || null
    })
  } catch (error: any) {
    console.error('Error getting WhatsApp status:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

