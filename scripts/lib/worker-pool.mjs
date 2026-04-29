/**
 * Fork-based worker pool for Lighthouse audits.
 *
 * Spawns N audit-worker.mjs child processes, each owning one Chrome on
 * a unique remote-debugging port (BASE_PORT + workerIndex). Drains a
 * shared queue, persists state after every audit, and emits an
 * "[X/total]" heartbeat so a hung page is visible immediately.
 *
 * Public API:
 *   runPool({ targets, total, host, workers, lhrDir, stateDir, onResult, log })
 */

import { fork } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { recordAudit } from "./state.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const WORKER_SCRIPT = join(__dirname, "audit-worker.mjs");

const BASE_DEBUG_PORT = Number(process.env.LH_DEBUG_BASE_PORT ?? 9222);
const HEARTBEAT_INTERVAL_MS = 30_000; // log even when nothing finished — catches hangs

function fmtScore(s) {
  return s == null ? " — " : String(Math.round(s * 100)).padStart(3);
}

function fmtDuration(ms) {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

/**
 * @param {object} opts
 * @param {Array} opts.targets   - targets to audit this run (already state-filtered)
 * @param {number} opts.total    - full matrix size, used as denominator in heartbeat
 * @param {string} opts.host     - e.g. "http://localhost:3030"
 * @param {number} opts.workers  - number of parallel processes
 * @param {string} opts.lhrDir   - where workers write LHR JSON
 * @param {string} opts.stateDir - where the pool persists per-target state
 * @param {(r) => void} [opts.onResult] - optional callback per result
 * @param {(s) => void} [opts.log]      - optional logger (defaults to console.log)
 */
export async function runPool({
  targets,
  total,
  host,
  workers,
  lhrDir,
  stateDir,
  onResult,
  log = (s) => console.log(s),
}) {
  if (targets.length === 0) {
    log(`Nothing to audit — queue is empty.`);
    return [];
  }

  const queue = [...targets];
  const results = [];
  const completedAtStart = total - targets.length; // pages already converged
  let completed = completedAtStart;
  let inflight = 0;
  let nextMsgId = 1;
  const startedAt = Date.now();

  // Spawn workers
  const procs = [];
  await Promise.all(
    Array.from({ length: workers }, (_, i) => {
      return new Promise((resolve, reject) => {
        const port = BASE_DEBUG_PORT + i;
        const child = fork(WORKER_SCRIPT, [String(port), host, lhrDir], {
          stdio: ["ignore", "inherit", "inherit", "ipc"],
        });
        child.workerIndex = i;
        child.debugPort = port;
        child.pending = new Map(); // id -> { resolve, reject, target }

        child.on("message", (msg) => {
          if (msg?.type === "ready") {
            log(`worker #${i} ready (pid ${msg.pid}, chrome :${msg.port})`);
            resolve();
          } else if (msg?.type === "result") {
            const handler = child.pending.get(msg.id);
            if (handler) {
              child.pending.delete(msg.id);
              handler.resolve(msg);
            }
          }
        });
        child.on("exit", (code, signal) => {
          if (code !== 0 && code !== null) {
            log(`worker #${i} exited unexpectedly (code=${code} signal=${signal})`);
          }
          // Reject any orphaned in-flight requests so the pool doesn't hang.
          for (const [, handler] of child.pending) {
            handler.reject(new Error(`worker #${i} exited (code=${code})`));
          }
          child.pending.clear();
        });
        child.on("error", (err) => {
          log(`worker #${i} errored: ${err.message}`);
          reject(err);
        });
        procs.push(child);
      });
    }),
  );

  // Heartbeat — fires even when no audit completes, so a hung page is obvious.
  const heartbeat = setInterval(() => {
    const elapsed = (Date.now() - startedAt) / 1000;
    const rate = (completed - completedAtStart) / Math.max(elapsed, 1);
    const remaining = total - completed;
    const eta = rate > 0 ? `${Math.round(remaining / rate)}s` : "—";
    log(
      `Progress: [${completed}/${total}] inflight=${inflight} queue=${queue.length} ` +
        `rate=${rate.toFixed(2)}/s eta=${eta}`,
    );
  }, HEARTBEAT_INTERVAL_MS);

  function dispatch(child) {
    if (queue.length === 0) return null;
    const target = queue.shift();
    const id = nextMsgId++;
    inflight++;
    return new Promise((resolve, reject) => {
      child.pending.set(id, { resolve, reject, target });
      child.send({ id, type: "audit", target });
    })
      .then((msg) => {
        inflight--;
        completed++;
        const persisted = recordAudit(stateDir, target, msg.scores, msg.error, msg.retries ?? 0);
        const r = { ...msg, persisted };
        results.push(r);
        const s = msg.scores ?? {};
        const retryTag = msg.retries ? ` retry×${msg.retries}(${msg.retryReason})` : "";
        log(
          `[${completed}/${total}] ${target.formFactor.padEnd(7)} ${target.locale} ${target.path} ` +
            `perf=${fmtScore(s.performance)} seo=${fmtScore(s.seo)} a11y=${fmtScore(s.accessibility)} ` +
            `bp=${fmtScore(s["best-practices"])} (${fmtDuration(msg.durationMs)})` +
            retryTag +
            (msg.error ? ` ERROR: ${msg.error}` : "") +
            ` [→ ${persisted.status}]`,
        );
        onResult?.(r);
      })
      .catch((err) => {
        inflight--;
        completed++;
        recordAudit(stateDir, target, null, err.message);
        log(`[${completed}/${total}] FAILED ${target.path}: ${err.message}`);
      });
  }

  // Drain loop: each worker keeps a single audit in-flight at a time.
  // When it completes, immediately dispatch the next item from the queue.
  async function drainWorker(child) {
    while (queue.length > 0) {
      const p = dispatch(child);
      if (!p) return;
      await p;
    }
  }

  await Promise.all(procs.map((c) => drainWorker(c)));

  clearInterval(heartbeat);

  // Graceful shutdown
  await Promise.all(
    procs.map(
      (c) =>
        new Promise((resolve) => {
          c.once("exit", resolve);
          try {
            c.send({ id: nextMsgId++, type: "shutdown" });
          } catch {
            c.kill("SIGTERM");
          }
          // Hard timeout if the child doesn't exit cleanly
          setTimeout(() => {
            try {
              c.kill("SIGKILL");
            } catch {}
            resolve();
          }, 5000).unref();
        }),
    ),
  );

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  log(`Pool drained: ${results.length} audits in ${elapsed}s`);
  return results;
}
