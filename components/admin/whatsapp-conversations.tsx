"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Clock } from "lucide-react"
import { WhatsAppChatWindow } from "./whatsapp-chat-window"
import type { WhatsAppConversation } from "@/lib/types"

export function WhatsAppConversations() {
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<WhatsAppConversation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      setIsLoading(true)
      // TODO: Hacer fetch a /api/whatsapp/conversations
      // Por ahora mock data
      const mockConversations: WhatsAppConversation[] = [
        {
          id: "1",
          phone: "5491158082486",
          name: "Juan Pérez",
          lastMessageText: "Hola, consulto por el aceite",
          lastMessageAt: new Date(),
          unreadCount: 2,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          phone: "5491123456789",
          name: "María García",
          lastMessageText: "¿Cuánto cuesta?",
          lastMessageAt: new Date(Date.now() - 3600000),
          unreadCount: 0,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      setConversations(mockConversations)
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredConversations = conversations.filter((conv) => {
    const query = searchQuery.toLowerCase()
    return (
      conv.name?.toLowerCase().includes(query) ||
      conv.phone.includes(query) ||
      conv.lastMessageText?.toLowerCase().includes(query)
    )
  })

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (hours < 1) {
      return `${minutes}m`
    } else if (hours < 24) {
      return `${hours}h`
    } else {
      return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" })
    }
  }

  if (selectedConversation) {
    return (
      <WhatsAppChatWindow
        conversation={selectedConversation}
        onBack={() => setSelectedConversation(null)}
        onMessageSent={() => {
          loadConversations()
        }}
      />
    )
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar conversaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-600">Cargando conversaciones...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-2">
            <MessageSquare className="h-12 w-12 text-gray-300" />
            <p className="text-sm text-gray-600">
              {searchQuery ? "No se encontraron conversaciones" : "No hay conversaciones aún"}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className="w-full p-4 hover:bg-gray-50 rounded-lg transition-colors text-left border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-lg">
                      {conversation.name?.[0]?.toUpperCase() || conversation.phone[0]}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.name || conversation.phone}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(conversation.lastMessageAt)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-green-500 text-white text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessageText || "Sin mensajes"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

