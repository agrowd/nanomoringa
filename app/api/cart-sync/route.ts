import { NextRequest, NextResponse } from "next/server"
import { sql } from '@vercel/postgres'

// GET - Obtener carrito de la base de datos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }
    
    console.log('[API Cart Sync] Fetching cart for session:', sessionId)
    
    const result = await sql`
      SELECT * FROM cart_sessions 
      WHERE session_id = ${sessionId}
      AND expires_at > CURRENT_TIMESTAMP
    `
    
    if (result.rows.length === 0) {
      return NextResponse.json({ items: [], appliedCoupon: null })
    }
    
    const cartSession = result.rows[0]
    
    return NextResponse.json({
      items: cartSession.items || [],
      appliedCoupon: cartSession.applied_coupon,
      lastSync: cartSession.updated_at
    })
  } catch (error) {
    console.error('[API Cart Sync GET] Error:', error)
    return NextResponse.json({ 
      error: "Error fetching cart", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

// POST - Guardar carrito en la base de datos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, items, appliedCoupon } = body
    
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }
    
    console.log('[API Cart Sync] Saving cart for session:', sessionId)
    
    // Upsert cart session
    const result = await sql`
      INSERT INTO cart_sessions (session_id, items, applied_coupon, expires_at)
      VALUES (${sessionId}, ${JSON.stringify(items)}, ${JSON.stringify(appliedCoupon)}, CURRENT_TIMESTAMP + INTERVAL '7 days')
      ON CONFLICT (session_id) 
      DO UPDATE SET 
        items = ${JSON.stringify(items)},
        applied_coupon = ${JSON.stringify(appliedCoupon)},
        updated_at = CURRENT_TIMESTAMP,
        expires_at = CURRENT_TIMESTAMP + INTERVAL '7 days'
      RETURNING *
    `
    
    console.log('[API Cart Sync] Cart saved successfully')
    return NextResponse.json({ 
      success: true, 
      message: "Cart synchronized successfully" 
    })
  } catch (error) {
    console.error('[API Cart Sync POST] Error:', error)
    return NextResponse.json({ 
      error: "Error saving cart", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

// DELETE - Limpiar carritos expirados
export async function DELETE() {
  try {
    console.log('[API Cart Sync] Cleaning expired carts...')
    
    const result = await sql`
      DELETE FROM cart_sessions 
      WHERE expires_at < CURRENT_TIMESTAMP
      RETURNING session_id
    `
    
    console.log(`[API Cart Sync] Cleaned ${result.rowCount} expired carts`)
    return NextResponse.json({ 
      success: true, 
      message: `Cleaned ${result.rowCount} expired carts` 
    })
  } catch (error) {
    console.error('[API Cart Sync DELETE] Error:', error)
    return NextResponse.json({ 
      error: "Error cleaning expired carts", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
