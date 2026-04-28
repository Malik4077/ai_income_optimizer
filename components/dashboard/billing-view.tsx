"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PLANS } from "@/lib/stripe/client";
import { CheckCircle, CreditCard, Loader2, ExternalLink } from "lucide-react";

interface BillingViewProps {
  subscription: {
    plan: string;
    status: string;
    analyses_used: number;
    current_period_end: string | null;
    stripe_subscription_id: string | null;
  } | null;
}

export function BillingView({ subscription }: BillingViewProps) {
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingUpgrade, setLoadingUpgrade] = useState<string | null>(null);

  const plan = subscription?.plan ?? "free";
  const currentPlan = PLANS[plan as keyof typeof PLANS];

  const handlePortal = async () => {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleUpgrade = async (targetPlan: string) => {
    setLoadingUpgrade(targetPlan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoadingUpgrade(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your plan and payment details</p>
      </div>

      {/* Current plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Plan
            <Badge variant={plan === "free" ? "secondary" : "default"} className={plan !== "free" ? "gradient-bg text-white" : ""}>
              {currentPlan.name}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-2xl">${currentPlan.price}/month</p>
              {subscription?.current_period_end && (
                <p className="text-sm text-muted-foreground">
                  Renews {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>
            <Badge variant={subscription?.status === "active" ? "success" : "warning"}>
              {subscription?.status ?? "active"}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-2">
            {currentPlan.features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {f}
              </div>
            ))}
          </div>

          {plan === "free" && (
            <div className="p-3 rounded-lg bg-muted text-sm">
              <span className="font-medium">Analyses used: </span>
              {subscription?.analyses_used ?? 0} / 1
            </div>
          )}

          {subscription?.stripe_subscription_id && (
            <Button variant="outline" onClick={handlePortal} disabled={loadingPortal} className="gap-2">
              {loadingPortal ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              Manage Billing
              <ExternalLink className="w-3 h-3" />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Upgrade options */}
      {plan !== "premium" && (
        <Card>
          <CardHeader>
            <CardTitle>Upgrade Your Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan === "free" && (
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-semibold">Pro — $29/month</p>
                  <p className="text-sm text-muted-foreground">Unlimited analyses + growth plans</p>
                </div>
                <Button
                  variant="gradient"
                  onClick={() => handleUpgrade("pro")}
                  disabled={loadingUpgrade === "pro"}
                >
                  {loadingUpgrade === "pro" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upgrade"}
                </Button>
              </div>
            )}
            <div className="flex items-center justify-between p-4 rounded-lg border border-primary/30 bg-primary/5">
              <div>
                <p className="font-semibold">Premium — $79/month</p>
                <p className="text-sm text-muted-foreground">Everything + AI coach + earnings simulator</p>
              </div>
              <Button
                variant="gradient"
                onClick={() => handleUpgrade("premium")}
                disabled={loadingUpgrade === "premium"}
              >
                {loadingUpgrade === "premium" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upgrade"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Questions?{" "}
        <Link href="#" className="text-primary hover:underline">
          Contact support
        </Link>
      </p>
    </div>
  );
}
