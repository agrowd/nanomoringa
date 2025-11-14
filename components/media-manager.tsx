"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Image as ImageIcon, Video } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { UploadButton } from "@/lib/uploadthing"

interface MediaManagerProps {
  images: string[]
  videos: string[]
  onImagesChange: (images: string[]) => void
  onVideosChange: (videos: string[]) => void
}

export function MediaManager({ images, videos, onImagesChange, onVideosChange }: MediaManagerProps) {
  const { toast } = useToast()

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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={image}
                      alt={`Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <Badge className="absolute bottom-2 left-2 text-xs">
                    {index === 0 ? "Principal" : `#${index + 1}`}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 mb-4">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">No hay imágenes agregadas</p>
              <p className="text-xs text-gray-400">Agrega imágenes para mostrar el producto</p>
            </div>
          )}
          
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
            className="ut-button:bg-blue-600 ut-button:hover:bg-blue-700 ut-button:ut-uploading:bg-blue-400"
          />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {videos.map((video, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <video
                      src={video}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeVideo(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <Badge className="absolute bottom-2 left-2 text-xs">
                    Video #{index + 1}
                  </Badge>
                </div>
              ))}
            </div>
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
    </div>
  )
}
