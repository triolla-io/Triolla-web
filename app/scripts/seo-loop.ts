import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface Scores {
  metadataCompleteness: number;
  structuredDataValid: number;
  llmAccessibility: number;
  en_he_parity: number;
}

interface LoopIteration {
  iteration: number;
  timestamp: string;
  scores: Scores;
  improvements: number;
  delta: Partial<Scores>;
}

const LOCALHOST = "http://localhost:3000";
const MAX_ITERATIONS = 10;
const IMPROVEMENT_THRESHOLD = 3; // Stop if no improvement > 3 points
const TARGET_SCORES = 90;
const CONVERGENCE_THRESHOLD = 3; // Stop after 3 consecutive no-improvement iterations

let iterationHistory: LoopIteration[] = [];
let noImprovementCount = 0;

function runTsxScript(scriptFile: string): Promise<number> {
  const tsxCli = path.join(process.cwd(), "node_modules", "tsx", "dist", "cli.mjs");
  const scriptPath = path.join(process.cwd(), "app", "scripts", scriptFile);
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [tsxCli, scriptPath], { stdio: "inherit" });
    child.on("close", (code) => {
      resolve(code ?? 0);
    });
    child.on("error", () => {
      resolve(1);
    });
  });
}

function loadReport(): { scores: Scores; pages: any[] } | null {
  try {
    const reportPath = path.join(process.cwd(), "seo-audit-report.json");
    if (!fs.existsSync(reportPath)) return null;
    const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
    return { scores: report.scores, pages: report.pages };
  } catch {
    return null;
  }
}

function calculateDelta(prevScores: Scores | null, currentScores: Scores): Partial<Scores> {
  if (!prevScores) return {};
  return {
    metadataCompleteness: currentScores.metadataCompleteness - prevScores.metadataCompleteness,
    structuredDataValid: currentScores.structuredDataValid - prevScores.structuredDataValid,
    llmAccessibility: currentScores.llmAccessibility - prevScores.llmAccessibility,
    en_he_parity: currentScores.en_he_parity - prevScores.en_he_parity,
  };
}

function hasSignificantImprovement(delta: Partial<Scores>): boolean {
  const values = Object.values(delta).filter((v) => v !== undefined) as number[];
  return values.some((v) => v > IMPROVEMENT_THRESHOLD);
}

function shouldContinue(scores: Scores, iteration: number): boolean {
  // Stop if all scores are above target
  const allAboveTarget = Object.values(scores).every((s) => s >= TARGET_SCORES);
  if (allAboveTarget) {
    console.log("\n✓ All scores above target threshold!");
    return false;
  }

  // Stop if max iterations reached
  if (iteration >= MAX_ITERATIONS) {
    console.log(`\n✓ Reached max iterations (${MAX_ITERATIONS})`);
    return false;
  }

  // Stop if no improvement for too long
  if (noImprovementCount >= CONVERGENCE_THRESHOLD) {
    console.log(`\n✓ Converged - no improvement for ${CONVERGENCE_THRESHOLD} iterations`);
    return false;
  }

  return true;
}

function printIteration(iter: LoopIteration) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Iteration ${iter.iteration}`);
  console.log(`${"=".repeat(60)}`);
  console.log(`Timestamp: ${iter.timestamp}`);
  console.log("\nScores:");
  console.log(`  Metadata Completeness: ${iter.scores.metadataCompleteness}%`);
  console.log(`  Structured Data Valid: ${iter.scores.structuredDataValid}%`);
  console.log(`  LLM Accessibility:      ${iter.scores.llmAccessibility}%`);
  console.log(`  EN/HE Parity:           ${iter.scores.en_he_parity}%`);

  if (Object.keys(iter.delta).length > 0) {
    console.log("\nDeltas:");
    Object.entries(iter.delta).forEach(([key, value]) => {
      if (value !== undefined && value !== 0) {
        const sign = value > 0 ? "+" : "";
        const emoji = value > 0 ? "📈" : "📉";
        console.log(`  ${emoji} ${key}: ${sign}${value}`);
      }
    });
  }
}

async function main() {
  console.log("Starting SEO improvement loop...");
  console.log(`Target: All scores ≥ ${TARGET_SCORES}%`);
  console.log(`Max iterations: ${MAX_ITERATIONS}`);
  console.log(`Convergence threshold: ${CONVERGENCE_THRESHOLD} iterations\n`);

  // Check if dev server is running
  console.log("Checking if dev server is running on localhost:3000...");
  const serverReady = await checkServer();
  if (!serverReady) {
    console.error("\n✗ Dev server not running on localhost:3000");
    console.error("Please start the dev server first: npm run dev");
    process.exit(1);
  }
  console.log("✓ Dev server is running\n");

  let iteration = 1;
  let previousScores: Scores | null = null;
  const loopStartTime = new Date();

  while (iteration <= MAX_ITERATIONS) {
    console.log(`\n>>> Running iteration ${iteration}...`);

    // Step 1: Run checker
    console.log("\n[1/3] Running SEO checker...");
    const checkerExit = await runTsxScript("seo-checker.ts");
    if (checkerExit !== 0) {
      console.error("Checker failed");
      break;
    }

    // Load report
    const report = loadReport();
    if (!report) {
      console.error("Failed to load report");
      break;
    }

    const currentScores = report.scores;
    const delta = calculateDelta(previousScores, currentScores);
    const hasImprovement = hasSignificantImprovement(delta);

    if (previousScores !== null) {
      if (hasImprovement) {
        noImprovementCount = 0;
      } else {
        noImprovementCount++;
      }
    }

    // Record iteration
    const iter: LoopIteration = {
      iteration,
      timestamp: new Date().toISOString(),
      scores: currentScores,
      improvements: report.pages.length,
      delta,
    };
    iterationHistory.push(iter);
    printIteration(iter);

    // Check if should continue
    if (!shouldContinue(currentScores, iteration)) {
      break;
    }

    // Step 2: Run improver
    console.log("\n[2/3] Running SEO improver...");
    const improverExit = await runTsxScript("seo-improver.ts");
    if (improverExit !== 0) {
      console.log("(Improver completed with non-zero exit, continuing...)");
    }

    previousScores = currentScores;
    iteration++;

    // Wait before next iteration
    if (iteration <= MAX_ITERATIONS && shouldContinue(currentScores, iteration)) {
      console.log("\n[3/3] Waiting 2s before next iteration...");
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  // Print final summary
  printSummary(loopStartTime);
}

function printSummary(startTime: Date) {
  const endTime = new Date();
  const duration = (endTime.getTime() - startTime.getTime()) / 1000;

  console.log(`\n${"=".repeat(60)}`);
  console.log("SEO Improvement Loop Summary");
  console.log(`${"=".repeat(60)}`);

  if (iterationHistory.length === 0) {
    console.log("No iterations completed");
    return;
  }

  const firstIter = iterationHistory[0];
  const lastIter = iterationHistory[iterationHistory.length - 1];

  console.log(`\nTotal iterations: ${iterationHistory.length}`);
  console.log(`Duration: ${Math.round(duration)}s`);

  console.log("\nBefore:");
  console.log(`  Metadata Completeness: ${firstIter.scores.metadataCompleteness}%`);
  console.log(`  Structured Data Valid: ${firstIter.scores.structuredDataValid}%`);
  console.log(`  LLM Accessibility:      ${firstIter.scores.llmAccessibility}%`);
  console.log(`  EN/HE Parity:           ${firstIter.scores.en_he_parity}%`);

  console.log("\nAfter:");
  console.log(`  Metadata Completeness: ${lastIter.scores.metadataCompleteness}%`);
  console.log(`  Structured Data Valid: ${lastIter.scores.structuredDataValid}%`);
  console.log(`  LLM Accessibility:      ${lastIter.scores.llmAccessibility}%`);
  console.log(`  EN/HE Parity:           ${lastIter.scores.en_he_parity}%`);

  console.log("\nImprovement:");
  const mdDelta = lastIter.scores.metadataCompleteness - firstIter.scores.metadataCompleteness;
  const sdDelta = lastIter.scores.structuredDataValid - firstIter.scores.structuredDataValid;
  const llmDelta = lastIter.scores.llmAccessibility - firstIter.scores.llmAccessibility;
  const pDelta = lastIter.scores.en_he_parity - firstIter.scores.en_he_parity;

  console.log(`  Metadata Completeness: ${mdDelta > 0 ? "+" : ""}${mdDelta}%`);
  console.log(`  Structured Data Valid: ${sdDelta > 0 ? "+" : ""}${sdDelta}%`);
  console.log(`  LLM Accessibility:      ${llmDelta > 0 ? "+" : ""}${llmDelta}%`);
  console.log(`  EN/HE Parity:           ${pDelta > 0 ? "+" : ""}${pDelta}%`);

  const avgBefore = (firstIter.scores.metadataCompleteness + firstIter.scores.structuredDataValid + firstIter.scores.llmAccessibility + firstIter.scores.en_he_parity) / 4;
  const avgAfter = (lastIter.scores.metadataCompleteness + lastIter.scores.structuredDataValid + lastIter.scores.llmAccessibility + lastIter.scores.en_he_parity) / 4;

  console.log(`\nAverage score: ${Math.round(avgBefore)}% → ${Math.round(avgAfter)}% (${Math.round(avgAfter - avgBefore) > 0 ? "+" : ""}${Math.round(avgAfter - avgBefore)}%)`);

  // Save history
  const historyPath = path.join(process.cwd(), "seo-loop-history.json");
  fs.writeFileSync(historyPath, JSON.stringify(iterationHistory, null, 2));
  console.log(`\nHistory saved to: ${historyPath}`);

  console.log(`${"=".repeat(60)}\n`);
}

async function checkServer(): Promise<boolean> {
  const http = require("http");
  return new Promise((resolve) => {
    const req = http.get("http://localhost:3000", { timeout: 5000 }, () => {
      resolve(true);
    });
    req.on("error", () => {
      resolve(false);
    });
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
