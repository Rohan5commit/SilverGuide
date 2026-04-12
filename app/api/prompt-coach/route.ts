import { promptCoachRequestSchema, promptCoachResponseSchema, SILVERGUIDE_BASE_RULES } from "@/lib/ai-contracts";
import { combineNotice, parseAiRequestBody, redactSensitiveInfo } from "@/lib/ai-guardrails";
import { getFallbackPromptCoach } from "@/lib/fallbacks";
import { chatWithRetryForJson, safeParseJson } from "@/lib/nim";

export async function POST(request: Request) {
  const bodyResult = await parseAiRequestBody(request, {
    routeKey: "prompt-coach",
  });

  if (!bodyResult.ok) {
    return bodyResult.response;
  }

  const requestResult = promptCoachRequestSchema.safeParse(bodyResult.data);

  if (!requestResult.success) {
    return Response.json(
      { error: requestResult.error.issues[0]?.message || "Please enter a prompt first." },
      { status: 400 }
    );
  }

  const { prompt } = requestResult.data;
  const { sanitized, redactionCount } = redactSensitiveInfo(prompt);
  const fallback = getFallbackPromptCoach(prompt);

  const attempt = await chatWithRetryForJson(
    [
      {
        role: "system",
        content: `${SILVERGUIDE_BASE_RULES}
Emphasize privacy and verification.
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
        content: `Improve this AI prompt for clarity and safety:\n${sanitized}`,
      },
    ],
    "Return only valid JSON. Do not include markdown fences or extra commentary.",
    { temperature: 0.25, maxTokens: 450 }
  );

  if (!attempt.ok) {
    return Response.json({
      ...fallback,
      source: "fallback",
      notice: combineNotice(
        redactionCount > 0 ? "Private details were redacted before AI processing." : undefined,
        attempt.reason === "timeout"
          ? "NVIDIA NIM took too long to respond, so a built-in prompt coach was used."
          : "NVIDIA NIM is unavailable right now, so a built-in prompt coach was used."
      ),
    });
  }

  let parsedJson = safeParseJson<unknown>(attempt.content);
  let parsed = parsedJson ? promptCoachResponseSchema.safeParse(parsedJson) : null;

  if (!parsed?.success) {
    const retryResult = await attempt.retry();
    if (retryResult.ok) {
      parsedJson = safeParseJson<unknown>(retryResult.content);
      parsed = parsedJson ? promptCoachResponseSchema.safeParse(parsedJson) : null;
    }
  }

  if (!parsed?.success) {
    return Response.json({
      ...fallback,
      source: "fallback",
      notice: combineNotice(
        redactionCount > 0 ? "Private details were redacted before AI processing." : undefined,
        "The AI response could not be validated, so a built-in prompt coach was used."
      ),
    });
  }

  return Response.json({
    ...parsed.data,
    source: "nim",
    notice: redactionCount > 0 ? "Private details were redacted before AI processing." : undefined,
  });
}
