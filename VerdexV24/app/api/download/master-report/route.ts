import { decodeReport } from "@/lib/report-crypto"
import { jsPDF } from "jspdf"

export async function POST(req: Request) {
  const { reportData } = await req.json()

  if (!reportData) {
    return new Response("Missing report data", { status: 400 })
  }

  const report = decodeReport(reportData)
  if (!report) {
    return new Response("Invalid report data", { status: 400 })
  }

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

  const addSection = (title: string, content: string) => {
    if (yPosition > pageHeight - 60) {
      doc.addPage()
      yPosition = margin
    }
    addText(title, 14, true)
    yPosition += 2
    addText(content, 10)
    yPosition += 10
  }

  // Title Page
  doc.setFontSize(28)
  doc.setFont("helvetica", "bold")
  doc.text("VERDEX", pageWidth / 2, 60, { align: "center" })

  doc.setFontSize(20)
  doc.text("Master Business Analysis", pageWidth / 2, 80, { align: "center" })

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("Confidential Business Report", pageWidth / 2, 100, { align: "center" })
  doc.text(
    new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    pageWidth / 2,
    110,
    { align: "center" }
  )

  // Phase 1: Research & Discovery
  doc.addPage()
  yPosition = margin
  addText("PHASE 1: RESEARCH & DISCOVERY", 16, true)
  yPosition += 10

  addSection("Market Research", report.masterReport.marketResearch)
  addSection("Competitor Analysis", report.masterReport.competitorAnalysis)
  addSection("Customer Persona", report.masterReport.customerPersona)
  addSection("SWOT Analysis", report.masterReport.swotAnalysis)
  addSection("Feasibility Study", report.masterReport.feasibilityStudy)

  // Phase 2: Concept Development
  doc.addPage()
  yPosition = margin
  addText("PHASE 2: CONCEPT DEVELOPMENT", 16, true)
  yPosition += 10

  addSection("Value Proposition", report.masterReport.valueProposition)
  addSection("Pitch Deck Outline", report.masterReport.pitchDeckOutline)
  addSection("Business Plan", report.masterReport.businessPlan)
  addSection("Product Requirements", report.masterReport.prd)
  addSection("Technology Stack", report.masterReport.techStack)
  addSection("Supplier Assessment", report.masterReport.supplierAssessment)

  // Phase 3: Business Modeling
  doc.addPage()
  yPosition = margin
  addText("PHASE 3: BUSINESS MODELING", 16, true)
  yPosition += 10

  addSection("Go-to-Market Strategy", report.masterReport.gtmStrategy)
  addSection("Financial Model", report.masterReport.financialModel)
  addSection("Break-Even Analysis", report.masterReport.breakEvenAnalysis)
  addSection("Startup Budget", report.masterReport.startupBudget)

  // Phase 4: Compliance & Legal
  doc.addPage()
  yPosition = margin
  addText("PHASE 4: COMPLIANCE & LEGAL", 16, true)
  yPosition += 10

  addSection("Legal Structure", report.masterReport.legalStructure)
  addSection("IP Audit", report.masterReport.ipAudit)
  addSection("Regulatory Compliance", report.masterReport.regulatoryCompliance)
  addSection("Legal Documents", report.masterReport.legalDocs)

  // Phase 5: Launch Readiness
  doc.addPage()
  yPosition = margin
  addText("PHASE 5: LAUNCH READINESS", 16, true)
  yPosition += 10

  addSection("Brand Identity", report.masterReport.brandIdentity)
  addSection("Marketing Plan", report.masterReport.marketingPlan)
  addSection("Sales Kit", report.masterReport.salesKit)
  addSection("Risk Assessment", report.masterReport.riskAssessment)
  addSection("MVP Test Report", report.masterReport.mvpTestReport)
  addSection("Pre-Launch Checklist", report.masterReport.preLaunchChecklist)

  // Generate PDF as buffer
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"))

  // Return PDF as download stream
  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Verdex-Master-Report.pdf"',
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
    },
  })
}
