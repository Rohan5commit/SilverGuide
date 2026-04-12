const DEFAULT_MODEL = process.env.NVIDIA_NIM_MODEL || "meta/llama-3.1-8b-instruct";
const NIM_CHAT_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const NIM_TIMEOUT_MS = 12_000;

export type NimMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatOptions = {
  messages: NimMessage[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
};

export type NimResult =
  | { ok: true; content: string; model: string }
  | { ok: false; reason: string; status?: number };

export async function chatWithNim({
  messages,
  temperature = 0.2,
  maxTokens = 500,
  model = DEFAULT_MODEL,
}: ChatOptions): Promise<NimResult> {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;

  if (!apiKey) {
    return { ok: false, reason: "missing_api_key" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), NIM_TIMEOUT_MS);

  try {
    const response = await fetch(NIM_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return { ok: false, reason: "nim_http_error", status: response.status };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return { ok: false, reason: "empty_response" };
    }

    return { ok: true, content, model };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, reason: "timeout" };
    }

    return { ok: false, reason: "network_error" };
  } finally {
    clearTimeout(timeout);
  }
}

export async function chatWithRetryForJson(
  baseMessages: NimMessage[],
  retryPrompt: string,
  options?: Omit<ChatOptions, "messages">
) {
  const firstAttempt = await chatWithNim({
    messages: baseMessages,
    ...options,
  });

  if (!firstAttempt.ok) {
    return firstAttempt;
  }

  return {
    ...firstAttempt,
    retry: async () =>
      chatWithNim({
        messages: [
          ...baseMessages,
          {
            role: "user",
            content: retryPrompt,
          },
        ],
        ...options,
      }),
  };
}

export function safeParseJson<T>(content: string): T | null {
  const trimmed = content.trim();

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]) as T;
    } catch {
      return null;
    }
  }
}
