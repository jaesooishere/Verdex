import type { AnalysisResult } from "@/lib/types"

// In-memory store for reports (server-side only)
// In production, use Redis, database, or secure object storage
const reportStore = new Map<string, { report: AnalysisResult; expiresAt: number }>()

// Clean up expired reports periodically
const REPORT_TTL_MS = 30 * 60 * 1000 // 30 minutes

export function generateReportId(): string {
  return `report_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

export function storeReport(reportId: string, report: AnalysisResult): void {
  reportStore.set(reportId, {
    report,
    expiresAt: Date.now() + REPORT_TTL_MS,
  })

  // Clean up expired reports
  const now = Date.now()
  for (const [id, data] of reportStore.entries()) {
    if (data.expiresAt < now) {
      reportStore.delete(id)
    }
  }
}

export function getReport(reportId: string): AnalysisResult | null {
  const data = reportStore.get(reportId)
  if (!data) return null
  if (data.expiresAt < Date.now()) {
    reportStore.delete(reportId)
    return null
  }
  return data.report
}

export function deleteReport(reportId: string): void {
  reportStore.delete(reportId)
}
