import { NextRequest, NextResponse } from "next/server"

// Endpoint para recombinar chunks y retornar el archivo completo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chunks, fileName, fileType, uploadId } = body

    if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
      return NextResponse.json({ error: "No chunks provided" }, { status: 400 })
    }

    // Ordenar chunks por índice
    const sortedChunks = chunks.sort((a: any, b: any) => a.chunkIndex - b.chunkIndex)

    // Combinar todos los chunks en un solo base64
    const combinedBase64 = sortedChunks.map((chunk: any) => chunk.chunkData).join('')

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = fileName.split('.').pop()
    const finalFileName = `${timestamp}_${randomString}.${fileExtension}`

    // Retornar la data base64 completa
    const publicUrl = `data:${fileType};base64,${combinedBase64}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: finalFileName,
      type: fileType.includes('video') ? 'video' : 'image',
      size: Buffer.from(combinedBase64, 'base64').length,
      mimeType: fileType
    })

  } catch (error) {
    console.error("Error combining chunks:", error)
    return NextResponse.json({
      error: "Failed to combine chunks"
    }, { status: 500 })
  }
}

