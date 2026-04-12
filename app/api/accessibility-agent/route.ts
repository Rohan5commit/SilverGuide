import { accessibilityRequestSchema, accessibilityResponseSchema, normalizeAccessibilityResponse, SILVERGUIDE_BASE_RULES } from "@/lib/ai-contracts";
import { getFallbackAccessibilityVersion } from "@/lib/fallbacks";
import { combineNotice, parseAiRequestBody } from "@/lib/ai-guardrails";
import { chatWithRetryForJson, safeParseJson } from "@/lib/nim";

export async function POST(request: Request) {
  const bodyResult = await parseAiRequestBody(request, {
    routeKey: "accessibility-agent",
    maxBytes: 10_000,
  });

  if (!bodyResult.ok) {
    return bodyResult.response;
  }

  const requestResult = accessibilityRequestSchema.safeParse(bodyResult.data);

  if (!requestResult.success) {
    return Response.json(
      { error: requestResult.error.issues[0]?.message || "Lesson content is required." },
      { status: 400 }
    );
  }

  const { title, steps, largeText } = requestResult.data;
  const fallback = getFallbackAccessibilityVersion(title, steps, Boolean(largeText));

  const lessonText = steps.map((step, index) => `${index + 1}. ${step.title}: ${step.body}`).join("\n");

  const attempt = await chatWithRetryForJson(
    [
      {
        role: "system",
        content: `${SILVERGUIDE_BASE_RULES}
Rewrite lessons at a simpler reading level for seniors.
Return JSON with this exact shape:
{
  "title": string,
  "summary": string,
  "simplified_steps": string[],
  "reading_tips": string[]
}
Use the exact same number of simplified_steps as the lesson you receive.
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
      notice: attempt.reason === "timeout"
        ? "NVIDIA NIM took too long to respond, so a built-in simplified version was used."
        : "NVIDIA NIM is unavailable right now, so a built-in simplified version was used.",
    });
  }

  let parsedJson = safeParseJson<unknown>(attempt.content);
  let parsed = parsedJson ? accessibilityResponseSchema.safeParse(parsedJson) : null;

  if (!parsed?.success) {
    const retryResult = await attempt.retry();
    if (retryResult.ok) {
      parsedJson = safeParseJson<unknown>(retryResult.content);
      parsed = parsedJson ? accessibilityResponseSchema.safeParse(parsedJson) : null;
    }
  }

  if (!parsed?.success) {
    return Response.json({
      ...fallback,
      source: "fallback",
      notice: combineNotice("The AI response could not be validated, so a built-in simplified version was used."),
    });
  }

  return Response.json({
    ...normalizeAccessibilityResponse(parsed.data, steps),
    source: "nim",
  });
}
