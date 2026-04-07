// Dangerous patterns that should never appear in user-editable content.
// Checked recursively against every string value in the content file.
const DANGEROUS_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /<script[\s>]/i,          label: "<script> tag" },
  { pattern: /<\/script>/i,            label: "</script> tag" },
  { pattern: /javascript\s*:/i,        label: "javascript: URL" },
  { pattern: /vbscript\s*:/i,          label: "vbscript: URL" },
  { pattern: /data\s*:\s*text\/html/i, label: "data:text/html URL" },
  { pattern: /<iframe[\s>]/i,          label: "<iframe> tag" },
  { pattern: /<object[\s>]/i,          label: "<object> tag" },
  { pattern: /<embed[\s>]/i,           label: "<embed> tag" },
  { pattern: /on\w+\s*=/i,             label: "inline event handler (on*=)" },
  { pattern: /__proto__/,              label: "__proto__ (prototype pollution)" },
  { pattern: /constructor\s*\[/,       label: "constructor[] (prototype pollution)" },
  { pattern: /prototype\s*\[/,         label: "prototype[] (prototype pollution)" },
];

// Keys whose values are always system-generated — skip validation
const SKIP_KEYS = new Set(["version", "updatedAt"]);

export class ContentSecurityError extends Error {
  constructor(public readonly violations: string[]) {
    super(`Content failed security check:\n${violations.map((v) => `  - ${v}`).join("\n")}`);
    this.name = "ContentSecurityError";
  }
}

import type { Tool } from "./tools";

export const validateContentTool: Tool<unknown, void> = {
  name: "validate_content",
  maxAttempts: 1,
  async execute(obj) {
    try {
      validateContent(obj);
      return { ok: true, data: undefined };
    } catch (e) {
      return { ok: false, retryable: false, error: e instanceof Error ? e.message : String(e), code: "security_violation" };
    }
  },
};

export function validateContent(obj: unknown, path = "root"): void {
  const violations: string[] = [];
  collectViolations(obj, path, violations);
  if (violations.length > 0) throw new ContentSecurityError(violations);
}

function collectViolations(value: unknown, path: string, violations: string[]): void {
  if (typeof value === "string") {
    for (const { pattern, label } of DANGEROUS_PATTERNS) {
      if (pattern.test(value)) {
        violations.push(`${label} at ${path}`);
      }
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, i) => collectViolations(item, `${path}[${i}]`, violations));
    return;
  }

  if (value !== null && typeof value === "object") {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (SKIP_KEYS.has(key)) continue;
      collectViolations(child, `${path}.${key}`, violations);
    }
  }
}
