"use client"

import { useState } from "react"
import { BusinessInputForm, type BusinessFormData } from "@/components/verdex/business-input-form"
import { LoadingOverlay } from "@/components/verdex/loading-overlay"
import { InvalidInputModal } from "@/components/verdex/invalid-input-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, FileText, Target } from "lucide-react"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [showInvalidModal, setShowInvalidModal] = useState(false)
  const [reportData, setReportData] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (formData: BusinessFormData) => {
    setIsLoading(true)
    setReportData(null)
    setErrorMessage(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const text = await response.text()

      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(`Server returned invalid response: ${text.substring(0, 100)}`)
      }

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed")
      }

      if (data.isValid === false) {
        setShowInvalidModal(true)
      } else if (data.reportReady && data.reportData) {
        setReportData(data.reportData)
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error"
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setReportData(null)
  }

  const handleDownloadMasterReport = () => {
    if (reportData) {
      window.location.href = `/api/download/master-report?data=${encodeURIComponent(reportData)}`
    }
  }

  const handleDownloadDecisionSummary = () => {
    if (reportData) {
      window.location.href = `/api/download/decision-summary?data=${encodeURIComponent(reportData)}`
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <LoadingOverlay isVisible={isLoading} />
      <InvalidInputModal
        isOpen={showInvalidModal}
        onClose={() => setShowInvalidModal(false)}
      />

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Verdex
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                AI-Powered Business Analysis
              </p>
            </div>
            {reportData && (
              <Button
                variant="ghost"
                onClick={handleReset}
                className="gap-2 text-muted-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                New Analysis
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        {!reportData ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance">
                Transform your business idea into a strategic roadmap
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Get a comprehensive, consultant-grade analysis of your business concept. 
                No prompts needed — just describe your idea and select a few options.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                <p className="text-sm font-medium">Error: {errorMessage}</p>
              </div>
            )}

            {/* Input Form */}
            <BusinessInputForm onSubmit={handleSubmit} isLoading={isLoading} />

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Comprehensive Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Strategic Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Actionable Roadmap</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Master Report Card */}
            <Card className="border-2">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Master Business Analysis</CardTitle>
                <CardDescription className="text-base">
                  Your full consultant-grade analysis is ready.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-8">
                <Button
                  size="lg"
                  onClick={handleDownloadMasterReport}
                  className="gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Master Report (PDF)
                </Button>
              </CardContent>
            </Card>

            <Separator />

            {/* Decision Engine Card */}
            <Card className="border-2">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">Verdex Decision Engine</CardTitle>
                <CardDescription className="text-base">
                  A strategic verdict and action plan based on your analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-8">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleDownloadDecisionSummary}
                  className="gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Decision Summary (PDF)
                </Button>
              </CardContent>
            </Card>

            {/* Bottom Actions */}
            <div className="flex justify-center pt-8">
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="gap-2 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Start New Analysis
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Verdex provides AI-generated analysis for educational and planning purposes.
            Always consult with qualified professionals for critical business decisions.
          </p>
        </div>
      </footer>
    </main>
  )
}
