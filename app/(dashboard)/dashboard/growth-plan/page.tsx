import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export default async function GrowthPlanListPage() {
  const { userId } = await auth();
  const supabase = createServerSupabaseClient();

  const { data: dbUser } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId!)
    .single();

  const { data: plans } = await supabase
    .from("growth_plans")
    .select("id, recommended_niche, income_increase_min, income_increase_max, timeline_months, created_at")
    .eq("user_id", dbUser?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Income Growth Plans</h1>
        <p className="text-muted-foreground">Your personalized income roadmaps</p>
      </div>

      {plans?.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No growth plans yet</h3>
            <p className="text-muted-foreground mb-4">Run an income analysis first, then generate your plan</p>
            <Link href="/dashboard/upload">
              <Button variant="gradient">Start Analysis</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {plans?.map((p) => (
            <Link key={p.id} href={`/dashboard/growth-plan/${p.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{p.recommended_niche}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString()} · {p.timeline_months} month plan
                    </p>
                  </div>
                  <Badge variant="success">
                    +{formatCurrency(p.income_increase_min)}-{formatCurrency(p.income_increase_max)}/mo
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
