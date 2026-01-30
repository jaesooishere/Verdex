"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { AnalysisResult } from "@/lib/types"

interface ReportDisplayProps {
  report: AnalysisResult
}

export function ReportDisplay({ report }: ReportDisplayProps) {
  return (
    <div className="space-y-8">
      {/* Master Report */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-foreground">
            Master Business Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Phase 1 */}
          <ReportSection
            title="Phase 1: Validation & Strategy"
            sections={[
              { title: "Market Research Report", content: report.masterReport.marketResearch },
              { title: "Competitor Analysis", content: report.masterReport.competitorAnalysis },
              { title: "Target Customer Persona", content: report.masterReport.customerPersona },
              { title: "SWOT Analysis", content: report.masterReport.swotAnalysis },
              { title: "Feasibility Study", content: report.masterReport.feasibilityStudy },
              { title: "Value Proposition Canvas", content: report.masterReport.valueProposition },
              { title: "Pitch Deck Outline", content: report.masterReport.pitchDeckOutline },
            ]}
          />

          <Separator />

          {/* Phase 2 */}
          <ReportSection
            title="Phase 2: Operational Planning"
            sections={[
              { title: "Business Plan", content: report.masterReport.businessPlan },
              { title: "Product Requirements Document", content: report.masterReport.prd },
              { title: "Technology Stack & Infrastructure", content: report.masterReport.techStack },
              { title: "Supplier & Vendor Assessment", content: report.masterReport.supplierAssessment },
              { title: "Go-To-Market Strategy", content: report.masterReport.gtmStrategy },
            ]}
          />

          <Separator />

          {/* Phase 3 */}
          <ReportSection
            title="Phase 3: Financial & Legal Groundwork"
            sections={[
              { title: "Financial Model & Projections", content: report.masterReport.financialModel },
              { title: "Break-Even Analysis", content: report.masterReport.breakEvenAnalysis },
              { title: "Startup Budget & Capital Requirements", content: report.masterReport.startupBudget },
              { title: "Legal Structure Overview", content: report.masterReport.legalStructure },
              { title: "Intellectual Property Audit", content: report.masterReport.ipAudit },
              { title: "Regulatory Compliance Review", content: report.masterReport.regulatoryCompliance },
              { title: "Terms, Privacy & Contracts Overview", content: report.masterReport.legalDocs },
            ]}
          />

          <Separator />

          {/* Phase 4 */}
          <ReportSection
            title="Phase 4: Pre-Launch Readiness"
            sections={[
              { title: "Brand Identity Guide", content: report.masterReport.brandIdentity },
              { title: "Marketing Launch Plan", content: report.masterReport.marketingPlan },
              { title: "Sales Kit & Collateral", content: report.masterReport.salesKit },
              { title: "Risk Assessment & Mitigation", content: report.masterReport.riskAssessment },
              { title: "MVP Test Report", content: report.masterReport.mvpTestReport },
              { title: "Pre-Launch Checklist", content: report.masterReport.preLaunchChecklist },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function ReportSection({
  title,
  sections,
}: {
  title: string
  sections: { title: string; content: string }[]
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h4 className="text-base font-medium text-foreground">{section.title}</h4>
            <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
