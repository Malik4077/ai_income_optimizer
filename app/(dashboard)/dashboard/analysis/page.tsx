import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Plus, BarChart3 } from "lucide-react";

export default async function AnalysisListPage() {
  const { userId } = await auth();
  const supabase = createServerSupabaseClient();

  const { data: dbUser } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId!)
    .single();

  const { data: analyses } = await supabase
    .from("income_analyses")
    .select("id, overall_score, current_income_estimate, potential_income_estimate, created_at")
    .eq("user_id", dbUser?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Income Analyses</h1>
          <p className="text-muted-foreground">All your income audit results</p>
        </div>
        <Link href="/dashboard/upload">
          <Button variant="gradient" className="gap-2">
            <Plus className="w-4 h-4" />
            New Analysis
          </Button>
        </Link>
      </div>

      {analyses?.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No analyses yet</h3>
            <p className="text-muted-foreground mb-4">Upload your resume to get started</p>
            <Link href="/dashboard/upload">
              <Button variant="gradient">Start Analysis</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {analyses?.map((a) => (
            <Link key={a.id} href={`/dashboard/analysis/${a.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Income Audit</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Potential</p>
                      <p className="font-semibold text-green-500">
                        {formatCurrency(a.potential_income_estimate)}/mo
                      </p>
                    </div>
                    <Badge
                      variant={
                        a.overall_score >= 70 ? "success" : a.overall_score >= 40 ? "warning" : "danger"
                      }
                    >
                      {a.overall_score}/100
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
