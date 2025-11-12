"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Image, Sparkles } from "lucide-react"
import type { Coupon } from "@/lib/types"

interface CouponImageGeneratorProps {
  coupon: Coupon
  onClose: () => void
}

export function CouponImageGenerator({ coupon, onClose }: CouponImageGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateCouponImage = useCallback(async () => {
    if (!canvasRef.current) return

    setIsGenerating(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configurar tamaño del canvas (1080x1080 para Instagram)
    canvas.width = 1080
    canvas.height = 1080

    // Fondo negro
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Agregar SVGs del hero como fondo (patrón decorativo)
    const addBackgroundPattern = () => {
      ctx.save()
      
      // Patrón de círculos degradados (similar al hero)
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 100 + 50
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, `rgba(139, 92, 246, ${Math.random() * 0.1 + 0.05})`)
        gradient.addColorStop(1, `rgba(168, 85, 247, 0)`)
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
      
      ctx.restore()
    }

    addBackgroundPattern()

    // Logo DripCore (esquina superior izquierda)
    const drawLogo = () => {
      ctx.save()
      
      // Logo en forma de gota con degradado
      const logoX = 80
      const logoY = 80
      const logoSize = 60
      
      const logoGradient = ctx.createLinearGradient(logoX, logoY, logoX + logoSize, logoY + logoSize)
      logoGradient.addColorStop(0, '#8B5CF6')
      logoGradient.addColorStop(1, '#00AEEF')
      
      ctx.fillStyle = logoGradient
      ctx.beginPath()
      ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2)
      ctx.fill()
      
      // Texto DRIPCORE
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 32px Arial, sans-serif'
      ctx.fillText('DRIPCORE', logoX + logoSize + 20, logoY + logoSize/2 + 12)
      
      ctx.restore()
    }

    // Título de la promoción
    const drawPromoTitle = () => {
      ctx.save()
      
      const titleX = 80
      const titleY = 180
      
      ctx.fillStyle = '#A855F7'
      ctx.font = '24px Arial, sans-serif'
      ctx.fillText('PROMO CUPÓN EXCLUSIVO -', titleX, titleY)
      
      ctx.restore()
    }

    // Oferta principal
    const drawMainOffer = () => {
      ctx.save()
      
      const offerX = 80
      const offerY = 280
      
      const discountText = coupon.discountType === 'percentage' 
        ? `${coupon.discountValue}% EN TODOS`
        : `$${coupon.discountValue.toLocaleString('es-AR')} EN TODOS`
      
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 72px Arial, sans-serif'
      ctx.fillText(discountText, offerX, offerY)
      
      // Texto adicional
      ctx.font = 'bold 64px Arial, sans-serif'
      ctx.fillText('LOS PRODUCTOS', offerX, offerY + 80)
      
      ctx.restore()
    }

    // Sección del código del cupón
    const drawCouponCode = () => {
      ctx.save()
      
      const codeX = 80
      const codeY = 480
      const codeWidth = 600
      const codeHeight = 120
      
      // Borde degradado del recuadro
      const borderGradient = ctx.createLinearGradient(codeX, codeY, codeX + codeWidth, codeY + codeHeight)
      borderGradient.addColorStop(0, '#8B5CF6')
      borderGradient.addColorStop(1, '#00AEEF')
      
      ctx.strokeStyle = borderGradient
      ctx.lineWidth = 4
      ctx.roundRect(codeX, codeY, codeWidth, codeHeight, 12)
      ctx.stroke()
      
      // Texto "Código del cupón"
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '20px Arial, sans-serif'
      ctx.fillText('Código del cupón', codeX + 20, codeY + 30)
      
      // Código del cupón
      ctx.font = 'bold 48px Arial, sans-serif'
      ctx.fillText(coupon.code, codeX + 20, codeY + 80)
      
      // Fecha de expiración
      if (coupon.expiresAt) {
        const expiresDate = new Date(coupon.expiresAt).toLocaleDateString('es-AR')
        ctx.font = '16px Arial, sans-serif'
        ctx.fillText(`Válido hasta ${expiresDate}`, codeX + 20, codeY + 100)
      }
      
      ctx.restore()
    }

    // Información adicional
    const drawAdditionalInfo = () => {
      ctx.save()
      
      const infoX = 80
      const infoY = 650
      
      // Icono de ubicación
      ctx.fillStyle = '#000000'
      ctx.beginPath()
      ctx.arc(infoX + 10, infoY + 10, 8, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '20px Arial, sans-serif'
      ctx.fillText('Tienda Online:', infoX + 30, infoY + 15)
      
      ctx.font = '18px Arial, sans-serif'
      ctx.fillText('dripcore.vercel.app', infoX + 30, infoY + 40)
      
      ctx.restore()
    }

    // Disponibilidad limitada
    const drawLimitedAvailability = () => {
      ctx.save()
      
      const limitX = 80
      const limitY = 750
      const limitWidth = 300
      const limitHeight = 60
      
      // Borde degradado
      const limitGradient = ctx.createLinearGradient(limitX, limitY, limitX + limitWidth, limitY + limitHeight)
      limitGradient.addColorStop(0, '#00AEEF')
      limitGradient.addColorStop(1, '#8B5CF6')
      
      ctx.strokeStyle = limitGradient
      ctx.lineWidth = 3
      ctx.roundRect(limitX, limitY, limitWidth, limitHeight, 8)
      ctx.stroke()
      
      // Texto
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 20px Arial, sans-serif'
      ctx.fillText(`Solo ${coupon.maxUses || 'limitados'} cupos`, limitX + 20, limitY + 35)
      
      ctx.restore()
    }

    // Llamada a la acción
    const drawCallToAction = () => {
      ctx.save()
      
      const ctaX = 500
      const ctaY = 750
      
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 24px Arial, sans-serif'
      ctx.fillText('Finalizá por WhatsApp', ctaX, ctaY)
      
      ctx.font = '18px Arial, sans-serif'
      ctx.fillText('dripcore.vercel.app', ctaX, ctaY + 30)
      
      ctx.restore()
    }

    // Dibujar todos los elementos
    drawLogo()
    drawPromoTitle()
    drawMainOffer()
    drawCouponCode()
    drawAdditionalInfo()
    drawLimitedAvailability()
    drawCallToAction()

    setIsGenerating(false)
  }, [coupon])

  const downloadImage = () => {
    if (!canvasRef.current) return

    const link = document.createElement('a')
    link.download = `cupon-${coupon.code}.png`
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Generador de Imagen de Cupón
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Canvas para la imagen */}
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="border border-gray-200 rounded-lg shadow-lg"
              style={{ width: '540px', height: '540px' }}
            />
          </div>

          {/* Información del cupón */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium">Código del Cupón</Label>
              <Input value={coupon.code} readOnly className="font-mono" />
            </div>
            <div>
              <Label className="text-sm font-medium">Descuento</Label>
              <Input 
                value={
                  coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}%`
                    : `$${coupon.discountValue.toLocaleString('es-AR')}`
                } 
                readOnly 
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Nombre</Label>
              <Input value={coupon.name} readOnly />
            </div>
            <div>
              <Label className="text-sm font-medium">Usos Máximos</Label>
              <Input value={coupon.maxUses || 'Ilimitados'} readOnly />
            </div>
            {coupon.expiresAt && (
              <div>
                <Label className="text-sm font-medium">Expira</Label>
                <Input 
                  value={new Date(coupon.expiresAt).toLocaleDateString('es-AR')} 
                  readOnly 
                />
              </div>
            )}
            {coupon.description && (
              <div className="md:col-span-2">
                <Label className="text-sm font-medium">Descripción</Label>
                <Textarea value={coupon.description} readOnly rows={2} />
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={generateCouponImage}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generando...
                </>
              ) : (
                <>
                  <Image className="mr-2 h-4 w-4" />
                  Generar Imagen
                </>
              )}
            </Button>
            
            <Button
              onClick={downloadImage}
              disabled={isGenerating}
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
            >
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
