import { lessonRequestSchema, lessonResponseSchema, SILVERGUIDE_BASE_RULES } from "@/lib/ai-contracts";
import { combineNotice, parseAiRequestBody, redactSensitiveInfo } from "@/lib/ai-guardrails";
import { getFallbackLesson } from "@/lib/fallbacks";
import { chatWithRetryForJson, safeParseJson } from "@/lib/nim";

export async function POST(request: Request) {
  const bodyResult = await parseAiRequestBody(request, {
    routeKey: "lesson-agent",
  });

  if (!bodyResult.ok) {
    return bodyResult.response;
  }

  const requestResult = lessonRequestSchema.safeParse(bodyResult.data);

  if (!requestResult.success) {
    return Response.json({ error: requestResult.error.issues[0]?.message || "Please enter a topic." }, { status: 400 });
  }

  const { topic } = requestResult.data;
  const { sanitized, redactionCount } = redactSensitiveInfo(topic);
  const fallback = getFallbackLesson(topic);

  const attempt = await chatWithRetryForJson(
    [
      {
        role: "system",
        content: `${SILVERGUIDE_BASE_RULES}
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
        content: `Create a short lesson about: ${sanitized}`,
      },
    ],
    "Return only valid JSON. Do not use markdown. Do not add commentary outside the JSON object.",
    { temperature: 0.2, maxTokens: 400 }
  );

  if (!attempt.ok) {
    return Response.json({
      ...fallback,
      source: "fallback",
      notice: combineNotice(
        redactionCount > 0 ? "Private details were redacted before AI processing." : undefined,
        attempt.reason === "timeout"
          ? "NVIDIA NIM took too long to respond, so a built-in lesson was used."
          : "NVIDIA NIM is unavailable right now, so a built-in lesson was used."
      ),
    });
  }

  let parsedJson = safeParseJson<unknown>(attempt.content);
  let parsed = parsedJson ? lessonResponseSchema.safeParse(parsedJson) : null;

  if (!parsed?.success) {
    const retryResult = await attempt.retry();
    if (retryResult.ok) {
      parsedJson = safeParseJson<unknown>(retryResult.content);
      parsed = parsedJson ? lessonResponseSchema.safeParse(parsedJson) : null;
    }
  }

  if (!parsed?.success) {
    return Response.json({
      ...fallback,
      source: "fallback",
      notice: combineNotice(
        redactionCount > 0 ? "Private details were redacted before AI processing." : undefined,
        "The AI response could not be validated, so a built-in lesson was used."
      ),
    });
  }

  return Response.json({
    ...parsed.data,
    source: "nim",
    notice: redactionCount > 0 ? "Private details were redacted before AI processing." : undefined,
  });
}
