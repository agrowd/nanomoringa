"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildWAUrl } from "@/lib/whatsapp"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export function FloatingWhatsAppButton() {
  const pathname = usePathname()
  const phone = process.env.NEXT_PUBLIC_WA_PHONE || "5491158082486"
  const [showTooltip, setShowTooltip] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const lastDismissed = localStorage.getItem("wa-tooltip-dismissed")
    const now = Date.now()

    if (!lastDismissed || now - Number.parseInt(lastDismissed) > 30000) {
      const timer = setTimeout(() => setShowTooltip(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Animación continua del botón
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleDismissTooltip = () => {
    setShowTooltip(false)
    localStorage.setItem("wa-tooltip-dismissed", Date.now().toString())

    // Reaparecer después de 30 segundos
    setTimeout(() => {
      setShowTooltip(true)
    }, 30000)
  }

  const handleClick = () => {
    const defaultMessage = `Hola 👋\n\nConsulto desde la web de Nano Moringa.\n\nNecesito ayuda general o información adicional.`
    const url = buildWAUrl(phone, defaultMessage)
    window.open(url, "_blank")
  }

  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <>
      {/* Tooltip */}
      {showTooltip && (
        <div className="fixed bottom-24 right-6 z-50 bg-gradient-to-br from-[#25D366] to-[#20BA5A] text-white rounded-2xl shadow-2xl p-4 max-w-xs animate-in slide-in-from-right duration-300">
          <button
            onClick={handleDismissTooltip}
            className="absolute -top-2 -right-2 bg-white text-[#25D366] rounded-full p-1.5 hover:bg-gray-100 transition-colors shadow-lg"
            aria-label="Cerrar"
          >
            <X className="h-3 w-3" />
          </button>
          <p className="text-base font-bold mb-1">📞 Consultas generales</p>
          <p className="text-sm mb-2 opacity-90">
            Para dudas o información adicional
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="animate-pulse">💬</span>
            <span>Para ventas usa el chat</span>
          </div>
        </div>
      )}

      {/* Botón WhatsApp */}
      <Button
        onClick={handleClick}
        size="lg"
        className={`fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-[#25D366] shadow-2xl hover:bg-[#20BA5A] transition-all duration-300 hover:scale-110 ${isAnimating ? 'animate-bounce' : ''}`}
        aria-label="Consultar por WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </Button>
    </>
  )
}
