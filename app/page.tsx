"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
// import { AnimatedOffers } from "@/components/animated-offers"
import { Badge } from "@/components/ui/badge"
import { Truck, Shield, Clock, Star, ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/lib/types"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isVideoMuted, setIsVideoMuted] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        console.log('[HomePage] Loading products from API...')
        const response = await fetch("/api/products")
        
        if (response.ok) {
          const data = await response.json()
          console.log('[HomePage] Loaded', data.length, 'products from API')
          setProducts(data)
        } else {
          console.error('[HomePage] Failed to load products:', response.status, response.statusText)
          // Fallback a productos mock si la API falla
          const { mockProducts } = await import("@/lib/mock-products")
          console.warn('[HomePage] Using mock products as fallback')
          setProducts(mockProducts)
        }
      } catch (error) {
        console.error('[HomePage] Error loading products:', error)
        // Fallback a productos mock si hay error
        try {
          const { mockProducts } = await import("@/lib/mock-products")
          console.warn('[HomePage] Using mock products as fallback due to error')
          setProducts(mockProducts)
        } catch (fallbackError) {
          console.error('[HomePage] Fallback also failed:', fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const featuredProducts = products.filter((p) => p.featured).slice(0, 8)

  // Componente de carrusel de imágenes
  function ImageCarousel({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextImage = () => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
      <div className="relative">
        <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-primary/20 aspect-[16/9] bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
          <Image
            src={images[currentIndex]}
            alt={`Imagen ${currentIndex + 1} de Nano Moringa`}
            width={1200}
            height={675}
            className="w-full h-full object-contain"
          />
        </div>
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-2 border-primary/20 h-10 w-10 sm:h-12 sm:w-12"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-2 border-primary/20 h-10 w-10 sm:h-12 sm:w-12"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-white/50 w-2 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section - Nano Moringa */}
        <section className="relative min-h-[100vh] flex flex-col items-center justify-center bg-gradient-to-br from-[#556B2F] via-[#6B8E23] to-[#556B2F] text-white overflow-hidden pt-24 pb-16">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6B8E23]/50 to-[#556B2F]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#6B8E23]/10 via-transparent to-transparent"></div>
          
          {/* Elementos flotantes naturales - Simplificado */}
          <div className="absolute top-20 left-10 w-24 h-24 bg-green-500/15 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-lime-500/15 rounded-full blur-2xl animate-pulse delay-500"></div>
          <div className="absolute bottom-40 left-20 w-28 h-28 bg-teal-500/15 rounded-full blur-2xl animate-pulse delay-700"></div>
          
          {/* Hojas flotantes decorativas - Ocultas en mobile para mejor rendimiento */}
          <div className="hidden md:block absolute top-32 right-24 text-6xl opacity-10 animate-float-slow">🌿</div>
          <div className="hidden md:block absolute bottom-32 left-24 text-5xl opacity-10 animate-float-medium">🍃</div>
          <div className="hidden md:block absolute top-60 left-32 text-4xl opacity-10 animate-float-fast">🌱</div>
          <div className="hidden md:block absolute bottom-60 right-32 text-5xl opacity-10 animate-float-slow">💚</div>

          <div className="container mx-auto px-4 relative z-10 text-center max-w-6xl pt-20">
            {/* Logo and Title Section */}
            <div className="flex flex-col items-center justify-center gap-6 mb-12">
              <div className="relative">
                <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full bg-white/95 flex items-center justify-center p-2 shadow-2xl animate-fade-in overflow-hidden">
                  <Image
                    src="/brand/nanomoringa-logo.png"
                    alt="Nano Moringa"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full blur-2xl -z-10 animate-pulse"></div>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-white via-[#F5F5DC] to-white bg-clip-text text-transparent drop-shadow-2xl font-[family-name:var(--font-playfair)]">
                NANO MORINGA
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-6 sm:mb-8 tracking-wide font-semibold text-center px-4 font-[family-name:var(--font-playfair)] whitespace-normal break-words">
              Productos Medicinales 100% Naturales 🌿
            </p>

            {/* Description - MÍNIMA */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 sm:mb-12 max-w-2xl mx-auto text-center leading-relaxed px-4 whitespace-normal break-words">
              Aceites micronizados • Bienestar en cada gota
            </p>

            {/* Confianza Social */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
              <div className="flex -space-x-2 sm:-space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-14 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 border-2 border-[#294E3A] flex items-center justify-center shadow-lg text-xl sm:text-2xl">
                  🌿
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-14 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 border-2 border-[#294E3A] flex items-center justify-center shadow-lg text-xl sm:text-2xl">
                  💚
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-14 rounded-full bg-gradient-to-br from-teal-600 to-green-600 border-2 border-[#294E3A] flex items-center justify-center shadow-lg text-xl sm:text-2xl">
                  ✨
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-14 rounded-full bg-gradient-to-br from-lime-600 to-green-600 border-2 border-[#294E3A] flex items-center justify-center shadow-lg text-xl sm:text-2xl">
                  🌱
                </div>
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm text-gray-300">
                  <span className="text-white font-bold text-base sm:text-lg lg:text-xl">21 mil</span> nos siguen
                </p>
                <p className="text-xs text-green-300">Bienestar diario</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-center mb-12 sm:mb-16 max-w-4xl mx-auto w-full px-4">
              <Button
                asChild
                size="lg"
                className="bg-white/95 text-[#556B2F] hover:bg-white text-base sm:text-xl lg:text-2xl px-6 sm:px-10 lg:px-12 py-4 sm:py-6 lg:py-8 font-bold shadow-2xl transition-all duration-300 transform hover:scale-110 rounded-xl sm:rounded-2xl border-2 border-white w-full sm:w-auto"
              >
                <Link href="/catalogo">🌿 Ver Productos</Link>
              </Button>
              <Button
                onClick={() => {
                  const chatButton = document.querySelector('[aria-label="Abrir chat"]') as HTMLButtonElement
                  if (chatButton) chatButton.click()
                }}
                size="lg"
                className="bg-gradient-to-r from-[#4A8F53] to-[#3A7A43] hover:from-[#3A7A43] hover:to-[#2A6A33] text-white text-base sm:text-xl lg:text-2xl px-6 sm:px-10 lg:px-12 py-4 sm:py-6 lg:py-8 font-bold shadow-2xl shadow-green-500/30 transition-all duration-300 transform hover:scale-110 rounded-xl sm:rounded-2xl w-full sm:w-auto"
              >
                💬 Consultar con Asesor
              </Button>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <p className="text-sm text-gray-400 tracking-widest">SCROLL TO REVEAL</p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-gradient-to-br from-[#556B2F] via-[#6B8E23] to-[#556B2F] border-y border-accent/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/25">
                    <Truck className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-white mb-1 text-sm sm:text-base">Envíos</h3>
                <p className="text-xs text-green-200">A todo el país</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-4">
                  <div className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/25">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-white mb-1 text-sm sm:text-base">100% Natural</h3>
                <p className="text-xs text-emerald-200">Productos medicinales</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 bg-gradient-to-br from-teal-600 to-teal-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-teal-500/25">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-white mb-1 text-sm sm:text-base">Micronizado</h3>
                <p className="text-xs text-teal-200">Mejor absorción</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 bg-gradient-to-br from-lime-600 to-lime-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-lime-500/25">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-white mb-1 text-sm sm:text-base">Asesoramiento</h3>
                <p className="text-xs text-lime-200">Personalizado</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Visual - Video e Imágenes */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-background via-muted to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Video principal - Grande y destacado */}
              <div className="mb-8 sm:mb-12 lg:mb-16 relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20 bg-gradient-to-br from-[#4A8F53] via-[#3A7A43] to-[#2A6A33] flex items-center justify-center relative" style={{ minHeight: '300px', maxHeight: '600px' }}>
                  <video
                    src="/uploads/video-nanomoringa.mp4"
                    className="w-full h-auto max-h-[600px] object-contain"
                    autoPlay
                    loop
                    muted
                    playsInline
                    id="hero-video"
                  />
                  {/* Botón de audio estético - Visible en todos los dispositivos */}
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        const video = document.getElementById('hero-video') as HTMLVideoElement
                        if (video) {
                          const newMutedState = !video.muted
                          video.muted = newMutedState
                          setIsVideoMuted(newMutedState)
                        }
                      }}
                      className={`group relative rounded-full transition-all duration-300 flex items-center justify-center backdrop-blur-sm border-2 shadow-lg ${
                        isVideoMuted
                          ? 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/20 hover:bg-white/30 border-white/30 hover:border-white/40'
                          : 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-green-600 hover:bg-green-700 border-green-400 hover:border-green-500 shadow-green-500/50'
                      }`}
                      title={isVideoMuted ? "Activar audio" : "Desactivar audio"}
                      aria-label={isVideoMuted ? "Activar audio" : "Desactivar audio"}
                    >
                      {isVideoMuted ? (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      )}
                      {!isVideoMuted && (
                        <div className="absolute inset-0 rounded-full bg-green-500/30 opacity-75 animate-pulse"></div>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Galería de imágenes principales - Grid visual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-primary/20 aspect-square bg-white flex items-center justify-center">
                  <Image
                    src="/uploads/nanomoringa-hero1.png"
                    alt="Producto natural Nano Moringa"
                    width={600}
                    height={600}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-primary/20 aspect-square bg-white flex items-center justify-center">
                  <Image
                    src="/uploads/nanomoringa-hero-2.png"
                    alt="Producto natural Nano Moringa"
                    width={600}
                    height={600}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-primary/20 aspect-square bg-white flex items-center justify-center">
                  <Image
                    src="/uploads/nanomoringa-hero4.jpeg"
                    alt="Producto natural Nano Moringa"
                    width={600}
                    height={600}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Carrusel de imágenes adicionales */}
              <ImageCarousel images={[
                "/uploads/nanomoringa-hero4.5.jpeg",
                "/uploads/Nano%20Moringa%202110%20(6).png",
                "/uploads/Nano%20Moringa%202110%20(7).png",
                "/uploads/Nano%20Moringa%202110%20(8).png"
              ]} />
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="featured-products" className="py-12 sm:py-16 lg:py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-8 sm:mb-12">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🌿</div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary font-[family-name:var(--font-playfair)] px-4 whitespace-normal break-words">Nuestros Productos</h2>
                <p className="text-muted-foreground mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl px-4 whitespace-normal break-words">Calidad • Seguimiento • Resultados</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {loading ? (
                // Skeleton loading para productos destacados
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-300 rounded-lg h-64 mb-4"></div>
                    <div className="bg-gray-300 rounded h-4 mb-2"></div>
                    <div className="bg-gray-300 rounded h-4 w-2/3"></div>
                  </div>
                ))
              ) : (
                featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>

            {/* Botón VER TODO al final de los productos */}
            <div className="flex justify-center mt-8 sm:mt-12">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-6 sm:px-10 lg:px-12 py-4 sm:py-6 lg:py-7 text-base sm:text-xl lg:text-2xl shadow-2xl shadow-accent/30 transition-all duration-300 transform hover:scale-110 rounded-xl sm:rounded-2xl">
                <Link href="/catalogo">
                  Ver Todo 🌿
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 font-[family-name:var(--font-playfair)] px-4 whitespace-normal break-words">Tu Bienestar, Nuestra Prioridad</h2>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 hover:bg-primary-foreground/15 transition-all hover:scale-105">
                <div className="text-5xl sm:text-6xl lg:text-7xl mb-4 sm:mb-6">🧪</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Certificado</h3>
                <p className="text-primary-foreground/80 text-base sm:text-lg">
                  Laboratorio verificado
                </p>
              </div>

              <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 hover:bg-primary-foreground/15 transition-all hover:scale-105">
                <div className="text-5xl sm:text-6xl lg:text-7xl mb-4 sm:mb-6">👥</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Acompañamiento</h3>
                <p className="text-primary-foreground/80 text-base sm:text-lg">
                  Asesoramiento personal
                </p>
              </div>

              <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 hover:bg-primary-foreground/15 transition-all hover:scale-105 sm:col-span-2 md:col-span-1">
                <div className="text-5xl sm:text-6xl lg:text-7xl mb-4 sm:mb-6">📦</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Envíos</h3>
                <p className="text-primary-foreground/80 text-base sm:text-lg">
                  A todo el país
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Consulta Section - MUY VISUAL */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-background to-muted border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-5xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6">💬</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6 font-[family-name:var(--font-playfair)] px-4 whitespace-normal break-words">
                ¿Dudas?
                </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 lg:mb-10 px-4 whitespace-normal break-words">
                Te asesoramos personalmente
              </p>
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base sm:text-xl lg:text-2xl px-8 sm:px-12 lg:px-16 py-5 sm:py-7 lg:py-10 rounded-xl sm:rounded-2xl shadow-2xl shadow-accent/30 transform hover:scale-110 transition-all"
                onClick={() => {
                  const chatButton = document.querySelector('[aria-label="Abrir chat"]') as HTMLButtonElement
                  if (chatButton) chatButton.click()
                }}
              >
                Consultar con Asesor
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Final - MUY DIRECTO */}
        <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-accent to-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 font-[family-name:var(--font-playfair)] px-4 whitespace-normal break-words">
              Comenzá Hoy 🌿
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 lg:mb-12 opacity-90 px-4 whitespace-normal break-words">
              Seguimiento personalizado
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
              <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base sm:text-xl lg:text-2xl px-8 sm:px-12 lg:px-14 py-5 sm:py-7 lg:py-9 font-bold rounded-xl sm:rounded-2xl shadow-2xl transform hover:scale-110 transition-all w-full sm:w-auto">
                <Link href="/catalogo">Ver Productos</Link>
              </Button>
              <Button
                size="lg"
                className="bg-white/20 text-primary-foreground hover:bg-white/30 text-base sm:text-xl lg:text-2xl px-8 sm:px-12 lg:px-14 py-5 sm:py-7 lg:py-9 font-bold rounded-xl sm:rounded-2xl border-2 border-white/50 backdrop-blur-sm transform hover:scale-110 transition-all w-full sm:w-auto"
                onClick={() => {
                  const chatButton = document.querySelector('[aria-label="Abrir chat"]') as HTMLButtonElement
                  if (chatButton) chatButton.click()
                }}
              >
                Consultar
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
