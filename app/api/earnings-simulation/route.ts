import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { simulateEarnings } from "@/lib/ai/earnings-simulation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", userId)
      .single();

    if (!sub || sub.plan !== "premium") {
      return NextResponse.json(
        { error: "Earnings Simulator requires Premium plan." },
        { status: 403 }
      );
    }

    const { analysisId, planId, currentIncome } = await req.json();

    const { data: analysis } = await supabase
      .from("income_analyses")
      .select("*, resume_uploads(raw_text)")
      .eq("id", analysisId)
      .eq("user_id", userId)
      .single();

    const { data: plan } = await supabase
      .from("growth_plans")
      .select("raw_ai_response")
      .eq("id", planId)
      .eq("user_id", userId)
      .single();

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    const resumeText = (analysis.resume_uploads as { raw_text: string })?.raw_text ?? "";

    const simulation = await simulateEarnings(
      resumeText,
      currentIncome,
      plan?.raw_ai_response ?? {}
    );

    await supabase.from("earnings_reports").insert({
      user_id: userId,
      analysis_id: analysisId,
      current_monthly: simulation.current_monthly,
      potential_monthly: simulation.potential_monthly,
      improvement_scenarios: simulation.scenarios,
    });

    return NextResponse.json({ simulation });
  } catch (error) {
    console.error("earnings-simulation error:", error);
    return NextResponse.json({ error: "Simulation failed." }, { status: 500 });
  }
}
