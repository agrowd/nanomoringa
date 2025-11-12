"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeftIcon, Sparkles, Ticket } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
// import { AnimatedOffers } from "@/components/animated-offers"
import { useCart } from "@/lib/cart-store"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

export default function OfertasPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState("")
  const [validatingCoupon, setValidatingCoupon] = useState(false)
  
  const applyCoupon = useCart((state) => state.applyCoupon)
  const appliedCoupon = useCart((state) => state.appliedCoupon)
  const { toast } = useToast()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        // Filtrar productos en oferta o destacados
        const onSaleProducts = data.filter((p: Product) => 
          p.is_on_sale || p.featured || p.compareAt && p.compareAt > p.price
        )
        setProducts(onSaleProducts)
      }
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Ingresa un código de cupón",
        variant: "destructive",
      })
      return
    }

    setValidatingCoupon(true)

    try {
      const response = await fetch(`/api/coupons?code=${couponCode.toUpperCase()}&validate=true`)
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.valid) {
          applyCoupon(data.coupon)
          setCouponCode("")
          
          toast({
            title: "¡Cupón aplicado!",
            description: `${data.coupon.name} - Agregá productos al carrito para ver tu descuento`,
          })
        } else {
          toast({
            title: "Cupón inválido",
            description: data.error || "El cupón no es válido",
            variant: "destructive",
          })
        }
      } else {
        const error = await response.json()
        toast({
          title: "Cupón no encontrado",
          description: error.error || "Verifica el código e intenta nuevamente",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo validar el cupón",
        variant: "destructive",
      })
    } finally {
      setValidatingCoupon(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1D29] to-[#0A0A0A] text-white">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-b border-purple-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-2 text-sm font-bold animate-pulse">
                🔥 OFERTAS LIMITADAS
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Ofertas Exclusivas DripCore
              </h1>
              <p className="text-xl text-purple-200 max-w-2xl mx-auto">
                ¡No te pierdas nuestras promociones y descuentos especiales en tus prendas favoritas de streetwear!
              </p>
            </div>
          </div>
        </section>

        {/* Sección de Cupón */}
        <section className="py-12 border-b border-purple-500/20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              {/* Banner de Cupón Aplicado */}
              {appliedCoupon ? (
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Ticket className="h-6 w-6" />
                    <span className="text-2xl font-bold">¡Cupón Aplicado!</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-3">
                    <p className="font-mono text-3xl font-bold tracking-wider">
                      {appliedCoupon.code}
                    </p>
                  </div>
                  <p className="text-lg opacity-90">
                    {appliedCoupon.name}
                  </p>
                  <p className="text-xl font-bold mt-2">
                    {appliedCoupon.discountType === 'percentage'
                      ? `${appliedCoupon.discountValue}% de descuento`
                      : `$${appliedCoupon.discountValue.toLocaleString('es-AR')} de descuento`}
                  </p>
                  <p className="text-sm opacity-75 mt-3">
                    Agregá productos al carrito para aplicar tu descuento
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Sparkles className="h-8 w-8 text-yellow-400" />
                      <h2 className="text-3xl font-bold">¡Usá un Cupón!</h2>
                      <Sparkles className="h-8 w-8 text-yellow-400" />
                    </div>
                    <p className="text-purple-200 text-lg">
                      Obtené hasta <span className="text-yellow-400 font-bold">50% OFF</span> en tu compra
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      placeholder="INGRESÁ TU CÓDIGO"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      className="flex-1 h-14 text-center font-mono text-xl uppercase bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      disabled={validatingCoupon}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={validatingCoupon || !couponCode.trim()}
                      className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg"
                    >
                      {validatingCoupon ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Ticket className="mr-2 h-5 w-5" />
                          Aplicar
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-center text-sm text-purple-200">
                      💡 <span className="font-semibold">Tip:</span> Ingresá tu código de cupón para obtener descuentos exclusivos
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Productos en Oferta Animados */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.filter(product => 
              product.is_on_sale || product.featured || (product.compareAt && product.compareAt > product.price)
            ).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Info adicional */}
        <section className="py-16 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                🎯 ¿Cómo Aprovechar al Máximo?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Cupones Acumulables</h4>
                    <p className="text-purple-200 text-sm">
                      Los cupones se suman a los descuentos de productos. ¡Doble ahorro!
                    </p>
                    <p className="text-purple-300 text-xs mt-1 font-medium">
                      🎟️ ¡Únete a nuestro canal de WhatsApp para cupones exclusivos!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Validá tu Cupón</h4>
                    <p className="text-purple-200 text-sm">
                      Ingresá el código aquí o directo en el carrito antes de comprar.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Compra por Mayor</h4>
                    <p className="text-purple-200 text-sm">
                      ¿Necesitás cantidad? Contactanos por WhatsApp para precios especiales.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <Button asChild variant="outline" className="px-8 py-4 text-lg font-semibold border-2 border-white/50 text-white hover:bg-white hover:text-[#0A0A0A] bg-transparent">
                <Link href="/catalogo">
                  <ArrowLeftIcon className="mr-2 h-5 w-5" />
                  Ver Catálogo Completo
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
