"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-store"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, MessageCircle } from "lucide-react"
import { buildWAUrl, buildProductMessage } from "@/lib/whatsapp"
import type { Product } from "@/lib/types"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const addItem = useCart((state) => state.addItem)
  const { toast } = useToast()

  // Pre-seleccionar la primera presentación y variante disponible
  React.useEffect(() => {
    if (product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0])
    }
    if (product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0])
    }
  }, [product.sizes, product.colors, selectedSize, selectedColor])

  const hasDiscount = product.compareAt && product.compareAt > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAt! - product.price) / product.compareAt!) * 100)
    : 0

  const handleAddToCart = () => {
    // Usar valores pre-seleccionados o valores por defecto si no hay variantes
    const finalSize = selectedSize || (product.sizes.length > 0 ? product.sizes[0] : "Único")
    const finalColor = selectedColor || (product.colors.length > 0 ? product.colors[0] : "Sin variante")
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: quantity,
      variant: {
        size: finalSize,
        color: finalColor,
      },
      image: product.images[0],
    })

    // Mensaje de confirmación adaptado según si tiene variantes o no
    const variantText = (product.sizes.length > 0 || product.colors.length > 0)
      ? ` (${finalSize} / ${finalColor})`
      : ""
    
    toast({
      title: "Agregado al carrito",
      description: `${product.name}${variantText} x${quantity}`,
    })
  }

  const handleWhatsAppInquiry = () => {
    // Abrir el chat en lugar de WhatsApp directo
    const chatButton = document.querySelector('[aria-label="Abrir chat"]') as HTMLButtonElement
    if (chatButton) {
      chatButton.click()
      return
    }
    // Fallback a WhatsApp si no se encuentra el botón del chat
    // Usar valores pre-seleccionados o valores por defecto
    const finalSize = selectedSize || (product.sizes.length > 0 ? product.sizes[0] : "Único")
    const finalColor = selectedColor || (product.colors.length > 0 ? product.colors[0] : "Sin variante")

    const phone = process.env.NEXT_PUBLIC_WA_PHONE || "5491158082486"
    const message = buildProductMessage(product.name, finalSize, finalColor, window.location.href)
    const url = buildWAUrl(phone, message)
    window.open(url, "_blank")
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          {product.tags.includes("nuevo") && <Badge className="bg-[#8B5CF6] text-white">Nuevo</Badge>}
          {product.tags.includes("drop-limitado") && <Badge variant="outline">Drop Limitado</Badge>}
          {product.tags.includes("bestseller") && <Badge variant="outline">Bestseller</Badge>}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">{product.name}</h1>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl font-bold">${product.price.toLocaleString('es-AR')}</span>
          {hasDiscount && (
            <>
              <span className="text-xl text-muted-foreground line-through">${product.compareAt!.toLocaleString('es-AR')}</span>
              <Badge className="bg-red-500 text-white">-{discountPercent}%</Badge>
            </>
          )}
        </div>

        {/* Información de envío */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-700 font-semibold">🚚 Envíos disponibles:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-800 font-medium">GBA:</span>
              <span className="text-green-700 font-semibold">$10.000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800 font-medium">Interior:</span>
              <span className="text-green-700 font-semibold">$35.000</span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-800">
            🤝 <span className="font-semibold">Punto de encuentro: GRATIS</span>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>

      {/* Size Selection */}
      <div>
        <label className="block text-sm font-semibold mb-3">
          Presentación: {selectedSize && <span className="text-[#8B5CF6]">{selectedSize}</span>}
        </label>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "default" : "outline"}
              onClick={() => setSelectedSize(size)}
              className={selectedSize === size ? "bg-[#8B5CF6] hover:bg-[#8B5CF6]/90" : ""}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-semibold mb-3">
          Color: {selectedColor && <span className="text-[#8B5CF6]">{selectedColor}</span>}
        </label>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <Button
              key={color}
              variant={selectedColor === color ? "default" : "outline"}
              onClick={() => setSelectedColor(color)}
              className={selectedColor === color ? "bg-[#8B5CF6] hover:bg-[#8B5CF6]/90" : ""}
            >
              {color}
            </Button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-semibold mb-3">Cantidad</label>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            -
          </Button>
          <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
          >
            +
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {product.stock > 0 ? `${product.stock} unidades disponibles` : "Sin stock"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {product.stock > 0 ? (
          <>
            <Button
              size="lg"
              className="flex-1 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Agregar al Carrito
            </Button>

            <Button
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Comprar
            </Button>
          </>
        ) : (
          <div className="flex-1 text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-semibold mb-2">⚠️ Sin stock disponible</p>
            <p className="text-sm text-yellow-700">
              Consultá por WhatsApp para verificar disponibilidad o reservar
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" variant="outline" className="flex-1 bg-transparent" onClick={handleWhatsAppInquiry}>
          <MessageCircle className="mr-2 h-5 w-5" />
          Consultar por WhatsApp
        </Button>
        
        <Button 
          size="lg" 
          variant="outline" 
          className="flex-1 bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
          onClick={() => {
            const phone = process.env.NEXT_PUBLIC_WA_PHONE || "5491158082486"
            const message = `¡Hola! Me interesa comprar *${product.name}* al por mayor. ¿Podrían darme información sobre precios y condiciones?\n\nProducto: ${window.location.href}`
            const url = buildWAUrl(phone, message)
            window.open(url, "_blank")
          }}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Compra por Mayor
        </Button>
      </div>

      {/* Additional Info */}
      <div className="border-t pt-6 space-y-2 text-sm text-muted-foreground">
        <p>
          <strong>Categoría:</strong> {product.category}
        </p>
        <p>
          <strong>SKU:</strong> {product.id}
        </p>
      </div>
    </div>
  )
}
