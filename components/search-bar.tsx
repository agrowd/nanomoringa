"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, TrendingDown, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/types"
import Image from "next/image"
import { createPortal } from "react-dom"

interface SearchBarProps {
  isExpanded: boolean
  onToggle: () => void
}

export function SearchBar({ isExpanded, onToggle }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Cargar productos desde la API cuando se abre el buscador
  useEffect(() => {
    if (isExpanded && products.length === 0) {
      loadProducts()
    }
  }, [isExpanded])

  const loadProducts = async () => {
    setLoading(true)
    try {
      console.log('[SearchBar] Fetching products...')
      const response = await fetch('/api/products')
      console.log('[SearchBar] Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('[SearchBar] Received products:', data.length)
        console.log('[SearchBar] Sample products:', data.slice(0, 3))
        setProducts(data)
        
        // Mostrar inmediatamente los 3 productos más baratos como recomendaciones
        const cheapest = data
          .sort((a: Product, b: Product) => (a.price || 0) - (b.price || 0))
          .slice(0, 3)
        console.log('[SearchBar] Cheapest products:', cheapest)
        setSuggestions(cheapest)
        setShowSuggestions(true)
      } else {
        const errorData = await response.json()
        console.error('[SearchBar] Error response:', errorData)
      }
    } catch (error) {
      console.error('[SearchBar] Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Actualizar sugerencias mientras escribe
  useEffect(() => {
    if (!products || products.length === 0) return
    
    if (searchQuery.trim().length > 0) {
      // Buscar productos que coincidan con la búsqueda
      const filtered = products
        .filter(product => 
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => (a.price || 0) - (b.price || 0))
        .slice(0, 3)
      
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else if (isExpanded) {
      // Si no hay búsqueda, mostrar los 3 productos más baratos
      const cheapest = products
        .sort((a, b) => (a.price || 0) - (b.price || 0))
        .slice(0, 3)
      
      setSuggestions(cheapest)
      setShowSuggestions(true)
    }
  }, [searchQuery, products, isExpanded])

  // Enfocar input cuando se expande
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isExpanded])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setShowSuggestions(false)
      onToggle()
    }
  }

  const handleSuggestionClick = (product: Product) => {
    router.push(`/producto/${product.slug || product.id}`)
    setSearchQuery("")
    setShowSuggestions(false)
    onToggle()
  }

  const handleClose = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setSearchQuery("")
      setShowSuggestions(false)
      setIsAnimating(false)
      onToggle()
    }, 150)
  }

  // Portal para renderizar fuera del navbar
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const searchModal = isExpanded && (
    <>
      {/* Overlay oscuro cuando está expandido */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal del buscador */}
      <div 
        className={`fixed top-16 left-4 right-4 sm:left-auto sm:right-4 sm:top-20 sm:w-[400px] bg-white border border-gray-200 rounded-lg shadow-xl z-[70] transition-all duration-200 ease-out ${
          isAnimating 
            ? 'opacity-0 scale-95 translate-y-2' 
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
          {/* Header con búsqueda */}
          <div className="p-2 border-b border-gray-100">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex items-center">
                <Search className="absolute left-2 h-3 w-3 text-gray-400 z-10" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-8 h-8 text-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200 [&::-webkit-search-cancel-button]:hidden"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 rounded z-10"
                  onClick={handleClose}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </form>
          </div>

          {/* Sugerencias */}
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
              <p className="text-xs text-gray-500 mt-1">Cargando...</p>
            </div>
          ) : showSuggestions && suggestions.length > 0 ? (
            <div className="max-h-[200px] overflow-y-auto">
              <div className="p-2">
                <div className="flex items-center gap-2 mb-3">
                  {searchQuery.trim().length > 0 ? (
                    <>
                      <Search className="h-3 w-3 text-purple-600" />
                      <p className="text-xs text-gray-600 font-medium">
                        Resultados ({suggestions.length})
                      </p>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 text-green-600" />
                      <p className="text-xs text-gray-600 font-medium flex items-center gap-1">
                        <Sparkles className="h-2 w-2 text-yellow-500" />
                        Recomendados
                      </p>
                    </>
                  )}
                </div>

                <div className="space-y-1">
                  {suggestions.map((product, index) => (
                    <button
                      key={product.id}
                      onClick={() => handleSuggestionClick(product)}
                      className="w-full group relative"
                    >
                      <div className="relative bg-gray-50 hover:bg-purple-50 rounded p-1.5 transition-all duration-200 border border-transparent hover:border-purple-200">
                        <div className="flex items-center gap-2">
                          {/* Imagen del producto */}
                          <div className="relative w-8 h-8 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Search className="h-3 w-3 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Información del producto */}
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            
                            <div className="flex items-center gap-1">
                              <p className="text-xs font-bold text-purple-600">
                                ${(product.price || 0).toLocaleString('es-AR')}
                              </p>
                              
                              {product.compareAt && product.compareAt > (product.price || 0) && (
                                <span className="text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded font-medium">
                                  -{Math.round((1 - (product.price || 0) / product.compareAt) * 100)}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : searchQuery.trim().length > 0 && suggestions.length === 0 ? (
            <div className="p-3 text-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-600 font-medium mb-1">No se encontraron productos</p>
              <p className="text-xs text-gray-500 mb-2">Intenta con otros términos</p>
              <Button
                onClick={() => {
                  router.push(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`)
                  handleClose()
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5"
              >
                Ver catálogo
              </Button>
            </div>
          ) : null}
      </div>
    </>
  )

  return (
    <>
      {/* Botón del buscador */}
      <div className="relative flex items-center" ref={containerRef}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={`text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 transition-all duration-300 ease-out hover:scale-110 active:scale-95 rounded-xl ${
            isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-transform duration-200 group-hover:rotate-12" />
        </Button>
      </div>
      
      {/* Portal para el modal del buscador */}
      {searchModal && createPortal(searchModal, document.body)}
    </>
  )
}
