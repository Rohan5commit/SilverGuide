import type { LessonStep } from "@/lib/data";

type ScamVerdict = "safe" | "suspicious" | "very_suspicious";

const highRiskTerms = [
  "urgent",
  "immediately",
  "verify",
  "gift card",
  "wire",
  "crypto",
  "password",
  "one-time code",
  "otp",
  "call now",
  "suspended",
  "locked",
  "click here",
  "remote access",
];

export function getFallbackLesson(topic: string) {
  const cleanedTopic = topic.trim() || "this topic";

  return {
    title: `Quick help: ${cleanedTopic}`,
    intro: `Here is a short, calm lesson about ${cleanedTopic.toLowerCase()}.`,
    steps: [
      "Start slowly and read each screen carefully before you tap or click anything.",
      "Look for trusted names, familiar website addresses, and clear reasons for the action.",
      "If a message or screen feels rushed or confusing, pause and verify another way.",
      "Ask a volunteer, family member, or staff member when something important does not feel clear.",
    ],
    safety_tip: "When you feel pressure, take a breath and verify from a trusted source.",
  };
}

export function getFallbackScamAnalysis(message: string) {
  const lower = message.toLowerCase();
  const matchedTerms = highRiskTerms.filter((term) => lower.includes(term));
  const directAsk =
    lower.includes("pay") ||
    lower.includes("send") ||
    lower.includes("bank") ||
    lower.includes("password") ||
    lower.includes("gift card") ||
    lower.includes("card details");

  const verdict: ScamVerdict =
    matchedTerms.length >= 3 || directAsk ? "very_suspicious" : matchedTerms.length >= 1 ? "suspicious" : "safe";

  const redFlags =
    verdict === "safe"
      ? [
          "No obvious urgent pressure language was detected.",
          "Still verify unexpected messages before acting on them.",
        ]
      : [
          "The message uses urgency or fear to push a quick decision.",
          "It appears to ask for money, account details, or another sensitive action.",
          "Unexpected requests should be checked through a trusted contact method.",
        ];

  return {
    verdict,
    red_flags: redFlags,
    simple_explanation:
      verdict === "safe"
        ? "This message does not show the strongest scam signals, but it is still smart to verify unexpected requests."
        : "This message shows common scam patterns. Slow down and verify it another way before you respond.",
    recommended_action:
      verdict === "safe"
        ? "If the message matters, verify it through a trusted app, website, or phone number."
        : "Do not click links or reply right away. Use a trusted phone number, app, or website to verify.",
  };
}

export function getFallbackPromptCoach(prompt: string) {
  const cleaned = prompt.trim();
  const privacyWarning =
    /password|social security|ssn|bank|account number|credit card|medical|insurance/i.test(cleaned)
      ? "Remove sensitive personal details before sending this to an AI tool."
      : "Keep private information out of the prompt when possible.";

  return {
    improved_prompt: cleaned
      ? `${cleaned.replace(/\s+/g, " ").trim()}\n\nPlease answer in plain language with short bullets. If important facts are uncertain, say so clearly.`
      : "Explain this topic in plain language with short bullets. Do not assume private details.",
    why_it_helps: [
      "It asks for a clear format that is easier to read.",
      "It reminds the AI to say when it is uncertain.",
      "It keeps the request focused on one main task.",
    ],
    privacy_warning: privacyWarning,
  };
}

export function getFallbackAccessibilityVersion(title: string, steps: LessonStep[], largeText: boolean) {
  return {
    title: largeText ? `${title} (large text mode)` : title,
    summary: "This version uses shorter sentences and simpler wording.",
    simplified_steps: steps.map((step) => `${step.title}: ${step.body}`),
    reading_tips: [
      "Read one sentence at a time.",
      "Pause after each step before moving on.",
      "Ask for help if any word feels unclear.",
    ],
  };
}
