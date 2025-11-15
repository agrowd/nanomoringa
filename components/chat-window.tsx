"use client"

import { useState, useEffect, useRef } from "react"
import { X, Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatForm } from "./chat-form"
import { ChatMessages } from "./chat-messages"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  media_url?: string
  message_type?: 'text' | 'image' | 'video' | 'audio' | 'document'
}

export function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [userInfo, setUserInfo] = useState<{ name: string; phone: string } | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [conversationId, setConversationId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Cargar datos guardados
  useEffect(() => {
    const savedName = localStorage.getItem("wa-chat-name")
    const savedPhone = localStorage.getItem("wa-chat-phone")
    const savedConvId = localStorage.getItem("wa-chat-conversation-id")
    
    if (savedName && savedPhone) {
      setUserInfo({ name: savedName, phone: savedPhone })
      setIsFormSubmitted(true)
      if (savedConvId) {
        setConversationId(parseInt(savedConvId))
        loadMessages(parseInt(savedConvId))
      }
    } else {
      // Mensaje inicial del bot
      const welcomeMessage: Message = {
        id: '1',
        text: '¡Hola! 👋 Soy tu asistente de Nano Moringa. Para ayudarte mejor, necesito algunos datos básicos.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [])

  // SSE para tiempo real
  useEffect(() => {
    if (!conversationId) return

    const eventSource = new EventSource("/api/whatsapp/events")
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "message_received" || data.type === "message_sent") {
          if (data.data?.conversation_id === conversationId) {
            // Recargar mensajes inmediatamente
            loadMessages(conversationId)
            // Solo reproducir sonido si es un mensaje nuevo (no del usuario actual)
            if (data.type === "message_sent" || (data.type === "message_received" && data.data?.sender_type !== 'user')) {
              playNotificationSound()
            }
          }
        }
      } catch (error) {
        console.error("Error parsing SSE event:", error)
      }
    }
    
    eventSource.onerror = (error) => {
      console.error("SSE error:", error)
      // Reconectar después de 3 segundos
      setTimeout(() => {
        if (conversationId) {
          eventSource.close()
          // El useEffect se ejecutará de nuevo y creará una nueva conexión
        }
      }, 3000)
    }

    return () => {
      eventSource.close()
    }
  }, [conversationId])

  // Polling periódico como respaldo (cada 10 segundos para actualización más frecuente)
  useEffect(() => {
    if (!conversationId) return

    // Recargar mensajes cada 10 segundos
    const interval = setInterval(() => {
      loadMessages(conversationId)
    }, 10000) // 10 segundos

    return () => {
      clearInterval(interval)
    }
  }, [conversationId])

  const loadMessages = async (convId: number) => {
    try {
      const response = await fetch(`/api/whatsapp/messages?conversationId=${convId}`)
      if (response.ok) {
        const data = await response.json()
        const msgs: Message[] = data.map((msg: any) => ({
          id: msg.id.toString(),
          text: msg.message || '',
          sender: msg.sender_type === "user" ? "user" : "bot",
          timestamp: new Date(msg.created_at),
          media_url: msg.media_url || undefined,
          message_type: msg.message_type || 'text'
        }))
        setMessages(msgs)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    }
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFormSubmit = async (name: string, phone: string) => {
    setUserInfo({ name, phone })
    setIsFormSubmitted(true)
    
    // Crear conversación en BD
    try {
      const response = await fetch("/api/whatsapp/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          name,
          sender_type: "user",
          message: "Hola, quiero consultar sobre productos"
        })
      })

      if (response.ok) {
        const data = await response.json()
        const convId = data.conversation_id
        
        setConversationId(convId)
        localStorage.setItem("wa-chat-name", name)
        localStorage.setItem("wa-chat-phone", phone)
        localStorage.setItem("wa-chat-conversation-id", convId.toString())
        
        // Cargar mensajes inmediatamente
        loadMessages(convId)
        
        // Esperar un poco y recargar de nuevo para capturar los mensajes del bot
        // (el bot puede tardar unos segundos en enviar la cadena)
        setTimeout(() => {
          loadMessages(convId)
        }, 3000)
        
        toast({
          title: "Chat iniciado",
          description: "Tu consulta ha sido enviada. El bot te responderá en breve.",
        })
      }
    } catch (error) {
      console.error("Error starting chat:", error)
      toast({
        title: "Error",
        description: "No se pudo iniciar el chat",
        variant: "destructive",
      })
    }
    
    // Focus en el input después de mostrar los mensajes
    setTimeout(() => {
      inputRef.current?.focus()
    }, 500)
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !conversationId) return

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const textToSend = text.trim()
    setInputValue("")

    try {
      const response = await fetch("/api/whatsapp/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: userInfo?.phone,
          name: userInfo?.name,
          sender_type: "user",
          message: textToSend,
          conversation_id: conversationId
        })
      })

      if (response.ok) {
        // Recargar mensajes inmediatamente para obtener el mensaje guardado con ID real
        await loadMessages(conversationId)
        
        // Recargar de nuevo después de 1 segundo para asegurar que se guardó
        setTimeout(() => {
          loadMessages(conversationId)
        }, 1000)
        
        // Recargar después de 3 segundos por si el bot responde
        setTimeout(() => {
          loadMessages(conversationId)
        }, 3000)
      } else {
        throw new Error("Error al enviar mensaje")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages(prev => prev.filter(m => m.id !== userMessage.id))
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  return (
    <div className="h-full flex flex-col bg-background rounded-lg shadow-2xl border-2 border-accent overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-accent to-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Nano Moringa</h3>
            <p className="text-xs opacity-90">Asistente virtual</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-primary-foreground hover:bg-white/20 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!isFormSubmitted ? (
          /* Form Stage */
          <div className="flex-1 flex items-center justify-center p-6 bg-muted/20">
            <ChatForm onSubmit={handleFormSubmit} />
          </div>
        ) : (
          /* Chat Stage */
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-hidden min-h-0">
              <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="border-t bg-muted/30 p-4 flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Escribí tu mensaje..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-background"
                />
                <Button
                  size="sm"
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
