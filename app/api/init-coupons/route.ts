import { NextResponse } from "next/server"
import { sql } from '@vercel/postgres'

export async function GET() {
  try {
    console.log('[API Init Coupons] Creating coupons table...')
    
    // Crear tabla de cupones
    await sql`
      CREATE TABLE IF NOT EXISTS coupons (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
        discount_value DECIMAL(10, 2) NOT NULL,
        min_purchase DECIMAL(10, 2) DEFAULT 0,
        max_uses INTEGER DEFAULT NULL,
        current_uses INTEGER DEFAULT 0,
        expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        categories TEXT[] DEFAULT '{}',
        image_url TEXT,
        public_url VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    console.log('[API Init Coupons] Table created successfully')
    
    // Crear índices para mejorar rendimiento
    await sql`CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code)`
    await sql`CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active)`
    await sql`CREATE INDEX IF NOT EXISTS idx_coupons_expires ON coupons(expires_at)`
    
    console.log('[API Init Coupons] Indexes created successfully')
    
    return NextResponse.json({ 
      success: true, 
      message: "Coupons table initialized successfully" 
    })
  } catch (error) {
    console.error('[API Init Coupons] Error:', error)
    return NextResponse.json({ 
      error: "Error initializing coupons table", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

