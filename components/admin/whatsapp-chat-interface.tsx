"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Send, Paperclip, Image as ImageIcon, Video, FileText, MoreVertical, Reply, Check, CheckCheck, Phone, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { VideoModal } from "@/components/video-modal"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  status: "sending" | "sent" | "delivered" | "read"
  replyTo?: string
  media?: {
    type: "image" | "video" | "audio" | "file"
    url: string
    name?: string
  }
}

interface Conversation {
  id: string
  name: string
  phone: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  avatar?: string
  messages: Message[]
}

export function WhatsAppChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [messageText, setMessageText] = useState("")
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Mock data - En producción esto vendrá de la API
  useEffect(() => {
    // Simular carga de conversaciones
    const mockConversations: Conversation[] = [
      {
        id: "1",
        name: "Juan Pérez",
        phone: "+5491158082486",
        lastMessage: "Hola, quiero consultar sobre productos",
        lastMessageTime: new Date(),
        unreadCount: 2,
        messages: [
          {
            id: "m1",
            text: "Hola, quiero consultar sobre productos",
            sender: "user",
            timestamp: new Date(Date.now() - 3600000),
            status: "read"
          },
          {
            id: "m2",
            text: "¡Hola! 👋 Te ayudo con gusto. ¿Qué producto te interesa?",
            sender: "bot",
            timestamp: new Date(Date.now() - 3500000),
            status: "read"
          },
          {
            id: "m3",
            text: "Me interesa el aceite",
            sender: "user",
            timestamp: new Date(Date.now() - 3400000),
            status: "read"
          }
        ]
      }
    ]
    setConversations(mockConversations)
    if (mockConversations.length > 0) {
      setSelectedConversation(mockConversations[0])
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedConversation?.messages])

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.phone.includes(searchQuery)
  )

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return

    const newMessage: Message = {
      id: `m${Date.now()}`,
      text: messageText,
      sender: "bot",
      timestamp: new Date(),
      status: "sending",
      replyTo: replyingTo?.id
    }

    // Actualizar conversación
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
      lastMessage: messageText,
      lastMessageTime: new Date()
    }

    setSelectedConversation(updatedConversation)
    setConversations(conversations.map(c =>
      c.id === selectedConversation.id ? updatedConversation : c
    ))

    setMessageText("")
    setReplyingTo(null)

    // Simular envío
    setTimeout(() => {
      const sentMessage: Message = { ...newMessage, status: "sent" }
      const updated = {
        ...updatedConversation,
        messages: updatedConversation.messages.map(m =>
          m.id === newMessage.id ? sentMessage : m
        )
      }
      setSelectedConversation(updated)
      setConversations(conversations.map(c =>
        c.id === selectedConversation.id ? updated : c
      ))

      // Simular entregado
      setTimeout(() => {
        const deliveredMessage: Message = { ...sentMessage, status: "delivered" }
        const updated2 = {
          ...updated,
          messages: updated.messages.map(m =>
            m.id === newMessage.id ? deliveredMessage : m
          )
        }
        setSelectedConversation(updated2)
        setConversations(conversations.map(c =>
          c.id === selectedConversation.id ? updated2 : c
        ))
      }, 1000)
    }, 500)
  }

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sending":
        return <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      case "sent":
        return <Check className="w-4 h-4 text-gray-400" />
      case "delivered":
        return <CheckCheck className="w-4 h-4 text-gray-400" />
      case "read":
        return <CheckCheck className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  }

  const getRepliedMessage = (messageId?: string) => {
    if (!messageId || !selectedConversation) return null
    return selectedConversation.messages.find(m => m.id === messageId)
  }

  return (
    <>
      {/* Sidebar - Lista de conversaciones */}
      <div className="w-1/3 border-r border-gray-300 bg-white flex flex-col">
        {/* Búsqueda */}
        <div className="p-3 bg-[#F0F2F5] border-b border-gray-300">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar o iniciar nueva conversación"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300"
            />
          </div>
        </div>

        {/* Lista de conversaciones */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left ${
                selectedConversation?.id === conv.id ? "bg-[#E9EDEF]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#DFE5E7] flex items-center justify-center flex-shrink-0">
                  {conv.avatar ? (
                    <Image
                      src={conv.avatar}
                      alt={conv.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatTime(conv.lastMessageTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-[#25D366] text-white text-xs font-semibold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat principal */}
      <div className="flex-1 flex flex-col bg-[#EFE7DD]">
        {selectedConversation ? (
          <>
            {/* Header del chat */}
            <div className="bg-[#F0F2F5] px-4 py-3 flex items-center justify-between border-b border-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#DFE5E7] flex items-center justify-center">
                  {selectedConversation.avatar ? (
                    <Image
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedConversation.name}</h2>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {selectedConversation.phone}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {selectedConversation.messages.map((message) => {
                const repliedMessage = getRepliedMessage(message.replyTo)
                return (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "bot" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 cursor-pointer hover:opacity-90 transition-opacity ${
                        message.sender === "bot"
                          ? "bg-[#DCF8C6] rounded-tr-none"
                          : "bg-white rounded-tl-none"
                      }`}
                      onClick={() => setReplyingTo(message)}
                    >
                      {repliedMessage && (
                        <div className="border-l-4 border-gray-400 pl-2 mb-2 text-xs text-gray-600 bg-gray-100 rounded py-1">
                          <p className="font-semibold">
                            {repliedMessage.sender === "bot" ? "Tú" : selectedConversation.name}
                          </p>
                          <p className="truncate">{repliedMessage.text}</p>
                        </div>
                      )}
                      {message.media && (
                        <div className="mb-2">
                          {message.media.type === "image" && (
                            <Image
                              src={message.media.url}
                              alt={message.media.name || "Imagen"}
                              width={200}
                              height={200}
                              className="rounded-lg object-cover"
                            />
                          )}
                          {message.media.type === "video" && (
                            <video
                              src={message.media.url}
                              controls
                              className="rounded-lg max-w-full max-h-64"
                              onClick={() => setSelectedVideo(message.media!.url)}
                            />
                          )}
                        </div>
                      )}
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{message.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.sender === "bot" && (
                          <span className="ml-1">{getStatusIcon(message.status)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensaje */}
            <div className="bg-[#F0F2F5] px-4 py-3 border-t border-gray-300">
              {replyingTo && (
                <div className="mb-2 flex items-center justify-between bg-white rounded-lg p-2 border-l-4 border-[#25D366]">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-600">
                      Respondiendo a {replyingTo.sender === "bot" ? "tú" : selectedConversation.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{replyingTo.text}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setReplyingTo(null)}
                  >
                    <span className="text-xs">×</span>
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-600">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Escribe un mensaje"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="flex-1 bg-white border-gray-300"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-[#DFE5E7] flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500">Selecciona una conversación para comenzar</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal de video */}
      {selectedVideo && (
        <VideoModal
          open={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoSrc={selectedVideo}
        />
      )}
    </>
  )
}

