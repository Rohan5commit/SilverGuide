import { getFallbackPromptCoach } from "@/lib/fallbacks";
import { chatWithRetryForJson, safeParseJson } from "@/lib/nim";

const BASE_RULES = `
You are SilverGuide, an AI helper for older adults learning safe AI habits.
Use plain, respectful language.
Avoid jargon.
Never talk down to the user.
Prefer short sentences.
Be calm and confidence-building.
Never fabricate facts.
If uncertain, say so clearly.
Emphasize privacy and verification.
`;

type PromptCoachResponse = {
  improved_prompt: string;
  why_it_helps: string[];
  privacy_warning: string;
  source?: "nim" | "fallback";
};

export async function POST(request: Request) {
  const { prompt } = (await request.json()) as { prompt?: string };

  if (!prompt?.trim()) {
    return Response.json({ error: "Please enter a prompt first." }, { status: 400 });
  }

  const fallback = getFallbackPromptCoach(prompt);

  const attempt = await chatWithRetryForJson(
    [
      {
        role: "system",
        content: `${BASE_RULES}
Improve prompts for seniors using AI tools.
Return JSON with this exact shape:
{
  "improved_prompt": string,
  "why_it_helps": string[],
  "privacy_warning": string
}
Use 2 or 3 short bullet-style reasons in why_it_helps.`,
      },
      {
        role: "user",
        content: `Improve this AI prompt for clarity and safety:\n${prompt}`,
      },
    ],
    "Return only valid JSON. Do not include markdown fences or extra commentary.",
    { temperature: 0.25, maxTokens: 450 }
  );

  if (!attempt.ok) {
    return Response.json({
      ...fallback,
      source: "fallback",
      notice: "NVIDIA NIM is unavailable right now, so a built-in prompt coach was used.",
    });
  }

  let parsed = safeParseJson<PromptCoachResponse>(attempt.content);

  if (!parsed) {
    const retryResult = await attempt.retry();
    if (retryResult.ok) {
      parsed = safeParseJson<PromptCoachResponse>(retryResult.content);
    }
  }

  if (!parsed) {
    return Response.json({
      ...fallback,
      source: "fallback",
      notice: "The AI response could not be read, so a built-in prompt coach was used.",
    });
  }

  return Response.json({
    ...parsed,
    source: "nim",
  });
}
