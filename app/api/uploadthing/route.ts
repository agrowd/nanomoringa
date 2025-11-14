import { createRouteHandler } from "uploadthing/next"

import { ourFileRouter } from "./core"

// Verificar que las variables de entorno estén configuradas
// En Uploadthing v7, se necesita UPLOADTHING_TOKEN (base64 encoded JSON)
function getToken() {
  const token = process.env.UPLOADTHING_TOKEN
  
  if (!token) {
    console.error('[Uploadthing] Missing UPLOADTHING_TOKEN environment variable')
    console.error('[Uploadthing] Available env vars:', Object.keys(process.env).filter(k => k.includes('UPLOAD')))
    return null
  }
  
  console.log('[Uploadthing] Token found, length:', token.length)
  // Intentar decodificar para verificar que sea válido
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const parsed = JSON.parse(decoded)
    console.log('[Uploadthing] Token decoded successfully, appId:', parsed.appId)
    return token
  } catch (error) {
    console.error('[Uploadthing] Token is not valid base64 JSON:', error)
    return null
  }
}

// Obtener token en runtime (no en build time)
const token = getToken()

// Export routes for Next App Router
// createRouteHandler devuelve { GET, POST } que deben ser exportados directamente
const { GET: originalGET, POST: originalPOST } = createRouteHandler({
  router: ourFileRouter,
  config: token ? {
    token: token,
  } : undefined,
})

// Wrapper para agregar logs en tiempo de ejecución y manejo de errores
export async function GET(request: Request) {
  try {
    console.log('[Uploadthing GET] Request received at:', new Date().toISOString())
    const tokenCheck = getToken()
    if (!tokenCheck) {
      console.error('[Uploadthing GET] Token not available in runtime!')
      return new Response(
        JSON.stringify({ 
          error: 'Uploadthing token not configured',
          message: 'UPLOADTHING_TOKEN environment variable is missing or invalid'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    return await originalGET(request)
  } catch (error) {
    console.error('[Uploadthing GET] Error:', error)
    console.error('[Uploadthing GET] Error stack:', error instanceof Error ? error.stack : 'No stack')
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : String(error)
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log('[Uploadthing POST] Request received at:', new Date().toISOString())
    const tokenCheck = getToken()
    if (!tokenCheck) {
      console.error('[Uploadthing POST] Token not available in runtime!')
      return new Response(
        JSON.stringify({ 
          error: 'Uploadthing token not configured',
          message: 'UPLOADTHING_TOKEN environment variable is missing or invalid'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    return await originalPOST(request)
  } catch (error) {
    console.error('[Uploadthing POST] Error:', error)
    console.error('[Uploadthing POST] Error stack:', error instanceof Error ? error.stack : 'No stack')
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : String(error)
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

