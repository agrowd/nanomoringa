import { NextRequest, NextResponse } from "next/server"
import { sql } from '@vercel/postgres'

export async function PUT(request: NextRequest) {
  try {
    const { productId, images } = await request.json()
    console.log('[API Reorder Images] Received request:', { productId, images })

    if (!productId || !Array.isArray(images)) {
      return NextResponse.json({ error: "Product ID and images array are required" }, { status: 400 })
    }

    // Validar que las imágenes sean strings válidos
    if (!images.every(img => typeof img === 'string' && img.length > 0)) {
      return NextResponse.json({ error: "All images must be valid strings" }, { status: 400 })
    }

    // Actualizar el producto con el nuevo orden de imágenes
    const result = await sql`
      UPDATE products 
      SET images = ${images}
      WHERE id = ${productId}
      RETURNING id, name, images;
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    console.log('[API Reorder Images] Successfully updated images for product:', result.rows[0].name)
    return NextResponse.json({ 
      success: true, 
      message: "Images reordered successfully",
      product: result.rows[0]
    })

  } catch (error) {
    console.error('[API Reorder Images] Error updating images:', error)
    return NextResponse.json({ 
      error: "Error updating images", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
