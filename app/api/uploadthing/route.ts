import { createRouteHandler } from "uploadthing/next"

import { ourFileRouter } from "./core"

// Verificar que las variables de entorno estén configuradas
// Uploadthing busca automáticamente UPLOADTHING_SECRET o UPLOADTHING_TOKEN
const token = process.env.UPLOADTHING_SECRET || process.env.UPLOADTHING_TOKEN

if (!token) {
  console.error('[Uploadthing] Missing UPLOADTHING_SECRET or UPLOADTHING_TOKEN environment variable')
  console.error('[Uploadthing] Available env vars:', Object.keys(process.env).filter(k => k.includes('UPLOAD')))
}

// Export routes for Next App Router
// Uploadthing lee automáticamente UPLOADTHING_SECRET o UPLOADTHING_TOKEN de process.env
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})

