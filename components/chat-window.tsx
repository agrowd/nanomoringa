"use client"

import { useState, useEffect, useRef } from "react"
import { X, Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatForm } from "./chat-form"
import { ChatMessages } from "./chat-messages"

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [userInfo, setUserInfo] = useState<{ name: string; phone: string } | null>(null)
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Mensaje inicial del bot
    if (!isFormSubmitted) {
      const welcomeMessage: Message = {
        id: '1',
        text: '¡Hola! 👋 Soy tu asistente de Nano Moringa. Para ayudarte mejor, necesito algunos datos básicos.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [isFormSubmitted])

  const handleFormSubmit = (name: string, phone: string) => {
    setUserInfo({ name, phone })
    setIsFormSubmitted(true)
    
    // Mensajes automáticos después del formulario
    const botMessages = [
      {
        id: Date.now().toString(),
        text: `¡Perfecto ${name}! 🎉 Ahora puedo ayudarte mejor.`,
        sender: 'bot' as const,
        timestamp: new Date()
      },
      {
        id: (Date.now() + 1).toString(),
        text: '¿En qué te puedo ayudar hoy? Puedo contarte sobre nuestros productos naturales, ayudarte a elegir el ideal para vos, o resolver cualquier duda que tengas.',
        sender: 'bot' as const,
        timestamp: new Date()
      }
    ]

    setMessages(prev => [...prev, ...botMessages])
    
    // Focus en el input después de mostrar los mensajes
    setTimeout(() => {
      inputRef.current?.focus()
    }, 500)
  }

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")

    // Respuesta automática del bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: '¡Gracias por tu mensaje! Te voy a conectar con nuestro equipo de asesores especializados. En unos minutos te van a contactar por WhatsApp para darte una atención personalizada. 💚',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    }, 1500)
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
