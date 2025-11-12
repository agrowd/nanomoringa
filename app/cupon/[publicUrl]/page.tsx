import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Calendar, Users, Percent, DollarSign } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Coupon {
  id: number
  code: string
  name: string
  description?: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase: number
  maxUses?: number
  currentUses: number
  expiresAt?: string
  categories: string[]
  imageUrl?: string
  publicUrl: string
  createdAt: string
}

async function getCoupon(publicUrl: string): Promise<Coupon | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://dripcore.vercel.app'}/api/coupons/${publicUrl}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching coupon:', error)
    return null
  }
}

export default async function CouponPage({ params }: { params: { publicUrl: string } }) {
  const coupon = await getCoupon(params.publicUrl)
  
  if (!coupon) {
    notFound()
  }

  const copyCode = () => {
    navigator.clipboard.writeText(coupon.code)
    toast.success("¡Código copiado al portapapeles!")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDiscount = () => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`
    } else {
      return `$${coupon.discountValue.toLocaleString('es-AR')} OFF`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎟️ Cupón de Descuento</h1>
          <p className="text-gray-600">Canjeá este cupón en tu próxima compra</p>
        </div>

        {/* Cupón Principal */}
        <Card className="mb-8 shadow-2xl border-0 bg-gradient-to-br from-white to-purple-50">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Badge className="bg-purple-500 text-white px-4 py-2 text-lg font-bold">
                {formatDiscount()}
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">{coupon.name}</CardTitle>
            {coupon.description && (
              <CardDescription className="text-gray-600 text-lg">
                {coupon.description}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Imagen del cupón si existe */}
            {coupon.imageUrl && (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={coupon.imageUrl}
                  alt={coupon.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Código del cupón */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Tu código de descuento:</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-2xl font-mono font-bold text-purple-600 bg-white px-4 py-2 rounded border">
                    {coupon.code}
                  </code>
                  <Button 
                    onClick={copyCode}
                    size="sm" 
                    variant="outline"
                    className="border-purple-300 hover:bg-purple-50"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={copyCode}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar Código
              </Button>
            </div>

            {/* Detalles del cupón */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span>Compra mínima: ${coupon.minPurchase.toLocaleString('es-AR')}</span>
              </div>
              
              {coupon.expiresAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Válido hasta: {formatDate(coupon.expiresAt)}</span>
                </div>
              )}
              
              {coupon.maxUses && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>Usos: {coupon.currentUses}/{coupon.maxUses}</span>
                </div>
              )}
            </div>

            {/* Categorías aplicables */}
            {coupon.categories.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Categorías aplicables:</p>
                <div className="flex flex-wrap gap-2">
                  {coupon.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="bg-purple-100 text-purple-700">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="text-center py-6">
            <h3 className="text-xl font-bold mb-2">¡Aprovechá este descuento!</h3>
            <p className="mb-4 opacity-90">
              Agregá productos a tu carrito y aplicá el código al finalizar tu compra
            </p>
            <Button 
              asChild
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <a href="/catalogo">
                Ver Productos
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Este cupón es válido solo en DripCore</p>
          <p>Para más información, contactanos por WhatsApp</p>
        </div>
      </div>
    </div>
  )
}
