import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CatalogFilters } from "@/components/catalog-filters"
import { ProductGrid } from "@/components/product-grid"
import { Suspense } from "react"

export const metadata = {
  title: "Productos - Medicina Natural",
  description: "Descubrí nuestra línea completa de aceites naturales certificados. Calidad garantizada.",
}

export default function CatalogoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <div className="text-6xl mb-4">🌿</div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-playfair)]">Nuestros Productos</h1>
            <p className="text-muted-foreground text-xl">Aceites naturales • Calidad certificada</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop: Show filters on the left */}
            <aside className="hidden lg:block lg:col-span-1">
              <Suspense fallback={<div>Cargando filtros...</div>}>
                <CatalogFilters />
              </Suspense>
            </aside>

            {/* Mobile: Show products directly, filters hidden by default */}
            <div className="lg:col-span-3">
              {/* Mobile filter toggle - will be handled by ProductGrid component */}
              <Suspense fallback={<div>Cargando productos...</div>}>
                <ProductGrid />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
