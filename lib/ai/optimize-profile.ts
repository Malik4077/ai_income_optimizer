import { openai, AI_MODEL } from "./openai";
import { z } from "zod";

export const OptimizedContentSchema = z.object({
  resume_summary: z.string(),
  linkedin_bio: z.string(),
  linkedin_headline: z.string(),
  gig_descriptions: z.array(
    z.object({
      platform: z.string(),
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()),
    })
  ),
  pricing_strategy: z.object({
    hourly_rate: z.object({
      current: z.number(),
      recommended: z.number(),
      premium: z.number(),
    }),
    project_rates: z.array(
      z.object({
        project_type: z.string(),
        rate_range: z.string(),
        justification: z.string(),
      })
    ),
    market_comparison: z.string(),
    raise_justification: z.string(),
  }),
  keywords: z.array(z.string()),
  ats_score_improvement: z.string(),
});

export type OptimizedContent = z.infer<typeof OptimizedContentSchema>;

export async function optimizeProfile(
  resumeText: string,
  targetNiche: string,
  currentRate?: number
): Promise<OptimizedContent> {
  const systemPrompt = `You are a premium personal branding expert and copywriter who specializes in positioning professionals for maximum income.
You write high-converting profiles that attract premium clients and employers.
Every word must serve the goal of commanding higher rates and attracting better opportunities.
Return ONLY valid JSON.`;

  const userPrompt = `Rewrite and optimize this professional's profile for maximum income potential.

ORIGINAL PROFILE:
${resumeText}

TARGET NICHE: ${targetNiche}
CURRENT RATE: ${currentRate ? `$${currentRate}/hr` : "Unknown"}

Return a JSON object with this EXACT structure:
{
  "resume_summary": "3-4 sentence premium resume summary focused on value and results",
  "linkedin_bio": "compelling LinkedIn about section (300-500 chars)",
  "linkedin_headline": "powerful LinkedIn headline under 220 chars",
  "gig_descriptions": [
    {
      "platform": "Upwork|Fiverr|Toptal",
      "title": "gig title optimized for search",
      "description": "full gig description (200-300 words)",
      "keywords": ["keyword1", "keyword2", ...]
    }
  ],
  "pricing_strategy": {
    "hourly_rate": {
      "current": <current hourly>,
      "recommended": <recommended hourly>,
      "premium": <premium tier hourly>
    },
    "project_rates": [
      {
        "project_type": "type of project",
        "rate_range": "$X - $Y",
        "justification": "why this rate is justified"
      }
    ],
    "market_comparison": "how their rate compares to market",
    "raise_justification": "script for justifying rate increase to clients"
  },
  "keywords": ["top 15 keywords for their niche"],
  "ats_score_improvement": "specific changes to improve ATS score"
}`;

  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.5,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No response from AI");

  const parsed = JSON.parse(content);
  return OptimizedContentSchema.parse(parsed);
}
