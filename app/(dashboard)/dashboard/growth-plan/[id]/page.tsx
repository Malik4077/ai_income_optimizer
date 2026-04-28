import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GrowthPlanView } from "@/components/dashboard/growth-plan-view";

export default async function GrowthPlanPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  const supabase = createServerSupabaseClient();

  const { data: dbUser } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId!)
    .single();

  const { data: plan } = await supabase
    .from("growth_plans")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", dbUser?.id ?? "")
    .single();

  if (!plan) notFound();

  return <GrowthPlanView plan={plan} />;
}
