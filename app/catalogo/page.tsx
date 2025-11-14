"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CatalogFilters } from "@/components/catalog-filters"
import { ProductGrid } from "@/components/product-grid"
import { Suspense } from "react"

export default function CatalogoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 sm:mb-8 text-center">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🌿</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 font-[family-name:var(--font-playfair)] px-4">Nuestros Productos</h1>
            <p className="text-muted-foreground text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 px-4">Productos medicinales 100% naturales • Calidad certificada</p>
            <button
              onClick={() => {
                const chatButton = document.querySelector('[aria-label="Abrir chat"]') as HTMLButtonElement
                if (chatButton) chatButton.click()
              }}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg transition-all hover:scale-105 mx-4 sm:mx-0"
            >
              💬 ¿Necesitás ayuda? Consultá con nuestro asesor
            </button>
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
