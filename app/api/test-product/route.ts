import { NextRequest, NextResponse } from "next/server"
import { sql } from '@vercel/postgres'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug') || 'gorra-snapback-inter-miami-negrorosa'
    
    console.log('[TEST API] Testing with slug:', slug)
    
    // Test 1: Basic SQL query
    const result = await sql`SELECT * FROM products WHERE slug = ${slug}`
    
    console.log('[TEST API] Query result:', { 
      rowCount: result.rows.length,
      hasRows: result.rows.length > 0 
    })
    
    if (result.rows.length > 0) {
      console.log('[TEST API] First row:', result.rows[0])
    }
    
    return NextResponse.json({ 
      success: true,
      slug,
      rowCount: result.rows.length,
      hasData: result.rows.length > 0,
      firstRow: result.rows.length > 0 ? result.rows[0] : null
    })
  } catch (error) {
    console.error('[TEST API] Error:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
