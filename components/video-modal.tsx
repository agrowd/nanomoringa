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
      <DialogContent 
        className="mobile-fullscreen max-w-6xl sm:w-[95vw] sm:h-[95vh] sm:max-h-[95vh] p-0 bg-black/95 flex flex-col overflow-hidden sm:rounded-lg"
        aria-describedby={videoTitle ? "video-modal-description" : undefined}
      >
        <div className="relative w-full flex-1 flex items-center justify-center min-h-[200px] max-h-full overflow-hidden">
          {/* Botón de cerrar */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white/10 hover:bg-white/20 text-white h-8 w-8 sm:h-10 sm:w-10"
            onClick={handleClose}
          >
            <X className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>

          {/* Video */}
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            autoPlay
            className="w-full h-full max-w-full max-h-full object-contain"
            onEnded={handleClose}
            playsInline
          />

          {/* Título opcional */}
          {videoTitle && (
            <div 
              id="video-modal-description"
              className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4"
            >
              <p className="text-white text-xs sm:text-sm font-medium">{videoTitle}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

