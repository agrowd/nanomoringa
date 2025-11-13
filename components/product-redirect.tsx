"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface ProductRedirectProps {
  product: {
    id: string
    slug: string
  }
  currentSlug: string
}

export function ProductRedirect({ product, currentSlug }: ProductRedirectProps) {
  const router = useRouter()

  useEffect(() => {
    // Si se accedió con un ID numérico y tenemos un slug, redirigir
    if (/^\d+$/.test(currentSlug) && product.slug && product.slug !== currentSlug) {
      console.log('[ProductRedirect] Redirecting from ID to slug:', currentSlug, '->', product.slug)
      router.replace(`/producto/${product.slug || product.id}`)
    }
  }, [product.slug, currentSlug, router])

  return null // Este componente no renderiza nada
}
