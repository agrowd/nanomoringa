"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { X, Send, Image as ImageIcon, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Message {
  id: string
  text: string
  sender: "user" | "admin" | "bot"
  timestamp: Date
  status: "sending" | "sent" | "delivered" | "read"
  media?: {
    type: "image" | "video"
    url: string
  }
}

export function WhatsAppFloatingChat() {
  const pathname = usePathname()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [userName, setUserName] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [showForm, setShowForm] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // No mostrar en páginas de admin
  if (pathname?.startsWith("/admin")) {
    return null
  }

  // Cargar datos del usuario desde localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("wa-chat-name")
    const savedPhone = localStorage.getItem("wa-chat-phone")
    const savedConvId = localStorage.getItem("wa-chat-conversation-id")
    
    if (savedName && savedPhone) {
      setUserName(savedName)
      setUserPhone(savedPhone)
      setShowForm(false)
      if (savedConvId) {
        setConversationId(parseInt(savedConvId))
        loadMessages(parseInt(savedConvId))
      }
    }
  }, [])

  // SSE para tiempo real
  useEffect(() => {
    if (!conversationId) return

    const eventSource = new EventSource("/api/whatsapp/events")
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "message_received" || data.type === "message_sent") {
        if (data.data?.conversation_id === conversationId) {
          loadMessages(conversationId)
          // Reproducir sonido
          playNotificationSound()
        }
      }
    }

    return () => {
      eventSource.close()
    }
  }, [conversationId])

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadMessages = async (convId: number) => {
    try {
      const response = await fetch(`/api/whatsapp/messages?conversationId=${convId}`)
      if (response.ok) {
        const data = await response.json()
        const msgs: Message[] = data.map((msg: any) => ({
          id: msg.id.toString(),
          text: msg.message,
          sender: msg.sender_type === "user" ? "user" : msg.sender_type === "admin" ? "admin" : "bot",
          timestamp: new Date(msg.created_at),
          status: msg.read ? "read" : msg.whatsapp_status || "sent",
          media: msg.media_url ? {
            type: msg.message_type === "image" ? "image" : "video",
            url: msg.media_url
          } : undefined
        }))
        setMessages(msgs)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const handleStartChat = async () => {
    if (!userName.trim() || !userPhone.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Crear o obtener conversación
      const response = await fetch("/api/whatsapp/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: userPhone,
          name: userName,
          sender_type: "user",
          message: "Hola, quiero consultar sobre productos"
        })
      })

      if (response.ok) {
        const data = await response.json()
        const convId = data.conversation_id
        
        setConversationId(convId)
        setShowForm(false)
        localStorage.setItem("wa-chat-name", userName)
        localStorage.setItem("wa-chat-phone", userPhone)
        localStorage.setItem("wa-chat-conversation-id", convId.toString())
        
        // Cargar mensajes
        loadMessages(convId)
        
        toast({
          title: "Chat iniciado",
          description: "Tu consulta ha sido enviada",
        })
      } else {
        throw new Error("Error al iniciar chat")
      }
    } catch (error) {
      console.error("Error starting chat:", error)
      toast({
        title: "Error",
        description: "No se pudo iniciar el chat",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !conversationId) return

    const newMessage: Message = {
      id: `temp-${Date.now()}`,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
      status: "sending"
    }

    setMessages([...messages, newMessage])
    const textToSend = messageText
    setMessageText("")

    try {
      const response = await fetch("/api/whatsapp/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: userPhone,
          name: userName,
          sender_type: "user",
          message: textToSend,
          conversation_id: conversationId
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => prev.map(m => 
          m.id === newMessage.id 
            ? { ...m, id: data.id?.toString() || m.id, status: "sent" }
            : m
        ))
        loadMessages(conversationId)
      } else {
        throw new Error("Error al enviar mensaje")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages(prev => prev.filter(m => m.id !== newMessage.id))
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!conversationId) return

    // Convertir a base64
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target?.result as string
      
      try {
        const response = await fetch("/api/whatsapp/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: userPhone,
            name: userName,
            sender_type: "user",
            message: "",
            message_type: "image",
            media_url: base64,
            conversation_id: conversationId
          })
        })

        if (response.ok) {
          loadMessages(conversationId)
        }
      } catch (error) {
        console.error("Error sending image:", error)
        toast({
          title: "Error",
          description: "No se pudo enviar la imagen",
          variant: "destructive",
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const playNotificationSound = () => {
    const beep = new AudioContext()
    const oscillator = beep.createOscillator()
    const gainNode = beep.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(beep.destination)
    oscillator.frequency.value = 800
    oscillator.type = "sine"
    gainNode.gain.setValueAtTime(0.3, beep.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, beep.currentTime + 0.5)
    oscillator.start(beep.currentTime)
    oscillator.stop(beep.currentTime + 0.5)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-[#25D366] shadow-2xl hover:bg-[#20BA5A] transition-all duration-300 hover:scale-110"
        aria-label="Abrir chat"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </Button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
      isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
    }`}>
      {/* Header */}
      <div className="bg-[#075E54] text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">Nano Moringa</h3>
            <p className="text-xs text-white/80">En línea</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/10 h-8 w-8 p-0"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/10 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#ECE5DD] space-y-2">
            {showForm ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-700">Completa tus datos para comenzar:</p>
                <Input
                  placeholder="Tu nombre"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-white"
                />
                <Input
                  placeholder="Tu teléfono (ej: 5491158082486)"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="bg-white"
                />
                <Button
                  onClick={handleStartChat}
                  disabled={isLoading}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A]"
                >
                  {isLoading ? "Iniciando..." : "Comenzar Chat"}
                </Button>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        msg.sender === "user"
                          ? "bg-[#DCF8C6] text-gray-900"
                          : "bg-white text-gray-900"
                      }`}
                    >
                      {msg.media && (
                        <div className="mb-2 rounded overflow-hidden">
                          <Image
                            src={msg.media.url}
                            alt="Imagen"
                            width={200}
                            height={200}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          {!showForm && (
            <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-600"
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Escribe un mensaje..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

