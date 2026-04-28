import { openai, AI_MODEL } from "./openai";

export interface ParsedResume {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  current_role: string;
  years_experience: number;
  skills: string[];
  work_history: Array<{
    company: string;
    role: string;
    duration: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  certifications: string[];
  summary: string;
}

export async function parseResumeText(text: string): Promise<ParsedResume> {
  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "Extract structured data from this resume. Return ONLY valid JSON.",
      },
      {
        role: "user",
        content: `Parse this resume into structured JSON:

${text}

Return:
{
  "full_name": "",
  "email": "",
  "phone": "",
  "location": "",
  "current_role": "",
  "years_experience": 0,
  "skills": [],
  "work_history": [{"company":"","role":"","duration":"","achievements":[]}],
  "education": [{"institution":"","degree":"","year":""}],
  "certifications": [],
  "summary": ""
}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Failed to parse resume");
  return JSON.parse(content) as ParsedResume;
}
