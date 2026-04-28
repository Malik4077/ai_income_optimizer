import { openai, AI_MODEL } from "./openai";
import { z } from "zod";

export const GrowthPlanSchema = z.object({
  recommended_niche: z.string(),
  niche_rationale: z.string(),
  repositioning_strategy: z.object({
    from: z.string(),
    to: z.string(),
    steps: z.array(z.string()),
    timeline_weeks: z.number(),
  }),
  skill_roadmap: z.array(
    z.object({
      skill: z.string(),
      priority: z.number(),
      learning_resource: z.string(),
      time_to_learn_weeks: z.number(),
      income_unlock: z.number(),
    })
  ),
  income_increase_min: z.number(),
  income_increase_max: z.number(),
  timeline_months: z.number(),
  action_steps: z.array(
    z.object({
      week: z.number(),
      action: z.string(),
      expected_outcome: z.string(),
      income_impact: z.number(),
    })
  ),
  target_clients: z.array(
    z.object({
      client_type: z.string(),
      platform: z.string(),
      avg_budget: z.string(),
      how_to_reach: z.string(),
    })
  ),
  pricing_strategy: z.object({
    current_rate: z.string(),
    recommended_rate: z.string(),
    justification: z.string(),
    raise_script: z.string(),
  }),
});

export type GrowthPlan = z.infer<typeof GrowthPlanSchema>;

export async function generateGrowthPlan(
  resumeText: string,
  analysisData: object,
  currentIncome?: number
): Promise<GrowthPlan> {
  const systemPrompt = `You are a top-tier income growth strategist who has helped thousands of professionals 2-5x their income.
You specialize in niche repositioning, premium positioning, and rapid income growth.
Be extremely specific. Include real platforms, real niches, real dollar amounts.
Return ONLY valid JSON.`;

  const userPrompt = `Based on this profile and income audit, create a detailed income growth plan.

PROFILE:
${resumeText}

INCOME AUDIT:
${JSON.stringify(analysisData, null, 2)}

Current Monthly Income: ${currentIncome ? `$${currentIncome}` : "Unknown"}

Return a JSON object with this EXACT structure:
{
  "recommended_niche": "specific niche (e.g., 'Shopify CRO Specialist for DTC brands')",
  "niche_rationale": "why this niche pays more and fits their skills",
  "repositioning_strategy": {
    "from": "current positioning",
    "to": "new premium positioning",
    "steps": ["step 1", "step 2", ...],
    "timeline_weeks": <number>
  },
  "skill_roadmap": [
    {
      "skill": "specific skill",
      "priority": <1-10>,
      "learning_resource": "specific course/resource name and URL",
      "time_to_learn_weeks": <number>,
      "income_unlock": <monthly USD unlocked>
    }
  ],
  "income_increase_min": <conservative monthly USD increase>,
  "income_increase_max": <optimistic monthly USD increase>,
  "timeline_months": <months to achieve>,
  "action_steps": [
    {
      "week": <week number>,
      "action": "specific action",
      "expected_outcome": "measurable outcome",
      "income_impact": <USD>
    }
  ],
  "target_clients": [
    {
      "client_type": "specific client description",
      "platform": "where to find them",
      "avg_budget": "budget range",
      "how_to_reach": "outreach strategy"
    }
  ],
  "pricing_strategy": {
    "current_rate": "current rate",
    "recommended_rate": "new rate",
    "justification": "why you deserve this rate",
    "raise_script": "exact script to use when raising rates"
  }
}`;

  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No response from AI");

  const parsed = JSON.parse(content);
  return GrowthPlanSchema.parse(parsed);
}
