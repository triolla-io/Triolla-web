// ─── Timeouts ─────────────────────────────────────────────────────────────────

export const POLL_INTERVAL_MS        =  10 * 1_000;  // interval between Coolify status checks
export const POLL_TIMEOUT_MS         =  10 * 60 * 1_000;  // max time to wait for deployment
export const FETCH_TIMEOUT_MS        =  15 * 1_000;  // default HTTP request timeout
export const SITE_VERIFY_TIMEOUT_MS  =  10 * 1_000;  // timeout for post-deploy site check

// ─── Store TTLs ───────────────────────────────────────────────────────────────

// Must be > POLL_TIMEOUT_MS + all other phases (~2 min) to ensure the store
// entry outlives the agent run if something goes wrong.
export const RUNNING_TTL_MS = 25 * 60 * 1_000;  // force-evict stuck "running" entries
export const DONE_TTL_MS    = 15 * 60 * 1_000;  // keep "done" entries after completion

// ─── Content ──────────────────────────────────────────────────────────────────

// Keys that are always system-generated — skip validation and diff
export const CONTENT_SKIP_KEYS = new Set(["version", "updatedAt"]);

// ─── Client ───────────────────────────────────────────────────────────────────

export const CLIENT_STREAM_TIMEOUT_MS = (POLL_TIMEOUT_MS + 5 * 60 * 1_000);  // client gives up after server max + buffer
