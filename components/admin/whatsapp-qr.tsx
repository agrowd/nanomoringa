"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"

interface WhatsAppQRProps {
  qrCode: string | null
  isLoading: boolean
}

export function WhatsAppQR({ qrCode, isLoading }: WhatsAppQRProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Recargar desde la página padre
    window.location.reload()
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
        <div className="w-64 h-64 flex items-center justify-center bg-gray-50 rounded">
          {qrCode ? (
            <QRCodeSVG
              value={qrCode}
              size={256}
              level="H"
              includeMargin={true}
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

