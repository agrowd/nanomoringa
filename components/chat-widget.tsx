"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatWindow } from "./chat-window"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setHasNewMessage(false)
    }
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[600px] max-h-[80vh] animate-in slide-in-from-bottom-5 duration-300">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-2xl hover:shadow-accent/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Abrir chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            {hasNewMessage && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white" />
            )}
          </>
        )}
      </button>
    </>
  )
}
