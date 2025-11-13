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
              <ProductGallery images={product.images} productName={product.name} />
              <ProductInfo product={product} />
            </div>

            <ProductTabs product={product} />

            {/* Sección de Cupones */}
            <section className="py-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
              <div className="container mx-auto px-4 text-center">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    🎟️ ¡Aprovechá Cupones Exclusivos!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Aplicá cupones de descuento sobre este producto y obtené hasta 50% OFF adicional. 
                    Los cupones se suman a cualquier descuento que ya tenga el producto.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/50 rounded-lg p-4">
                      <div className="text-2xl mb-2">🎯</div>
                      <h4 className="font-bold text-gray-900 mb-1">Cupones Acumulables</h4>
                      <p className="text-sm text-gray-600">Se suman a los descuentos existentes</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-4">
                      <div className="text-2xl mb-2">📱</div>
                      <h4 className="font-bold text-gray-900 mb-1">Canal Exclusivo</h4>
                      <p className="text-sm text-gray-600">Más cupones en nuestro canal de WhatsApp</p>
                    </div>
                  </div>
                  <Button 
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
                  >
                    <a href="https://whatsapp.com/channel/0029Vb6grAvJuyA3fHqw1R1J" target="_blank" rel="noopener noreferrer">
                      🎟️ Unirse al Canal
                    </a>
                  </Button>
                </div>
              </div>
            </section>
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
