import type { AnalysisResult } from "@/lib/types"

// Simple base64 encoding for report data transfer
// Uses btoa/atob which work in both Node.js and browser environments

export function encodeReport(report: AnalysisResult): string {
  const json = JSON.stringify(report)
  // Use btoa for base64 encoding (works in both environments)
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(json).toString("base64")
  }
  return btoa(encodeURIComponent(json))
}

export function decodeReport(encoded: string): AnalysisResult | null {
  try {
    let json: string
    if (typeof Buffer !== 'undefined') {
      json = Buffer.from(encoded, "base64").toString("utf-8")
    } else {
      json = decodeURIComponent(atob(encoded))
    }
    return JSON.parse(json) as AnalysisResult
  } catch {
    return null
  }
}
