import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AnalysisResults } from "@/components/dashboard/analysis-results";

export default async function AnalysisPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  const supabase = createServerSupabaseClient();

  const { data: dbUser } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId!)
    .single();

  const { data: analysis } = await supabase
    .from("income_analyses")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", dbUser?.id ?? "")
    .single();

  if (!analysis) notFound();

  return <AnalysisResults analysis={analysis} />;
}
