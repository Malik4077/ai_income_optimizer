import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { optimizeProfile } from "@/lib/ai/optimize-profile";
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

    if (!sub || sub.plan === "free") {
      return NextResponse.json(
        { error: "Upgrade to Pro to optimize your profile." },
        { status: 403 }
      );
    }

    const { analysisId, targetNiche, currentRate } = await req.json();

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

    const optimized = await optimizeProfile(resumeText, targetNiche, currentRate);

    const { data: saved } = await supabase
      .from("optimized_content")
      .insert({
        user_id: userId,
        analysis_id: analysisId,
        resume_summary: optimized.resume_summary,
        linkedin_bio: optimized.linkedin_bio,
        gig_descriptions: optimized.gig_descriptions,
        pricing_strategy: optimized.pricing_strategy,
        keywords: optimized.keywords,
        raw_ai_response: optimized,
      })
      .select()
      .single();

    return NextResponse.json({ contentId: saved?.id, optimized });
  } catch (error) {
    console.error("optimize-profile error:", error);
    return NextResponse.json({ error: "Optimization failed." }, { status: 500 });
  }
}
