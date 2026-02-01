import { decodeReport } from "@/lib/report-crypto"
import { jsPDF } from "jspdf"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const reportData = url.searchParams.get("data")

  if (!reportData) {
    return new Response("Missing report data", { status: 400 })
  }

  const report = decodeReport(reportData)
  if (!report) {
    return new Response("Invalid report data", { status: 400 })
  }

  const { decisionEngine } = report

  // Generate PDF server-side
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let yPosition = margin

  const addText = (text: string, fontSize: number, isBold = false) => {
    doc.setFontSize(fontSize)
    doc.setFont("helvetica", isBold ? "bold" : "normal")
    const lines = doc.splitTextToSize(text, contentWidth)

    for (const line of lines) {
      if (yPosition > pageHeight - margin - 10) {
        doc.addPage()
        yPosition = margin
      }
      doc.text(line, margin, yPosition)
      yPosition += fontSize * 0.5
    }
    yPosition += 5
  }

  // Title Page
  doc.setFontSize(28)
  doc.setFont("helvetica", "bold")
  doc.text("VERDEX", pageWidth / 2, 50, { align: "center" })

  doc.setFontSize(18)
  doc.text("Decision Engine Summary", pageWidth / 2, 70, { align: "center" })

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(
    new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    pageWidth / 2,
    85,
    { align: "center" }
  )

  // Verdict Box
  yPosition = 110
  const verdictColor =
    decisionEngine.verdict === "GO"
      ? [34, 139, 34]
      : decisionEngine.verdict === "CAUTION"
        ? [218, 165, 32]
        : [178, 34, 34]

  doc.setFillColor(verdictColor[0], verdictColor[1], verdictColor[2])
  doc.roundedRect(margin, yPosition, contentWidth, 30, 3, 3, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text(`VERDICT: ${decisionEngine.verdict}`, pageWidth / 2, yPosition + 20, { align: "center" })

  doc.setTextColor(0, 0, 0)
  yPosition += 45

  // Confidence Score
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text(`Confidence Score: ${decisionEngine.confidenceScore}%`, margin, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const explanationLines = doc.splitTextToSize(decisionEngine.confidenceExplanation, contentWidth)
  for (const line of explanationLines) {
    doc.text(line, margin, yPosition)
    yPosition += 5
  }
  yPosition += 15

  // Top Risks
  addText("TOP RISKS", 14, true)
  for (let i = 0; i < decisionEngine.topRisks.length; i++) {
    addText(`${i + 1}. ${decisionEngine.topRisks[i]}`, 10)
  }
  yPosition += 10

  // Top Opportunities
  addText("TOP OPPORTUNITIES", 14, true)
  for (let i = 0; i < decisionEngine.topOpportunities.length; i++) {
    addText(`${i + 1}. ${decisionEngine.topOpportunities[i]}`, 10)
  }
  yPosition += 10

  // Recommendations
  addText("STRATEGIC RECOMMENDATIONS", 14, true)
  for (let i = 0; i < decisionEngine.recommendations.length; i++) {
    addText(`${i + 1}. ${decisionEngine.recommendations[i]}`, 10)
  }
  yPosition += 10

  // Action Plan
  if (yPosition > pageHeight - 100) {
    doc.addPage()
    yPosition = margin
  }

  addText("30-60-90 DAY ACTION PLAN", 16, true)
  yPosition += 5

  addText("First 30 Days:", 12, true)
  for (let i = 0; i < decisionEngine.actionPlan.thirtyDays.length; i++) {
    addText(`  ${i + 1}. ${decisionEngine.actionPlan.thirtyDays[i]}`, 10)
  }
  yPosition += 5

  addText("Days 31-60:", 12, true)
  for (let i = 0; i < decisionEngine.actionPlan.sixtyDays.length; i++) {
    addText(`  ${i + 1}. ${decisionEngine.actionPlan.sixtyDays[i]}`, 10)
  }
  yPosition += 5

  addText("Days 61-90:", 12, true)
  for (let i = 0; i < decisionEngine.actionPlan.ninetyDays.length; i++) {
    addText(`  ${i + 1}. ${decisionEngine.actionPlan.ninetyDays[i]}`, 10)
  }

  // Generate PDF as buffer
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"))

  // Return PDF as download stream
  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Verdex-Decision-Summary.pdf"',
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
    },
  })
}
