"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, X, Image as ImageIcon, Clock, GripVertical, Trash2, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { UploadButton } from "@/lib/uploadthing"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export interface BotMessage {
  id: string
  type: "text" | "image"
  content: string // Texto o URL de imagen
  delay: number // Delay en segundos antes de enviar este mensaje
}

interface BotMessagesEditorProps {
  open: boolean
  onClose: () => void
  messages: BotMessage[]
  onSave: (messages: BotMessage[]) => void
}

interface SortableMessageItemProps {
  message: BotMessage
  index: number
  onEdit: () => void
  onDelete: () => void
}

function SortableMessageItem({ message, index, onEdit, onDelete }: SortableMessageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: message.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className="p-4 border-2 border-gray-200 hover:border-purple-500 transition-colors">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-grab active:cursor-grabbing mt-1"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={message.type === "image" ? "default" : "secondary"}>
                {message.type === "image" ? (
                  <>
                    <ImageIcon className="h-3 w-3 mr-1" />
                    Imagen
                  </>
                ) : (
                  "Texto"
                )}
              </Badge>
              {message.delay > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {message.delay}s
                </Badge>
              )}
              <span className="text-xs text-gray-500">#{index + 1}</span>
            </div>

            {message.type === "image" ? (
              <div className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
                <Image
                  src={message.content}
                  alt="Imagen del mensaje"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded border border-gray-200">
                {message.content || "(Mensaje vacío)"}
              </p>
            )}
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function BotMessagesEditor({ open, onClose, messages: initialMessages, onSave }: BotMessagesEditorProps) {
  const [messages, setMessages] = useState<BotMessage[]>(initialMessages)
  const [editingMessage, setEditingMessage] = useState<BotMessage | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [messageDelay, setMessageDelay] = useState(0)
  const [messageImage, setMessageImage] = useState<string>("")
  const [messageType, setMessageType] = useState<"text" | "image">("text")
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleAddMessage = () => {
    setMessageText("")
    setMessageDelay(0)
    setMessageImage("")
    setMessageType("text")
    setEditingMessage(null)
    setIsEditModalOpen(true)
  }

  const handleEditMessage = (message: BotMessage) => {
    setEditingMessage(message)
    setMessageText(message.type === "text" ? message.content : "")
    setMessageImage(message.type === "image" ? message.content : "")
    setMessageDelay(message.delay)
    setMessageType(message.type)
    setIsEditModalOpen(true)
  }

  const handleSaveMessage = () => {
    if (messageType === "text" && !messageText.trim()) {
      toast({
        title: "Error",
        description: "El mensaje de texto no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    if (messageType === "image" && !messageImage) {
      toast({
        title: "Error",
        description: "Debes seleccionar una imagen",
        variant: "destructive",
      })
      return
    }

    const newMessage: BotMessage = {
      id: editingMessage?.id || `msg-${Date.now()}`,
      type: messageType,
      content: messageType === "text" ? messageText : messageImage,
      delay: messageDelay,
    }

    if (editingMessage) {
      setMessages(messages.map(m => m.id === editingMessage.id ? newMessage : m))
    } else {
      setMessages([...messages, newMessage])
    }

    setIsEditModalOpen(false)
    setEditingMessage(null)
    setMessageText("")
    setMessageImage("")
    setMessageDelay(0)
  }

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter(m => m.id !== id))
    toast({
      title: "Mensaje eliminado",
      description: "El mensaje ha sido eliminado de la cadena",
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = messages.findIndex(m => m.id === active.id)
      const newIndex = messages.findIndex(m => m.id === over.id)

      setMessages(arrayMove(messages, oldIndex, newIndex))
    }
  }

  const handleSave = () => {
    onSave(messages)
    onClose()
  }

  const handleCancel = () => {
    setMessages(initialMessages)
    onClose()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleCancel}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
            <DialogTitle>Editor de Cadena de Mensajes del Bot</DialogTitle>
            <p className="text-sm text-gray-600 mt-2">
              Construye la secuencia de mensajes que se enviarán automáticamente. Puedes agregar texto, imágenes y configurar delays entre mensajes.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4 px-6 min-h-0 overscroll-contain">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay mensajes en la cadena</p>
                <p className="text-sm mt-2">Agrega tu primer mensaje para comenzar</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={messages.map(m => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {messages.map((message, index) => (
                      <SortableMessageItem
                        key={message.id}
                        message={message}
                        index={index}
                        onEdit={() => handleEditMessage(message)}
                        onDelete={() => handleDeleteMessage(message.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          <DialogFooter className="flex-shrink-0 gap-2 px-6 pb-6 pt-4 border-t bg-gray-50">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleAddMessage} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Mensaje
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar/agregar mensaje */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingMessage ? "Editar Mensaje" : "Agregar Nuevo Mensaje"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4 overflow-y-auto flex-1 min-h-0">
            {/* Tipo de mensaje */}
            <div className="space-y-2">
              <Label>Tipo de Mensaje</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={messageType === "text" ? "default" : "outline"}
                  onClick={() => setMessageType("text")}
                  className="flex-1"
                >
                  Texto
                </Button>
                <Button
                  type="button"
                  variant={messageType === "image" ? "default" : "outline"}
                  onClick={() => setMessageType("image")}
                  className="flex-1"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Imagen
                </Button>
              </div>
            </div>

            {/* Contenido según tipo */}
            {messageType === "text" ? (
              <div className="space-y-2">
                <Label htmlFor="message-text">Mensaje de Texto</Label>
                <Textarea
                  id="message-text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Escribe el mensaje que se enviará..."
                  className="min-h-[120px]"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Imagen</Label>
                {messageImage ? (
                  <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-300">
                    <Image
                      src={messageImage}
                      alt="Imagen del mensaje"
                      fill
                      className="object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setMessageImage("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res.length > 0) {
                          setMessageImage(res[0].url)
                          toast({
                            title: "Imagen subida",
                            description: "La imagen se ha agregado correctamente",
                          })
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast({
                          title: "Error al subir imagen",
                          description: error.message || "Ocurrió un error inesperado",
                          variant: "destructive",
                        })
                      }}
                      className="ut-button:bg-purple-600 ut-button:hover:bg-purple-700"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Delay */}
            <div className="space-y-2">
              <Label htmlFor="message-delay">Delay antes de enviar (segundos)</Label>
              <Input
                id="message-delay"
                type="number"
                min="0"
                max="60"
                value={messageDelay}
                onChange={(e) => setMessageDelay(Number(e.target.value))}
                placeholder="0"
              />
              <p className="text-xs text-gray-500">
                Tiempo de espera antes de enviar este mensaje. 0 = enviar inmediatamente después del anterior.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveMessage}>
              {editingMessage ? "Actualizar" : "Agregar"} Mensaje
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Componente de icono simple para cuando no hay mensajes
function MessageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

