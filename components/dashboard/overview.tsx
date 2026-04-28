"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Upload,
  BarChart3,
  ArrowRight,
  DollarSign,
  Target,
  Zap,
} from "lucide-react";

interface OverviewProps {
  analyses: Array<{
    id: string;
    overall_score: number;
    current_income_estimate: number;
    potential_income_estimate: number;
    created_at: string;
  }>;
  plans: Array<{
    id: string;
    recommended_niche: string;
    income_increase_min: number;
    income_increase_max: number;
    created_at: string;
  }>;
  subscription: { plan: string; analyses_used: number } | null;
}

export function DashboardOverview({ analyses, plans, subscription }: OverviewProps) {
  const latestAnalysis = analyses[0];
  const latestPlan = plans[0];
  const plan = subscription?.plan ?? "free";

  const potentialIncrease = latestAnalysis
    ? latestAnalysis.potential_income_estimate - latestAnalysis.current_income_estimate
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Income Dashboard</h1>
        <p className="text-muted-foreground">Track your income optimization progress</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Income Score</span>
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold mb-2">
                {latestAnalysis ? `${latestAnalysis.overall_score}/100` : "—"}
              </div>
              {latestAnalysis && (
                <Progress value={latestAnalysis.overall_score} className="h-2" />
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Potential Monthly Gain</span>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold text-green-500">
                {potentialIncrease > 0 ? `+${formatCurrency(potentialIncrease)}` : "—"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">vs current income</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Target Niche</span>
                <Target className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-sm font-semibold line-clamp-2">
                {latestPlan?.recommended_niche ?? "Run analysis to discover"}
              </div>
              {latestPlan && (
                <Badge variant="success" className="mt-2 text-xs">
                  +{formatCurrency(latestPlan.income_increase_min)}-{formatCurrency(latestPlan.income_increase_max)}/mo
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* CTA if no analysis */}
      {analyses.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start your income analysis</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Upload your resume and get a brutally honest AI analysis of why you&apos;re underpaid
                and exactly how to fix it.
              </p>
              <Link href="/dashboard/upload">
                <Button variant="gradient" size="lg" className="gap-2">
                  Upload Resume Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent analyses */}
      {analyses.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Recent Analyses
                <Link href="/dashboard/analysis">
                  <Button variant="ghost" size="sm">View all</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analyses.slice(0, 3).map((a) => (
                <Link key={a.id} href={`/dashboard/analysis/${a.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <div>
                      <div className="text-sm font-medium">Income Audit</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={a.overall_score >= 70 ? "success" : a.overall_score >= 40 ? "warning" : "danger"}>
                        {a.overall_score}/100
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Quick Actions
                <Zap className="w-4 h-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { href: "/dashboard/upload", label: "New Analysis", icon: Upload, desc: "Upload a new resume" },
                { href: "/dashboard/growth-plan", label: "Growth Plan", icon: TrendingUp, desc: "View your roadmap" },
                { href: "/dashboard/optimizer", label: "Optimize Profile", icon: BarChart3, desc: "Rewrite your bio" },
                { href: "/dashboard/chat", label: "Ask AI Coach", icon: Target, desc: plan === "premium" ? "Chat now" : "Premium only" },
              ].map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <action.icon className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-sm font-medium">{action.label}</div>
                      <div className="text-xs text-muted-foreground">{action.desc}</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
