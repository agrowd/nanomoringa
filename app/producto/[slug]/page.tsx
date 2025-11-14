import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { ProductTabs } from "@/components/product-tabs"
import { Button } from "@/components/ui/button"
import { sql } from '@vercel/postgres'
import { adaptProductFromDB } from '@/lib/db-adapter'
import type { Product } from "@/lib/types"
import type { Metadata } from "next"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slugOrId: string): Promise<Product | null> {
  try {
    console.log('[ProductPage] Fetching product with slug/id:', slugOrId)
    
    // Primero intentar buscar por slug
    let result = await sql`SELECT * FROM products WHERE slug = ${slugOrId}`
    
    // Si no se encuentra por slug, intentar por ID
    if (result.rows.length === 0) {
      console.log('[ProductPage] Product not found by slug, trying by ID:', slugOrId)
      result = await sql`SELECT * FROM products WHERE id = ${slugOrId}`
    }
    
    if (result.rows.length === 0) {
      console.log('[ProductPage] Product not found by slug or ID:', slugOrId)
      return null
    }
    
    console.log('[ProductPage] Raw product data:', result.rows[0])
    const product = adaptProductFromDB(result.rows[0])
    console.log('[ProductPage] Product found:', product.name, 'slug:', product.slug)
    
    return product
  } catch (error) {
    console.error('[ProductPage] Error fetching product:', error)
    return null
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: "Producto no encontrado",
    }
  }

  return {
    title: `${product.name} - Nano Moringa`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  }
}

// Deshabilitar generación estática para permitir productos dinámicos
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProductPage({ params }: ProductPageProps) {
  console.log('[ProductPage] ===== STARTING PAGE RENDER =====')
  try {
    const { slug } = await params
    console.log('[ProductPage] Rendering page for slug:', slug)
    console.log('[ProductPage] Slug type:', typeof slug)
    console.log('[ProductPage] Slug length:', slug.length)
    
    const product = await getProduct(slug)

    if (!product) {
      console.log('[ProductPage] Product not found, calling notFound()')
      notFound()
    }

    console.log('[ProductPage] Product found, rendering:', product.name)
    console.log('[ProductPage] ===== RENDERING SUCCESS =====')

    // JSON-LD for SEO
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: Array.isArray(product.images) ? product.images : [],
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "USD",
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    }

    return (
      <>
        <Header />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
              <ProductGallery images={product.images} videos={product.videos} productName={product.name} />
              <ProductInfo product={product} />
            </div>

            <ProductTabs product={product} />
          </div>
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    console.error('[ProductPage] Error rendering product page:', error)
    notFound()
  }
}
