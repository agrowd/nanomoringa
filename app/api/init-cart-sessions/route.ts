import { NextResponse } from "next/server"
import { sql } from '@vercel/postgres'

export async function GET() {
  try {
    console.log('[API Init Cart Sessions] Creating cart_sessions table...')
    
    // Crear tabla de sesiones de carrito
    await sql`
      CREATE TABLE IF NOT EXISTS cart_sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        user_id VARCHAR(255),
        items JSONB DEFAULT '[]',
        applied_coupon JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days')
      )
    `
    
    console.log('[API Init Cart Sessions] Table created successfully')
    
    // Crear índices para mejorar rendimiento
    await sql`CREATE INDEX IF NOT EXISTS idx_cart_sessions_session_id ON cart_sessions(session_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_cart_sessions_user_id ON cart_sessions(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_cart_sessions_expires_at ON cart_sessions(expires_at)`
    
    console.log('[API Init Cart Sessions] Indexes created successfully')
    
    return NextResponse.json({ 
      success: true, 
      message: "Cart sessions table initialized successfully" 
    })
  } catch (error) {
    console.error('[API Init Cart Sessions] Error:', error)
    return NextResponse.json({ 
      error: "Error initializing cart sessions table", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
