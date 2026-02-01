"use client"

import { useEffect, useState } from "react"

const loadingSteps = [
  "Validating idea...",
  "Analyzing market...",
  "Evaluating competitors...",
  "Building strategy...",
  "Finalizing report...",
]

interface LoadingOverlayProps {
  isVisible: boolean
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0)
      return
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev))
    }, 3000)

    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>

        <div className="space-y-4">
          {loadingSteps.map((step, index) => (
            <div
              key={step}
              className={`flex items-center gap-3 transition-all duration-500 ${
                index <= currentStep
                  ? "text-foreground opacity-100"
                  : "text-muted-foreground opacity-40"
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full transition-all duration-500 ${
                  index < currentStep
                    ? "bg-primary"
                    : index === currentStep
                      ? "bg-primary animate-pulse"
                      : "bg-muted"
                }`}
              />
              <span className="text-base font-medium">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
