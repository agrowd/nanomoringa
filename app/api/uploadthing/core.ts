import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

// FileRouter para tu app
export const ourFileRouter = {
  // Uploader para imágenes
  imageUploader: f({
    image: {
      maxFileSize: "10MB",
      maxFileCount: 10,
    },
  })
    .middleware(async () => {
      // Aquí podrías agregar autenticación si lo necesitas
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Image upload complete:", file.url)
      return { url: file.url }
    }),

  // Uploader para videos
  videoUploader: f({
    video: {
      maxFileSize: "100MB", // Uploadthing permite hasta 100MB
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Video upload complete:", file.url)
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

