"use client"

import { useState, useEffect, useRef } from "react"
import { X, Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  return (
    <Card className="h-full flex flex-col shadow-2xl border-2 border-accent">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-accent to-primary text-accent-foreground">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Nano Moringa</h3>
            <p className="text-xs opacity-80">Asistente virtual</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-accent-foreground hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {!isFormSubmitted ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <ChatForm onSubmit={handleFormSubmit} />
          </div>
        ) : (
          <>
            <ChatMessages messages={messages} />
            <div className="p-4 border-t bg-muted/30">
              <div className="flex gap-2">
                <Input
                  placeholder="Escribí tu mensaje..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  className="bg-accent hover:bg-accent/90"
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector('input')
                    if (input?.value) {
                      handleSendMessage(input.value)
                      input.value = ''
                    }
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <div ref={messagesEndRef} />
    </Card>
  )
}
