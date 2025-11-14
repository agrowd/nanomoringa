"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, User, Bot, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { WhatsAppConversation, WhatsAppMessage } from "@/lib/types"

interface WhatsAppChatWindowProps {
  conversation: WhatsAppConversation
  onBack: () => void
  onMessageSent: () => void
}

export function WhatsAppChatWindow({
  conversation,
  onBack,
  onMessageSent,
}: WhatsAppChatWindowProps) {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadMessages()
  }, [conversation.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    try {
      setIsLoading(true)
      // TODO: Hacer fetch a /api/whatsapp/conversations/[phone]/messages
      // Por ahora mock data
      const mockMessages: WhatsAppMessage[] = [
        {
          id: "1",
          conversationId: conversation.id,
          messageText: "Hola, consulto por el aceite",
          sender: "user",
          fromWhatsApp: true,
          timestamp: new Date(Date.now() - 3600000),
          messageType: "text",
        },
        {
          id: "2",
          conversationId: conversation.id,
          messageText: "Hola buenas. Ahí te paso información 👇",
          sender: "admin",
          fromWhatsApp: false,
          timestamp: new Date(Date.now() - 3500000),
          messageType: "text",
        },
        {
          id: "3",
          conversationId: conversation.id,
          messageText: "ACEITE MEDICINAL NATURAL 🌿\n🌿BENEFICIOS DEL ACEITE MICRONIZADO 🌿...",
          sender: "admin",
          fromWhatsApp: false,
          timestamp: new Date(Date.now() - 3400000),
          messageType: "text",
        },
        {
          id: "4",
          conversationId: conversation.id,
          messageText: "Perfecto, gracias",
          sender: "user",
          fromWhatsApp: true,
          timestamp: new Date(Date.now() - 1800000),
          messageType: "text",
        },
      ]
      setMessages(mockMessages)
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return

    const messageText = inputValue.trim()
    setInputValue("")

    // Optimistic update
    const tempMessage: WhatsAppMessage = {
      id: `temp-${Date.now()}`,
      conversationId: conversation.id,
      messageText,
      sender: "admin",
      fromWhatsApp: false,
      timestamp: new Date(),
      messageType: "text",
    }
    setMessages((prev) => [...prev, tempMessage])

    try {
      setIsSending(true)
      // TODO: Hacer POST a /api/whatsapp/conversations/[phone]/send
      // await fetch(`/api/whatsapp/conversations/${conversation.phone}/send`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ message: messageText }),
      // })

      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remover mensaje temporal y agregar el real
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempMessage.id)
        return [
          ...filtered,
          {
            ...tempMessage,
            id: Date.now().toString(),
          },
        ]
      })

      onMessageSent()
    } catch (error) {
      console.error("Error sending message:", error)
      // Remover mensaje temporal en caso de error
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id))
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-green-500 text-white">
            {conversation.name?.[0]?.toUpperCase() || conversation.phone[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {conversation.name || conversation.phone}
          </h3>
          <p className="text-xs text-gray-600 truncate">{conversation.phone}</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-600">Cargando mensajes...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-2">
            <MessageSquare className="h-12 w-12 text-gray-300" />
            <p className="text-sm text-gray-600">No hay mensajes aún</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isAdmin = message.sender === "admin"
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 items-start ${
                    isAdmin ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback
                      className={
                        isAdmin
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-700"
                      }
                    >
                      {isAdmin ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      isAdmin
                        ? "bg-green-500 text-white"
                        : "bg-white border border-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.messageText}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        isAdmin
                          ? "text-green-50"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Escribí un mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

