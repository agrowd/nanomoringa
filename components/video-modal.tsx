"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useEffect, useRef } from "react"

interface VideoModalProps {
  open: boolean
  onClose: () => void
  videoSrc: string
  videoTitle?: string
}

export function VideoModal({ open, onClose, videoSrc, videoTitle }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.play().catch(console.error)
    } else if (!open && videoRef.current) {
      videoRef.current.pause()
    }
  }, [open])

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 bg-black/95">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Botón de cerrar */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Video */}
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            autoPlay
            className="w-full h-full object-contain"
            onEnded={handleClose}
          />

          {/* Título opcional */}
          {videoTitle && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-white text-sm font-medium">{videoTitle}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

