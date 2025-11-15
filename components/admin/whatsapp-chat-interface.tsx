"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Search, Send, Paperclip, Image as ImageIcon, Video, FileText, MoreVertical, Reply, Check, CheckCheck, Phone, User, Tag, X, Plus, Trash2 } from "lucide-react"
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
  tags?: string[]
}

export function WhatsAppChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [messageText, setMessageText] = useState("")
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [tagsInput, setTagsInput] = useState("")
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Cargar conversaciones desde la API
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await fetch("/api/whatsapp/conversations")
        if (response.ok) {
          const data = await response.json()
          // Filtrar conversaciones reales (con ID numérico válido)
          const convs: Conversation[] = data
            .filter((conv: any) => conv.id && typeof conv.id === 'number')
            .map((conv: any) => ({
              id: conv.id.toString(),
              name: conv.name,
              phone: conv.phone,
              lastMessage: conv.lastMessage || "",
              lastMessageTime: new Date(conv.lastMessageTime || conv.updated_at),
              unreadCount: conv.unreadCount || 0,
              tags: conv.tags || [],
              messages: [] // Se cargarán cuando se seleccione
            }))
          
          // Extraer todas las etiquetas únicas para el selector
          const allTags = new Set<string>()
          convs.forEach(conv => {
            if (conv.tags) {
              conv.tags.forEach(tag => allTags.add(tag))
            }
          })
          setAvailableTags(Array.from(allTags))
          setConversations(convs)
          if (convs.length > 0 && !selectedConversation) {
            setSelectedConversation(convs[0])
          }
        }
      } catch (error) {
        console.error("Error loading conversations:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las conversaciones",
          variant: "destructive",
        })
      }
    }
    
    loadConversations()
    
    // Polling cada 20 segundos para recargar conversaciones (nuevos leads)
    const conversationsInterval = setInterval(() => {
      loadConversations()
    }, 20000) // 20 segundos
    
    // SSE para tiempo real
    const eventSource = new EventSource("/api/whatsapp/events")
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "message_received" || data.type === "message_sent") {
          loadConversations()
          // Reproducir sonido si hay mensaje nuevo (solo si es recibido del usuario)
          if (data.type === "message_received" && data.data?.sender_type === 'user') {
            playNotificationSound()
          }
        }
        if (data.type === "message_status_update") {
          // Actualizar estado del mensaje en la UI
          if (selectedConversation) {
            setSelectedConversation(prev => {
              if (!prev) return prev
              return {
                ...prev,
                messages: prev.messages.map(m => 
                  m.id === data.data.message_id?.toString() 
                    ? { ...m, status: data.data.status === 'read' ? 'read' : data.data.status === 'delivered' ? 'delivered' : 'sent' }
                    : m
                )
              }
            })
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
        eventSource.close()
      }, 3000)
    }
    
    return () => {
      eventSource.close()
      clearInterval(conversationsInterval)
    }
  }, [toast, selectedConversation])
  
  // Cargar mensajes cuando se selecciona una conversación
  useEffect(() => {
    if (!selectedConversation) return
    
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/whatsapp/messages?conversationId=${selectedConversation.id}`)
        if (response.ok) {
          const data = await response.json()
          const msgs: Message[] = data.map((msg: any) => ({
            id: msg.id.toString(),
            text: msg.message,
            sender: msg.sender_type === "user" ? "user" : "bot",
            timestamp: new Date(msg.created_at),
            status: msg.read ? "read" : msg.whatsapp_status || "sent",
            media: msg.media_url ? {
              type: msg.message_type === "image" ? "image" : "file",
              url: msg.media_url
            } : undefined
          }))
          
          setSelectedConversation({
            ...selectedConversation,
            messages: msgs
          })
          
          // Marcar como leído
          const unreadMessages = msgs.filter(m => m.sender === "user" && m.status !== "read")
          if (unreadMessages.length > 0) {
            unreadMessages.forEach(msg => {
              fetch(`/api/whatsapp/messages/${msg.id}/read`, { method: "POST" }).catch(console.error)
            })
          }
        }
      } catch (error) {
        console.error("Error loading messages:", error)
      }
    }
    
    loadMessages()
    
    // Polling para nuevos mensajes cada 20 segundos
    const interval = setInterval(loadMessages, 20000) // 20 segundos
    return () => clearInterval(interval)
  }, [selectedConversation?.id, toast])
  
  // Función para reproducir sonido
  const playNotificationSound = () => {
    const audio = new Audio("/sounds/whatsapp-notification.mp3")
    audio.volume = 0.5
    audio.play().catch(() => {
      // Si no hay archivo, usar beep del navegador
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
    })
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedConversation?.messages])

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations
    const query = searchQuery.toLowerCase().trim()
    return conversations.filter(conv => {
      const nameMatch = conv.name?.toLowerCase().includes(query) || false
      const phoneMatch = conv.phone?.includes(query) || false
      const messageMatch = conv.lastMessage?.toLowerCase().includes(query) || false
      return nameMatch || phoneMatch || messageMatch
    })
  }, [conversations, searchQuery])

  const handleSendMessage = async (imageFile?: File) => {
    const hasContent = messageText.trim() || imageFile
    if (!hasContent || !selectedConversation) return

    let mediaUrl: string | undefined
    if (imageFile) {
      // Convertir a base64
      const reader = new FileReader()
      mediaUrl = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(imageFile)
      })
    }

    const newMessage: Message = {
      id: `temp-${Date.now()}`,
      text: messageText || (imageFile ? "📷 Imagen" : ""),
      sender: "bot",
      timestamp: new Date(),
      status: "sending",
      replyTo: replyingTo?.id,
      media: mediaUrl ? {
        type: "image",
        url: mediaUrl
      } : undefined
    }

    // Actualizar UI inmediatamente
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
      lastMessage: messageText || "📷 Imagen",
      lastMessageTime: new Date()
    }

    setSelectedConversation(updatedConversation)
    setConversations(conversations.map(c =>
      c.id === selectedConversation.id ? updatedConversation : c
    ))

    const messageToSend = messageText
    const messageToReply = replyingTo
    setMessageText("")
    setReplyingTo(null)

    // Enviar a través de la API
    try {
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: selectedConversation.phone,
          message: messageToSend,
          message_type: imageFile ? "image" : "text",
          media_url: mediaUrl,
          conversation_id: parseInt(selectedConversation.id),
          reply_to_message_id: messageToReply?.id ? parseInt(messageToReply.id) : undefined
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        // Actualizar mensaje con ID real
        const sentMessage: Message = {
          ...newMessage,
          id: result.message?.id?.toString() || newMessage.id,
          status: "sent"
        }
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
      } else {
        throw new Error("Error al enviar mensaje")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      })
      // Revertir mensaje
      const reverted = {
        ...selectedConversation,
        messages: selectedConversation.messages.filter(m => m.id !== newMessage.id)
      }
      setSelectedConversation(reverted)
      setConversations(conversations.map(c =>
        c.id === selectedConversation.id ? reverted : c
      ))
    }
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
  
  const handleAddTag = async (tag: string) => {
    if (!selectedConversation) return
    
    const currentTags = selectedConversation.tags || []
    if (currentTags.includes(tag)) return
    
    const newTags = [...currentTags, tag]
    
    try {
      const response = await fetch(`/api/whatsapp/conversations/${selectedConversation.id}/tags`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: newTags })
      })
      
      if (response.ok) {
        setSelectedConversation({ ...selectedConversation, tags: newTags })
        setConversations(convs => convs.map(c => 
          c.id === selectedConversation.id ? { ...c, tags: newTags } : c
        ))
        
        // Agregar a etiquetas disponibles si no existe
        if (!availableTags.includes(tag)) {
          setAvailableTags([...availableTags, tag])
        }
      } else {
        throw new Error('Error al actualizar etiquetas')
      }
    } catch (error) {
      console.error('Error adding tag:', error)
      toast({
        title: "Error",
        description: "No se pudo agregar la etiqueta",
        variant: "destructive",
      })
    }
  }
  
  const updateConversationTags = async (conversationId: number, tags: string[]) => {
    try {
      const response = await fetch(`/api/whatsapp/conversations/${conversationId}/tags`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags })
      })
      
      if (!response.ok) {
        throw new Error('Error al actualizar etiquetas')
      }
    } catch (error) {
      console.error('Error updating tags:', error)
      throw error
    }
  }
  
  const handleDeleteConversation = async () => {
    if (!conversationToDelete) return
    
    try {
      const response = await fetch(`/api/whatsapp/conversations/${conversationToDelete.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Eliminar de la lista
        setConversations(convs => convs.filter(c => c.id !== conversationToDelete.id))
        
        // Si era la conversación seleccionada, seleccionar otra o ninguna
        if (selectedConversation?.id === conversationToDelete.id) {
          const remaining = conversations.filter(c => c.id !== conversationToDelete.id)
          setSelectedConversation(remaining.length > 0 ? remaining[0] : null)
        }
        
        toast({
          title: "Chat eliminado",
          description: "La conversación ha sido eliminada correctamente.",
        })
      } else {
        throw new Error('Error al eliminar la conversación')
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la conversación",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
      setConversationToDelete(null)
    }
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
            <div
              key={conv.id}
              className={`w-full border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                selectedConversation?.id === conv.id ? "bg-[#E9EDEF]" : ""
              }`}
            >
              <button
                onClick={() => setSelectedConversation(conv)}
                className="w-full p-3 text-left flex items-center gap-3"
              >
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
              </button>
              <div className="px-3 pb-2 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    setConversationToDelete(conv)
                    setShowDeleteDialog(true)
                  }}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
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
              <div className="flex items-center gap-2">
                {/* Etiquetas */}
                {selectedConversation.tags && selectedConversation.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap max-w-[200px]">
                    {selectedConversation.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {/* Popover para agregar/editar etiquetas */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Tag className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Etiquetas</h4>
                      {/* Etiquetas actuales */}
                      {selectedConversation.tags && selectedConversation.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedConversation.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <button
                                onClick={async () => {
                                  const newTags = selectedConversation.tags!.filter(t => t !== tag)
                                  await updateConversationTags(parseInt(selectedConversation.id), newTags)
                                  setSelectedConversation({ ...selectedConversation, tags: newTags })
                                  setConversations(convs => convs.map(c => 
                                    c.id === selectedConversation.id ? { ...c, tags: newTags } : c
                                  ))
                                }}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      {/* Agregar nueva etiqueta */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nueva etiqueta..."
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && tagsInput.trim()) {
                              handleAddTag(tagsInput.trim())
                              setTagsInput("")
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            if (tagsInput.trim()) {
                              handleAddTag(tagsInput.trim())
                              setTagsInput("")
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {/* Etiquetas disponibles */}
                      {availableTags.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Etiquetas disponibles:</p>
                          <div className="flex flex-wrap gap-2">
                            {availableTags
                              .filter(tag => !selectedConversation.tags?.includes(tag))
                              .map((tag, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleAddTag(tag)}
                                >
                                  {tag}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={() => {
                        setConversationToDelete(selectedConversation)
                        setShowDeleteDialog(true)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleSendMessage(file)
                    }
                  }}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-600"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-5 w-5" />
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
                  onClick={() => handleSendMessage()}
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

      {/* Diálogo de confirmación para eliminar chat */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar chat?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la conversación con{" "}
              <strong>{conversationToDelete?.name}</strong> y todos sus mensajes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false)
              setConversationToDelete(null)
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConversation}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

