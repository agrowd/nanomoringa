"use client"

import { Bot, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RefObject } from "react"
import Image from "next/image"

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  media_url?: string
  message_type?: 'text' | 'image' | 'video' | 'audio' | 'document'
}

interface ChatMessagesProps {
  messages: Message[]
  messagesEndRef: RefObject<HTMLDivElement | null>
}

export function ChatMessages({ messages, messagesEndRef }: ChatMessagesProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 bg-muted/10 scroll-smooth">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 items-start ${
            message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* Avatar */}
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className={
              message.sender === 'bot'
                ? 'bg-accent text-accent-foreground'
                : 'bg-primary text-primary-foreground'
            }>
              {message.sender === 'bot' ? (
                <Bot className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>
          
          {/* Message Bubble */}
          <div
            className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              message.sender === 'user'
                ? 'bg-accent text-accent-foreground'
                : 'bg-background border border-border text-foreground'
            }`}
          >
            {/* Imagen si existe */}
            {message.media_url && message.message_type === 'image' && (
              <div className="mb-2 rounded-lg overflow-hidden max-w-full">
                <div className="relative w-full max-w-[250px] sm:max-w-[300px] aspect-square">
                  <Image
                    src={message.media_url}
                    alt="Imagen del mensaje"
                    fill
                    className="object-contain rounded-lg"
                    unoptimized
                  />
                </div>
              </div>
            )}
            
            {/* Texto del mensaje (solo si hay texto) */}
            {message.text && (
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
            )}
            
            {/* Timestamp */}
            <p className={`text-xs mt-2 ${
              message.sender === 'user' 
                ? 'text-accent-foreground/70' 
                : 'text-muted-foreground'
            }`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
