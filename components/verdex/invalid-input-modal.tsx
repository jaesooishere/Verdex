"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface InvalidInputModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InvalidInputModal({ isOpen, onClose }: InvalidInputModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Irrelevant topic
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground pt-2">
            Verdex only analyzes real business ideas.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button onClick={onClose} className="min-w-[120px]">
            Edit Input
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
