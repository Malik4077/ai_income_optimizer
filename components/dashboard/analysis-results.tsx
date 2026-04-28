"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, getIncomeImpactColor } from "@/lib/utils";
import {
  AlertTriangle,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowRight,
  DollarSign,
  Loader2,
} from "lucide-react";

interface AnalysisResultsProps {
  analysis: {
    id: string;
    overall_score: number;
    current_income_estimate: number;
    potential_income_estimate: number;
    skill_gaps: Array<{ skill: string; impact: string; income_impact_usd: number; how_to_fix: string }>;
    income_limitations: Array<{ limitation: string; severity: string; estimated_loss_monthly: number; fix: string }>;
    positioning_flaws: Array<{ flaw: string; impact: string; correction: string }>;
    missed_opportunities: Array<{ opportunity: string; potential_monthly_gain: number; effort_level: string; action: string }>;
    raw_ai_response: { summary: string };
  };
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const router = useRouter();
  const [generatingPlan, setGeneratingPlan] = useState(false);

  const incomeGap = analysis.potential_income_estimate - analysis.current_income_estimate;
  const scoreColor =
    analysis.overall_score >= 70 ? "text-green-500" : analysis.overall_score >= 40 ? "text-yellow-500" : "text-red-500";

  const handleGeneratePlan = async () => {
    setGeneratingPlan(true);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: analysis.id,
          currentIncome: analysis.current_income_estimate,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/dashboard/growth-plan/${data.planId}`);
      } else {
        alert(data.error);
      }
    } finally {
      setGeneratingPlan(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Income Audit Results</h1>
          <p className="text-muted-foreground">Here&apos;s exactly why you&apos;re leaving money on the table</p>
        </div>
        <Button variant="gradient" onClick={handleGeneratePlan} disabled={generatingPlan} className="gap-2">
          {generatingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
          Generate Growth Plan
        </Button>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Income Score</p>
              <div className={`text-5xl font-bold ${scoreColor}`}>{analysis.overall_score}</div>
              <p className="text-xs text-muted-foreground mt-1">out of 100</p>
              <Progress value={analysis.overall_score} className="mt-3 h-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Current Estimate</p>
              <div className="text-3xl font-bold">{formatCurrency(analysis.current_income_estimate)}</div>
              <p className="text-xs text-muted-foreground mt-1">per month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Potential</p>
              <div className="text-3xl font-bold text-green-500">{formatCurrency(analysis.potential_income_estimate)}</div>
              <p className="text-xs text-green-600 mt-1">+{formatCurrency(incomeGap)}/mo available</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Summary */}
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">AI Assessment</p>
              <p className="text-sm text-muted-foreground">{analysis.raw_ai_response?.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed tabs */}
      <Tabs defaultValue="limitations">
        <TabsList className="w-full">
          <TabsTrigger value="limitations" className="flex-1">
            Income Blockers ({analysis.income_limitations?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex-1">
            Skill Gaps ({analysis.skill_gaps?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="positioning" className="flex-1">
            Positioning ({analysis.positioning_flaws?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="flex-1">
            Opportunities ({analysis.missed_opportunities?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="limitations" className="space-y-3 mt-4">
          {analysis.income_limitations?.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={item.severity === "critical" ? "danger" : item.severity === "moderate" ? "warning" : "secondary"}>
                          {item.severity}
                        </Badge>
                        <span className="font-medium text-sm">{item.limitation}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium text-foreground">Fix: </span>{item.fix}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-red-500 font-bold text-sm">-{formatCurrency(item.estimated_loss_monthly)}/mo</div>
                      <div className="text-xs text-muted-foreground">lost monthly</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="skills" className="space-y-3 mt-4">
          {analysis.skill_gaps?.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={item.impact === "high" ? "danger" : item.impact === "medium" ? "warning" : "secondary"}>
                          {item.impact} impact
                        </Badge>
                        <span className="font-medium text-sm">{item.skill}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium text-foreground">How to fix: </span>{item.how_to_fix}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-green-500 font-bold text-sm">+{formatCurrency(item.income_impact_usd)}/mo</div>
                      <div className="text-xs text-muted-foreground">if acquired</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="positioning" className="space-y-3 mt-4">
          {analysis.positioning_flaws?.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Target className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{item.flaw}</p>
                      <p className="text-xs text-muted-foreground mt-1">Impact: {item.impact}</p>
                      <p className="text-sm mt-2">
                        <span className="font-medium text-green-600">Correction: </span>{item.correction}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-3 mt-4">
          {analysis.missed_opportunities?.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="border-green-500/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={item.effort_level === "low" ? "success" : item.effort_level === "medium" ? "warning" : "secondary"}>
                          {item.effort_level} effort
                        </Badge>
                        <span className="font-medium text-sm">{item.opportunity}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium text-foreground">Action: </span>{item.action}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-green-500 font-bold text-sm">+{formatCurrency(item.potential_monthly_gain)}/mo</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button variant="gradient" size="lg" onClick={handleGeneratePlan} disabled={generatingPlan} className="gap-2">
          {generatingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          Generate My Income Growth Plan
        </Button>
      </div>
    </div>
  );
}
