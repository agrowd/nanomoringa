import { createRouteHandler } from "uploadthing/next"

import { ourFileRouter } from "./core"

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    // Uploadthing busca UPLOADTHING_TOKEN o UPLOADTHING_SECRET
    // Si tienes UPLOADTHING_SECRET, se usa automáticamente
    // Si no, puedes pasar el token manualmente aquí
  },
})

