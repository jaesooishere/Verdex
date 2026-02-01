export interface MasterReport {
  marketResearch: string
  competitorAnalysis: string
  customerPersona: string
  swotAnalysis: string
  feasibilityStudy: string
  valueProposition: string
  pitchDeckOutline: string
  businessPlan: string
  prd: string
  techStack: string
  supplierAssessment: string
  gtmStrategy: string
  financialModel: string
  breakEvenAnalysis: string
  startupBudget: string
  legalStructure: string
  ipAudit: string
  regulatoryCompliance: string
  legalDocs: string
  brandIdentity: string
  marketingPlan: string
  salesKit: string
  riskAssessment: string
  mvpTestReport: string
  preLaunchChecklist: string
}

export interface DecisionEngine {
  verdict: "GO" | "CAUTION" | "NO-GO"
  confidenceScore: number
  confidenceExplanation: string
  topRisks: string[]
  topOpportunities: string[]
  recommendations: string[]
  actionPlan: {
    thirtyDays: string[]
    sixtyDays: string[]
    ninetyDays: string[]
  }
}

export interface AnalysisResult {
  masterReport: MasterReport
  decisionEngine: DecisionEngine
}

export interface BusinessFormData {
  description: string
  businessType: string
  businessStage: string
  userProfile: string
  budgetRange: string
}
