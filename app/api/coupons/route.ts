import { NextRequest, NextResponse } from "next/server"
import { sql } from '@vercel/postgres'

// GET - Obtener todos los cupones o validar uno específico
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const validate = searchParams.get('validate') === 'true'
    
    if (code) {
      // Buscar cupón específico
      const result = await sql`
        SELECT * FROM coupons 
        WHERE code = ${code.toUpperCase()}
      `
      
      if (result.rows.length === 0) {
        return NextResponse.json({ 
          valid: false,
          error: "Cupón no encontrado" 
        })
      }
      
      const coupon = result.rows[0]
      
      // Si es validación, verificar condiciones
      if (validate) {
        const now = new Date()
        const expiresAt = coupon.expires_at ? new Date(coupon.expires_at) : null
        
        if (!coupon.is_active) {
          return NextResponse.json({ 
            valid: false, 
            error: "Este cupón no está activo" 
          })
        }
        
        if (expiresAt && expiresAt < now) {
          return NextResponse.json({ 
            valid: false, 
            error: "Este cupón ha expirado" 
          })
        }
        
        if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
          return NextResponse.json({ 
            valid: false, 
            error: "Este cupón ha alcanzado el límite de usos" 
          })
        }
        
        return NextResponse.json({ 
          valid: true, 
          coupon: {
            code: coupon.code,
            name: coupon.name,
            description: coupon.description,
            discountType: coupon.discount_type,
            discountValue: parseFloat(coupon.discount_value),
            minPurchase: parseFloat(coupon.min_purchase || 0)
          }
        })
      }
      
      return NextResponse.json(coupon)
    }
    
    // Obtener todos los cupones
    const result = await sql`
      SELECT * FROM coupons 
      ORDER BY created_at DESC
    `
    
    const coupons = result.rows.map(row => ({
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      discountType: row.discount_type,
      discountValue: parseFloat(row.discount_value),
      minPurchase: parseFloat(row.min_purchase || 0),
      maxUses: row.max_uses,
      currentUses: row.current_uses,
      expiresAt: row.expires_at,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
    
    return NextResponse.json(coupons)
  } catch (error) {
    console.error('[API Coupons GET] Error:', error)
    
    // Si hay un error de conexión a la base de datos, devolver mensaje amigable
    if (error instanceof Error && error.message.includes('relation "coupons" does not exist')) {
      return NextResponse.json({ 
        valid: false,
        error: "Sistema de cupones no disponible temporalmente" 
      })
    }
    
    return NextResponse.json({ 
      valid: false,
      error: "Error al validar cupón. Intenta nuevamente." 
    })
  }
}

// POST - Crear nuevo cupón
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('[API Coupons POST] Creating coupon:', data)
    
    const code = data.code.toUpperCase()
    const name = data.name
    const description = data.description || null
    const discountType = data.discountType
    const discountValue = parseFloat(data.discountValue)
    const minPurchase = data.minPurchase ? parseFloat(data.minPurchase) : 0
    const maxUses = data.maxUses || null
    const expiresAt = data.expiresAt || null
    const isActive = data.isActive !== undefined ? data.isActive : true
    const categories = data.categories || []
    const imageUrl = data.imageUrl || null
    
    // Generar URL pública única
    const publicUrl = `cupon-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`
    
    // Validaciones
    if (!code || !name || !discountType || !discountValue) {
      return NextResponse.json({ 
        error: "Faltan campos requeridos" 
      }, { status: 400 })
    }
    
    if (!['percentage', 'fixed'].includes(discountType)) {
      return NextResponse.json({ 
        error: "Tipo de descuento inválido" 
      }, { status: 400 })
    }
    
    if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
      return NextResponse.json({ 
        error: "El porcentaje debe estar entre 0 y 100" 
      }, { status: 400 })
    }
    
    // Verificar si el código ya existe
    const existing = await sql`
      SELECT id FROM coupons WHERE code = ${code}
    `
    
    if (existing.rows.length > 0) {
      return NextResponse.json({ 
        error: "Ya existe un cupón con este código" 
      }, { status: 409 })
    }
    
    // Crear cupón
    const result = await sql`
      INSERT INTO coupons (
        code, name, description, discount_type, discount_value, 
        min_purchase, max_uses, expires_at, is_active, categories, image_url, public_url
      ) VALUES (
        ${code}, ${name}, ${description}, ${discountType}, ${discountValue},
        ${minPurchase}, ${maxUses}, ${expiresAt}, ${isActive}, ${categories}, ${imageUrl}, ${publicUrl}
      )
      RETURNING *
    `
    
    const coupon = result.rows[0]
    
    console.log('[API Coupons POST] Coupon created:', coupon.code)
    
    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        discountType: coupon.discount_type,
        discountValue: parseFloat(coupon.discount_value),
        minPurchase: parseFloat(coupon.min_purchase || 0),
        maxUses: coupon.max_uses,
        currentUses: coupon.current_uses,
        expiresAt: coupon.expires_at,
        isActive: coupon.is_active,
        createdAt: coupon.created_at
      }
    }, { status: 201 })
  } catch (error) {
    console.error('[API Coupons POST] Error:', error)
    return NextResponse.json({ 
      error: "Error creating coupon", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

// PUT - Actualizar cupón
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updates } = data
    
    if (!id) {
      return NextResponse.json({ 
        error: "ID de cupón requerido" 
      }, { status: 400 })
    }
    
    console.log('[API Coupons PUT] Updating coupon:', id)
    
    // Construir query de actualización dinámicamente
    const updateFields: string[] = []
    const values: any[] = []
    let paramIndex = 1
    
    if (updates.name !== undefined) {
      updateFields.push(`name = $${paramIndex++}`)
      values.push(updates.name)
    }
    if (updates.description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`)
      values.push(updates.description)
    }
    if (updates.discountType !== undefined) {
      updateFields.push(`discount_type = $${paramIndex++}`)
      values.push(updates.discountType)
    }
    if (updates.discountValue !== undefined) {
      updateFields.push(`discount_value = $${paramIndex++}`)
      values.push(parseFloat(updates.discountValue))
    }
    if (updates.minPurchase !== undefined) {
      updateFields.push(`min_purchase = $${paramIndex++}`)
      values.push(parseFloat(updates.minPurchase))
    }
    if (updates.maxUses !== undefined) {
      updateFields.push(`max_uses = $${paramIndex++}`)
      values.push(updates.maxUses)
    }
    if (updates.expiresAt !== undefined) {
      updateFields.push(`expires_at = $${paramIndex++}`)
      values.push(updates.expiresAt)
    }
    if (updates.isActive !== undefined) {
      updateFields.push(`is_active = $${paramIndex++}`)
      values.push(updates.isActive)
    }
    
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
    
    values.push(id)
    
    const query = `
      UPDATE coupons 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `
    
    const result = await sql.query(query, values)
    
    if (result.rows.length === 0) {
      return NextResponse.json({ 
        error: "Cupón no encontrado" 
      }, { status: 404 })
    }
    
    const coupon = result.rows[0]
    
    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        discountType: coupon.discount_type,
        discountValue: parseFloat(coupon.discount_value),
        minPurchase: parseFloat(coupon.min_purchase || 0),
        maxUses: coupon.max_uses,
        currentUses: coupon.current_uses,
        expiresAt: coupon.expires_at,
        isActive: coupon.is_active,
        updatedAt: coupon.updated_at
      }
    })
  } catch (error) {
    console.error('[API Coupons PUT] Error:', error)
    return NextResponse.json({ 
      error: "Error updating coupon", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

// DELETE - Eliminar cupón
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ 
        error: "ID de cupón requerido" 
      }, { status: 400 })
    }
    
    console.log('[API Coupons DELETE] Deleting coupon:', id)
    
    const result = await sql`
      DELETE FROM coupons 
      WHERE id = ${id}
      RETURNING code
    `
    
    if (result.rows.length === 0) {
      return NextResponse.json({ 
        error: "Cupón no encontrado" 
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: `Cupón ${result.rows[0].code} eliminado exitosamente`
    })
  } catch (error) {
    console.error('[API Coupons DELETE] Error:', error)
    return NextResponse.json({ 
      error: "Error deleting coupon", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

// PATCH - Incrementar uso de cupón
export async function PATCH(request: NextRequest) {
  try {
    const { code } = await request.json()
    
    if (!code) {
      return NextResponse.json({ 
        error: "Código de cupón requerido" 
      }, { status: 400 })
    }
    
    console.log('[API Coupons PATCH] Incrementing usage for:', code)
    
    const result = await sql`
      UPDATE coupons 
      SET current_uses = current_uses + 1, updated_at = CURRENT_TIMESTAMP
      WHERE code = ${code.toUpperCase()}
      RETURNING *
    `
    
    if (result.rows.length === 0) {
      return NextResponse.json({ 
        error: "Cupón no encontrado" 
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: "Uso de cupón registrado"
    })
  } catch (error) {
    console.error('[API Coupons PATCH] Error:', error)
    return NextResponse.json({ 
      error: "Error updating coupon usage", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

