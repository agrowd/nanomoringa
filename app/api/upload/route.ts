import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File
    const type: string | null = data.get("type") as string // 'image' or 'video'

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (!type || !['image', 'video'].includes(type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validar tipos de archivo
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    
    if (type === 'image' && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid image type. Only JPEG, PNG, and WebP are allowed." 
      }, { status: 400 })
    }
    
    if (type === 'video' && !allowedVideoTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid video type. Only MP4, WebM, and MOV are allowed." 
      }, { status: 400 })
    }

    // Verificar el tamaño del archivo (máximo 50MB para videos, 10MB para imágenes)
    const maxImageSize = 10 * 1024 * 1024 // 10MB para imágenes
    const maxVideoSize = 50 * 1024 * 1024 // 50MB para videos
    const maxSize = type === 'video' ? maxVideoSize : maxImageSize
    
    if (file.size > maxSize) {
      const maxSizeMB = type === 'video' ? 50 : 10
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${maxSizeMB}MB.` 
      }, { status: 400 })
    }

    // Convertir archivo a base64 para almacenamiento temporal
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    
    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}_${randomString}.${fileExtension}`
    
    // En Vercel, no podemos escribir archivos al sistema de archivos
    // En su lugar, retornamos la data base64 y el frontend la manejará
    const publicUrl = `data:${file.type};base64,${base64}`
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName: fileName,
      type: type,
      size: file.size,
      mimeType: file.type
    })

  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ 
      error: "Failed to upload file" 
    }, { status: 500 })
  }
}
