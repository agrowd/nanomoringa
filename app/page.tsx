"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
// import { AnimatedOffers } from "@/components/animated-offers"
import { Badge } from "@/components/ui/badge"
import { Truck, Shield, Clock, Star } from "lucide-react"
import { FaUser, FaUserTie, FaUserGraduate, FaUserAstronaut, FaUserNinja } from "react-icons/fa"
import { MdSportsSoccer, MdSportsBasketball, MdSportsTennis } from "react-icons/md"
import type { Product } from "@/lib/types"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      // Cargar productos mockup directamente (sin API por ahora)
      const { mockProducts } = await import("@/lib/mock-products")
      setProducts(mockProducts)
      setLoading(false)
      console.log('[HomePage] Loaded', mockProducts.length, 'mock products')
    }

    loadProducts()
  }, [])

  const featuredProducts = products.filter((p) => p.featured).slice(0, 8)

  return (
    <>
      <Header />
      <main>
        {/* Hero Section - Medicina Natural */}
        <section className="relative min-h-[100vh] flex flex-col items-center justify-center bg-gradient-to-br from-[#213A2E] via-[#294E3A] to-[#213A2E] text-white overflow-hidden pt-24 pb-16">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#294E3A]/50 to-[#294E3A]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent"></div>
          
          {/* Elementos flotantes naturales - Simplificado */}
          <div className="absolute top-20 left-10 w-24 h-24 bg-green-500/15 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-lime-500/15 rounded-full blur-2xl animate-pulse delay-500"></div>
          <div className="absolute bottom-40 left-20 w-28 h-28 bg-teal-500/15 rounded-full blur-2xl animate-pulse delay-700"></div>
          
          {/* Hojas flotantes decorativas */}
          <div className="absolute top-32 right-24 text-6xl opacity-10 animate-float-slow">🌿</div>
          <div className="absolute bottom-32 left-24 text-5xl opacity-10 animate-float-medium">🍃</div>
          <div className="absolute top-60 left-32 text-4xl opacity-10 animate-float-fast">🌱</div>
          <div className="absolute bottom-60 right-32 text-5xl opacity-10 animate-float-slow">💚</div>

          <div className="container mx-auto px-4 relative z-10 text-center max-w-6xl pt-20">
            {/* Logo and Title Section */}
            <div className="flex flex-col items-center justify-center gap-6 mb-12">
              <div className="relative">
                <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full bg-white/95 flex items-center justify-center p-1 shadow-2xl animate-fade-in overflow-hidden">
                  <Image
                    src="/brand/medicina-natural-logo.png"
                    alt="Medicina Natural"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full blur-2xl -z-10 animate-pulse"></div>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent drop-shadow-2xl font-[family-name:var(--font-playfair)]">
                MEDICINA NATURAL
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-2xl sm:text-3xl md:text-4xl text-white mb-8 tracking-wide font-semibold text-center px-4 font-[family-name:var(--font-playfair)]">
              Bienestar Natural 🌿
            </p>

            {/* Description - MÍNIMA */}
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto text-center leading-relaxed">
              Aceites naturales • Seguimiento personalizado
            </p>

            {/* Confianza Social */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="flex -space-x-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 border-3 border-[#294E3A] flex items-center justify-center shadow-lg text-2xl">
                  🌿
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 border-3 border-[#294E3A] flex items-center justify-center shadow-lg text-2xl">
                  💚
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-600 to-green-600 border-3 border-[#294E3A] flex items-center justify-center shadow-lg text-2xl">
                  ✨
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-lime-600 to-green-600 border-3 border-[#294E3A] flex items-center justify-center shadow-lg text-2xl">
                  🌱
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-300">
                  <span className="text-white font-bold text-xl">Miles</span> confían en nosotros
                </p>
                <p className="text-xs text-green-300">Comenzá tu bienestar</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#4A8F53] to-[#3A7A43] hover:from-[#3A7A43] hover:to-[#2A6A33] text-white text-2xl px-12 py-8 font-bold shadow-2xl shadow-green-500/30 transition-all duration-300 transform hover:scale-110 rounded-2xl"
              >
                <Link href="/catalogo">🌿 Ver Productos</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-white/95 text-[#294E3A] hover:bg-white text-2xl px-12 py-8 font-bold shadow-2xl transition-all duration-300 transform hover:scale-110 rounded-2xl border-2 border-white"
              >
                <Link href="/contacto">💬 Consultar Ahora</Link>
              </Button>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <p className="text-sm text-gray-400 tracking-widest">SCROLL TO REVEAL</p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-[#213A2E] via-[#294E3A] to-[#213A2E] border-y border-accent/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/25">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-white mb-1">Envíos</h3>
                <p className="text-xs text-green-200">A todo el país</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/25">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-white mb-1">CBD Certificado</h3>
                <p className="text-xs text-emerald-200">Calidad garantizada</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-teal-500/25">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-white mb-1">Seguimiento 1:1</h3>
                <p className="text-xs text-teal-200">Asesoramiento personal</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-lime-600 to-lime-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-lime-500/25">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-white mb-1">Natural</h3>
                <p className="text-xs text-lime-200">Sin aditivos</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Visual con Imagen/Video Placeholder */}
        <section className="py-16 bg-gradient-to-br from-background via-muted to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Imagen de beneficios */}
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="order-2 md:order-1">
                  <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20">
                    <Image
                      src="/uploads/beneficios-cbd.png"
                      alt="Rutina de bienestar natural"
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="order-1 md:order-2 text-center md:text-left">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-[family-name:var(--font-playfair)]">
                    🌿 Bienestar Natural
                  </h2>
                  <div className="space-y-4 text-xl text-muted-foreground">
                    <p className="flex items-center justify-center md:justify-start gap-3">
                      <span className="text-3xl">🌱</span> Natural
                    </p>
                    <p className="flex items-center justify-center md:justify-start gap-3">
                      <span className="text-3xl">💚</span> Seguro
                    </p>
                    <p className="flex items-center justify-center md:justify-start gap-3">
                      <span className="text-3xl">✨</span> Efectivo
                    </p>
                  </div>
                </div>
              </div>

              {/* Galería de imágenes lifestyle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-primary/20">
                  <Image
                    src="/uploads/hero-aceite.jpg"
                    alt="Uso de aceite natural"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-primary/20">
                  <Image
                    src="/uploads/gel-crema.png"
                    alt="Productos naturales"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="featured-products" className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-12">
              <div className="text-center">
                <div className="text-6xl mb-4">🌿</div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-[family-name:var(--font-playfair)]">Nuestros Productos</h2>
                <p className="text-muted-foreground mt-4 text-xl">Calidad • Seguimiento • Resultados</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="flex justify-center mt-12">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-12 py-7 text-2xl shadow-2xl shadow-accent/30 transition-all duration-300 transform hover:scale-110 rounded-2xl">
                <Link href="/catalogo">
                  Ver Todo 🌿
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-[family-name:var(--font-playfair)]">Tu Bienestar, Nuestra Prioridad</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-2xl p-10 hover:bg-primary-foreground/15 transition-all hover:scale-105">
                <div className="text-7xl mb-6">🧪</div>
                <h3 className="text-2xl font-bold mb-3">Certificado</h3>
                <p className="text-primary-foreground/80 text-lg">
                  Laboratorio verificado
                </p>
              </div>

              <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-2xl p-10 hover:bg-primary-foreground/15 transition-all hover:scale-105">
                <div className="text-7xl mb-6">👥</div>
                <h3 className="text-2xl font-bold mb-3">Acompañamiento</h3>
                <p className="text-primary-foreground/80 text-lg">
                  Asesoramiento personal
                </p>
              </div>

              <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-2xl p-10 hover:bg-primary-foreground/15 transition-all hover:scale-105">
                <div className="text-7xl mb-6">📦</div>
                <h3 className="text-2xl font-bold mb-3">Envíos</h3>
                <p className="text-primary-foreground/80 text-lg">
                  A todo el país
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Consulta Section - MUY VISUAL */}
        <section className="py-20 bg-gradient-to-br from-background to-muted border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-8xl mb-6">💬</div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-[family-name:var(--font-playfair)]">
                ¿Dudas?
                </h2>
              <p className="text-2xl text-muted-foreground mb-10">
                Te asesoramos personalmente
              </p>
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-2xl px-16 py-10 rounded-2xl shadow-2xl shadow-accent/30 transform hover:scale-110 transition-all">
                <Link href="/contacto">
                  Consultar por WhatsApp
                    </Link>
                  </Button>
            </div>
          </div>
        </section>

        {/* CTA Final - MUY DIRECTO */}
        <section className="py-24 bg-gradient-to-br from-accent to-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 font-[family-name:var(--font-playfair)]">
              Comenzá Hoy 🌿
            </h2>
            <p className="text-2xl md:text-3xl mb-12 opacity-90">
              Seguimiento personalizado
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-2xl px-14 py-9 font-bold rounded-2xl shadow-2xl transform hover:scale-110 transition-all">
                <Link href="/catalogo">Ver Productos</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-white/20 text-primary-foreground hover:bg-white/30 text-2xl px-14 py-9 font-bold rounded-2xl border-2 border-white/50 backdrop-blur-sm transform hover:scale-110 transition-all"
              >
                <Link href="/contacto">Consultar</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
