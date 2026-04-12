import { z } from "zod";
import type { LessonStep } from "@/lib/data";

export const SILVERGUIDE_BASE_RULES = `
You are SilverGuide, an AI helper for older adults learning technology.
Use plain, respectful language.
Avoid jargon.
Never talk down to the user.
Prefer short sentences.
Be calm and confidence-building.
Never fabricate facts.
If uncertain, say so clearly.
`.trim();

const shortLine = z.string().trim().min(1).max(180);
const mediumLine = z.string().trim().min(1).max(320);

export const lessonRequestSchema = z.object({
  topic: z.string().trim().min(1, "Please enter a topic.").max(140, "Keep the topic under 140 characters."),
});

export const lessonResponseSchema = z.object({
  title: shortLine,
  intro: mediumLine,
  steps: z.array(mediumLine).min(3).max(5),
  safety_tip: mediumLine,
});

export type LessonResponse = z.infer<typeof lessonResponseSchema> & {
  source?: "nim" | "fallback";
  notice?: string;
};

export const scamRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Please paste a message first.")
    .max(1800, "Paste a shorter message so SilverGuide can review it clearly."),
});

export const scamResponseSchema = z.object({
  verdict: z.enum(["safe", "suspicious", "very_suspicious"]),
  red_flags: z.array(mediumLine).min(2).max(3),
  simple_explanation: mediumLine,
  recommended_action: mediumLine,
});

export type ScamResponse = z.infer<typeof scamResponseSchema> & {
  source?: "nim" | "fallback";
  notice?: string;
};

export const promptCoachRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Please enter a prompt first.")
    .max(1200, "Keep the prompt under 1,200 characters for this coach."),
});

export const promptCoachResponseSchema = z.object({
  improved_prompt: z.string().trim().min(1).max(900),
  why_it_helps: z.array(mediumLine).min(2).max(3),
  privacy_warning: mediumLine,
});

export type PromptCoachResponse = z.infer<typeof promptCoachResponseSchema> & {
  source?: "nim" | "fallback";
  notice?: string;
};

const lessonStepSchema = z.object({
  title: shortLine,
  body: mediumLine,
  tip: mediumLine,
});

export const accessibilityRequestSchema = z.object({
  title: z.string().trim().min(1, "Lesson content is required.").max(140),
  steps: z.array(lessonStepSchema).min(1, "Lesson content is required.").max(8, "This lesson is too large to simplify."),
  largeText: z.boolean().optional(),
});

export const accessibilityResponseSchema = z.object({
  title: shortLine,
  summary: mediumLine,
  simplified_steps: z.array(mediumLine).min(1).max(8),
  reading_tips: z.array(mediumLine).min(1).max(5),
});

export type AccessibilityResponse = z.infer<typeof accessibilityResponseSchema> & {
  source?: "nim" | "fallback";
  notice?: string;
};

function buildFallbackSimplifiedStep(step: LessonStep) {
  return `${step.title}: ${step.body}`;
}

export function normalizeAccessibilityResponse(
  response: z.infer<typeof accessibilityResponseSchema>,
  steps: LessonStep[]
) {
  const fallbackSteps = steps.map(buildFallbackSimplifiedStep);

  return {
    ...response,
    simplified_steps: fallbackSteps.map(
      (fallbackStep, index) => response.simplified_steps[index]?.trim() || fallbackStep
    ),
  };
}
