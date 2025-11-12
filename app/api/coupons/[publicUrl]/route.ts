import { NextRequest, NextResponse } from "next/server"
import { sql } from '@vercel/postgres'

export async function GET(
  request: NextRequest,
  { params }: { params: { publicUrl: string } }
) {
  try {
    const { publicUrl } = params
    
    console.log('[API Coupon Public] Fetching coupon by public URL:', publicUrl)
    
    // Buscar cupón por URL pública
    const result = await sql`
      SELECT * FROM coupons 
      WHERE public_url = ${publicUrl}
      AND is_active = true
    `
    
    if (result.rows.length === 0) {
      return NextResponse.json({ 
        error: "Cupón no encontrado o inactivo" 
      }, { status: 404 })
    }
    
    const coupon = result.rows[0]
    
    // Verificar si no ha expirado
    const now = new Date()
    const expiresAt = coupon.expires_at ? new Date(coupon.expires_at) : null
    
    if (expiresAt && expiresAt < now) {
      return NextResponse.json({ 
        error: "Este cupón ha expirado" 
      }, { status: 410 })
    }
    
    // Verificar si no ha alcanzado el límite de usos
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
      return NextResponse.json({ 
        error: "Este cupón ha alcanzado el límite de usos" 
      }, { status: 410 })
    }
    
    // Formatear respuesta
    const formattedCoupon = {
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
      categories: coupon.categories || [],
      imageUrl: coupon.image_url,
      publicUrl: coupon.public_url,
      createdAt: coupon.created_at
    }
    
    console.log('[API Coupon Public] Coupon found:', coupon.code)
    return NextResponse.json(formattedCoupon)
  } catch (error) {
    console.error('[API Coupon Public] Error:', error)
    return NextResponse.json({ 
      error: "Error fetching coupon", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
