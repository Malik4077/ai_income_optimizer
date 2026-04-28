import { openai, AI_MODEL } from "./openai";
import { z } from "zod";

export const EarningsSimulationSchema = z.object({
  current_monthly: z.number(),
  potential_monthly: z.number(),
  annual_difference: z.number(),
  scenarios: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      monthly_income: z.number(),
      monthly_increase: z.number(),
      probability: z.enum(["high", "medium", "low"]),
      required_actions: z.array(z.string()),
      timeline_months: z.number(),
    })
  ),
  quick_wins: z.array(
    z.object({
      action: z.string(),
      income_impact: z.number(),
      time_to_implement: z.string(),
    })
  ),
  five_year_projection: z.object({
    without_changes: z.number(),
    with_optimization: z.number(),
    difference: z.number(),
  }),
});

export type EarningsSimulation = z.infer<typeof EarningsSimulationSchema>;

export async function simulateEarnings(
  resumeText: string,
  currentIncome: number,
  growthPlan: object
): Promise<EarningsSimulation> {
  const systemPrompt = `You are a financial modeling expert specializing in professional income projections.
Create realistic, data-backed earnings simulations based on market data.
Be specific with numbers. Base projections on real market rates.
Return ONLY valid JSON.`;

  const userPrompt = `Create a detailed earnings simulation for this professional.

PROFILE:
${resumeText}

CURRENT MONTHLY INCOME: $${currentIncome}

GROWTH PLAN:
${JSON.stringify(growthPlan, null, 2)}

Return a JSON object with this EXACT structure:
{
  "current_monthly": ${currentIncome},
  "potential_monthly": <realistic potential monthly>,
  "annual_difference": <yearly difference>,
  "scenarios": [
    {
      "name": "scenario name (e.g., 'Conservative Growth')",
      "description": "what this scenario involves",
      "monthly_income": <monthly USD>,
      "monthly_increase": <increase from current>,
      "probability": "high|medium|low",
      "required_actions": ["action 1", "action 2"],
      "timeline_months": <months to achieve>
    }
  ],
  "quick_wins": [
    {
      "action": "specific action",
      "income_impact": <monthly USD>,
      "time_to_implement": "e.g., '1 week'"
    }
  ],
  "five_year_projection": {
    "without_changes": <5yr total without changes>,
    "with_optimization": <5yr total with optimization>,
    "difference": <difference>
  }
}

Include 3 scenarios: Conservative, Moderate, Aggressive.`;

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
  return EarningsSimulationSchema.parse(parsed);
}
