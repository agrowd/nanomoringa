"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ZoomIn, X, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoModal } from "@/components/video-modal"

interface ProductGalleryProps {
  images: string[]
  videos?: string[]
  productName: string
}

export function ProductGallery({ images, videos = [], productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [selectedVideoSrc, setSelectedVideoSrc] = useState<string>("")
  
  // Combinar imágenes y videos en un solo array
  const allMedia = [...images, ...videos]
  const isVideo = (index: number) => index >= images.length
  const currentMedia = allMedia[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1))
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  const openModal = () => {
    if (isVideo(currentIndex)) {
      setSelectedVideoSrc(currentMedia)
      setIsVideoModalOpen(true)
    } else {
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleVideoClick = (videoSrc: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    setSelectedVideoSrc(videoSrc)
    setIsVideoModalOpen(true)
  }

  return (
    <div className="space-y-4">
      <Card className="relative w-full overflow-hidden bg-muted group cursor-pointer" onClick={openModal}>
        <div className="relative w-full flex items-center justify-center" style={{ minHeight: '400px', maxHeight: '800px' }}>
        {isVideo(currentIndex) ? (
          <video
            src={currentMedia}
            className={`w-full h-auto max-h-[800px] object-contain transition-transform duration-300 ${isZoomed ? 'scale-150' : 'group-hover:scale-105'}`}
            controls
            loop
            muted
            playsInline
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={currentMedia || "/placeholder.svg"}
              alt={`${productName} - imagen ${currentIndex + 1}`}
              width={1200}
              height={1200}
              className={`max-w-full h-auto max-h-[800px] object-contain transition-transform duration-300 ${isZoomed ? 'scale-150' : 'group-hover:scale-105'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        </div>

        {/* Zoom and Fullscreen buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation()
              toggleZoom()
            }}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation()
              openModal()
            }}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {allMedia.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allMedia.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIndex(index)
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                  }`}
                  aria-label={`Ir a ${isVideo(index) ? 'video' : 'imagen'} ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Click hint */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-white text-xs font-medium">Haz clic para ver en pantalla completa</p>
          </div>
        </div>
      </Card>

      {allMedia.length > 1 && (
        <div className="grid grid-cols-3 gap-2">
          {allMedia.map((media, index) => (
            <button
              key={index}
              onClick={(e) => {
                if (isVideo(index)) {
                  handleVideoClick(media, e)
                } else {
                  setCurrentIndex(index)
                  openModal()
                }
              }}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                index === currentIndex ? "border-[#8B5CF6]" : "border-transparent hover:border-muted-foreground"
              }`}
            >
              {isVideo(index) ? (
                <video
                  src={media}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                <Image
                  src={media || "/placeholder.svg"}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              )}
              {isVideo(index) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Modal for fullscreen image view */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4">
          <div className="relative w-full h-full sm:max-w-6xl sm:max-h-[90vh] flex flex-col">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white/10 hover:bg-white/20 text-white h-8 w-8 sm:h-10 sm:w-10"
              onClick={closeModal}
            >
              <X className="h-4 w-4 sm:h-6 sm:w-6" />
            </Button>

            {/* Main media */}
            <div className="flex-1 relative overflow-hidden rounded-lg">
              {isVideo(currentIndex) ? (
                <video
                  src={currentMedia}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <Image
                  src={currentMedia || "/placeholder.svg"}
                  alt={`${productName} - imagen ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>

            {/* Navigation */}
            {allMedia.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white h-8 w-8 sm:h-10 sm:w-10"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-5 w-5 sm:h-8 sm:w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white h-8 w-8 sm:h-10 sm:w-10"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-5 w-5 sm:h-8 sm:w-8" />
                </Button>

                {/* Media counter */}
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm">
                  {currentIndex + 1} / {allMedia.length}
                </div>

                {/* Thumbnail strip */}
                <div className="flex gap-2 mt-2 sm:mt-4 justify-center overflow-x-auto pb-2 px-2">
                  {allMedia.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`relative w-12 h-12 sm:w-16 sm:h-16 overflow-hidden rounded-lg border-2 transition-all flex-shrink-0 ${
                        index === currentIndex ? "border-white" : "border-white/30 hover:border-white/60"
                      }`}
                    >
                      {isVideo(index) ? (
                        <>
                          <video
                            src={media}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="w-4 h-4 rounded-full bg-white/90 flex items-center justify-center">
                              <svg className="w-2 h-2 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </>
                      ) : (
                        <Image
                          src={media || "/placeholder.svg"}
                          alt={`${productName} thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Video Modal */}
      <VideoModal
        open={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc={selectedVideoSrc}
        videoTitle={productName}
      />
    </div>
  )
}
