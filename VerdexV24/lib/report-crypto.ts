import type { AnalysisResult } from "@/lib/types"

// Simple base64 encoding for report data transfer
// In production, use proper encryption with a server-side key

export function encodeReport(report: AnalysisResult): string {
  const json = JSON.stringify(report)
  // Use base64 encoding
  return Buffer.from(json).toString("base64")
}

export function decodeReport(encoded: string): AnalysisResult | null {
  try {
    const json = Buffer.from(encoded, "base64").toString("utf-8")
    return JSON.parse(json) as AnalysisResult
  } catch {
    return null
  }
}
