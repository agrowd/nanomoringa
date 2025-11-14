"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Play, Image as ImageIcon, Video } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface MediaManagerProps {
  images: string[]
  videos: string[]
  onImagesChange: (images: string[]) => void
  onVideosChange: (videos: string[]) => void
}

export function MediaManager({ images, videos, onImagesChange, onVideosChange }: MediaManagerProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const compressImage = (file: File, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = document.createElement('img') // Usar createElement en lugar de new Image()
      
      img.onload = () => {
        try {
          // Redimensionar más agresivamente para reducir payload (máximo 800px)
          let { width, height } = img
          const maxSize = 800
          
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width
              width = maxSize
            } else {
              width = (width * maxSize) / height
              height = maxSize
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          ctx?.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          }, 'image/jpeg', quality)
        } catch (error) {
          console.error('[MediaManager] Compression error:', error)
          resolve(file) // Si falla la compresión, usar el archivo original
        }
      }
      
      img.onerror = () => {
        console.error('[MediaManager] Image load error')
        resolve(file) // Si falla la carga, usar el archivo original
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const uploadFile = async (file: File, type: 'image' | 'video'): Promise<string> => {
    console.log('[MediaManager] ===== UPLOAD FILE START =====')
    console.log('[MediaManager] Uploading file:', {
      name: file.name,
      size: file.size,
      sizeMB: (file.size / (1024 * 1024)).toFixed(2),
      type: file.type
    })
    
    // Para videos, SIEMPRE usar chunking si es mayor a 2MB
    // Para imágenes, comprimir primero
    let fileToUpload = file
    const CHUNK_SIZE = 3 * 1024 * 1024 // 3MB por chunk
    const CHUNK_THRESHOLD = 2 * 1024 * 1024 // 2MB threshold para activar chunking
    
    // Para videos grandes, usar chunking directamente
    if (type === 'video' && file.size > CHUNK_THRESHOLD) {
      console.log('[MediaManager] Video is large, using chunking directly...')
      return await uploadFileInChunks(file, type, CHUNK_SIZE)
    }
    
    // Comprimir imágenes para reducir el tamaño
    if (type === 'image') {
      try {
        console.log('[MediaManager] Compressing image...')
        const quality = file.size > 2 * 1024 * 1024 ? 0.6 : 0.8
        fileToUpload = await compressImage(file, quality)
        console.log('[MediaManager] Compressed size:', fileToUpload.size, 'MB:', (fileToUpload.size / (1024 * 1024)).toFixed(2))
      } catch (error) {
        console.warn('[MediaManager] Compression failed, using original file')
        fileToUpload = file
      }
    }

    // Verificar si necesita chunking después de compresión
    const useChunking = fileToUpload.size > CHUNK_THRESHOLD

    console.log('[MediaManager] File size check:', {
      originalSize: file.size,
      processedSize: fileToUpload.size,
      sizeMB: (fileToUpload.size / (1024 * 1024)).toFixed(2),
      chunkThreshold: CHUNK_THRESHOLD,
      useChunking
    })

    if (useChunking) {
      console.log('[MediaManager] File is large, using chunking...')
      return await uploadFileInChunks(fileToUpload, type, CHUNK_SIZE)
    }
    
    // Upload normal para archivos pequeños
    console.log('[MediaManager] File is small, using normal upload...')
    const formData = new FormData()
    formData.append('file', fileToUpload)
    formData.append('type', type)

    console.log('[MediaManager] Sending to /api/upload...')
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      console.error('[MediaManager] Upload failed:', response.status)
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { error: `Server error: ${response.status}` }
      }
      console.error('[MediaManager] Error details:', errorData)
      throw new Error(errorData.error || 'Failed to upload file')
    }

    const result = await response.json()
    console.log('[MediaManager] Upload successful:', result.fileName)
    return result.url
  }

  const uploadFileInChunks = async (file: File, type: 'image' | 'video', chunkSize: number): Promise<string> => {
    const uploadId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const totalChunks = Math.ceil(file.size / chunkSize)
    const chunks: Array<{ chunkIndex: number; chunkData: string }> = []

    console.log(`[MediaManager] Starting chunked upload:`, {
      fileName: file.name,
      fileSize: file.size,
      fileSizeMB: (file.size / (1024 * 1024)).toFixed(2),
      chunkSize,
      totalChunks
    })

    // Subir cada chunk
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      const chunk = file.slice(start, end)

      console.log(`[MediaManager] Preparing chunk ${i + 1}/${totalChunks}:`, {
        start,
        end,
        chunkSize: chunk.size,
        chunkSizeMB: (chunk.size / (1024 * 1024)).toFixed(2)
      })

      const formData = new FormData()
      formData.append('chunk', chunk)
      formData.append('chunkIndex', i.toString())
      formData.append('totalChunks', totalChunks.toString())
      formData.append('fileName', file.name)
      formData.append('fileType', file.type)
      formData.append('uploadId', uploadId)

      console.log(`[MediaManager] Uploading chunk ${i + 1}/${totalChunks} to /api/upload-chunk...`)

      try {
        const response = await fetch('/api/upload-chunk', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`[MediaManager] Chunk ${i + 1} upload failed:`, response.status, errorText)
          let errorData
          try {
            errorData = JSON.parse(errorText)
          } catch {
            errorData = { error: `Chunk ${i + 1} upload failed with status ${response.status}` }
          }
          throw new Error(errorData.error || `Failed to upload chunk ${i + 1}`)
        }

        const result = await response.json()
        console.log(`[MediaManager] Chunk ${i + 1}/${totalChunks} uploaded successfully`)
        chunks.push({
          chunkIndex: result.chunkIndex,
          chunkData: result.chunkData,
        })
      } catch (error) {
        console.error(`[MediaManager] Error uploading chunk ${i + 1}:`, error)
        throw error
      }
    }

    // Recombinar chunks
    console.log('[MediaManager] All chunks uploaded, combining...')
    try {
      const combineResponse = await fetch('/api/upload-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chunks,
          fileName: file.name,
          fileType: file.type,
          uploadId,
        }),
      })

      if (!combineResponse.ok) {
        const errorText = await combineResponse.text()
        console.error('[MediaManager] Combine failed:', combineResponse.status, errorText)
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: `Failed to combine chunks: ${combineResponse.status}` }
        }
        throw new Error(errorData.error || 'Failed to combine chunks')
      }

      const result = await combineResponse.json()
      console.log('[MediaManager] Upload successful:', result.fileName)
      return result.url
    } catch (error) {
      console.error('[MediaManager] Error combining chunks:', error)
      throw error
    }
  }

  const handleFileUpload = async (files: FileList, type: 'image' | 'video') => {
    if (!files || files.length === 0) return

    // Limitar el número de archivos para evitar payloads muy grandes
    const maxFiles = type === 'image' ? 5 : 2
    if (files.length > maxFiles) {
      toast({
        title: "Demasiados archivos",
        description: `Máximo ${maxFiles} ${type === 'image' ? 'imágenes' : 'videos'} por producto`,
        variant: "destructive",
      })
      return
    }

    console.log('[MediaManager] Starting upload for', files.length, 'file(s)')
    setIsUploading(true)
    
    try {
      const newUrls: string[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        console.log(`[MediaManager] Processing file ${i + 1}/${files.length}:`, file.name)
        
        // Validaciones
        if (type === 'image' && !file.type.startsWith('image/')) {
          console.warn('[MediaManager] Invalid image type:', file.type)
          toast({
            title: "Error",
            description: "Solo se permiten archivos de imagen",
            variant: "destructive",
          })
          continue
        }
        
        if (type === 'video' && !file.type.startsWith('video/')) {
          console.warn('[MediaManager] Invalid video type:', file.type)
          toast({
            title: "Error", 
            description: "Solo se permiten archivos de video",
            variant: "destructive",
          })
          continue
        }

        // Subir archivo real al servidor
        console.log('[MediaManager] About to call uploadFile with:', {
          name: file.name,
          size: file.size,
          sizeMB: (file.size / (1024 * 1024)).toFixed(2),
          type: type
        })
        const uploadedUrl = await uploadFile(file, type)
        newUrls.push(uploadedUrl)
        console.log('[MediaManager] URL added:', uploadedUrl.substring(0, 50) + '...')
      }

      if (newUrls.length > 0) {
        if (type === 'image') {
          console.log('[MediaManager] Adding images to state. Current:', images.length, 'New:', newUrls.length)
          onImagesChange([...images, ...newUrls])
        } else {
          console.log('[MediaManager] Adding videos to state. Current:', videos.length, 'New:', newUrls.length)
          onVideosChange([...videos, ...newUrls])
        }
        
        toast({
          title: "Archivos subidos",
          description: `${newUrls.length} ${type === 'image' ? 'imagen(es)' : 'video(s)'} agregado(s)`,
        })
      }
    } catch (error) {
      console.error('[MediaManager] Upload error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al subir los archivos",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index)
    onVideosChange(newVideos)
  }

  const triggerFileInput = (type: 'image' | 'video') => {
    if (type === 'image') {
      fileInputRef.current?.click()
    } else {
      videoInputRef.current?.click()
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
          
          <div className="flex gap-2">
            <Button
              onClick={() => triggerFileInput('image')}
              disabled={isUploading}
              variant="outline"
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Subiendo..." : "Agregar Imágenes"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files || new FileList(), 'image')}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {videos.map((video, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <video
                      src={video}
                      controls
                      className="w-full h-full object-cover"
                      poster="/placeholder-video.jpg"
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
            <div className="text-center py-8 text-gray-500">
              <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">No hay videos agregados</p>
              <p className="text-xs text-gray-400">Agrega videos para mostrar el producto en acción</p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              onClick={() => triggerFileInput('video')}
              disabled={isUploading}
              variant="outline"
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Subiendo..." : "Agregar Videos"}
            </Button>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files || new FileList(), 'video')}
            />
          </div>
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
                <li><strong>Imágenes:</strong> JPG, PNG, WebP. Mínimo 800x800px. La primera imagen será la principal</li>
                <li><strong>Videos:</strong> MP4, MOV, WebM. Máximo 50MB. Muestran el producto en uso</li>
                <li><strong>Orden:</strong> Arrastra para reordenar (funcionalidad futura)</li>
                <li><strong>Calidad:</strong> Usa imágenes de alta resolución para mejor presentación</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
