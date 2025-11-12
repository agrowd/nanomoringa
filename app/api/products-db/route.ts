import { NextRequest, NextResponse } from "next/server"
import { sql } from '@vercel/postgres'

// GET - Obtener todos los productos de la base de datos
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM products ORDER BY created_at DESC`
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error getting products:', error)
    return NextResponse.json({ error: "Error loading products" }, { status: 500 })
  }
}

// POST - Crear nuevo producto en la base de datos
export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()
    
    // Generar ID y fecha de creación
    const id = Date.now().toString()
    const createdAt = new Date().toISOString()
    
    const { rows } = await sql`
      INSERT INTO products (
        id, name, slug, description, long_description, price, compare_at,
        category, sizes, colors, images, tags, stock, featured, sku, created_at
      ) VALUES (
        ${id},
        ${productData.name},
        ${productData.slug},
        ${productData.description},
        ${productData.long_description || ''},
        ${productData.price},
        ${productData.compare_at || null},
        ${productData.category},
        ${productData.sizes},
        ${productData.colors},
        ${productData.images},
        ${productData.tags},
        ${productData.stock},
        ${productData.featured},
        ${productData.sku},
        ${createdAt}
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        long_description = EXCLUDED.long_description,
        price = EXCLUDED.price,
        compare_at = EXCLUDED.compare_at,
        category = EXCLUDED.category,
        sizes = EXCLUDED.sizes,
        colors = EXCLUDED.colors,
        images = EXCLUDED.images,
        tags = EXCLUDED.tags,
        stock = EXCLUDED.stock,
        featured = EXCLUDED.featured,
        sku = EXCLUDED.sku
      RETURNING *
    `
    
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: "Error creating product" }, { status: 500 })
  }
}

// PUT - Actualizar producto existente
export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at')
    
    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ')
    const values = fields.map(key => updates[key])
    
    const { rows } = await sql`
      UPDATE products 
      SET ${sql.unsafe(setClause)}
      WHERE id = ${id}
      RETURNING *
    `
    
    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: "Error updating product" }, { status: 500 })
  }
}

// DELETE - Eliminar producto
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }
    
    const { rowCount } = await sql`DELETE FROM products WHERE id = ${id}`
    
    if (rowCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: "Error deleting product" }, { status: 500 })
  }
}