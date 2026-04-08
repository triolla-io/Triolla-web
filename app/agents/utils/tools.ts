// ─── Fetch with timeout ───────────────────────────────────────────────────────

export async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<Response> {
  const { timeoutMs = 15_000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...fetchOptions, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ─── Tool primitives ──────────────────────────────────────────────────────────

export type ToolResult<T> =
  | { ok: true; data: T }
  | { ok: false; retryable: boolean; error: string; code?: string };

export type Tool<TInput, TOutput> = {
  name: string;
  maxAttempts: number;
  execute: (input: TInput) => Promise<ToolResult<TOutput>>;
};

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export async function runWithRetry<TInput, TOutput>(
  tool: Tool<TInput, TOutput>,
  input: TInput,
  logs: AgentLog[],
  onLog?: (entry: AgentLog) => void
): Promise<ToolResult<TOutput>> {
  for (let attempt = 1; attempt <= tool.maxAttempts; attempt++) {
    const result = await tool.execute(input);
    if (result.ok) return result;
    if (!result.retryable || attempt === tool.maxAttempts) return result;
    const backoff = Math.min(500 * 2 ** (attempt - 1), 8_000);
    const entry: AgentLog = { level: "warn", tool: tool.name, message: `attempt ${attempt}/${tool.maxAttempts} failed, retrying in ${backoff}ms — ${result.error}` };
    logs.push(entry);
    onLog?.(entry);
    await sleep(backoff);
  }
  return { ok: false, retryable: false, error: "max attempts exceeded" };
}

// ─── Logging ──────────────────────────────────────────────────────────────────

export type AgentLog = {
  level: "info" | "warn" | "error";
  tool?: string;
  message: string;
};

export function makeLogger(logs: AgentLog[], onLog?: (entry: AgentLog) => void) {
  function push(entry: AgentLog) {
    logs.push(entry);
    onLog?.(entry);
  }
  return {
    info:  (tool: string, message: string) => push({ level: "info",  tool, message }),
    warn:  (tool: string, message: string) => push({ level: "warn",  tool, message }),
    error: (tool: string, message: string) => push({ level: "error", tool, message }),
  };
}

// ─── Retryability ─────────────────────────────────────────────────────────────

// 429 + 5xx are transient — safe to retry. 4xx (except 429) are permanent.
export function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}
