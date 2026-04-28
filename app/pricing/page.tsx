"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, TrendingUp, Zap, ArrowLeft, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Try it out",
    badge: null,
    features: [
      "1 income analysis",
      "Basic skill gap report",
      "Income score",
      "Positioning audit",
    ],
    notIncluded: [
      "Growth plan generation",
      "Profile optimizer",
      "Earnings simulator",
      "AI chat coach",
    ],
    cta: "Get Started Free",
    variant: "outline" as const,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    description: "For serious income growth",
    badge: "Most Popular",
    features: [
      "Unlimited income analyses",
      "Full growth plan generator",
      "Profile optimizer (resume, LinkedIn, gigs)",
      "Pricing strategy engine",
      "Job & client targeting",
      "Priority support",
    ],
    notIncluded: ["Earnings simulator", "AI chat coach"],
    cta: "Start Pro",
    variant: "gradient" as const,
  },
  {
    id: "premium",
    name: "Premium",
    price: 79,
    description: "Maximum income acceleration",
    badge: "Best Value",
    features: [
      "Everything in Pro",
      "AI income coach (unlimited chat)",
      "Earnings simulator",
      "5-year income projections",
      "Weekly income reports",
      "Priority support",
    ],
    notIncluded: [],
    cta: "Start Premium",
    variant: "gradient" as const,
  },
];

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") {
      window.location.href = isSignedIn ? "/dashboard" : "/sign-up";
      return;
    }

    if (!isSignedIn) {
      window.location.href = "/sign-up";
      return;
    }

    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b bg-background/80 backdrop-blur-md p-4">
        <div className="container flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-bg flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold">AI Income Optimizer</span>
          </div>
        </div>
      </nav>

      <div className="container max-w-6xl mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1 inline" />
            Simple Pricing
          </Badge>
          <h1 className="text-5xl font-bold mb-4">
            Invest in your <span className="gradient-text">income growth</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Most users see a 2-4x return on their subscription within the first month.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={plan.id === "pro" ? "md:-mt-4" : ""}
            >
              <Card className={`h-full relative ${plan.id === "pro" ? "border-primary shadow-lg shadow-primary/20" : ""}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="default" className="gradient-bg text-white px-4">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">${plan.price}</span>
                    {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant={plan.variant}
                    size="lg"
                    className="w-full"
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      plan.cta
                    )}
                  </Button>

                  <Separator />

                  <div className="space-y-2">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-4 h-4 flex-shrink-0 mt-0.5 flex items-center justify-center">
                          <div className="w-3 h-0.5 bg-muted-foreground/40 rounded" />
                        </div>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm">
            All plans include a 7-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
