import { notFound } from "next/navigation"
import { sql } from '@vercel/postgres'
import { adaptProductFromDB } from '@/lib/db-adapter'
import type { Product } from "@/lib/types"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    console.log('[TEST PAGE] Fetching product with slug:', slug)
    
    const result = await sql`SELECT * FROM products WHERE slug = ${slug}`
    
    console.log('[TEST PAGE] Query result:', { rowCount: result.rows.length })
    
    if (result.rows.length === 0) {
      console.log('[TEST PAGE] Product not found:', slug)
      return null
    }
    
    console.log('[TEST PAGE] Product found:', result.rows[0].name)
    return adaptProductFromDB(result.rows[0])
  } catch (error) {
    console.error('[TEST PAGE] Error:', error)
    return null
  }
}

export default async function TestProductPage({ params }: ProductPageProps) {
  try {
    const { slug } = await params
    console.log('[TEST PAGE] Rendering page for slug:', slug)
    
    const product = await getProduct(slug)

    if (!product) {
      console.log('[TEST PAGE] Product not found, calling notFound()')
      notFound()
    }

    console.log('[TEST PAGE] Rendering product:', product.name)

    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Producto: {product.name}</h1>
        <p><strong>ID:</strong> {product.id}</p>
        <p><strong>Slug:</strong> {product.slug}</p>
        <p><strong>Precio:</strong> ${product.price}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <p><strong>Descripción:</strong> {product.description}</p>
        {product.images && product.images.length > 0 && (
          <div>
            <h3>Imágenes:</h3>
            <p>{product.images.length} imagen(es) encontrada(s)</p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('[TEST PAGE] Error rendering:', error)
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Error</h1>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    )
  }
}
