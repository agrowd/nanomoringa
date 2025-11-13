"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { X, ShoppingCart, Check, Ticket } from "lucide-react"
import Link from "next/link"

export function CartNotification() {
  const { lastAddedItem, closeCart, getItemCount, clearLastAddedItem } = useCart()
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    if (lastAddedItem) {
      setShowNotification(true)
      const timer = setTimeout(() => {
        setShowNotification(false)
        clearLastAddedItem() // Limpiar lastAddedItem después de ocultar
      }, 5000) // Auto-hide after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [lastAddedItem, clearLastAddedItem])

  if (!showNotification || !lastAddedItem) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-right-full">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-gray-900">
                ¡Agregado al carrito!
              </p>
              <Ticket className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 truncate">
              {lastAddedItem.name}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Presentación: {lastAddedItem.variant.size} • Variante: {lastAddedItem.variant.color}
            </p>
            <p className="text-xs text-purple-600 font-medium mt-2">
              💡 ¡Aplicá cupones en el carrito!
            </p>
            
            <div className="flex gap-2 mt-3">
              <Button asChild size="sm" className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90">
                <Link href="/carrito" onClick={() => {
                  setShowNotification(false)
                  clearLastAddedItem()
                }}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Ver Carrito ({getItemCount()})
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowNotification(false)
                  clearLastAddedItem()
                }}
              >
                Continuar Comprando
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setShowNotification(false)
              clearLastAddedItem()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
