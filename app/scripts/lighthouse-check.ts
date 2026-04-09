import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as http from "http";

const TARGET_URL = "http://localhost:3000";
const REPORTS_DIR = path.join(process.cwd(), "public", "lighthouse");
const BACKUP_DIR  = path.join(process.cwd(), "reports", "lighthouse");

// ─── Types ────────────────────────────────────────────────────────────────────

type FormFactor = "desktop" | "mobile";

interface LighthouseCategory {
  title: string;
  score: number | null;
}

interface LighthouseAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  numericValue?: number;
  numericUnit?: string;
  displayValue?: string;
  details?: { type: string; items?: unknown[] };
}

interface LighthouseReport {
  lighthouseVersion: string;
  requestedUrl: string;
  finalUrl: string;
  fetchTime: string;
  categories: Record<string, LighthouseCategory>;
  audits: Record<string, LighthouseAudit>;
}

// ─── Args ─────────────────────────────────────────────────────────────────────

function parseFormFactor(): FormFactor | "both" {
  const args = process.argv.slice(2);
  if (args.includes("--mobile") && args.includes("--desktop")) return "both";
  if (args.includes("--both")) return "both";
  if (args.includes("--mobile")) return "mobile";
  return "desktop"; // default
}

// ─── Server check ─────────────────────────────────────────────────────────────

function checkServer(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(TARGET_URL, { timeout: 5000 }, () => resolve(true));
    req.on("error", () => resolve(false));
    req.on("timeout", () => { req.destroy(); resolve(false); });
  });
}

// ─── Run lighthouse CLI ───────────────────────────────────────────────────────

function runLighthouse(formFactor: FormFactor): Promise<void> {
  return new Promise((resolve, reject) => {
    const lighthouseBin = path.join(process.cwd(), "node_modules", ".bin", "lighthouse");
    const outputBase = path.join(REPORTS_DIR, `latest-${formFactor}`);

    const args = [
      TARGET_URL,
      "--output=json,html",
      `--output-path=${outputBase}`,
      "--chrome-flags=--headless --no-sandbox --disable-gpu",
      "--only-categories=performance,accessibility,best-practices,seo",
      "--quiet",
    ];

    if (formFactor === "desktop") {
      args.push("--form-factor=desktop");
      args.push("--screenEmulation.disabled=true");
    } else {
      args.push("--form-factor=mobile");
    }

    console.log(`\nRunning Lighthouse [${formFactor.toUpperCase()}] on ${TARGET_URL}...`);
    const child = spawn(lighthouseBin, args, { stdio: ["ignore", "pipe", "pipe"] });

    child.stderr.on("data", (data: Buffer) => {
      const msg = data.toString().trim();
      if (msg) process.stderr.write(`  ${msg}\n`);
    });

    child.on("close", (code) => {
      if (code !== 0) reject(new Error(`Lighthouse exited with code ${code}`));
      else resolve();
    });

    child.on("error", reject);
  });
}

// ─── Print results ────────────────────────────────────────────────────────────

const RESET = "\x1b[0m";
const BOLD  = "\x1b[1m";

function scoreColor(score: number): string {
  if (score >= 0.9) return "\x1b[32m";
  if (score >= 0.5) return "\x1b[33m";
  return "\x1b[31m";
}

function formatScore(score: number | null): string {
  if (score === null) return "N/A";
  const pct = Math.round(score * 100);
  return `${scoreColor(score)}${BOLD}${pct}${RESET}`;
}

function formatMs(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
}

function printReport(report: LighthouseReport, formFactor: FormFactor) {
  const line = "─".repeat(52);
  const label = formFactor === "desktop" ? "Desktop" : "Mobile";

  console.log(`\n${BOLD}${line}${RESET}`);
  console.log(`${BOLD}Lighthouse Report [${label}] — ${report.finalUrl}${RESET}`);
  console.log(`${BOLD}${line}${RESET}`);
  console.log(`Fetched: ${new Date(report.fetchTime).toLocaleString()}\n`);

  console.log(`${BOLD}Category Scores${RESET}`);
  for (const key of ["performance", "accessibility", "best-practices", "seo"]) {
    const cat = report.categories[key];
    if (!cat) continue;
    console.log(`  ${cat.title.padEnd(20)} ${formatScore(cat.score)}`);
  }

  console.log(`\n${BOLD}Core Web Vitals${RESET}`);
  const vitals = [
    { id: "first-contentful-paint",   label: "FCP", good: 1800,  poor: 3000  },
    { id: "largest-contentful-paint", label: "LCP", good: 2500,  poor: 4000  },
    { id: "total-blocking-time",      label: "TBT", good: 200,   poor: 600   },
    { id: "cumulative-layout-shift",  label: "CLS", good: 0.1,   poor: 0.25  },
    { id: "speed-index",              label: "SI",  good: 3400,  poor: 5800  },
    { id: "interactive",              label: "TTI", good: 3800,  poor: 7300  },
  ];

  for (const v of vitals) {
    const audit = report.audits[v.id];
    if (!audit || audit.numericValue === undefined) continue;
    const val = audit.numericValue;
    const color = val <= v.good ? "\x1b[32m" : val > v.poor ? "\x1b[31m" : "\x1b[33m";
    const tag   = val <= v.good ? "GOOD"      : val > v.poor ? "POOR"      : "NEEDS WORK";
    const display = (audit.displayValue ?? formatMs(val)).padEnd(12);
    console.log(`  ${v.label.padEnd(6)} ${color}${BOLD}${display}${RESET}  ${color}${tag}${RESET}`);
  }

  console.log(`\n${BOLD}Failed Audits${RESET}`);
  const failed = Object.values(report.audits)
    .filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode === "binary")
    .sort((a, b) => (a.score ?? 1) - (b.score ?? 1));

  if (failed.length === 0) {
    console.log("  All audits passed!");
  } else {
    for (const a of failed) {
      const pct = Math.round((a.score ?? 0) * 100);
      console.log(`  ${scoreColor(a.score ?? 0)}✗${RESET} [${pct.toString().padStart(3)}] ${a.title}`);
    }
  }

  console.log(`\n${BOLD}Opportunities (potential savings)${RESET}`);
  const opps = Object.values(report.audits)
    .filter((a) => a.scoreDisplayMode === "numeric" && a.score !== null && a.score < 0.9 && (a.numericValue ?? 0) > 0)
    .sort((a, b) => (b.numericValue ?? 0) - (a.numericValue ?? 0));

  if (opps.length === 0) {
    console.log("  No significant opportunities found.");
  } else {
    for (const o of opps) {
      const display = o.displayValue ?? formatMs(o.numericValue!);
      console.log(`  • ${o.title.padEnd(45)} ${BOLD}${display}${RESET}`);
    }
  }

  console.log(`\n${BOLD}${line}${RESET}`);
  console.log(`HTML report: http://localhost:3000/lighthouse/latest-${formFactor}.report.html`);
  console.log(`JSON report: http://localhost:3000/lighthouse/latest-${formFactor}.report.json`);
  console.log(`${BOLD}${line}${RESET}\n`);
}


// ─── Run one form factor ──────────────────────────────────────────────────────

async function runOne(formFactor: FormFactor) {
  await runLighthouse(formFactor);

  const jsonPath = path.join(REPORTS_DIR, `latest-${formFactor}.report.json`);
  if (!fs.existsSync(jsonPath)) {
    console.error(`✗ Lighthouse did not produce a report for ${formFactor}`);
    process.exit(1);
  }

  // Mirror to reports/lighthouse/ (not served publicly, safe to commit if needed)
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  fs.copyFileSync(jsonPath, path.join(BACKUP_DIR, `latest-${formFactor}.report.json`));
  fs.copyFileSync(
    path.join(REPORTS_DIR, `latest-${formFactor}.report.html`),
    path.join(BACKUP_DIR, `latest-${formFactor}.report.html`)
  );

  const report: LighthouseReport = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  printReport(report, formFactor);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const mode = parseFormFactor();

  const serverReady = await checkServer();
  if (!serverReady) {
    console.error(`✗ Dev server not reachable at ${TARGET_URL}`);
    console.error("  Start it first: npm run start  (or npm run dev)");
    process.exit(1);
  }

  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  if (mode === "both") {
    await runOne("desktop");
    await runOne("mobile");
  } else {
    await runOne(mode);
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
