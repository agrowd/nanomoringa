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

const token = getToken()

// Export routes for Next App Router
// Pasar el token explícitamente para asegurar que esté disponible en tiempo de ejecución
const handlers = createRouteHandler({
  router: ourFileRouter,
  config: token ? {
    token: token,
  } : undefined,
})

// Wrapper para agregar logs en tiempo de ejecución
export async function GET(request: Request) {
  console.log('[Uploadthing GET] Request received at:', new Date().toISOString())
  const tokenCheck = getToken()
  if (!tokenCheck) {
    console.error('[Uploadthing GET] Token not available in runtime!')
  }
  return handlers(request)
}

export async function POST(request: Request) {
  console.log('[Uploadthing POST] Request received at:', new Date().toISOString())
  const tokenCheck = getToken()
  if (!tokenCheck) {
    console.error('[Uploadthing POST] Token not available in runtime!')
  }
  return handlers(request)
}

