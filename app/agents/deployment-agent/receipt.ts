import { readFile, writeFile } from "fs/promises";
import { PATHS } from "./config";

const RECEIPT_FILE = PATHS.receipt;

export type DeploymentReceipt = {
  deploymentId: string;
  commitSha: string;
  version: number;
  deployedAt: string;
  commitMessage: string;
  status: "triggered" | "succeeded" | "failed";
};

export async function writeReceipt(receipt: DeploymentReceipt): Promise<void> {
  await writeFile(RECEIPT_FILE, JSON.stringify(receipt, null, 2) + "\n");
}

export async function readReceipt(): Promise<DeploymentReceipt | null> {
  try {
    return JSON.parse(await readFile(RECEIPT_FILE, "utf8")) as DeploymentReceipt;
  } catch {
    return null;
  }
}
