"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AnalysisResult } from "@/lib/types"

interface DecisionEngineDisplayProps {
  decisionEngine: AnalysisResult["decisionEngine"]
}

export function DecisionEngineDisplay({ decisionEngine }: DecisionEngineDisplayProps) {
  const getVerdictColor = (verdict: string) => {
    switch (verdict.toUpperCase()) {
      case "GO":
        return "bg-primary text-primary-foreground"
      case "CAUTION":
        return "bg-amber-500 text-white"
      case "NO-GO":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="border-2 border-primary/20 shadow-md bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-foreground">
          Verdex Decision Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Final Verdict */}
        <div className="flex flex-col items-center gap-4 py-6 rounded-lg bg-muted/50">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Final Verdict
          </span>
          <Badge className={`text-2xl px-6 py-2 font-bold ${getVerdictColor(decisionEngine.verdict)}`}>
            {decisionEngine.verdict}
          </Badge>
        </div>

        {/* Confidence Score */}
        <div className="space-y-3">
          <h4 className="text-base font-semibold text-foreground">Confidence Score</h4>
          <div className="flex items-center gap-4">
            <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500"
                style={{ width: `${decisionEngine.confidenceScore}%` }}
              />
            </div>
            <span className="text-lg font-bold text-foreground min-w-[4rem] text-right">
              {decisionEngine.confidenceScore}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {decisionEngine.confidenceExplanation}
          </p>
        </div>

        {/* Top Risks */}
        <div className="space-y-3">
          <h4 className="text-base font-semibold text-foreground">Top Risks</h4>
          <ul className="space-y-2">
            {decisionEngine.topRisks.map((risk, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Opportunities */}
        <div className="space-y-3">
          <h4 className="text-base font-semibold text-foreground">Top Opportunities</h4>
          <ul className="space-y-2">
            {decisionEngine.topOpportunities.map((opportunity, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prioritized Recommendations */}
        <div className="space-y-3">
          <h4 className="text-base font-semibold text-foreground">Prioritized Recommendations</h4>
          <ul className="space-y-2">
            {decisionEngine.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent-foreground flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 30-60-90 Day Action Plan */}
        <div className="space-y-4">
          <h4 className="text-base font-semibold text-foreground">30-60-90 Day Action Plan</h4>
          <div className="grid gap-4 sm:grid-cols-3">
            <ActionPlanCard
              title="First 30 Days"
              items={decisionEngine.actionPlan.thirtyDays}
            />
            <ActionPlanCard
              title="Days 31-60"
              items={decisionEngine.actionPlan.sixtyDays}
            />
            <ActionPlanCard
              title="Days 61-90"
              items={decisionEngine.actionPlan.ninetyDays}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActionPlanCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border p-4 bg-background">
      <h5 className="text-sm font-semibold text-primary mb-3">{title}</h5>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
