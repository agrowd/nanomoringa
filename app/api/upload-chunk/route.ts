import { NextRequest, NextResponse } from "next/server"

// Endpoint para recibir chunks de archivos grandes
export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const chunk: File | null = data.get("chunk") as unknown as File
    const chunkIndex: string | null = data.get("chunkIndex") as string
    const totalChunks: string | null = data.get("totalChunks") as string
    const fileName: string | null = data.get("fileName") as string
    const fileType: string | null = data.get("fileType") as string
    const uploadId: string | null = data.get("uploadId") as string

    if (!chunk || !chunkIndex || !totalChunks || !fileName || !fileType || !uploadId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convertir chunk a base64
    const bytes = await chunk.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    return NextResponse.json({
      success: true,
      chunkIndex: parseInt(chunkIndex),
      totalChunks: parseInt(totalChunks),
      chunkData: base64,
      uploadId,
    })

  } catch (error) {
    console.error("Error uploading chunk:", error)
    return NextResponse.json({
      error: "Failed to upload chunk"
    }, { status: 500 })
  }
}

