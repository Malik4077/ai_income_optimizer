"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import {
  Target,
  TrendingUp,
  BookOpen,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface GrowthPlanViewProps {
  plan: {
    id: string;
    recommended_niche: string;
    repositioning_strategy: {
      from: string;
      to: string;
      steps: string[];
      timeline_weeks: number;
    };
    skill_roadmap: Array<{
      skill: string;
      priority: number;
      learning_resource: string;
      time_to_learn_weeks: number;
      income_unlock: number;
    }>;
    income_increase_min: number;
    income_increase_max: number;
    timeline_months: number;
    action_steps: Array<{
      week: number;
      action: string;
      expected_outcome: string;
      income_impact: number;
    }>;
    raw_ai_response: {
      target_clients?: Array<{
        client_type: string;
        platform: string;
        avg_budget: string;
        how_to_reach: string;
      }>;
      pricing_strategy?: {
        current_rate: string;
        recommended_rate: string;
        justification: string;
        raise_script: string;
      };
    };
  };
}

export function GrowthPlanView({ plan }: GrowthPlanViewProps) {
  const targetClients = plan.raw_ai_response?.target_clients ?? [];
  const pricingStrategy = plan.raw_ai_response?.pricing_strategy;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Your Income Growth Plan</h1>
        <p className="text-muted-foreground">Follow this roadmap to increase your income</p>
      </div>

      {/* Header card */}
      <Card className="border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
        <CardContent className="p-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <Badge variant="secondary" className="mb-3">Recommended Niche</Badge>
              <h2 className="text-3xl font-bold mb-2">{plan.recommended_niche}</h2>
              <p className="text-muted-foreground">
                Transition from <span className="font-medium text-foreground">{plan.repositioning_strategy.from}</span> to{" "}
                <span className="font-medium text-foreground">{plan.repositioning_strategy.to}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Income Increase Potential</p>
              <div className="text-3xl font-bold text-green-500">
                +{formatCurrency(plan.income_increase_min)}-{formatCurrency(plan.income_increase_max)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">per month</p>
              <Badge variant="success" className="mt-2">{plan.timeline_months} month timeline</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repositioning strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Repositioning Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {plan.repositioning_strategy.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
            >
              <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-sm">{step}</p>
            </motion.div>
          ))}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
            <Calendar className="w-4 h-4" />
            Complete in {plan.repositioning_strategy.timeline_weeks} weeks
          </div>
        </CardContent>
      </Card>

      {/* Skill roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Skill Development Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {plan.skill_roadmap
            .sort((a, b) => b.priority - a.priority)
            .map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={skill.priority >= 8 ? "danger" : skill.priority >= 5 ? "warning" : "secondary"}>
                            Priority {skill.priority}/10
                          </Badge>
                          <span className="font-semibold">{skill.skill}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{skill.learning_resource}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {skill.time_to_learn_weeks} weeks
                          </span>
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <DollarSign className="w-3 h-3" />
                            +{formatCurrency(skill.income_unlock)}/mo unlock
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </CardContent>
      </Card>

      {/* Action steps timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Week-by-Week Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plan.action_steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center font-bold text-sm">
                    W{step.week}
                  </div>
                  {i < plan.action_steps.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{step.action}</p>
                      <p className="text-sm text-muted-foreground mt-1">{step.expected_outcome}</p>
                    </div>
                    {step.income_impact > 0 && (
                      <Badge variant="success" className="flex-shrink-0">
                        +{formatCurrency(step.income_impact)}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Target clients */}
      {targetClients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Target Clients & Platforms
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {targetClients.map((client, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <p className="font-semibold mb-1">{client.client_type}</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><span className="font-medium text-foreground">Platform:</span> {client.platform}</p>
                    <p><span className="font-medium text-foreground">Budget:</span> {client.avg_budget}</p>
                    <p><span className="font-medium text-foreground">Reach:</span> {client.how_to_reach}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Pricing strategy */}
      {pricingStrategy && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Pricing Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Rate</p>
                <p className="text-2xl font-bold">{pricingStrategy.current_rate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Recommended Rate</p>
                <p className="text-2xl font-bold text-green-500">{pricingStrategy.recommended_rate}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-1">Justification</p>
              <p className="text-sm text-muted-foreground">{pricingStrategy.justification}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Rate Increase Script</p>
              <div className="p-3 rounded-lg bg-muted text-sm font-mono">
                {pricingStrategy.raise_script}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center gap-4">
        <Button variant="outline" size="lg">
          Download Plan (PDF)
        </Button>
        <Button variant="gradient" size="lg" className="gap-2">
          Start Week 1
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
