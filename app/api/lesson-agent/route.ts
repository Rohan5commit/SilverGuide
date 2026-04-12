import { getFallbackLesson } from "@/lib/fallbacks";
import { chatWithRetryForJson, safeParseJson } from "@/lib/nim";

const BASE_RULES = `
You are SilverGuide, an AI helper for older adults learning technology.
Use plain, respectful language.
Avoid jargon.
Never talk down to the user.
Prefer short sentences.
Be calm and confidence-building.
Never fabricate facts.
If uncertain, say so clearly.
`;

type LessonResponse = {
  title: string;
  intro: string;
  steps: string[];
  safety_tip: string;
  source?: "nim" | "fallback";
};

export async function POST(request: Request) {
  const { topic } = (await request.json()) as { topic?: string };

  if (!topic?.trim()) {
    return Response.json({ error: "Please enter a topic." }, { status: 400 });
  }

  const fallback = getFallbackLesson(topic);

  const attempt = await chatWithRetryForJson(
    [
      {
        role: "system",
        content: `${BASE_RULES}
Create short step-by-step lessons for seniors.
Return JSON with this exact shape:
{
  "title": string,
  "intro": string,
  "steps": string[],
  "safety_tip": string
}
Use 3 to 5 steps. Each step should be one short sentence.`,
      },
      {
        role: "user",
        content: `Create a short lesson about: ${topic}`,
      },
    ],
    "Return only valid JSON. Do not use markdown. Do not add commentary outside the JSON object.",
    { temperature: 0.2, maxTokens: 400 }
  );

  if (!attempt.ok) {
    return Response.json({
      ...fallback,
      source: "fallback",
      notice: "NVIDIA NIM is unavailable right now, so a built-in lesson was used.",
    });
  }

  let parsed = safeParseJson<LessonResponse>(attempt.content);

  if (!parsed) {
    const retryResult = await attempt.retry();
    if (retryResult.ok) {
      parsed = safeParseJson<LessonResponse>(retryResult.content);
    }
  }

  if (!parsed) {
    return Response.json({
      ...fallback,
      source: "fallback",
      notice: "The AI response could not be read, so a built-in lesson was used.",
    });
  }

  return Response.json({
    ...parsed,
    source: "nim",
  });
}
