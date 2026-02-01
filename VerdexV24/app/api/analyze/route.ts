import { GoogleGenerativeAI } from "@google/generative-ai"
import type { BusinessFormData, AnalysisResult } from "@/lib/types"
import { encodeReport } from "@/lib/report-crypto"

async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 4,
  initialDelay = 5000
): Promise<T> {
  let lastError: Error | null = null
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (
        lastError.message.includes("429") ||
        lastError.message.includes("503") ||
        lastError.message.includes("RESOURCE_EXHAUSTED") ||
        lastError.message.includes("overloaded")
      ) {
        const delay = initialDelay * Math.pow(2, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else {
        throw lastError
      }
    }
  }
  throw lastError
}

export async function POST(req: Request) {
  console.log("[v0] API route hit - starting analysis")
  try {
    const body: BusinessFormData = await req.json()
    console.log("[v0] Request body parsed:", { businessType: body.businessType, businessStage: body.businessStage })
    const { description, businessType, businessStage, userProfile, budgetRange } = body

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    console.log("[v0] API key check:", !!apiKey, "length:", apiKey?.length || 0)
    if (!apiKey) {
      console.log("[v0] No API key found!")
      return Response.json({ error: "API key not configured" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Step 1: Validate if input is business-related
    const validationPrompt = `You are a strict validator. Determine if the following text describes a legitimate business idea, product, service, or entrepreneurial concept.

TEXT TO VALIDATE:
"${description}"

RULES:
- Respond "y" ONLY if it clearly describes: a business idea, startup concept, product idea, service offering, company concept, or entrepreneurial venture
- Respond "n" for: random words, gibberish, jokes, questions unrelated to business, greetings, nonsense, poems, stories, or anything NOT a business concept

Respond with ONLY a single lowercase letter: y or n
No periods, no spaces, no explanation, no other characters.`

    const validationResult = await callWithRetry(() => model.generateContent(validationPrompt))
    const validationText = validationResult.response.text().trim().toLowerCase()
    const isValid = validationText.charAt(0) === "y"

    if (!isValid) {
      return Response.json({ isValid: false }, { status: 200 })
    }

    // Step 2: Generate comprehensive master report
    const reportPrompt = `You are Verdex, an elite business analysis AI that provides consultant-grade strategic reports.

Analyze this business idea and return a JSON response:

BUSINESS DESCRIPTION:
${description}

CONTEXT:
- Business Type: ${businessType}
- Stage: ${businessStage}
- User Profile: ${userProfile}
- Budget Range: ${budgetRange}

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "masterReport": {
    "marketResearch": "Detailed market research including market size, trends, growth projections, key players (2-3 paragraphs)",
    "competitorAnalysis": "Analysis of direct/indirect competitors, their strengths/weaknesses, market positioning (2-3 paragraphs)",
    "customerPersona": "Target customer demographics, psychographics, pain points, behaviors (2-3 paragraphs)",
    "swotAnalysis": "Detailed Strengths, Weaknesses, Opportunities, Threats (2-3 paragraphs)",
    "feasibilityStudy": "Technical, financial, market feasibility with go/no-go insight (2-3 paragraphs)",
    "valueProposition": "Customer jobs, pains, gains, and how the product addresses them (2-3 paragraphs)",
    "pitchDeckOutline": "10-15 slide bullet points covering key investor talking points (formatted as numbered list)",
    "businessPlan": "Executive summary, mission, vision, objectives, strategy (2-3 paragraphs)",
    "prd": "Key features, user stories, requirements, milestones (2-3 paragraphs)",
    "techStack": "Recommended technologies, infrastructure, scalability considerations (2-3 paragraphs)",
    "supplierAssessment": "Potential vendors, partnerships, sourcing strategy (2-3 paragraphs)",
    "gtmStrategy": "Launch strategy, channels, partnerships, initial traction plan (2-3 paragraphs)",
    "financialModel": "Revenue model, 3-5 year projections, key assumptions (2-3 paragraphs)",
    "breakEvenAnalysis": "Fixed costs, variable costs, break-even point calculation (2-3 paragraphs)",
    "startupBudget": "Initial capital needs, runway calculation, funding strategy (2-3 paragraphs)",
    "legalStructure": "Recommended entity type, jurisdiction considerations (2-3 paragraphs)",
    "ipAudit": "Patents, trademarks, copyrights needed, protection strategy (2-3 paragraphs)",
    "regulatoryCompliance": "Industry regulations, licenses, compliance requirements (2-3 paragraphs)",
    "legalDocs": "Key contracts and policies needed (2-3 paragraphs)",
    "brandIdentity": "Name evaluation, brand voice, visual identity recommendations (2-3 paragraphs)",
    "marketingPlan": "Content calendar, launch campaigns, channel strategy (2-3 paragraphs)",
    "salesKit": "Sales materials, pricing strategy, sales process (2-3 paragraphs)",
    "riskAssessment": "Key risks ranked by impact/probability with mitigation (2-3 paragraphs)",
    "mvpTestReport": "Suggested MVP scope, testing methodology, success metrics (2-3 paragraphs)",
    "preLaunchChecklist": "Critical items before launch (formatted as numbered list)"
  },
  "decisionEngine": {
    "verdict": "GO or CAUTION or NO-GO",
    "confidenceScore": 75,
    "confidenceExplanation": "Explanation of confidence level (1-2 sentences)",
    "topRisks": ["Risk 1", "Risk 2", "Risk 3"],
    "topOpportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
    "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3", "Recommendation 4", "Recommendation 5"],
    "actionPlan": {
      "thirtyDays": ["Action 1", "Action 2", "Action 3"],
      "sixtyDays": ["Action 1", "Action 2", "Action 3"],
      "ninetyDays": ["Action 1", "Action 2", "Action 3"]
    }
  }
}

IMPORTANT: Return ONLY the JSON object. No markdown formatting, no \`\`\`json, no explanation before or after.`

    const reportResult = await callWithRetry(() => model.generateContent(reportPrompt))
    let reportText = reportResult.response.text().trim()

    // Clean up the response - remove markdown code blocks if present
    if (reportText.startsWith("```json")) {
      reportText = reportText.slice(7)
    } else if (reportText.startsWith("```")) {
      reportText = reportText.slice(3)
    }
    if (reportText.endsWith("```")) {
      reportText = reportText.slice(0, -3)
    }
    reportText = reportText.trim()

    let analysis: AnalysisResult
    try {
      analysis = JSON.parse(reportText)
    } catch {
      return Response.json({ error: "Failed to parse analysis response" }, { status: 500 })
    }

    // Encode report for secure transfer to download endpoints
    const encodedReport = encodeReport(analysis)

    return Response.json({
      isValid: true,
      reportId: encodedReport,
      reportReady: true,
    })
  } catch (error) {
    console.error("[v0] Analysis error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return Response.json({ error: `Analysis failed: ${errorMessage}` }, { status: 500 })
  }
}
