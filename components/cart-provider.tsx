"use client"

import type React from "react"
import { useEffect } from "react"
import { useCart } from "@/lib/cart-store"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const validateCartData = useCart((state) => state.validateCartData)
  
  useEffect(() => {
    // Validar el carrito al montar el componente
    validateCartData()
  }, [validateCartData])
  
  return <>{children}</>
}

