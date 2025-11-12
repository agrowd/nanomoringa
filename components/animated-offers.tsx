"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Eye, Percent } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/lib/cart-store"

interface AnimatedOffersProps {
  products: Product[]
  title?: string
  description?: string
}

export function AnimatedOffers({ 
  products, 
  title = "🔥 OFERTAS ESPECIALES", 
  description = "No te pierdas estas ofertas increíbles" 
}: AnimatedOffersProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()
  const addItem = useCart((state) => state.addItem)

  // Filtrar solo productos en oferta o destacados
  const offerProducts = products.filter(product => 
    product.is_on_sale || product.featured || (product.compareAt && product.compareAt > product.price)
  )

  // Auto-slide cada 4 segundos
  useEffect(() => {
    if (!isHovered && offerProducts.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === offerProducts.length - 1 ? 0 : prevIndex + 1
        )
      }, 4000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovered, offerProducts.length])

  const handleProductClick = (product: Product, action: string) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'offers',
        event_label: `${action}_${product.name}`,
        value: product.price
      })
    }
    
    console.log(`Product ${action} clicked:`, product.name)
  }

  const calculateDiscount = (product: Product) => {
    if (product.compareAt && product.compareAt > product.price) {
      return Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    }
    return 0
  }

  if (offerProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No hay ofertas disponibles</h3>
        <p className="text-gray-600">¡Vuelve pronto para ver nuestras ofertas especiales!</p>
      </div>
    )
  }

  const currentProduct = offerProducts[currentIndex]

  return (
    <section className="relative py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-orange-500 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-500 rounded-full animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 mb-4 animate-pulse">
            {title}
          </h2>
          <p className="text-lg text-gray-700 font-medium">{description}</p>
        </div>

        {/* Main Offer Card */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-3xl">
            {/* Discount Badge - 3D Effect */}
            <div className="absolute top-6 right-6 z-20">
              <div className="relative">
                {/* Shadow for 3D effect */}
                <div className="absolute inset-0 bg-red-600 rounded-full transform rotate-3 scale-105 opacity-50"></div>
                {/* Main badge */}
                <div className="relative bg-gradient-to-br from-red-500 to-red-700 rounded-full p-4 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <Percent className="w-8 h-8 text-white" />
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-800 text-xs font-black px-2 py-1 rounded-full animate-bounce">
                    -{calculateDiscount(currentProduct)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="relative">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group cursor-pointer">
                  <Link href={`/producto/${currentProduct.id}`}>
                    <Image
                      src={currentProduct.images[0] || "/placeholder.svg"}
                      alt={currentProduct.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Ghost effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Link>
                  
                  {/* Price overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600 line-through">
                            ${currentProduct.compareAt?.toLocaleString('es-AR')}
                          </div>
                          <div className="text-2xl font-black text-red-600">
                            ${currentProduct.price.toLocaleString('es-AR')}
                          </div>
                        </div>
                        <Badge className="bg-red-500 text-white px-3 py-1 text-sm font-bold">
                          -{calculateDiscount(currentProduct)}% OFF
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <Badge className="mb-3 bg-purple-100 text-purple-800">
                    {currentProduct.category}
                  </Badge>
                  <Link href={`/producto/${currentProduct.id}`}>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 hover:text-purple-600 cursor-pointer transition-colors">
                      {currentProduct.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {currentProduct.short_description || "Producto de alta calidad con descuento especial"}
                  </p>
                </div>

                {/* Stock indicator */}
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${currentProduct.stock > 10 ? 'bg-green-500' : currentProduct.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {currentProduct.stock > 10 ? 'Stock disponible' : currentProduct.stock > 0 ? 'Últimas unidades' : 'Sin stock'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => {
                      if (currentProduct.stock > 0) {
                        addItem(currentProduct)
                        handleProductClick(currentProduct, 'add_to_cart')
                      }
                    }}
                    disabled={currentProduct.stock === 0}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {currentProduct.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                  </Button>
                  
                  <Button 
                    asChild 
                    variant="outline" 
                    className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold py-4 rounded-xl transition-all duration-300"
                    onClick={() => handleProductClick(currentProduct, 'view')}
                  >
                    <Link href={`/producto/${currentProduct.id}`}>
                      <Eye className="w-5 h-5 mr-2" />
                      Ver Detalles
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          {offerProducts.length > 1 && (
            <div className="flex justify-center mt-8 space-x-3">
              {offerProducts.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-red-500 scale-125 shadow-lg' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}

          {/* Slide indicators */}
          <div className="flex justify-center mt-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <span className="text-sm font-medium text-gray-700">
                {currentIndex + 1} de {offerProducts.length}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Products Grid */}
        {offerProducts.length > 1 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Más Ofertas Especiales
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {offerProducts.slice(0, 4).map((product, index) => (
                <div 
                  key={product.id}
                  className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    index === currentIndex ? 'ring-4 ring-red-500/50' : ''
                  }`}
                >
                  {/* Small discount badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-red-500 text-white text-xs font-bold">
                      -{calculateDiscount(product)}%
                    </Badge>
                  </div>

                  {/* Botón para cambiar producto principal */}
                  {index !== currentIndex && (
                    <div className="absolute top-2 left-2 z-10">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs bg-white/90 hover:bg-white border-gray-300"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setCurrentIndex(index)
                        }}
                        title="Ver este producto"
                      >
                        Ver
                      </Button>
                    </div>
                  )}
                  
                  <Link href={`/producto/${product.slug || product.id}`}>
                    <div className="aspect-square relative cursor-pointer">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="p-3">
                      <h4 className="font-bold text-sm text-gray-900 truncate hover:text-purple-600 cursor-pointer transition-colors">
                        {product.name}
                      </h4>
                  </Link>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-lg font-black text-red-600">
                        ${product.price.toLocaleString('es-AR')}
                      </div>
                      {product.compareAt && (
                        <div className="text-xs text-gray-500 line-through">
                          ${product.compareAt.toLocaleString('es-AR')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}