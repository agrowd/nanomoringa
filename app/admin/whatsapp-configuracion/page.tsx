"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, LogOut, QrCode, MessageSquare, RefreshCw, Save, MessageCircle, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { WhatsAppStatus } from "@/components/admin/whatsapp-status"
import { WhatsAppQR } from "@/components/admin/whatsapp-qr"
import { WhatsAppConversations } from "@/components/admin/whatsapp-conversations"
import { BotMessagesEditor, type BotMessage } from "@/components/admin/bot-messages-editor"

export default function WhatsAppConfiguracionPage() {
  const { isAuthenticated, logout } = useAdminAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [botMessages, setBotMessages] = useState<BotMessage[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }
    loadBotStatus()
    loadBotMessages()
    
    // Polling automático cada 5 segundos si no está conectado (para actualizar QR)
    const interval = setInterval(() => {
      if (!isConnected) {
        loadBotStatus()
      }
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isAuthenticated, router, isConnected])

  const loadBotStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/whatsapp/status")
      if (response.ok) {
        const data = await response.json()
        setIsConnected(data.connected)
        setQrCode(data.qrCode)
      } else {
        setIsConnected(false)
        setQrCode(null)
      }
    } catch (error) {
      console.error("Error loading bot status:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el estado del bot",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadBotMessages = async () => {
    try {
      const response = await fetch("/api/whatsapp/bot-messages")
      if (response.ok) {
        const data = await response.json()
        // Convertir de formato BD a formato del componente
        const messages: BotMessage[] = data.map((msg: any, index: number) => ({
          id: `msg-${msg.id || index + 1}`,
          type: msg.type,
          content: msg.content,
          delay: msg.delay || 0,
        }))
        setBotMessages(messages)
      } else {
        // Si no hay mensajes, usar defaults
        const defaultMessages: BotMessage[] = [
          {
            id: "msg-1",
            type: "text",
            content: "¡Hola! 👋 Bienvenido a Nano Moringa 🌿",
            delay: 0,
          },
          {
            id: "msg-2",
            type: "text",
            content: "Soy tu asistente virtual y estoy aquí para ayudarte con información sobre nuestros productos naturales.",
            delay: 1,
          },
          {
            id: "msg-3",
            type: "text",
            content: "¿En qué puedo ayudarte hoy?",
            delay: 1,
          },
        ]
        setBotMessages(defaultMessages)
      }
    } catch (error) {
      console.error("Error loading bot messages:", error)
    }
  }

  const handleSaveMessages = async (messages: BotMessage[]) => {
    try {
      setIsSaving(true)
      const response = await fetch("/api/whatsapp/bot-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages })
      })
      
      if (response.ok) {
        setBotMessages(messages)
        toast({
          title: "Mensajes guardados",
          description: "La cadena de mensajes iniciales se ha actualizado correctamente.",
        })
      } else {
        throw new Error("Error al guardar mensajes")
      }
    } catch (error) {
      console.error("Error saving bot messages:", error)
      toast({
        title: "Error",
        description: "No se pudieron guardar los mensajes",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      // TODO: Hacer POST a /api/whatsapp/logout
      toast({
        title: "Sesión cerrada",
        description: "El bot se ha desconectado. Podés escanear el QR nuevamente.",
      })
      setIsConnected(false)
      setQrCode(null)
      setTimeout(() => {
        loadBotStatus()
      }, 2000)
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      })
    }
  }

  const handleAdminLogout = () => {
    logout()
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })
    router.push("/admin")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/dashboard")}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/brand/nanomoringa-logo.png"
                    alt="Nano Moringa"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">WhatsApp Bot</h1>
                  <p className="text-sm text-gray-600">Configuración y gestión</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAdminLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión Admin
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sección 1: QR Code y Estado */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Estado del Bot
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadBotStatus}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Estado */}
              <WhatsAppStatus isConnected={isConnected} />

              {/* QR Code */}
              {!isConnected && (
                <WhatsAppQR qrCode={qrCode} isLoading={isLoading} />
              )}

              {/* Botón Cerrar Sesión */}
              {isConnected && (
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión WhatsApp
                </Button>
              )}

              {!isConnected && !qrCode && !isLoading && (
                <div className="text-center py-8 text-gray-500">
                  <p>Esperando código QR...</p>
                  <p className="text-sm mt-2">El bot generará un código QR cuando se inicie</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sección 2: Conversaciones */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WhatsAppConversations />
            </CardContent>
          </Card>
        </div>

        {/* Sección 3: Editor de Mensajes del Bot */}
        <Card className="bg-white border-gray-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Cadena de Mensajes Iniciales del Bot
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Edita los mensajes que se enviarán automáticamente cuando una persona inicie una conversación.
              Puedes agregar texto, imágenes y configurar delays entre mensajes.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Vista previa de mensajes */}
            {botMessages.length > 0 && (
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">Vista Previa ({botMessages.length} mensajes):</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {botMessages.map((msg, index) => (
                    <div key={msg.id} className="flex items-start gap-2 text-xs">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      {msg.type === "image" ? (
                        <span className="text-gray-600 flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          Imagen
                        </span>
                      ) : (
                        <span className="text-gray-600 truncate flex-1">
                          {msg.content.substring(0, 50)}{msg.content.length > 50 ? "..." : ""}
                        </span>
                      )}
                      {msg.delay > 0 && (
                        <Badge variant="outline" className="text-xs">
                          +{msg.delay}s
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={() => setIsEditorOpen(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {botMessages.length > 0 ? "Editar Mensajes" : "Crear Cadena de Mensajes"}
            </Button>
          </CardContent>
        </Card>

        {/* Botón para ir al chat completo */}
        <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Chat Completo</h3>
                <p className="text-green-100">
                  Accede a la interfaz completa tipo WhatsApp Web para responder mensajes en tiempo real
                </p>
              </div>
              <Button
                onClick={() => router.push("/admin/whatsapp")}
                className="bg-white text-green-600 hover:bg-green-50 font-semibold"
                size="lg"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Ir al Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Editor Modal */}
      <BotMessagesEditor
        open={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        messages={botMessages}
        onSave={handleSaveMessages}
      />
    </div>
  )
}

