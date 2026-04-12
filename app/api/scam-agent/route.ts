import { getFallbackScamAnalysis } from "@/lib/fallbacks";
import { chatWithRetryForJson, safeParseJson } from "@/lib/nim";

const BASE_RULES = `
You are SilverGuide, an AI helper for older adults learning technology safety.
Use plain, respectful language.
Avoid jargon.
Never talk down to the user.
Prefer short sentences.
Be calm and confidence-building.
Never fabricate facts.
If uncertain, say so clearly.
For scam advice, be conservative.
`;

type ScamResponse = {
  verdict: "safe" | "suspicious" | "very_suspicious";
  red_flags: string[];
  simple_explanation: string;
  recommended_action: string;
  source?: "nim" | "fallback";
};

export async function POST(request: Request) {
  const { message } = (await request.json()) as { message?: string };

  if (!message?.trim()) {
    return Response.json({ error: "Please paste a message first." }, { status: 400 });
  }

  const fallback = getFallbackScamAnalysis(message);

  const attempt = await chatWithRetryForJson(
    [
      {
        role: "system",
        content: `${BASE_RULES}
Analyze whether a message may be a scam.
Return JSON with this exact shape:
{
  "verdict": "safe" | "suspicious" | "very_suspicious",
  "red_flags": string[],
  "simple_explanation": string,
  "recommended_action": string
}
Use 2 or 3 short red flags. Be conservative.`,
      },
      {
        role: "user",
        content: `Review this message for scam risk:\n${message}`,
      },
    ],
    "Return only valid JSON with verdict, red_flags, simple_explanation, and recommended_action.",
    { temperature: 0.1, maxTokens: 450 }
  );

  if (!attempt.ok) {
    return Response.json({
      ...fallback,
      source: "fallback",
      notice: "NVIDIA NIM is unavailable right now, so a built-in safety check was used.",
    });
  }

  let parsed = safeParseJson<ScamResponse>(attempt.content);

  if (!parsed) {
    const retryResult = await attempt.retry();
    if (retryResult.ok) {
      parsed = safeParseJson<ScamResponse>(retryResult.content);
    }
  }

  if (!parsed) {
    return Response.json({
      ...fallback,
      source: "fallback",
      notice: "The AI response could not be read, so a built-in safety check was used.",
    });
  }

  return Response.json({
    ...parsed,
    source: "nim",
  });
}
