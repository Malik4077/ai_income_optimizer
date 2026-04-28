import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { generateGrowthPlan } from "@/lib/ai/generate-plan";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Check plan
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", userId)
      .single();

    if (!sub || sub.plan === "free") {
      return NextResponse.json(
        { error: "Upgrade to Pro to generate growth plans." },
        { status: 403 }
      );
    }

    const { analysisId, currentIncome } = await req.json();

    // Fetch analysis
    const { data: analysis } = await supabase
      .from("income_analyses")
      .select("*, resume_uploads(raw_text)")
      .eq("id", analysisId)
      .eq("user_id", userId)
      .single();

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    const resumeText = (analysis.resume_uploads as { raw_text: string })?.raw_text ?? "";

    const plan = await generateGrowthPlan(
      resumeText,
      analysis.raw_ai_response,
      currentIncome
    );

    const { data: savedPlan } = await supabase
      .from("growth_plans")
      .insert({
        user_id: userId,
        analysis_id: analysisId,
        recommended_niche: plan.recommended_niche,
        repositioning_strategy: plan.repositioning_strategy,
        skill_roadmap: plan.skill_roadmap,
        income_increase_min: plan.income_increase_min,
        income_increase_max: plan.income_increase_max,
        timeline_months: plan.timeline_months,
        action_steps: plan.action_steps,
        raw_ai_response: plan,
      })
      .select()
      .single();

    return NextResponse.json({ planId: savedPlan?.id, plan });
  } catch (error) {
    console.error("generate-plan error:", error);
    return NextResponse.json({ error: "Plan generation failed." }, { status: 500 });
  }
}
