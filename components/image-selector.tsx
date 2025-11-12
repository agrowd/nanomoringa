"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Lock, Unlock, Eye, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageSelectorProps {
  images: string[]
  onReorderImages: (newOrder: string[]) => void
  onRemoveImage: (index: number) => void
}

export function ImageSelector({ images, onReorderImages, onRemoveImage }: ImageSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { toast } = useToast()

  const handleSetMainImage = (index: number) => {
    if (index === 0) {
      toast({
        title: "Ya es la imagen principal",
        description: "Esta imagen ya está establecida como principal",
      })
      return
    }

    // Reordenar array: mover la imagen seleccionada al inicio
    const newOrder = [
      images[index], // Imagen seleccionada va primero
      ...images.filter((_, i) => i !== index) // Resto de imágenes
    ]

    onReorderImages(newOrder)
    setSelectedIndex(0) // Seleccionar la nueva imagen principal

    toast({
      title: "Imagen principal actualizada",
      description: "La imagen seleccionada ahora es la principal",
    })
  }

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      toast({
        title: "No se puede eliminar",
        description: "Debe haber al menos una imagen",
        variant: "destructive",
      })
      return
    }

    onRemoveImage(index)
    
    // Ajustar índice seleccionado si es necesario
    if (selectedIndex >= index && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    } else if (selectedIndex === index && index > 0) {
      setSelectedIndex(index - 1)
    }
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No hay imágenes</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Vista previa principal */}
      <div className="relative">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
          <Image
            src={images[selectedIndex]}
            alt={`Imagen ${selectedIndex + 1}`}
            fill
            className="object-cover"
          />
          
          {/* Badge de imagen principal */}
          {selectedIndex === 0 && (
            <div className="absolute top-3 left-3">
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Lock className="w-4 h-4" />
                Principal
              </div>
            </div>
          )}
        </div>

        {/* Información de la imagen */}
        <div className="mt-3 text-center">
          <p className="text-sm font-medium text-gray-900">
            Imagen {selectedIndex + 1} de {images.length}
          </p>
          <p className="text-xs text-gray-500">
            {selectedIndex === 0 ? "Imagen principal" : "Imagen secundaria"}
          </p>
        </div>
      </div>

      {/* Grid de miniaturas */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
              index === selectedIndex
                ? 'ring-2 ring-blue-500 shadow-lg scale-105'
                : 'hover:scale-105 hover:shadow-md'
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            <Image
              src={image}
              alt={`Miniatura ${index + 1}`}
              fill
              className="object-cover"
            />

            {/* Overlay con acciones */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/60 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="flex gap-2">
                {/* Botón para establecer como principal */}
                <Button
                  size="sm"
                  variant={index === 0 ? "default" : "secondary"}
                  className={`h-8 w-8 p-0 ${
                    index === 0 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-white/90 hover:bg-white text-gray-700'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSetMainImage(index)
                  }}
                  title={index === 0 ? "Ya es la imagen principal" : "Establecer como principal"}
                >
                  {index === 0 ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </Button>

                {/* Botón para eliminar (solo si hay más de 1 imagen) */}
                {images.length > 1 && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveImage(index)
                    }}
                    title="Eliminar imagen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Indicador de imagen principal */}
            {index === 0 && (
              <div className="absolute top-1 left-1">
                <div className="bg-green-500 text-white rounded-full p-1">
                  <Lock className="w-3 h-3" />
                </div>
              </div>
            )}

            {/* Indicador de selección actual */}
            {index === selectedIndex && (
              <div className="absolute bottom-1 right-1">
                <div className="bg-blue-500 text-white rounded-full p-1">
                  <Eye className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 text-white rounded-full p-1 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Imagen Principal</h4>
            <p className="text-sm text-blue-700">
              La imagen principal es la que ven los usuarios por defecto. 
              Haz clic en el candado de cualquier imagen para establecerla como principal.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
