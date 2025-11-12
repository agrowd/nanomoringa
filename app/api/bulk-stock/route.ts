import { NextRequest, NextResponse } from "next/server"
import { sql } from '@vercel/postgres'

// POST - Actualizar stock de múltiples productos
export async function POST(request: NextRequest) {
  try {
    const { updates } = await request.json()
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ 
        error: "Se requiere un array de actualizaciones" 
      }, { status: 400 })
    }

    console.log('[API Bulk Stock] Updating stock for', updates.length, 'products')
    
    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    // Actualizar cada producto
    for (const update of updates) {
      const { id, stock } = update
      
      if (!id || stock === undefined || stock === null) {
        errorCount++
        errors.push(`Producto ${id}: datos inválidos`)
        continue
      }

      try {
        await sql`
          UPDATE products 
          SET stock = ${parseInt(stock)}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
        `
        successCount++
      } catch (error) {
        errorCount++
        errors.push(`Producto ${id}: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      }
    }

    console.log(`[API Bulk Stock] Updated ${successCount} products, ${errorCount} errors`)

    return NextResponse.json({
      success: true,
      message: `Stock actualizado para ${successCount} productos`,
      successCount,
      errorCount,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    console.error('[API Bulk Stock] Error:', error)
    return NextResponse.json({ 
      error: "Error actualizando stock", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

