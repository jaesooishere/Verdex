"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { AnalysisResult } from "@/lib/types"
import { jsPDF } from "jspdf"

interface DownloadButtonsProps {
  report: AnalysisResult
}

export function DownloadButtons({ report }: DownloadButtonsProps) {
  const downloadMasterReportPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const maxWidth = pageWidth - margin * 2
    let yPosition = 20

    const addTitle = (text: string, fontSize: number = 16) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
      doc.setFontSize(fontSize)
      doc.setFont("helvetica", "bold")
      doc.text(text, margin, yPosition)
      yPosition += fontSize * 0.5 + 4
    }

    const addSubtitle = (text: string) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(text, margin, yPosition)
      yPosition += 8
    }

    const addText = (text: string) => {
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const lines = doc.splitTextToSize(text, maxWidth)
      for (const line of lines) {
        if (yPosition > 280) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, margin, yPosition)
        yPosition += 5
      }
      yPosition += 4
    }

    const addSection = (title: string, content: string) => {
      addSubtitle(title)
      addText(content)
      yPosition += 4
    }

    // Title Page
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("VERDEX", pageWidth / 2, 60, { align: "center" })
    doc.setFontSize(16)
    doc.text("Master Business Analysis Report", pageWidth / 2, 75, { align: "center" })
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 90, { align: "center" })
    
    doc.addPage()
    yPosition = 20

    // Phase 1
    addTitle("PHASE 1: VALIDATION & STRATEGY", 14)
    yPosition += 4
    addSection("1. Market Research Report", report.masterReport.marketResearch)
    addSection("2. Competitor Analysis", report.masterReport.competitorAnalysis)
    addSection("3. Target Customer Persona", report.masterReport.customerPersona)
    addSection("4. SWOT Analysis", report.masterReport.swotAnalysis)
    addSection("5. Feasibility Study", report.masterReport.feasibilityStudy)
    addSection("6. Value Proposition Canvas", report.masterReport.valueProposition)
    addSection("7. Pitch Deck Outline", report.masterReport.pitchDeckOutline)

    // Phase 2
    doc.addPage()
    yPosition = 20
    addTitle("PHASE 2: OPERATIONAL PLANNING", 14)
    yPosition += 4
    addSection("8. Business Plan", report.masterReport.businessPlan)
    addSection("9. Product Requirements Document", report.masterReport.prd)
    addSection("10. Technology Stack", report.masterReport.techStack)
    addSection("11. Supplier Assessment", report.masterReport.supplierAssessment)
    addSection("12. Go-To-Market Strategy", report.masterReport.gtmStrategy)

    // Phase 3
    doc.addPage()
    yPosition = 20
    addTitle("PHASE 3: FINANCIAL & LEGAL GROUNDWORK", 14)
    yPosition += 4
    addSection("13. Financial Model", report.masterReport.financialModel)
    addSection("14. Break-Even Analysis", report.masterReport.breakEvenAnalysis)
    addSection("15. Startup Budget", report.masterReport.startupBudget)
    addSection("16. Legal Structure", report.masterReport.legalStructure)
    addSection("17. IP Audit", report.masterReport.ipAudit)
    addSection("18. Regulatory Compliance", report.masterReport.regulatoryCompliance)
    addSection("19. Legal Documents Overview", report.masterReport.legalDocs)

    // Phase 4
    doc.addPage()
    yPosition = 20
    addTitle("PHASE 4: PRE-LAUNCH READINESS", 14)
    yPosition += 4
    addSection("20. Brand Identity", report.masterReport.brandIdentity)
    addSection("21. Marketing Plan", report.masterReport.marketingPlan)
    addSection("22. Sales Kit", report.masterReport.salesKit)
    addSection("23. Risk Assessment", report.masterReport.riskAssessment)
    addSection("24. MVP Test Report", report.masterReport.mvpTestReport)
    addSection("25. Pre-Launch Checklist", report.masterReport.preLaunchChecklist)

    // Decision Engine
    doc.addPage()
    yPosition = 20
    addTitle("DECISION ENGINE SUMMARY", 14)
    yPosition += 8

    addSubtitle(`Final Verdict: ${report.decisionEngine.verdict}`)
    yPosition += 4
    addSubtitle(`Confidence Score: ${report.decisionEngine.confidenceScore}%`)
    addText(report.decisionEngine.confidenceExplanation)
    yPosition += 4

    addSubtitle("Top Risks")
    report.decisionEngine.topRisks.forEach((risk, i) => {
      addText(`${i + 1}. ${risk}`)
    })
    yPosition += 4

    addSubtitle("Top Opportunities")
    report.decisionEngine.topOpportunities.forEach((opp, i) => {
      addText(`${i + 1}. ${opp}`)
    })
    yPosition += 4

    addSubtitle("Recommendations")
    report.decisionEngine.recommendations.forEach((rec, i) => {
      addText(`${i + 1}. ${rec}`)
    })
    yPosition += 4

    addSubtitle("30-Day Action Plan")
    report.decisionEngine.actionPlan.thirtyDays.forEach((item) => {
      addText(`• ${item}`)
    })
    yPosition += 4

    addSubtitle("60-Day Action Plan")
    report.decisionEngine.actionPlan.sixtyDays.forEach((item) => {
      addText(`• ${item}`)
    })
    yPosition += 4

    addSubtitle("90-Day Action Plan")
    report.decisionEngine.actionPlan.ninetyDays.forEach((item) => {
      addText(`• ${item}`)
    })

    doc.save("verdex-master-report.pdf")
  }

  const downloadDecisionSummaryPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const maxWidth = pageWidth - margin * 2
    let yPosition = 20

    const addText = (text: string) => {
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const lines = doc.splitTextToSize(text, maxWidth)
      for (const line of lines) {
        if (yPosition > 280) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, margin, yPosition)
        yPosition += 5
      }
      yPosition += 4
    }

    // Title
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("VERDEX Decision Summary", pageWidth / 2, yPosition, { align: "center" })
    yPosition += 15

    // Verdict
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    const verdictColor = report.decisionEngine.verdict === "GO" ? [34, 139, 34] : 
                         report.decisionEngine.verdict === "CAUTION" ? [255, 140, 0] : [220, 20, 60]
    doc.setTextColor(verdictColor[0], verdictColor[1], verdictColor[2])
    doc.text(`Verdict: ${report.decisionEngine.verdict}`, margin, yPosition)
    doc.setTextColor(0, 0, 0)
    yPosition += 10

    doc.setFontSize(14)
    doc.text(`Confidence: ${report.decisionEngine.confidenceScore}%`, margin, yPosition)
    yPosition += 8
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    addText(report.decisionEngine.confidenceExplanation)
    yPosition += 6

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Top Risks", margin, yPosition)
    yPosition += 6
    report.decisionEngine.topRisks.forEach((risk, i) => {
      addText(`${i + 1}. ${risk}`)
    })
    yPosition += 4

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Top Opportunities", margin, yPosition)
    yPosition += 6
    report.decisionEngine.topOpportunities.forEach((opp, i) => {
      addText(`${i + 1}. ${opp}`)
    })
    yPosition += 4

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Recommendations", margin, yPosition)
    yPosition += 6
    report.decisionEngine.recommendations.forEach((rec, i) => {
      addText(`${i + 1}. ${rec}`)
    })
    yPosition += 4

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("30-60-90 Day Action Plan", margin, yPosition)
    yPosition += 8

    doc.setFontSize(11)
    doc.text("First 30 Days:", margin, yPosition)
    yPosition += 6
    report.decisionEngine.actionPlan.thirtyDays.forEach((item) => {
      addText(`• ${item}`)
    })
    yPosition += 2

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("Days 31-60:", margin, yPosition)
    yPosition += 6
    report.decisionEngine.actionPlan.sixtyDays.forEach((item) => {
      addText(`• ${item}`)
    })
    yPosition += 2

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("Days 61-90:", margin, yPosition)
    yPosition += 6
    report.decisionEngine.actionPlan.ninetyDays.forEach((item) => {
      addText(`• ${item}`)
    })

    doc.save("verdex-decision-summary.pdf")
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        onClick={downloadMasterReportPDF}
        variant="outline"
        className="gap-2 bg-transparent"
      >
        <Download className="h-4 w-4" />
        Download Master Report (PDF)
      </Button>
      <Button
        onClick={downloadDecisionSummaryPDF}
        variant="outline"
        className="gap-2 bg-transparent"
      >
        <Download className="h-4 w-4" />
        Download Decision Summary (PDF)
      </Button>
    </div>
  )
}
