import { NextRequest } from 'next/server'

// Server-Sent Events para tiempo real
// El bot enviará eventos aquí y el frontend los escuchará

const clients = new Set<ReadableStreamDefaultController>()

// Función para emitir eventos a todos los clientes conectados
export function emitEvent(event: { type: string; data: any }) {
  const message = JSON.stringify(event)
  const data = `data: ${message}\n\n`
  
  clients.forEach((controller) => {
    try {
      controller.enqueue(data)
    } catch (error) {
      // Cliente desconectado, removerlo
      clients.delete(controller)
    }
  })
}

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller)
      
      // Enviar mensaje de conexión
      const data = JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })
      controller.enqueue(`data: ${data}\n\n`)
      
      // Limpiar cuando el cliente se desconecta
      request.signal.addEventListener('abort', () => {
        clients.delete(controller)
        try {
          controller.close()
        } catch (e) {
          // Ignorar errores al cerrar
        }
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    }
  })
}

// Endpoint para que el bot envíe eventos
export async function POST(request: Request) {
  try {
    const body = await request.json()
    emitEvent(body)
    return Response.json({ success: true })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

