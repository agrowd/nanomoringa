"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

interface UseUnsavedChangesOptions {
  hasUnsavedChanges: boolean
  onSave: () => Promise<void>
  onDiscard?: () => void
  message?: string
}

export function useUnsavedChanges({
  hasUnsavedChanges,
  onSave,
  onDiscard,
  message = "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?"
}: UseUnsavedChangesOptions) {
  const [showDialog, setShowDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const router = useRouter()
  const isNavigatingRef = useRef(false)

  // Interceptar navegación del router
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isNavigatingRef.current) {
        event.preventDefault()
        event.returnValue = message
        return message
      }
    }

    // Interceptar clicks en enlaces
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const link = target.closest('a[href]') as HTMLAnchorElement
      
      if (link && hasUnsavedChanges && !isNavigatingRef.current) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('/') && !href.startsWith('http')) {
          event.preventDefault()
          setPendingNavigation(href)
          setShowDialog(true)
        }
      }
    }

    // Interceptar navegación del router
    const handleRouteChangeStart = (url: string) => {
      if (hasUnsavedChanges && !isNavigatingRef.current) {
        setPendingNavigation(url)
        setShowDialog(true)
        throw 'Abort navigation'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('click', handleLinkClick)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('click', handleLinkClick)
    }
  }, [hasUnsavedChanges, message])

  const handleSave = async () => {
    try {
      await onSave()
      setShowDialog(false)
      if (pendingNavigation) {
        isNavigatingRef.current = true
        router.push(pendingNavigation)
        setPendingNavigation(null)
      }
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleDiscard = () => {
    if (onDiscard) {
      onDiscard()
    }
    setShowDialog(false)
    if (pendingNavigation) {
      isNavigatingRef.current = true
      router.push(pendingNavigation)
      setPendingNavigation(null)
    }
  }

  const handleClose = () => {
    setShowDialog(false)
    setPendingNavigation(null)
  }

  return {
    showDialog,
    handleSave,
    handleDiscard,
    handleClose
  }
}
