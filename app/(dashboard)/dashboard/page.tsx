import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DashboardOverview } from "@/components/dashboard/overview";

export default async function DashboardPage() {
  const { userId } = await auth();
  const supabase = createServerSupabaseClient();

  const { data: dbUser } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId!)
    .single();

  const [{ data: analyses }, { data: plans }, { data: sub }] = await Promise.all([
    supabase
      .from("income_analyses")
      .select("id, overall_score, current_income_estimate, potential_income_estimate, created_at")
      .eq("user_id", dbUser?.id ?? "")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("growth_plans")
      .select("id, recommended_niche, income_increase_min, income_increase_max, created_at")
      .eq("user_id", dbUser?.id ?? "")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("subscriptions")
      .select("plan, analyses_used")
      .eq("user_id", dbUser?.id ?? "")
      .single(),
  ]);

  return (
    <DashboardOverview
      analyses={analyses ?? []}
      plans={plans ?? []}
      subscription={sub}
    />
  );
}
