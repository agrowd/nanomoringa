"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Ticket, ExternalLink, X } from "lucide-react"

const messages = [
  {
    title: "🎟️ ¡Cupones Exclusivos!",
    subtitle: "Hasta 50% OFF adicional",
    description: "Únete al canal y obtené descuentos especiales"
  },
  {
    title: "🔥 Ofertas Flash",
    subtitle: "Solo para miembros",
    description: "Acceso prioritario a promociones limitadas"
  },
  {
    title: "💎 Calidad Premium",
    subtitle: "Ropa AAA",
    description: "Productos de alta calidad con precios increíbles"
  },
  {
    title: "📱 Atención Directa",
    subtitle: "Comunicación personalizada",
    description: "Asesoramiento directo y envíos a todo el país"
  }
]

export function CouponBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Verificar si ya fue dismissada
    const dismissed = localStorage.getItem("coupon-banner-dismissed")
    const lastDismissed = dismissed ? parseInt(dismissed) : 0
    const now = Date.now()
    
    // Mostrar después de 30 minutos si fue dismissada
    if (now - lastDismissed > 30 * 60 * 1000) {
      const timer = setTimeout(() => {
        setShowBanner(true)
        setIsDismissed(false)
      }, 15000) // Mostrar después de 15 segundos
      
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!showBanner) return

    // Cambiar mensaje cada 5 segundos
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [showBanner])

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem("coupon-banner-dismissed", Date.now().toString())
    setIsDismissed(true)
  }

  const handleJoinChannel = () => {
    window.open("https://whatsapp.com/channel/0029Vb6grAvJuyA3fHqw1R1J", "_blank")
  }

  if (!showBanner || isDismissed) {
    return null
  }

  const currentMessage = messages[currentMessageIndex]

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-slide-in-down">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-2xl border-2 border-purple-400 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-purple-700/80 rounded-t-xl">
          <div className="flex items-center gap-3">
            <Ticket className="h-6 w-6 text-yellow-300" />
            <Badge className="bg-yellow-400 text-purple-800 text-sm font-bold">
              EXCLUSIVO
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white hover:bg-purple-600"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{currentMessage.title}</h3>
              <p className="text-purple-100 text-lg font-medium mb-2">
                {currentMessage.subtitle}
              </p>
              <p className="text-purple-50 text-sm">
                {currentMessage.description}
              </p>
            </div>
            
            <div className="ml-6">
              <Button
                onClick={handleJoinChannel}
                size="lg"
                className="bg-white text-purple-600 hover:bg-purple-50 font-bold text-lg px-8 py-4 shadow-lg"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Unirse al Canal
              </Button>
            </div>
          </div>

          {/* Indicadores de mensajes */}
          <div className="flex justify-center gap-2 mt-4">
            {messages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentMessageIndex
                    ? 'bg-yellow-300 scale-125'
                    : 'bg-purple-300/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-4">
          <p className="text-purple-100 text-xs text-center">
            Canal oficial de DripCore • Cupones acumulables con descuentos existentes
          </p>
        </div>
      </div>
    </div>
  )
}
