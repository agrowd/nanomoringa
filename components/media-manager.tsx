"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Image as ImageIcon, Video, Upload, ArrowUp, ArrowDown, GripVertical } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { UploadButton } from "@/lib/uploadthing"
import { ImageCropModal } from "@/components/image-crop-modal"
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

interface MediaManagerProps {
  images: string[]
  videos: string[]
  onImagesChange: (images: string[]) => void
  onVideosChange: (videos: string[]) => void
}

interface SortableImageItemProps {
  image: string
  index: number
  total: number
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

interface SortableVideoItemProps {
  video: string
  index: number
  total: number
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

function SortableImageItem({ image, index, total, onRemove, onMoveUp, onMoveDown }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `image-${index}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent group-hover:border-purple-500 transition-colors">
        <Image
          src={image}
          alt={`Imagen ${index + 1}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute top-2 left-2 flex gap-1">
        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-3 w-3" />
        </Button>
      </div>
      <div className="absolute top-2 right-2 flex gap-1">
        {index > 0 && (
          <Button
            variant="secondary"
            size="icon"
            className="h-6 w-6 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onMoveUp}
            title="Mover arriba"
          >
            <ArrowUp className="h-3 w-3" />
          </Button>
        )}
        {index < total - 1 && (
          <Button
            variant="secondary"
            size="icon"
            className="h-6 w-6 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onMoveDown}
            title="Mover abajo"
          >
            <ArrowDown className="h-3 w-3" />
          </Button>
        )}
        <Button
          variant="destructive"
          size="icon"
          className="h-6 w-6 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
          title="Eliminar"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <Badge className="absolute bottom-2 left-2 text-xs">
        {index === 0 ? "Principal" : `#${index + 1}`}
      </Badge>
    </div>
  )
}

function SortableVideoItem({ video, index, total, onRemove, onMoveUp, onMoveDown }: SortableVideoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `video-${index}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent group-hover:border-purple-500 transition-colors">
        <video
          src={video}
          controls
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute top-2 left-2 flex gap-1">
        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-3 w-3" />
        </Button>
      </div>
      <div className="absolute top-2 right-2 flex gap-1">
        {index > 0 && (
          <Button
            variant="secondary"
            size="icon"
            className="h-6 w-6 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onMoveUp}
            title="Mover arriba"
          >
            <ArrowUp className="h-3 w-3" />
          </Button>
        )}
        {index < total - 1 && (
          <Button
            variant="secondary"
            size="icon"
            className="h-6 w-6 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onMoveDown}
            title="Mover abajo"
          >
            <ArrowDown className="h-3 w-3" />
          </Button>
        )}
        <Button
          variant="destructive"
          size="icon"
          className="h-6 w-6 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
          title="Eliminar"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <Badge className="absolute bottom-2 left-2 text-xs">
        Video #{index + 1}
      </Badge>
    </div>
  )
}

export function MediaManager({ images, videos, onImagesChange, onVideosChange }: MediaManagerProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
    toast({
      title: "Imagen eliminada",
      description: "La imagen ha sido eliminada correctamente.",
    })
  }

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index)
    onVideosChange(newVideos)
    toast({
      title: "Video eliminado",
      description: "El video ha sido eliminado correctamente.",
    })
  }

  const moveImageUp = (index: number) => {
    if (index === 0) return
    const newImages = arrayMove(images, index, index - 1)
    onImagesChange(newImages)
    toast({
      title: "Orden actualizado",
      description: "La imagen se movió correctamente.",
    })
  }

  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return
    const newImages = arrayMove(images, index, index + 1)
    onImagesChange(newImages)
    toast({
      title: "Orden actualizado",
      description: "La imagen se movió correctamente.",
    })
  }

  const moveVideoUp = (index: number) => {
    if (index === 0) return
    const newVideos = arrayMove(videos, index, index - 1)
    onVideosChange(newVideos)
    toast({
      title: "Orden actualizado",
      description: "El video se movió correctamente.",
    })
  }

  const moveVideoDown = (index: number) => {
    if (index === videos.length - 1) return
    const newVideos = arrayMove(videos, index, index + 1)
    onVideosChange(newVideos)
    toast({
      title: "Orden actualizado",
      description: "El video se movió correctamente.",
    })
  }

  const handleImagesDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((_, i) => `image-${i}` === active.id)
      const newIndex = images.findIndex((_, i) => `image-${i}` === over.id)

      const newImages = arrayMove(images, oldIndex, newIndex)
      onImagesChange(newImages)
      toast({
        title: "Orden actualizado",
        description: "Las imágenes se reordenaron correctamente.",
      })
    }
  }

  const handleVideosDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = videos.findIndex((_, i) => `video-${i}` === active.id)
      const newIndex = videos.findIndex((_, i) => `video-${i}` === over.id)

      const newVideos = arrayMove(videos, oldIndex, newIndex)
      onVideosChange(newVideos)
      toast({
        title: "Orden actualizado",
        description: "Los videos se reordenaron correctamente.",
      })
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Solo se permiten archivos de imagen",
        variant: "destructive",
      })
      return
    }

    // Validar tamaño (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen debe ser menor a 10MB",
        variant: "destructive",
      })
      return
    }

    // Crear preview y abrir modal de crop
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageSrc = e.target?.result as string
      setImageToCrop(imageSrc)
      setCropModalOpen(true)
    }
    reader.readAsDataURL(file)

    // Limpiar el input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCropComplete = async (croppedImageUrl: string) => {
    setUploading(true)
    try {
      // Convertir la URL del blob a un File
      const response = await fetch(croppedImageUrl)
      const blob = await response.blob()
      const file = new File([blob], `cropped-image-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      })

      // Subir la imagen recortada usando Uploadthing
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'image')

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Error al subir la imagen')
      }

      const data = await uploadResponse.json()
      
      // Agregar la imagen a la lista
      onImagesChange([...images, data.url])
      
      toast({
        title: "Imagen subida",
        description: "La imagen ha sido recortada y subida correctamente.",
      })

      // Limpiar la URL del blob
      URL.revokeObjectURL(croppedImageUrl)
    } catch (error) {
      console.error('Error al subir imagen recortada:', error)
      toast({
        title: "Error al subir imagen",
        description: "No se pudo subir la imagen recortada.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      setImageToCrop(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Imágenes */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-600" />
            Imágenes ({images.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {images.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleImagesDragEnd}
            >
              <SortableContext
                items={images.map((_, i) => `image-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {images.map((image, index) => (
                    <SortableImageItem
                      key={`image-${index}`}
                      image={image}
                      index={index}
                      total={images.length}
                      onRemove={() => removeImage(index)}
                      onMoveUp={() => moveImageUp(index)}
                      onMoveDown={() => moveImageDown(index)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-8 text-gray-500 mb-4">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">No hay imágenes agregadas</p>
              <p className="text-xs text-gray-400">Agrega imágenes para mostrar el producto</p>
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            {/* Input file oculto para seleccionar imágenes */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload-input"
              disabled={uploading}
            />
            
            {/* Botón para abrir el selector de archivos */}
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Subiendo..." : "Subir y Recortar Imagen"}
            </Button>

            {/* Opción alternativa: Subir sin recortar (usando Uploadthing directamente) */}
            <div className="text-center text-xs text-gray-500 py-2">o</div>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  const newUrls = res.map((file) => file.url)
                  onImagesChange([...images, ...newUrls])
                  toast({
                    title: "Imágenes subidas",
                    description: `${newUrls.length} imagen(es) agregada(s) correctamente.`,
                  })
                }
              }}
              onUploadError={(error: Error) => {
                toast({
                  title: "Error al subir imágenes",
                  description: error.message || "Ocurrió un error inesperado.",
                  variant: "destructive",
                })
              }}
              className="ut-button:bg-gray-600 ut-button:hover:bg-gray-700 ut-button:ut-uploading:bg-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Videos */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-purple-600" />
            Videos ({videos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {videos.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleVideosDragEnd}
            >
              <SortableContext
                items={videos.map((_, i) => `video-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {videos.map((video, index) => (
                    <SortableVideoItem
                      key={`video-${index}`}
                      video={video}
                      index={index}
                      total={videos.length}
                      onRemove={() => removeVideo(index)}
                      onMoveUp={() => moveVideoUp(index)}
                      onMoveDown={() => moveVideoDown(index)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-8 text-gray-500 mb-4">
              <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">No hay videos agregados</p>
              <p className="text-xs text-gray-400">Agrega videos para mostrar el producto en acción</p>
            </div>
          )}
          
          <UploadButton
            endpoint="videoUploader"
            onClientUploadComplete={(res) => {
              if (res && res.length > 0) {
                const newUrls = res.map((file) => file.url)
                onVideosChange([...videos, ...newUrls])
                toast({
                  title: "Videos subidos",
                  description: `${newUrls.length} video(s) agregado(s) correctamente.`,
                })
              }
            }}
            onUploadError={(error: Error) => {
              toast({
                title: "Error al subir videos",
                description: error.message || "Ocurrió un error inesperado.",
                variant: "destructive",
              })
            }}
            className="ut-button:bg-blue-600 ut-button:hover:bg-blue-700 ut-button:ut-uploading:bg-blue-400"
          />
        </CardContent>
      </Card>

      {/* Información útil */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              💡 Consejos para medios:
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Imágenes:</strong> JPG, PNG, WebP. Máximo 10MB cada una. La primera imagen será la principal</li>
                <li><strong>Videos:</strong> MP4, MOV, WebM. Máximo 100MB cada uno. Muestran el producto en uso</li>
                <li><strong>Almacenamiento:</strong> Los archivos se guardan en la nube, no en la base de datos</li>
                <li><strong>Calidad:</strong> Usa imágenes de alta resolución para mejor presentación</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de recorte de imagen */}
      {imageToCrop && (
        <ImageCropModal
          open={cropModalOpen}
          onClose={() => {
            setCropModalOpen(false)
            setImageToCrop(null)
            if (imageToCrop.startsWith('blob:')) {
              URL.revokeObjectURL(imageToCrop)
            }
          }}
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          aspectRatio={1} // Cuadrado 1:1 para productos
        />
      )}
    </div>
  )
}
