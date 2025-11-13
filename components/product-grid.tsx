"use client"

import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { EmptyState } from "@/components/empty-state"
import { CatalogFilters } from "@/components/catalog-filters"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter } from "lucide-react"
import type { Product } from "@/lib/types"
import { useMemo, useEffect, useState } from "react"

export function ProductGrid() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        console.log('[ProductGrid] Loading products from API...')
        const response = await fetch("/api/products")
        
        if (response.ok) {
          const data = await response.json()
          console.log('[ProductGrid] Loaded', data.length, 'products from API')
          setProducts(data)
        } else {
          console.error('[ProductGrid] Failed to load products:', response.status, response.statusText)
          // Fallback a productos mock si la API falla
          const { mockProducts } = await import("@/lib/mock-products")
          console.warn('[ProductGrid] Using mock products as fallback')
          setProducts(mockProducts)
        }
      } catch (error) {
        console.error('[ProductGrid] Error loading products:', error)
        // Fallback a productos mock si hay error
        try {
          const { mockProducts } = await import("@/lib/mock-products")
          console.warn('[ProductGrid] Using mock products as fallback due to error')
          setProducts(mockProducts)
        } catch (fallbackError) {
          console.error('[ProductGrid] Fallback also failed:', fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    const searchQuery = searchParams.get("search")?.toLowerCase()
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery) ||
          p.description?.toLowerCase().includes(searchQuery) ||
          p.category?.toLowerCase().includes(searchQuery),
      )
    }

    // Category filter
    const categories = searchParams.get("category")?.split(",").filter(Boolean)
    if (categories && categories.length > 0) {
      console.log('[ProductGrid] Filtering by categories:', categories)
      console.log('[ProductGrid] Available categories in products:', [...new Set(products.map(p => p.category))])
      filtered = filtered.filter((p) => {
        const matches = categories.includes(p.category)
        if (!matches) {
          console.log(`[ProductGrid] Product "${p.name}" category "${p.category}" not in`, categories)
        }
        return matches
      })
      console.log('[ProductGrid] Filtered to', filtered.length, 'products')
    }

    // Size filter
    const sizes = searchParams.get("size")?.split(",").filter(Boolean)
    if (sizes && sizes.length > 0) {
      filtered = filtered.filter((p) => p.sizes.some((s) => sizes.includes(s)))
    }

    // Color filter
    const colors = searchParams.get("color")?.split(",").filter(Boolean)
    if (colors && colors.length > 0) {
      filtered = filtered.filter((p) => p.colors.some((c) => colors.includes(c)))
    }

    // Price range filter
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number.parseFloat(minPrice))
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number.parseFloat(maxPrice))
    }

    // Sort
    const sort = searchParams.get("sort")
    if (sort === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price)
    }

    return filtered
  }, [searchParams, products])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <EmptyState
        title="No se encontraron productos"
        description="Intenta ajustar los filtros o la búsqueda para ver más resultados"
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado
          {filteredProducts.length !== 1 ? "s" : ""}
        </p>
        
        {/* Mobile filters button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <CatalogFilters />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
