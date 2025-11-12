"use client"

import { Bot, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatMessagesProps {
  messages: Message[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.sender === 'bot' && (
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-accent text-accent-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
          
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              message.sender === 'user'
                ? 'bg-accent text-accent-foreground ml-auto'
                : 'bg-muted text-foreground'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            <p className={`text-xs mt-1 ${
              message.sender === 'user' 
                ? 'text-accent-foreground/70' 
                : 'text-muted-foreground'
            }`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
          
          {message.sender === 'user' && (
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
  )
}
