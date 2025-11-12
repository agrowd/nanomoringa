import { NextResponse } from "next/server"
import { sql } from '@vercel/postgres'

export async function GET() {
  try {
    console.log('[Health] Checking database connection...')
    
    const result = await sql`SELECT NOW() as current_time`
    console.log('[Health] Database connected:', result.rows[0])
    
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as table_exists
    `
    
    console.log('[Health] Products table exists:', tableCheck.rows[0]?.table_exists)
    
    let productCount = 0
    if (tableCheck.rows[0]?.table_exists) {
      const countResult = await sql`SELECT COUNT(*) as count FROM products`
      productCount = parseInt(countResult.rows[0]?.count || '0')
      console.log('[Health] Product count:', productCount)
    }
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: result.rows[0]?.current_time,
      productsTable: tableCheck.rows[0]?.table_exists ? 'exists' : 'missing',
      productCount: productCount,
      env: {
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        hasPostgresUser: !!process.env.POSTGRES_USER,
        hasPostgresHost: !!process.env.POSTGRES_HOST,
        hasPostgresDatabase: !!process.env.POSTGRES_DATABASE,
      }
    })
  } catch (error) {
    console.error('[Health] Error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        hasPostgresUser: !!process.env.POSTGRES_USER,
        hasPostgresHost: !!process.env.POSTGRES_HOST,
        hasPostgresDatabase: !!process.env.POSTGRES_DATABASE,
      }
    }, { status: 500 })
  }
}

