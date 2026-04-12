import { scamRequestSchema, scamResponseSchema, SILVERGUIDE_BASE_RULES } from "@/lib/ai-contracts";
import { combineNotice, parseAiRequestBody, redactSensitiveInfo } from "@/lib/ai-guardrails";
import { getFallbackScamAnalysis } from "@/lib/fallbacks";
import { chatWithRetryForJson, safeParseJson } from "@/lib/nim";

export async function POST(request: Request) {
  const bodyResult = await parseAiRequestBody(request, {
    routeKey: "scam-agent",
  });

  if (!bodyResult.ok) {
    return bodyResult.response;
  }

  const requestResult = scamRequestSchema.safeParse(bodyResult.data);

  if (!requestResult.success) {
    return Response.json(
      { error: requestResult.error.issues[0]?.message || "Please paste a message first." },
      { status: 400 }
    );
  }

  const { message } = requestResult.data;
  const { sanitized, redactionCount } = redactSensitiveInfo(message);
  const fallback = getFallbackScamAnalysis(message);

  const attempt = await chatWithRetryForJson(
    [
      {
        role: "system",
        content: `${SILVERGUIDE_BASE_RULES}
For scam advice, be conservative.
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
        content: `Review this message for scam risk:\n${sanitized}`,
      },
    ],
    "Return only valid JSON with verdict, red_flags, simple_explanation, and recommended_action.",
    { temperature: 0.1, maxTokens: 450 }
  );

  if (!attempt.ok) {
    return Response.json({
      ...fallback,
      source: "fallback",
      notice: combineNotice(
        redactionCount > 0 ? "Private details were redacted before AI processing." : undefined,
        attempt.reason === "timeout"
          ? "NVIDIA NIM took too long to respond, so a built-in safety check was used."
          : "NVIDIA NIM is unavailable right now, so a built-in safety check was used."
      ),
    });
  }

  let parsedJson = safeParseJson<unknown>(attempt.content);
  let parsed = parsedJson ? scamResponseSchema.safeParse(parsedJson) : null;

  if (!parsed?.success) {
    const retryResult = await attempt.retry();
    if (retryResult.ok) {
      parsedJson = safeParseJson<unknown>(retryResult.content);
      parsed = parsedJson ? scamResponseSchema.safeParse(parsedJson) : null;
    }
  }

  if (!parsed?.success) {
    return Response.json({
      ...fallback,
      source: "fallback",
      notice: combineNotice(
        redactionCount > 0 ? "Private details were redacted before AI processing." : undefined,
        "The AI response could not be validated, so a built-in safety check was used."
      ),
    });
  }

  return Response.json({
    ...parsed.data,
    source: "nim",
    notice: redactionCount > 0 ? "Private details were redacted before AI processing." : undefined,
  });
}
