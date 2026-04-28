import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { analyzeProfile } from "@/lib/ai/analyze-profile";
import { parseResumeText } from "@/lib/ai/parse-resume";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { uploadResumePDF } from "@/lib/supabase/storage";
import { extractTextFromPDF } from "@/lib/pdf-parser";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Check subscription limits
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, analyses_used")
      .eq("user_id", userId)
      .single();

    const plan = sub?.plan ?? "free";
    const analysesUsed = sub?.analyses_used ?? 0;

    if (plan === "free" && analysesUsed >= 1) {
      return NextResponse.json(
        { error: "Free tier limit reached. Upgrade to Pro for unlimited analyses." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const resumeText = formData.get("text") as string | null;
    const currentIncome = formData.get("currentIncome") as string | null;
    const employmentType = formData.get("employmentType") as string | null;

    let rawText = "";
    let fileUrl: string | undefined;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      rawText = await extractTextFromPDF(buffer);
      fileUrl = await uploadResumePDF(buffer, file.name, userId);
    } else if (resumeText) {
      rawText = resumeText;
    } else {
      return NextResponse.json(
        { error: "No resume provided" },
        { status: 400 }
      );
    }

    // Parse resume structure
    const parsedData = await parseResumeText(rawText);

    // Save resume upload
    const { data: upload } = await supabase
      .from("resume_uploads")
      .insert({
        user_id: userId,
        file_name: file?.name ?? "pasted-text",
        file_url: fileUrl,
        raw_text: rawText,
        parsed_data: parsedData,
      })
      .select()
      .single();

    // Run AI analysis
    const analysis = await analyzeProfile(
      rawText,
      currentIncome ? parseFloat(currentIncome) : undefined,
      employmentType ?? undefined
    );

    // Save analysis
    const { data: savedAnalysis } = await supabase
      .from("income_analyses")
      .insert({
        user_id: userId,
        resume_upload_id: upload?.id,
        skill_gaps: analysis.skill_gaps,
        income_limitations: analysis.income_limitations,
        positioning_flaws: analysis.positioning_flaws,
        missed_opportunities: analysis.missed_opportunities,
        overall_score: analysis.overall_score,
        current_income_estimate: analysis.current_income_estimate,
        potential_income_estimate: analysis.potential_income_estimate,
        raw_ai_response: analysis,
      })
      .select()
      .single();

    // Increment analyses used
    await supabase
      .from("subscriptions")
      .update({ analyses_used: analysesUsed + 1 })
      .eq("user_id", userId);

    return NextResponse.json({
      analysisId: savedAnalysis?.id,
      analysis,
      parsedData,
    });
  } catch (error) {
    console.error("analyze-profile error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
