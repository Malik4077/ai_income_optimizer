"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { Loader2, TrendingUp, Zap, Lock } from "lucide-react";
import Link from "next/link";

export default function SimulatorPage() {
  const [analysisId, setAnalysisId] = useState("");
  const [planId, setPlanId] = useState("");
  const [currentIncome, setCurrentIncome] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    current_monthly: number;
    potential_monthly: number;
    annual_difference: number;
    scenarios: Array<{
      name: string;
      description: string;
      monthly_income: number;
      monthly_increase: number;
      probability: string;
      required_actions: string[];
      timeline_months: number;
    }>;
    quick_wins: Array<{ action: string; income_impact: number; time_to_implement: string }>;
    five_year_projection: { without_changes: number; with_optimization: number; difference: number };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isPremium = true; // Check from subscription in production

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/earnings-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          planId,
          currentIncome: parseFloat(currentIncome),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setResult(data.simulation);
    } finally {
      setLoading(false);
    }
  };

  if (!isPremium) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Premium Feature</h2>
            <p className="text-muted-foreground mb-6">Upgrade to Premium to access the Earnings Simulator.</p>
            <Link href="/pricing"><Button variant="gradient" className="w-full">Upgrade to Premium</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Earnings Simulator</h1>
        <p className="text-muted-foreground">See exactly how much more you can earn</p>
      </div>

      {!result && (
        <Card>
          <CardHeader><CardTitle>Run Simulation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Analysis ID</Label>
                <Input value={analysisId} onChange={(e) => setAnalysisId(e.target.value)} placeholder="From analysis page" className="mt-1" />
              </div>
              <div>
                <Label>Growth Plan ID</Label>
                <Input value={planId} onChange={(e) => setPlanId(e.target.value)} placeholder="From growth plan page" className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Current Monthly Income (USD)</Label>
              <Input type="number" value={currentIncome} onChange={(e) => setCurrentIncome(e.target.value)} placeholder="e.g. 5000" className="mt-1" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button variant="gradient" onClick={handleSimulate} disabled={loading} className="w-full gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Simulating...</> : <><Zap className="w-4 h-4" />Run Simulation</>}
            </Button>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Current Monthly</p>
                <p className="text-3xl font-bold">{formatCurrency(result.current_monthly)}</p>
              </CardContent>
            </Card>
            <Card className="border-green-500/30 bg-green-500/5">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Potential Monthly</p>
                <p className="text-3xl font-bold text-green-500">{formatCurrency(result.potential_monthly)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Annual Difference</p>
                <p className="text-3xl font-bold text-violet-500">+{formatCurrency(result.annual_difference)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Scenarios */}
          <Card>
            <CardHeader><CardTitle>Income Scenarios</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {result.scenarios.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{s.name}</p>
                            <Badge variant={s.probability === "high" ? "success" : s.probability === "medium" ? "warning" : "secondary"}>
                              {s.probability} probability
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{s.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl font-bold text-green-500">{formatCurrency(s.monthly_income)}/mo</p>
                          <p className="text-xs text-muted-foreground">+{formatCurrency(s.monthly_increase)}/mo increase</p>
                        </div>
                      </div>
                      <Progress value={(s.monthly_income / result.potential_monthly) * 100} className="h-2 mb-3" />
                      <div className="space-y-1">
                        {s.required_actions.map((a, j) => (
                          <p key={j} className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />{a}
                          </p>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Timeline: {s.timeline_months} months</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Quick wins */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-4 h-4" />Quick Wins</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {result.quick_wins.map((w, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div>
                    <p className="text-sm font-medium">{w.action}</p>
                    <p className="text-xs text-muted-foreground">{w.time_to_implement}</p>
                  </div>
                  <Badge variant="success">+{formatCurrency(w.income_impact)}/mo</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 5-year projection */}
          <Card className="border-violet-500/30 bg-violet-500/5">
            <CardHeader><CardTitle>5-Year Projection</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Without Changes</p>
                  <p className="text-xl font-bold">{formatCurrency(result.five_year_projection.without_changes)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">With Optimization</p>
                  <p className="text-xl font-bold text-green-500">{formatCurrency(result.five_year_projection.with_optimization)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Difference</p>
                  <p className="text-xl font-bold text-violet-500">+{formatCurrency(result.five_year_projection.difference)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" onClick={() => setResult(null)} className="w-full">Run New Simulation</Button>
        </div>
      )}
    </div>
  );
}
