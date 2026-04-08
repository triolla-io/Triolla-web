import { join } from "path";

// ─── Content file paths ───────────────────────────────────────────────────────

const ROOT = process.cwd();

export const PATHS = {
  contentGithub: "content/mock-data.json",
  contentLocal:  join(ROOT, "content/mock-data.json"),
  contentBkp:    join(ROOT, "content/mock-data.json.bkp"),
  receipt:       join(ROOT, "content/deployment-receipt.json"),
} as const;

// ─── Git provider config (GitHub) ────────────────────────────────────────────

export type GitProviderConfig = {
  repo:   string;
  branch: string;
  token:  string;
};

export function getGitProviderConfig(): GitProviderConfig {
  const repo   = process.env.GITHUB_REPO;
  const token  = process.env.GITHUB_TOKEN;
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!repo)  throw new Error("Missing env var: GITHUB_REPO");
  if (!token) throw new Error("Missing env var: GITHUB_TOKEN");
  return { repo, branch, token };
}

// ─── Deployment provider config (Coolify) ────────────────────────────────────

export type DeploymentProviderConfig = {
  apiUrl:  string;
  appUuid: string;
  token:   string;
};

export function getDeploymentProviderConfig(): DeploymentProviderConfig {
  const apiUrl  = process.env.COOLIFY_API_URL;
  const appUuid = process.env.COOLIFY_APP_UUID;
  const token   = process.env.COOLIFY_API_TOKEN;
  if (!apiUrl)  throw new Error("Missing env var: COOLIFY_API_URL");
  if (!appUuid) throw new Error("Missing env var: COOLIFY_APP_UUID");
  if (!token)   throw new Error("Missing env var: COOLIFY_API_TOKEN");
  return { apiUrl, appUuid, token };
}
