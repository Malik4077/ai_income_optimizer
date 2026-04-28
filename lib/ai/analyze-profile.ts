import { openai, AI_MODEL } from "./openai";
import { z } from "zod";

export const IncomeAnalysisSchema = z.object({
  overall_score: z.number().min(0).max(100),
  current_income_estimate: z.number(),
  potential_income_estimate: z.number(),
  skill_gaps: z.array(
    z.object({
      skill: z.string(),
      impact: z.enum(["high", "medium", "low"]),
      income_impact_usd: z.number(),
      how_to_fix: z.string(),
    })
  ),
  income_limitations: z.array(
    z.object({
      limitation: z.string(),
      severity: z.enum(["critical", "moderate", "minor"]),
      estimated_loss_monthly: z.number(),
      fix: z.string(),
    })
  ),
  positioning_flaws: z.array(
    z.object({
      flaw: z.string(),
      impact: z.string(),
      correction: z.string(),
    })
  ),
  missed_opportunities: z.array(
    z.object({
      opportunity: z.string(),
      potential_monthly_gain: z.number(),
      effort_level: z.enum(["low", "medium", "high"]),
      action: z.string(),
    })
  ),
  summary: z.string(),
});

export type IncomeAnalysis = z.infer<typeof IncomeAnalysisSchema>;

export async function analyzeProfile(
  resumeText: string,
  currentIncome?: number,
  employmentType?: string
): Promise<IncomeAnalysis> {
  const systemPrompt = `You are a brutally honest income optimization expert and career strategist. 
Your job is to analyze professional profiles and identify EXACTLY why someone is underpaid and what they must do to increase income.
Be specific, data-driven, and direct. Never give vague advice. Always include dollar amounts.
Return ONLY valid JSON matching the exact schema provided.`;

  const userPrompt = `Analyze this professional profile and return a detailed income audit.

PROFILE:
${resumeText}

Current Income: ${currentIncome ? `$${currentIncome}/month` : "Unknown"}
Employment Type: ${employmentType || "Unknown"}

Return a JSON object with this EXACT structure:
{
  "overall_score": <0-100 income optimization score>,
  "current_income_estimate": <estimated monthly USD>,
  "potential_income_estimate": <realistic potential monthly USD within 12 months>,
  "skill_gaps": [
    {
      "skill": "specific skill name",
      "impact": "high|medium|low",
      "income_impact_usd": <monthly USD impact if acquired>,
      "how_to_fix": "specific actionable step"
    }
  ],
  "income_limitations": [
    {
      "limitation": "specific limitation",
      "severity": "critical|moderate|minor",
      "estimated_loss_monthly": <USD lost per month>,
      "fix": "specific fix"
    }
  ],
  "positioning_flaws": [
    {
      "flaw": "specific positioning problem",
      "impact": "how this hurts income",
      "correction": "exact correction needed"
    }
  ],
  "missed_opportunities": [
    {
      "opportunity": "specific opportunity",
      "potential_monthly_gain": <USD>,
      "effort_level": "low|medium|high",
      "action": "exact action to take"
    }
  ],
  "summary": "2-3 sentence brutal honest summary of income situation"
}`;

  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No response from AI");

  const parsed = JSON.parse(content);
  return IncomeAnalysisSchema.parse(parsed);
}
