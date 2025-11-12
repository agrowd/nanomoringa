import { NextRequest, NextResponse } from "next/server"
import { sql } from '@vercel/postgres'
import { adaptProductFromDB } from '@/lib/db-adapter'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    if (!slug) {
      return NextResponse.json({ error: "Slug parameter required" }, { status: 400 })
    }
    
    console.log('[API Debug Slug] Searching for slug:', slug)
    
    // Buscar por slug
    const result = await sql`SELECT * FROM products WHERE slug = ${slug}`
    
    console.log('[API Debug Slug] Query result:', { rowCount: result.rows.length })
    
    if (result.rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Product not found by slug",
        slug,
        rowCount: 0
      })
    }
    
    console.log('[API Debug Slug] Raw product data:', result.rows[0])
    const product = adaptProductFromDB(result.rows[0])
    
    return NextResponse.json({ 
      success: true, 
      product,
      rawData: result.rows[0],
      slug
    })
  } catch (error) {
    console.error('[API Debug Slug] Error:', error)
    return NextResponse.json({ 
      error: "Error searching by slug", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
