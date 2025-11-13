"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Ticket, X, Sparkles } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { buildWAUrl, buildCartMessage } from "@/lib/whatsapp"
import { useToast } from "@/hooks/use-toast"

export function CartSummary() {
  const items = useCart((state) => state.items)
  const appliedCoupon = useCart((state) => state.appliedCoupon)
  const applyCoupon = useCart((state) => state.applyCoupon)
  const removeCoupon = useCart((state) => state.removeCoupon)
  const getSubtotal = useCart((state) => state.getSubtotal)
  const getCouponDiscount = useCart((state) => state.getCouponDiscount)
  const getTotal = useCart((state) => state.getTotal)
  
  const [deliveryOption, setDeliveryOption] = useState<"envio" | "retiro">("envio")
  const [note, setNote] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [validatingCoupon, setValidatingCoupon] = useState(false)
  
  const { toast } = useToast()

  const subtotal = getSubtotal()
  const couponDiscount = getCouponDiscount()
  const total = getTotal()

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
          if (subtotal < data.coupon.minPurchase) {
            toast({
              title: "Compra mínima no alcanzada",
              description: `Este cupón requiere una compra mínima de $${data.coupon.minPurchase.toLocaleString('es-AR')}`,
              variant: "destructive",
            })
            return
          }

          applyCoupon(data.coupon)
          setCouponCode("")
          
          toast({
            title: "¡Cupón aplicado!",
            description: `${data.coupon.name} - ${data.coupon.discountType === 'percentage' ? `${data.coupon.discountValue}%` : `$${data.coupon.discountValue.toLocaleString('es-AR')}`} de descuento`,
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

  const handleRemoveCoupon = () => {
    removeCoupon()
    toast({
      title: "Cupón removido",
      description: "El cupón ha sido removido del carrito",
    })
  }

  const handleCheckout = () => {
    const phone = process.env.NEXT_PUBLIC_WA_PHONE || "5491158082486"
    const message = buildCartMessage(items, deliveryOption, note, window.location.href)
    const url = buildWAUrl(phone, message)
    window.open(url, "_blank")
    
    // Incrementar uso del cupón si hay uno aplicado
    if (appliedCoupon) {
      fetch('/api/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: appliedCoupon.code })
      }).catch(console.error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input de Cupón - Opcional */}
      {!appliedCoupon && (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
          <h3 className="font-semibold text-foreground text-base mb-3 flex items-center gap-2">
            <Ticket className="h-5 w-5 text-accent" />
            ¿Tenés un código de descuento?
          </h3>
          
          <div className="flex gap-2">
            <Input
              placeholder="CÓDIGO"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
              className="flex-1 font-mono uppercase border-2 border-border focus:border-accent"
              disabled={validatingCoupon}
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={validatingCoupon || !couponCode.trim()}
              className="bg-accent hover:bg-accent/90"
            >
              {validatingCoupon ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Aplicar'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Cupón aplicado */}
      {appliedCoupon && (
        <div className="bg-accent/10 border-2 border-accent rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-accent text-accent-foreground font-mono text-sm">
                  {appliedCoupon.code}
                </Badge>
                <Badge variant="outline" className="text-primary border-primary">
                  Aplicado ✓
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{appliedCoupon.name}</p>
              <p className="text-base font-semibold text-accent">
                -{appliedCoupon.discountType === 'percentage' 
                  ? `${appliedCoupon.discountValue}%` 
                  : `$${appliedCoupon.discountValue.toLocaleString('es-AR')}`}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRemoveCoupon}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Resumen de precios */}
      <div className="bg-muted/50 border border-border rounded-xl p-5 space-y-3">
        <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
          💰 Resumen
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-medium">Subtotal ({items.length} productos)</span>
            <span className="text-lg font-semibold text-foreground">${subtotal.toLocaleString('es-AR')}</span>
          </div>
          
          {appliedCoupon && couponDiscount > 0 && (
            <div className="flex justify-between items-center text-accent">
              <span className="font-medium flex items-center gap-1">
                <Ticket className="h-4 w-4" />
                Descuento
              </span>
              <span className="font-semibold">-${couponDiscount.toLocaleString('es-AR')}</span>
            </div>
          )}
        </div>
        
        <div className="border-t border-border pt-3">
          <div className="flex justify-between items-center">
            <span className="text-foreground font-bold text-xl">Total</span>
            <span className="text-2xl font-bold text-accent">${total.toLocaleString('es-AR')}</span>
          </div>
          {couponDiscount > 0 && (
            <p className="text-sm text-accent font-medium text-right mt-1">
              ¡Ahorraste ${couponDiscount.toLocaleString('es-AR')}!
            </p>
          )}
        </div>
      </div>

      {/* Opciones de entrega */}
      <div className="bg-muted/50 border border-border rounded-xl p-4">
        <h3 className="font-semibold text-foreground text-base mb-4 flex items-center gap-2">
          🚚 Entrega
        </h3>
        <RadioGroup value={deliveryOption} onValueChange={(value) => setDeliveryOption(value as "envio" | "retiro")}>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border-2 border-border rounded-xl bg-card hover:border-accent transition-colors">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="envio" id="envio" />
                <div>
                  <Label htmlFor="envio" className="cursor-pointer font-semibold text-foreground text-base">
                    Envío a domicilio
                  </Label>
                  <div className="text-sm text-muted-foreground mt-1">
                    A todo el país
                  </div>
                </div>
              </div>
              <span className="text-green-600 font-bold text-xl">GRATIS</span>
            </div>
            
            <div className="flex items-center justify-between p-4 border-2 border-border rounded-xl bg-card hover:border-accent transition-colors">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="retiro" id="retiro" />
                <div>
                  <Label htmlFor="retiro" className="cursor-pointer font-semibold text-foreground text-base">
                    Retiro personal
                  </Label>
                  <div className="text-sm text-muted-foreground mt-1">
                    Coordinamos lugar y horario
                  </div>
                </div>
              </div>
              <span className="text-green-600 font-bold text-xl">GRATIS</span>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Nota opcional */}
      <div className="bg-muted/30 border border-border rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-base">
          💬 Comentarios
        </h3>
        <Textarea
          id="note"
          placeholder="Agregá cualquier aclaración sobre tu pedido..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="bg-card border-2 border-border focus:border-accent resize-none"
        />
      </div>

      {/* Botón de finalizar */}
      <div className="space-y-3">
        <Button 
          size="lg" 
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-6 text-xl shadow-2xl shadow-green-500/30 transition-all transform hover:scale-105" 
          onClick={handleCheckout}
        >
          <MessageCircle className="mr-3 h-6 w-6" />
          Finalizar Pedido por WhatsApp
        </Button>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-green-600" />
            <p className="text-sm font-semibold text-green-900">
              Envío GRATIS a todo el país
            </p>
          </div>
          <p className="text-xs text-green-700">
            Te enviaremos todos los detalles de tu pedido por WhatsApp
          </p>
        </div>
      </div>
    </div>
  )
}
