import Link from "next/link"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-store"
import { ShoppingCart, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  
  const hasDiscount = product.compareAt && product.compareAt > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAt! - product.price) / product.compareAt!) * 100)
    : 0

  // Combinar imágenes y videos
  const allMedia = [...(product.images || []), ...(product.videos || [])]
  const isVideo = (index: number) => index >= (product.images?.length || 0)
  const currentMedia = allMedia[currentImageIndex] || "/placeholder.svg"
  const hasMultipleMedia = allMedia.length > 1

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allMedia.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length)
  }

  // Swipe gestures para móvil
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && hasMultipleMedia) {
      nextImage()
    }
    if (isRightSwipe && hasMultipleMedia) {
      prevImage()
    }
  }

  // Mostrar hint de swipe en móvil
  useEffect(() => {
    if (hasMultipleMedia && window.innerWidth <= 768) {
      const timer = setTimeout(() => setShowHint(true), 1000)
      const hideTimer = setTimeout(() => setShowHint(false), 4000)
      return () => {
        clearTimeout(timer)
        clearTimeout(hideTimer)
      }
    }
  }, [hasMultipleMedia])

  // Animación de hint
  useEffect(() => {
    if (showHint && imageRef.current) {
      const element = imageRef.current
      element.style.transform = 'translateX(10px)'
      setTimeout(() => {
        element.style.transform = 'translateX(-10px)'
      }, 1000)
      setTimeout(() => {
        element.style.transform = 'translateX(0)'
      }, 2000)
    }
  }, [showHint])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock > 0) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || "/placeholder.svg",
        variant: {
          size: product.sizes[0] || "M",
          color: product.colors[0] || "Negro"
        }
      })
    }
  }

  return (
    <Card className="group overflow-hidden border-2 hover:border-[#8B5CF6] transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      <div className="flex flex-col h-full">
        <CardContent 
          ref={imageRef}
          className="p-0 relative aspect-[3/4] overflow-hidden bg-muted cursor-pointer transition-transform duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Media principal */}
          <Link href={`/producto/${product.slug || product.id}`}>
            {isVideo(currentImageIndex) ? (
              <video
                src={currentMedia}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={currentMedia}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
          </Link>

          {/* Controles de navegación - Desktop */}
          {hasMultipleMedia && isHovered && (
            <>
              <Button
                variant="ghost"
                size="lg"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-2 border-purple-500 text-purple-600 hover:text-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-12 w-12 p-0 shadow-lg"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  prevImage()
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-2 border-purple-500 text-purple-600 hover:text-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-12 w-12 p-0 shadow-lg"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  nextImage()
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Controles de navegación - Móvil */}
          {hasMultipleMedia && (
            <>
              <Button
                variant="ghost"
                size="lg"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-2 border-purple-500 text-purple-600 hover:text-purple-700 h-12 w-12 p-0 shadow-lg md:hidden"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  prevImage()
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-2 border-purple-500 text-purple-600 hover:text-purple-700 h-12 w-12 p-0 shadow-lg md:hidden"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  nextImage()
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.tags.includes("nuevo") && <Badge className="bg-[#8B5CF6] text-white">Nuevo</Badge>}
            {hasDiscount && <Badge className="bg-red-500 text-white">-{discountPercent}%</Badge>}
            {product.stock < 10 && product.stock > 0 && (
              <Badge variant="outline" className="bg-background/80">
                Últimas unidades
              </Badge>
            )}
            {product.stock === 0 && <Badge variant="destructive">Agotado</Badge>}
          </div>

          {/* Indicador de múltiples media */}
          {hasMultipleMedia && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-black/70 text-white text-xs">
                {currentImageIndex + 1}/{allMedia.length}
              </Badge>
            </div>
          )}
          {/* Indicador de video */}
          {isVideo(currentImageIndex) && (
            <div className="absolute top-3 right-3 mt-8">
              <Badge className="bg-purple-500/90 text-white text-xs flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Video
              </Badge>
            </div>
          )}

          {/* Hint de swipe para móvil */}
          {showHint && hasMultipleMedia && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
              <div className="bg-purple-500/90 backdrop-blur-sm rounded-lg px-4 py-2 text-center animate-pulse">
                <p className="text-white text-sm font-medium">← Desliza →</p>
              </div>
            </div>
          )}

          {/* Miniaturas de navegación - Desktop */}
          {hasMultipleMedia && isHovered && (
            <div className="absolute bottom-3 left-3 right-3 hidden md:block">
              <div className="flex gap-1 justify-center">
                {allMedia.slice(0, 4).map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-200 border-2 ${
                      index === currentImageIndex 
                        ? 'bg-purple-500 border-purple-300 scale-125' 
                        : 'bg-white/50 border-white/30 hover:bg-white/80 hover:border-white/60'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                    }}
                  />
                ))}
                {allMedia.length > 4 && (
                  <span className="text-white/80 text-xs ml-1">+{allMedia.length - 4}</span>
                )}
              </div>
            </div>
          )}

          {/* Miniaturas de navegación - Móvil */}
          {hasMultipleMedia && (
            <div className="absolute bottom-3 left-3 right-3 md:hidden">
              <div className="flex gap-2 justify-center">
                {allMedia.slice(0, 4).map((_, index) => (
                  <button
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                      index === currentImageIndex 
                        ? 'bg-purple-500 border-purple-300 scale-125' 
                        : 'bg-white/50 border-white/30 hover:bg-white/80 hover:border-white/60'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                    }}
                  />
                ))}
                {allMedia.length > 4 && (
                  <span className="text-white/80 text-xs ml-1">+{allMedia.length - 4}</span>
                )}
              </div>
            </div>
          )}

          {/* Mensaje informativo */}
          {!hasMultipleMedia && (
            <div className="absolute bottom-3 left-3 right-3">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
                <p className="text-white text-xs font-medium">Presiona para ver más</p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-3 p-4 flex-1">
          <Link href={`/producto/${product.slug || product.id}`}>
            <h3 className="font-semibold text-base line-clamp-2 group-hover:text-[#8B5CF6] transition-colors cursor-pointer hover:underline">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">${product.price.toLocaleString('es-AR')}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">${product.compareAt!.toLocaleString('es-AR')}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {product.colors.slice(0, 3).map((color) => (
              <span key={color} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {color}
              </span>
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                +{product.colors.length - 3}
              </span>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 w-full mt-auto">
            <Button 
              asChild 
              variant="outline" 
              size="sm" 
              className="flex-1 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"
            >
              <Link href={`/producto/${product.slug || product.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver
              </Link>
            </Button>
            <Button 
              onClick={handleAddToCart}
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Comprar
            </Button>
            <Button 
              onClick={handleAddToCart}
              variant="outline"
              size="sm" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-1 h-3 w-3" />
              +
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}
