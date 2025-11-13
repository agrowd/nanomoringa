"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"

interface WhatsAppStatusProps {
  isConnected: boolean
}

export function WhatsAppStatus({ isConnected }: WhatsAppStatusProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        {isConnected ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <div>
          <p className="font-semibold text-gray-900">Estado del Bot</p>
          <p className="text-sm text-gray-600">
            {isConnected ? "Conectado a WhatsApp" : "Desconectado"}
          </p>
        </div>
      </div>
      <Badge
        variant={isConnected ? "default" : "destructive"}
        className={
          isConnected
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }
      >
        {isConnected ? "Conectado" : "Desconectado"}
      </Badge>
    </div>
  )
}

