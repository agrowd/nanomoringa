"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-store"
import { CartItems } from "@/components/cart-items"
import { CartSummary } from "@/components/cart-summary"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { ShoppingCart, Receipt } from "lucide-react"
import Link from "next/link"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => {
    const qty = Number(item.qty) || 1
    return sum + qty
  }, 0)
  const [activePanel, setActivePanel] = useState<"cart" | "summary">("cart")

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-background border-border overflow-y-auto">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActivePanel("cart")}
                className={`p-2 rounded-lg ${activePanel === "cart" ? "bg-accent/20 text-accent" : "text-muted-foreground hover:bg-muted"}`}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActivePanel("summary")}
                className={`p-2 rounded-lg ${activePanel === "summary" ? "bg-accent/20 text-accent" : "text-muted-foreground hover:bg-muted"}`}
              >
                <Receipt className="h-5 w-5" />
              </Button>
            </div>
            
            <SheetTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              {activePanel === "cart" ? (
                <>
                  <ShoppingCart className="h-6 w-6" />
                  Mi Pedido ({itemCount})
                </>
              ) : (
                <>
                  <Receipt className="h-6 w-6" />
                  Resumen
                </>
              )}
            </SheetTitle>
            
            <div className="w-10 h-10"></div>
          </div>
          <SheetDescription>
            {activePanel === "cart" ? "Gestioná los productos en tu pedido" : "Revisá tu pedido y finalizá la compra"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="text-6xl mb-4">🌿</div>
              <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Tu carrito está vacío</h3>
              <p className="text-muted-foreground mb-6">
                Explorá nuestros productos naturales
              </p>
              <Button asChild onClick={onClose} className="bg-accent hover:bg-accent/90">
                <Link href="/catalogo">
                  Ir al Catálogo
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Panel Toggle Buttons */}
              <div className="flex bg-muted rounded-lg p-1 mb-4">
                <button
                  onClick={() => setActivePanel("cart")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                    activePanel === "cart" 
                      ? "bg-card text-accent shadow-sm font-medium border border-accent/20" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Carrito ({itemCount})
                </button>
                <button
                  onClick={() => setActivePanel("summary")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                    activePanel === "summary" 
                      ? "bg-card text-accent shadow-sm font-medium border border-accent/20" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Receipt className="h-4 w-4" />
                  Resumen
                </button>
              </div>

              {/* Content based on active panel */}
              <div className="flex-1 overflow-y-auto">
                {activePanel === "cart" ? (
                  <div className="py-2">
                    <CartItems />
                    {/* Instrucción para carrito */}
                    <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                      <p className="text-xs text-accent text-center font-medium">
                        💡 Andá a <strong>Resumen</strong> para finalizar tu pedido
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-2">
                    <CartSummary />
                    {/* Instrucción para resumen */}
                    <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-xs text-primary text-center font-medium">
                        💡 Presioná <strong>Carrito</strong> para revisar productos
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="border-t border-border pt-4 mt-4">
                <div className="space-y-3">
                  {/* Botón principal según el panel */}
                  {activePanel === "cart" ? (
                    <Button 
                      onClick={() => setActivePanel("summary")}
                      className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-accent-foreground font-semibold py-3 text-base shadow-lg transition-all duration-200"
                    >
                      📋 Ver Resumen
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setActivePanel("cart")}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-3 text-base shadow-lg transition-all duration-200"
                    >
                      🛒 Ver Carrito
                    </Button>
                  )}
                  
                  {/* Botones secundarios */}
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1 border-border text-foreground hover:bg-muted">
                      <Link href="/carrito" onClick={onClose}>
                        📄 Página Completa
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={onClose}
                      className="flex-1 border-border text-foreground hover:bg-muted"
                    >
                      ✨ Seguir Comprando
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
