"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone } from "lucide-react"

interface ChatFormProps {
  onSubmit: (name: string, phone: string) => void
}

export function ChatForm({ onSubmit }: ChatFormProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !phone.trim()) {
      return
    }

    setIsSubmitting(true)

    // Simular envío de datos (aquí iría la lógica real)
    try {
      // TODO: Enviar datos a la API para guardar el lead
      console.log('Lead capturado:', { name: name.trim(), phone: phone.trim() })
      
      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSubmit(name.trim(), phone.trim())
    } catch (error) {
      console.error('Error al enviar datos:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-background rounded-xl border border-border p-6 shadow-lg">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <User className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold">Datos básicos</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Necesito algunos datos para poder ayudarte mejor
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Nombre completo
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-2 border-border focus:border-accent"
            autoFocus
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Teléfono
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+54 9 11 1234-5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="border-2 border-border focus:border-accent"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          disabled={isSubmitting || !name.trim() || !phone.trim()}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Enviando...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Continuar</span>
            </div>
          )}
        </Button>
      </form>
      
      <p className="text-xs text-muted-foreground text-center mt-4">
        Tus datos están seguros y solo los usamos para asesorarte mejor
      </p>
    </div>
  )
}
