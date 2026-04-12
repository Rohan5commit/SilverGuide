type GuardrailOptions = {
  routeKey: string;
  limit?: number;
  maxBytes?: number;
  windowMs?: number;
};

type ParsedBodyResult<T> = { ok: true; data: T } | { ok: false; response: Response };

const DEFAULT_MAX_BYTES = 8_000;
const DEFAULT_RATE_LIMIT = 12;
const DEFAULT_WINDOW_MS = 5 * 60_000;
const bodyEncoder = new TextEncoder();
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfIp = request.headers.get("cf-connecting-ip");
  const userAgent = request.headers.get("user-agent") || "unknown-agent";

  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || cfIp;

  return ip ? `${ip}:${userAgent}` : userAgent;
}

function hitRateLimit(request: Request, options: Required<Pick<GuardrailOptions, "limit" | "routeKey" | "windowMs">>) {
  const now = Date.now();
  const clientId = getClientIdentifier(request);
  const bucketKey = `${options.routeKey}:${clientId}`;
  const existing = requestBuckets.get(bucketKey);

  if (!existing || existing.resetAt <= now) {
    requestBuckets.set(bucketKey, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return null;
  }

  if (existing.count >= options.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

    return Response.json(
      {
        error: "Please wait a moment before asking the AI again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
        },
      }
    );
  }

  existing.count += 1;

  if (requestBuckets.size > 1_000) {
    for (const [key, value] of requestBuckets) {
      if (value.resetAt <= now) {
        requestBuckets.delete(key);
      }
    }
  }

  return null;
}

export async function parseAiRequestBody<T>(
  request: Request,
  options: GuardrailOptions
): Promise<ParsedBodyResult<T>> {
  const rateLimitResponse = hitRateLimit(request, {
    routeKey: options.routeKey,
    limit: options.limit ?? DEFAULT_RATE_LIMIT,
    windowMs: options.windowMs ?? DEFAULT_WINDOW_MS,
  });

  if (rateLimitResponse) {
    return { ok: false, response: rateLimitResponse };
  }

  const rawBody = await request.text();

  if (!rawBody.trim()) {
    return {
      ok: false,
      response: Response.json({ error: "A request body is required." }, { status: 400 }),
    };
  }

  if (bodyEncoder.encode(rawBody).length > (options.maxBytes ?? DEFAULT_MAX_BYTES)) {
    return {
      ok: false,
      response: Response.json(
        { error: "That message is too long for SilverGuide. Paste a shorter section." },
        { status: 413 }
      ),
    };
  }

  try {
    return {
      ok: true,
      data: JSON.parse(rawBody) as T,
    };
  } catch {
    return {
      ok: false,
      response: Response.json({ error: "The request could not be read." }, { status: 400 }),
    };
  }
}

export function combineNotice(...parts: Array<string | null | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function redactSensitiveInfo(value: string) {
  const replacements: Array<[RegExp, (...args: string[]) => string]> = [
    [/\b\d{3}-?\d{2}-?\d{4}\b/g, () => "[redacted SSN]"],
    [/\b(?:\d[ -]?){13,16}\b/g, () => "[redacted card or account number]"],
    [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, () => "[redacted email]"],
    [/\b(?:\+?\d{1,2}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?){2}\d{4}\b/g, () => "[redacted phone number]"],
    [/\b((?:otp|one-time code|verification code|passcode)\s*(?:is|:)?\s*)\d{4,8}\b/gi, (_match, prefix) => `${prefix}[redacted code]`],
    [/\b((?:password|pin)\s*(?:is|:)?\s*)\S+\b/gi, (_match, prefix) => `${prefix}[redacted secret]`],
  ];

  let sanitized = value;
  let redactionCount = 0;

  for (const [pattern, replacement] of replacements) {
    sanitized = sanitized.replace(pattern, (...args) => {
      redactionCount += 1;
      return replacement(...(args as string[]));
    });
  }

  return {
    sanitized,
    redactionCount,
  };
}
