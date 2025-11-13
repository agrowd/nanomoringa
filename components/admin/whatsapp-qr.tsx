"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface WhatsAppQRProps {
  qrCode: string | null
  isLoading: boolean
}

export function WhatsAppQR({ qrCode, isLoading }: WhatsAppQRProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // TODO: Recargar QR desde API
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        <p className="text-sm text-gray-600">Cargando código QR...</p>
      </div>
    )
  }

  if (!qrCode) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <p className="text-sm text-gray-500 text-center px-4">
            Esperando código QR
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-4">
      <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
        {/* TODO: Usar librería de QR o mostrar como imagen base64 */}
        <div className="w-64 h-64 flex items-center justify-center bg-gray-50 rounded">
          {qrCode ? (
            <Image
              src={`data:image/png;base64,${qrCode}`}
              alt="QR Code"
              width={256}
              height={256}
              className="rounded"
            />
          ) : (
            <div className="text-center text-gray-500">
              <p className="text-sm">Cargando QR...</p>
            </div>
          )}
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-sm font-semibold text-gray-900">
          Escaneá este código con WhatsApp
        </p>
        <p className="text-xs text-gray-600">
          Abrí WhatsApp → Configuración → Dispositivos vinculados → Vincular un dispositivo
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        Actualizar QR
      </Button>
    </div>
  )
}

