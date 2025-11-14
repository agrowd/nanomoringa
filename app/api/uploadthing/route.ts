import { createRouteHandler } from "uploadthing/next"

import { ourFileRouter } from "./core"

// Verificar que las variables de entorno estén configuradas
const token = process.env.UPLOADTHING_TOKEN || process.env.UPLOADTHING_SECRET

if (!token) {
  console.error('[Uploadthing] Missing UPLOADTHING_TOKEN or UPLOADTHING_SECRET environment variable')
  throw new Error('UPLOADTHING_TOKEN or UPLOADTHING_SECRET must be set')
}

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    // Pasar el token explícitamente si es necesario
    token: token,
  },
})

