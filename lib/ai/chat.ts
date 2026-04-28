import { openai, AI_MODEL } from "./openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const SYSTEM_PROMPT = `You are an elite income optimization coach and career strategist.
Your ONLY focus is helping professionals increase their income.
You have deep expertise in:
- Freelance pricing strategy
- Career repositioning
- Niche selection for maximum income
- Profile optimization for premium clients
- Negotiation tactics
- High-income skill development

Rules:
- Always give specific, actionable advice
- Always include dollar amounts when discussing income
- Never give vague or generic advice
- If asked about non-income topics, redirect to income optimization
- Be direct, confident, and results-focused
- Reference the user's profile data when available`;

export async function streamChatResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  userContext?: string
): Promise<ReadableStream> {
  const systemMessage: ChatCompletionMessageParam = {
    role: "system",
    content: userContext
      ? `${SYSTEM_PROMPT}\n\nUSER PROFILE CONTEXT:\n${userContext}`
      : SYSTEM_PROMPT,
  };

  const formattedMessages: ChatCompletionMessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const stream = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [systemMessage, ...formattedMessages],
    stream: true,
    temperature: 0.7,
    max_tokens: 1000,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) {
          controller.enqueue(new TextEncoder().encode(text));
        }
      }
      controller.close();
    },
  });
}
