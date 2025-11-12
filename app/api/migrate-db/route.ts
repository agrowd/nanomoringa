import { NextResponse } from "next/server"
import { sql } from '@vercel/postgres'

export async function GET() {
  try {
    console.log('[MIGRATE] Starting database migration...')
    
    // Verificar columnas existentes
    const existingColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products'
    `
    
    console.log('[MIGRATE] Existing columns:', existingColumns.rows.map(r => r.column_name))
    
    const columnNames = existingColumns.rows.map(r => r.column_name)
    const migrations = []
    
    // Agregar columna is_on_sale si no existe
    if (!columnNames.includes('is_on_sale')) {
      await sql`ALTER TABLE products ADD COLUMN is_on_sale BOOLEAN DEFAULT false`
      migrations.push('is_on_sale')
      console.log('[MIGRATE] Added column: is_on_sale')
    }
    
    // Agregar columna sale_price si no existe
    if (!columnNames.includes('sale_price')) {
      await sql`ALTER TABLE products ADD COLUMN sale_price DECIMAL`
      migrations.push('sale_price')
      console.log('[MIGRATE] Added column: sale_price')
    }
    
    // Agregar columna sale_start_date si no existe
    if (!columnNames.includes('sale_start_date')) {
      await sql`ALTER TABLE products ADD COLUMN sale_start_date TIMESTAMP`
      migrations.push('sale_start_date')
      console.log('[MIGRATE] Added column: sale_start_date')
    }
    
    // Agregar columna sale_end_date si no existe
    if (!columnNames.includes('sale_end_date')) {
      await sql`ALTER TABLE products ADD COLUMN sale_end_date TIMESTAMP`
      migrations.push('sale_end_date')
      console.log('[MIGRATE] Added column: sale_end_date')
    }
    
    // Agregar columna sale_duration_days si no existe
    if (!columnNames.includes('sale_duration_days')) {
      await sql`ALTER TABLE products ADD COLUMN sale_duration_days INTEGER DEFAULT 7`
      migrations.push('sale_duration_days')
      console.log('[MIGRATE] Added column: sale_duration_days')
    }
    
    // Agregar columna videos si no existe
    if (!columnNames.includes('videos')) {
      await sql`ALTER TABLE products ADD COLUMN videos TEXT[] DEFAULT '{}'`
      migrations.push('videos')
      console.log('[MIGRATE] Added column: videos')
    }
    
    // Agregar columna long_description si no existe
    if (!columnNames.includes('long_description')) {
      await sql`ALTER TABLE products ADD COLUMN long_description TEXT DEFAULT ''`
      migrations.push('long_description')
      console.log('[MIGRATE] Added column: long_description')
    }
    
    console.log('[MIGRATE] Migration completed successfully')
    
    return NextResponse.json({ 
      success: true,
      message: 'Database migration completed',
      migrationsApplied: migrations.length,
      columnsAdded: migrations
    })
  } catch (error) {
    console.error('[MIGRATE] Error during migration:', error)
    return NextResponse.json({ 
      error: "Migration failed",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST() {
  return GET()
}

