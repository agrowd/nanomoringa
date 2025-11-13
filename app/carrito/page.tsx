"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartItems } from "@/components/cart-items"
import { CartSummary } from "@/components/cart-summary"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-store"
import { ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CartPage() {
  const { items, getTotal } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (items.length === 0) {
      router.push("/catalogo")
    }
  }, [items.length, router])

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-md mx-auto">
              <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
              <p className="text-muted-foreground mb-8">
                Agrega algunos productos para comenzar tu compra
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => {
                    const chatButton = document.querySelector('[aria-label="Abrir chat"]') as HTMLButtonElement
                    if (chatButton) chatButton.click()
                  }}
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  💬 Consultar con Asesor
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/catalogo">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Ver Productos
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="outline" size="sm">
              <Link href="/catalogo">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continuar Comprando
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Mi Carrito</h1>
            <span className="text-muted-foreground">
              ({items.reduce((sum, item) => sum + (item.qty || 1), 0)} productos)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <CartItems />
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <CartSummary />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}