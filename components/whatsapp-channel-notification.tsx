"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { X, MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WhatsAppChannelNotification() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [lastShown, setLastShown] = useState<number | null>(null)

  // No mostrar la notificación en páginas de admin
  const isAdminPage = pathname?.startsWith('/admin')
  
  useEffect(() => {
    // Si estamos en admin, no mostrar la notificación
    if (isAdminPage) {
      return
    }

    const checkAndShow = () => {
      // Verificar si el chat está cerrado Y si el usuario lo cerró manualmente
      const chatIsOpen = (window as any).chatWidgetIsOpen || false
      const chatWasClosed = (window as any).chatWidgetWasClosed || false
      
      // Solo mostrar la notificación si:
      // 1. El chat está cerrado
      // 2. El usuario lo cerró manualmente (no es el estado inicial)
      // 3. Pasaron 60 segundos desde la última vez que se mostró
      if (!chatIsOpen && chatWasClosed) {
        const now = Date.now()
        if (!lastShown || (now - lastShown) >= 60000) {
          setIsVisible(true)
          setLastShown(now)
          
          // Auto-ocultar después de 10 segundos si no interactúa
          setTimeout(() => {
            setIsVisible(false)
          }, 10000)
        }
      } else {
        // Si el chat está abierto, ocultar la notificación
        setIsVisible(false)
      }
    }

    // No verificar inmediatamente, esperar a que el chat se abra primero
    // Verificar después de 2 segundos (para dar tiempo al auto-open del chat)
    const initialDelay = setTimeout(() => {
      checkAndShow()
    }, 2000)

    // Verificar cada 60 segundos
    const interval = setInterval(checkAndShow, 60000)

    return () => {
      clearTimeout(initialDelay)
      clearInterval(interval)
    }
  }, [lastShown, isAdminPage])

  // No renderizar nada si estamos en admin
  if (isAdminPage) {
    return null
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setLastShown(Date.now()) // Actualizar el tiempo para que vuelva a aparecer en 60 segundos
  }

  const handleChatClick = () => {
    // Trigger del chat widget
    const chatButton = document.querySelector('[aria-label="Abrir chat"]') as HTMLButtonElement
    if (chatButton) {
      chatButton.click()
    }
    handleDismiss()
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-28 right-6 z-50 animate-in slide-in-from-right duration-500">
      <div className="bg-gradient-to-br from-accent to-primary text-primary-foreground rounded-2xl shadow-2xl p-5 max-w-sm border-2 border-accent">
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1.5 hover:bg-primary/90 transition-colors shadow-lg"
          aria-label="Cerrar"
        >
          <X className="h-3 w-3" />
        </button>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">💬 ¡Comprá más rápido acá!</h3>
            <p className="text-sm opacity-90">Te asesoramos personalmente</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span className="font-semibold">Respuesta inmediata</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Disponible 24/7</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span>Asesoramiento especializado</span>
          </div>
        </div>
        
        <Button
          onClick={handleChatClick}
          className="w-full mt-4 bg-white text-accent hover:bg-gray-100 font-bold py-3 text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Hablar con asesor
        </Button>
        
        <p className="text-xs text-center mt-2 opacity-80">
          Sin compromiso • Consulta gratuita
        </p>
      </div>
    </div>
  )
}