import type { LessonStep } from "@/lib/data";
import { getFallbackAccessibilityVersion } from "@/lib/fallbacks";
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

type AccessibilityResponse = {
  title: string;
  summary: string;
  simplified_steps: string[];
  reading_tips: string[];
  source?: "nim" | "fallback";
};

export async function POST(request: Request) {
  const { title, steps, largeText } = (await request.json()) as {
    title?: string;
    steps?: LessonStep[];
    largeText?: boolean;
  };

  if (!title?.trim() || !steps?.length) {
    return Response.json({ error: "Lesson content is required." }, { status: 400 });
  }

  const fallback = getFallbackAccessibilityVersion(title, steps, Boolean(largeText));

  const lessonText = steps.map((step, index) => `${index + 1}. ${step.title}: ${step.body}`).join("\n");

  const attempt = await chatWithRetryForJson(
    [
      {
        role: "system",
        content: `${BASE_RULES}
Rewrite lessons at a simpler reading level for seniors.
Return JSON with this exact shape:
{
  "title": string,
  "summary": string,
  "simplified_steps": string[],
  "reading_tips": string[]
}
Use 3 to 5 short simplified steps.
If largeText is true, use even shorter sentences.`,
      },
      {
        role: "user",
        content: `Title: ${title}
Large text mode: ${largeText ? "true" : "false"}
Lesson:
${lessonText}`,
      },
    ],
    "Return only valid JSON with title, summary, simplified_steps, and reading_tips.",
    { temperature: 0.2, maxTokens: 500 }
  );

  if (!attempt.ok) {
    return Response.json({
      ...fallback,
      source: "fallback",
      notice: "NVIDIA NIM is unavailable right now, so a built-in simplified version was used.",
    });
  }

  let parsed = safeParseJson<AccessibilityResponse>(attempt.content);

  if (!parsed) {
    const retryResult = await attempt.retry();
    if (retryResult.ok) {
      parsed = safeParseJson<AccessibilityResponse>(retryResult.content);
    }
  }

  if (!parsed) {
    return Response.json({
      ...fallback,
      source: "fallback",
      notice: "The AI response could not be read, so a built-in simplified version was used.",
    });
  }

  return Response.json({
    ...parsed,
    source: "nim",
  });
}
