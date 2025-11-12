"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Save, X } from "lucide-react"

interface SaveConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  onDiscard: () => void
  title?: string
  description?: string
}

export function SaveConfirmationDialog({
  isOpen,
  onClose,
  onSave,
  onDiscard,
  title = "¿Guardar cambios?",
  description = "Tienes cambios sin guardar. ¿Quieres guardarlos antes de continuar?"
}: SaveConfirmationDialogProps) {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave()
      onClose()
    } catch (error) {
      console.error("Error saving:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    onDiscard()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleDiscard}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Descartar cambios
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
