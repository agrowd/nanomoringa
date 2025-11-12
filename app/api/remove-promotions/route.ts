import { NextResponse } from "next/server"
import { sql } from '@vercel/postgres'

export async function POST() {
  try {
    console.log('[API] Removing promotions from all products...')
    
    // Primero verificar si las columnas existen
    const checkColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      AND column_name IN ('is_on_sale', 'sale_price', 'sale_start_date', 'sale_end_date')
    `
    
    console.log('[API] Available columns:', checkColumns.rows)
    
    // Actualizar todos los productos para quitar promociones
    const result = await sql`
      UPDATE products 
      SET 
        is_on_sale = false,
        sale_price = NULL,
        sale_start_date = NULL,
        sale_end_date = NULL
    `
    
    console.log(`[API] Updated ${result.rowCount} products`)
    
    return NextResponse.json({ 
      success: true,
      message: `Promociones eliminadas de ${result.rowCount} productos`,
      productsUpdated: result.rowCount
    })
  } catch (error) {
    console.error('[API] Error removing promotions:', error)
    return NextResponse.json({ 
      error: "Error removing promotions",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// También permitir GET para facilitar el acceso desde el navegador
export async function GET() {
  try {
    console.log('[API] Removing promotions from all products...')
    
    // Primero verificar si las columnas existen
    const checkColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      AND column_name IN ('is_on_sale', 'sale_price', 'sale_start_date', 'sale_end_date')
    `
    
    console.log('[API] Available columns:', checkColumns.rows)
    
    // Actualizar todos los productos para quitar promociones
    const result = await sql`
      UPDATE products 
      SET 
        is_on_sale = false,
        sale_price = NULL,
        sale_start_date = NULL,
        sale_end_date = NULL
    `
    
    console.log(`[API] Updated ${result.rowCount} products`)
    
    return NextResponse.json({ 
      success: true,
      message: `Promociones eliminadas de ${result.rowCount} productos`,
      productsUpdated: result.rowCount
    })
  } catch (error) {
    console.error('[API] Error removing promotions:', error)
    return NextResponse.json({ 
      error: "Error removing promotions",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

