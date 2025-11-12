"use client"

import { useEffect } from "react"
import { useCart } from "@/lib/cart-store"
import { useCartSync } from "@/hooks/use-cart-sync"

export function CartInitializer() {
  const validateCartData = useCart((state) => state.validateCartData)
  const { loadFromDatabase } = useCartSync()

  useEffect(() => {
    // Validar datos del carrito al cargar la página
    validateCartData()
    
    // Cargar desde la base de datos si es necesario
    loadFromDatabase()
  }, [validateCartData, loadFromDatabase])

  return null // Este componente no renderiza nada
}
