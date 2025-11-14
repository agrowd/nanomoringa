import { NextRequest, NextResponse } from "next/server"
import { sql } from '@vercel/postgres'
import { adaptProductFromDB } from '@/lib/db-adapter'

export async function GET(request: NextRequest) {
  try {
    console.log('[API GET] Fetching products from database...')
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    console.log('[API GET] Query params:', { id })
    console.log('[API GET] Environment check:', {
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      hasVercelEnv: !!process.env.VERCEL
    })
    
    // Verificar si la tabla existe
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as exists
    `
    
    console.log('[API GET] Table exists check:', tableExists.rows[0])
    
    if (!tableExists.rows[0]?.exists) {
      console.error('[API GET] Products table does not exist!')
      return NextResponse.json({ 
        error: "Products table does not exist",
        message: "Please run the database initialization script first"
      }, { status: 500 })
    }
    
    // Si hay un ID, buscar ese producto específico
    if (id) {
      console.log('[API GET] Fetching single product with ID:', id)
      try {
        const result = await sql`SELECT * FROM products WHERE id = ${id}`
        console.log('[API GET] Query result:', { rowCount: result.rows.length })
        
        if (result.rows.length === 0) {
          console.log('[API GET] Product not found:', id)
          return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }
        
        console.log('[API GET] Raw product data:', result.rows[0])
        const product = adaptProductFromDB(result.rows[0])
        console.log('[API GET] Product adapted:', { id: product.id, name: product.name })
        return NextResponse.json(product)
      } catch (singleError) {
        console.error('[API GET] Error fetching single product:', singleError)
        console.error('[API GET] Error details:', {
          message: singleError instanceof Error ? singleError.message : 'Unknown',
          stack: singleError instanceof Error ? singleError.stack : 'No stack'
        })
        throw singleError // Re-throw para que lo capture el catch principal
      }
    }
    
    // Si no hay ID, devolver todos los productos
    const result = await sql`SELECT * FROM products ORDER BY created_at DESC`
    console.log(`[API GET] Found ${result.rows.length} products in database`)
    
    if (result.rows.length === 0) {
      console.log('[API GET] No products found in database')
      return NextResponse.json([])
    }
    
    const adaptedProducts = result.rows.map(adaptProductFromDB)
    console.log('[API GET] Products adapted successfully')
    console.log('[API GET] First product:', adaptedProducts[0] ? {
      id: adaptedProducts[0].id,
      name: adaptedProducts[0].name,
      price: adaptedProducts[0].price
    } : 'No products')
    
    return NextResponse.json(adaptedProducts)
  } catch (error) {
    console.error('[API GET] Error loading products:', error)
    console.error('[API GET] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: "Error loading products", 
      details: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  let productData: any = null
  try {
    productData = await request.json()
    
    // Validar tamaño del payload (límite de 10MB)
    const payloadSize = JSON.stringify(productData).length
    const maxPayloadSize = 10 * 1024 * 1024 // 10MB
    
    if (payloadSize > maxPayloadSize) {
      console.error('[API POST] Payload too large:', payloadSize, 'bytes')
      return NextResponse.json({ 
        error: "Payload too large", 
        details: `El producto es demasiado grande (${Math.round(payloadSize / 1024 / 1024)}MB). Máximo 10MB.`,
        maxSize: maxPayloadSize,
        currentSize: payloadSize
      }, { status: 413 })
    }
    
    console.log('[API POST] Received product data:', JSON.stringify(productData, null, 2))
    
    const id = productData.id || Date.now().toString()
    const createdAt = new Date().toISOString()
    
    console.log('[API POST] Inserting product with ID:', id)
    
    const result = await sql`
      INSERT INTO products (
        id, name, slug, description, long_description, price, compare_at,
        category, sizes, colors, images, videos, tags, stock, featured, sku, created_at,
        is_on_sale, sale_price, sale_start_date, sale_end_date, sale_duration_days
      ) VALUES (
        ${id},
        ${productData.name},
        ${productData.slug},
        ${productData.description},
        ${productData.long_description || ''},
        ${productData.price},
        ${productData.compareAt || null},
        ${productData.category},
        ${productData.sizes || []},
        ${productData.colors || []},
        ${productData.images || []},
        ${productData.videos || []},
        ${productData.tags || []},
        ${productData.stock},
        ${productData.featured || false},
        ${productData.sku},
        ${createdAt},
        ${productData.is_on_sale || false},
        ${productData.sale_price || null},
        ${productData.sale_start_date || null},
        ${productData.sale_end_date || null},
        ${productData.sale_duration_days || 7}
      )
      RETURNING *
    `
    
    console.log('[API POST] Product created successfully')
    return NextResponse.json(adaptProductFromDB(result.rows[0]), { status: 201 })
  } catch (error) {
    console.error('[API POST] Error creating product:', error)
    console.error('[API POST] Product data received:', productData)
    console.error('[API POST] Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json({ 
      error: "Error creating product",
      details: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Obtener el ID desde la URL o del body
    const { searchParams } = new URL(request.url)
    const urlId = searchParams.get('id')
    
    const updatedProduct = await request.json()
    const { id: bodyId, ...updates } = updatedProduct
    
    // Validar tamaño del payload (límite de 4MB para evitar 413 en Vercel)
    const payloadSize = JSON.stringify(updatedProduct).length
    const maxPayloadSize = 4 * 1024 * 1024 // 4MB (límite de Vercel)
    
    if (payloadSize > maxPayloadSize) {
      console.error('[API PUT] Payload too large:', payloadSize, 'bytes')
      return NextResponse.json({ 
        error: "Payload too large", 
        details: `El producto es demasiado grande (${Math.round(payloadSize / 1024 / 1024)}MB). Los videos en base64 ocupan mucho espacio. Máximo 4MB.`,
        suggestion: "Considera usar un servicio de almacenamiento externo (Cloudinary, S3) para videos grandes.",
        maxSize: maxPayloadSize,
        currentSize: payloadSize
      }, { status: 413 })
    }
    
    // Usar el ID de la URL si está disponible, sino del body
    const id = urlId || bodyId
    
    console.log('[API PUT] Updating product:', id)
    console.log('[API PUT] Payload size:', payloadSize, 'bytes', `(${(payloadSize / 1024 / 1024).toFixed(2)}MB)`)
    console.log('[API PUT] Updates:', Object.keys(updates))
    
    // Usar sql template literal para manejar arrays correctamente
    
    const result = await sql`
      UPDATE products SET 
        name = ${updates.name !== undefined ? updates.name : sql`name`},
        slug = ${updates.slug !== undefined ? updates.slug : sql`slug`},
        description = ${updates.description !== undefined ? updates.description : sql`description`},
        long_description = ${updates.long_description !== undefined ? updates.long_description : sql`long_description`},
        price = ${updates.price !== undefined ? updates.price : sql`price`},
        compare_at = ${updates.compareAt !== undefined ? updates.compareAt : sql`compare_at`},
        category = ${updates.category !== undefined ? updates.category : sql`category`},
        sizes = ${updates.sizes !== undefined ? updates.sizes : sql`sizes`},
        colors = ${updates.colors !== undefined ? updates.colors : sql`colors`},
        images = ${updates.images !== undefined ? updates.images : sql`images`},
        videos = ${updates.videos !== undefined ? updates.videos : sql`videos`},
        tags = ${updates.tags !== undefined ? updates.tags : sql`tags`},
        stock = ${updates.stock !== undefined ? updates.stock : sql`stock`},
        featured = ${updates.featured !== undefined ? updates.featured : sql`featured`},
        sku = ${updates.sku !== undefined ? updates.sku : sql`sku`},
        is_on_sale = ${updates.is_on_sale !== undefined ? updates.is_on_sale : sql`is_on_sale`},
        sale_price = ${updates.sale_price !== undefined ? updates.sale_price : sql`sale_price`},
        sale_start_date = ${updates.sale_start_date !== undefined ? updates.sale_start_date : sql`sale_start_date`},
        sale_end_date = ${updates.sale_end_date !== undefined ? updates.sale_end_date : sql`sale_end_date`},
        sale_duration_days = ${updates.sale_duration_days !== undefined ? updates.sale_duration_days : sql`sale_duration_days`}
      WHERE id = ${id}
      RETURNING *
    `
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    
    console.log('[API PUT] Product updated successfully')
    return NextResponse.json(adaptProductFromDB(result.rows[0]))
  } catch (error) {
    console.error('[API PUT] Error updating product:', error)
    console.error('[API PUT] Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json({ 
      error: "Error updating product",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }
    
    const result = await sql`DELETE FROM products WHERE id = ${id}`
    
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: "Error deleting product" }, { status: 500 })
  }
}
