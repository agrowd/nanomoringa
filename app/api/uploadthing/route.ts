import { createRouteHandler } from "uploadthing/next"

import { ourFileRouter } from "./core"

// Verificar que las variables de entorno estén configuradas
const token = process.env.UPLOADTHING_TOKEN || process.env.UPLOADTHING_SECRET

if (!token) {
  console.error('[Uploadthing] Missing UPLOADTHING_TOKEN or UPLOADTHING_SECRET environment variable')
}

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})

