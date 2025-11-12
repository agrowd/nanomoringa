import { NextRequest, NextResponse } from "next/server"
import { sql } from '@vercel/postgres'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }
    
    console.log('[DEBUG] Fetching product:', id)
    
    // Obtener el producto directamente sin adaptar
    const result = await sql`SELECT * FROM products WHERE id = ${id}`
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    
    const product = result.rows[0]
    
    // Retornar información detallada sobre el producto
    return NextResponse.json({
      success: true,
      productId: id,
      rawData: product,
      fieldTypes: {
        id: typeof product.id,
        name: typeof product.name,
        slug: typeof product.slug,
        description: typeof product.description,
        long_description: typeof product.long_description,
        price: typeof product.price,
        compare_at: typeof product.compare_at,
        category: typeof product.category,
        sizes: Array.isArray(product.sizes) ? 'array' : typeof product.sizes,
        colors: Array.isArray(product.colors) ? 'array' : typeof product.colors,
        images: Array.isArray(product.images) ? 'array' : typeof product.images,
        videos: Array.isArray(product.videos) ? 'array' : typeof product.videos,
        tags: Array.isArray(product.tags) ? 'array' : typeof product.tags,
        stock: typeof product.stock,
        featured: typeof product.featured,
        sku: typeof product.sku,
        created_at: typeof product.created_at,
        is_on_sale: typeof product.is_on_sale,
        sale_price: typeof product.sale_price,
        sale_start_date: typeof product.sale_start_date,
        sale_end_date: typeof product.sale_end_date,
        sale_duration_days: typeof product.sale_duration_days
      },
      nullFields: Object.keys(product).filter(key => product[key] === null),
      undefinedFields: Object.keys(product).filter(key => product[key] === undefined)
    })
    
  } catch (error) {
    console.error('[DEBUG] Error:', error)
    return NextResponse.json({ 
      error: "Error fetching product",
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

