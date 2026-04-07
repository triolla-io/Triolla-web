import { type Tool, fetchWithTimeout, isRetryableStatus } from "../utils/tools";

function headers(): HeadersInit {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

const REPO   = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH ?? "main";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RemoteFile = {
  sha: string;
  content: Record<string, unknown>;
  raw: string;
};

export type CommitFileInput = {
  filePath: string;
  content: string;       // raw file content (string, not base64)
  remoteFileSha: string;
  message: string;
};

export type CommitFileOutput = {
  commitSha: string;
  fileSha: string;       // new file SHA — needed to revert later
};

export type RevertCommitInput = {
  filePath: string;
  originalContent: string;
  currentFileSha: string;
};

// ─── Tools ────────────────────────────────────────────────────────────────────

export const checkGitHubHealthTool: Tool<void, void> = {
  name: "github_health",
  maxAttempts: 2,
  async execute() {
    try {
      const res = await fetchWithTimeout(`https://api.github.com/repos/${REPO}`, { headers: headers() });
      if (!res.ok) return { ok: false, retryable: isRetryableStatus(res.status), error: `GitHub unreachable: ${res.status}` };
      return { ok: true, data: undefined };
    } catch (e) {
      return { ok: false, retryable: true, error: `GitHub unreachable: ${String(e)}` };
    }
  },
};

export function makeFetchRemoteFileTool(filePath: string): Tool<void, RemoteFile> {
  return {
    name: "github_fetch_remote",
    maxAttempts: 3,
    async execute() {
      try {
        const res = await fetchWithTimeout(
          `https://api.github.com/repos/${REPO}/contents/${filePath}?ref=${BRANCH}`,
          { headers: headers() }
        );
        if (!res.ok) return { ok: false, retryable: isRetryableStatus(res.status), error: `GitHub GET ${res.status} ${res.statusText}` };
        const json = await res.json();
        const raw = Buffer.from(json.content, "base64").toString("utf8");
        return { ok: true, data: { sha: json.sha, content: JSON.parse(raw), raw } };
      } catch (e) {
        return { ok: false, retryable: true, error: String(e) };
      }
    },
  };
}

export const commitFileTool: Tool<CommitFileInput, CommitFileOutput> = {
  name: "github_commit_file",
  maxAttempts: 2,
  async execute({ filePath, content, remoteFileSha, message }) {
    try {
      const res = await fetchWithTimeout(
        `https://api.github.com/repos/${REPO}/contents/${filePath}`,
        {
          method: "PUT",
          headers: headers(),
          body: JSON.stringify({
            message,
            content: Buffer.from(content).toString("base64"),
            sha: remoteFileSha,
            branch: BRANCH,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { ok: false, retryable: isRetryableStatus(res.status), error: `GitHub PUT ${res.status}: ${JSON.stringify(err)}` };
      }
      const data = await res.json();
      return {
        ok: true,
        data: {
          commitSha: (data.commit as Record<string, unknown>).sha as string,
          fileSha:   (data.content as Record<string, unknown>).sha as string,
        },
      };
    } catch (e) {
      return { ok: false, retryable: true, error: String(e) };
    }
  },
};

export const revertCommitTool: Tool<RevertCommitInput, void> = {
  name: "github_revert_commit",
  maxAttempts: 3,
  async execute({ filePath, originalContent, currentFileSha }) {
    try {
      const res = await fetchWithTimeout(
        `https://api.github.com/repos/${REPO}/contents/${filePath}`,
        {
          method: "PUT",
          headers: headers(),
          body: JSON.stringify({
            message: "revert: rollback failed deployment",
            content: Buffer.from(originalContent).toString("base64"),
            sha: currentFileSha,
            branch: BRANCH,
          }),
        }
      );
      if (!res.ok) return { ok: false, retryable: isRetryableStatus(res.status), error: `GitHub revert ${res.status}` };
      return { ok: true, data: undefined };
    } catch (e) {
      return { ok: false, retryable: true, error: String(e) };
    }
  },
};
