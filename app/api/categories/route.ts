import { NextResponse } from "next/server"
import { sql } from '@vercel/postgres'

export async function GET() {
  try {
    console.log('[API Categories] Fetching all categories...')
    
    // Obtener todas las categorías únicas de los productos
    const result = await sql`
      SELECT DISTINCT category 
      FROM products 
      WHERE category IS NOT NULL 
      AND category != '' 
      ORDER BY category
    `
    
    const categories = result.rows.map(row => row.category)
    
    console.log(`[API Categories] Found ${categories.length} categories`)
    return NextResponse.json(categories)
  } catch (error) {
    console.error('[API Categories] Error:', error)
    return NextResponse.json({ 
      error: "Error fetching categories", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
