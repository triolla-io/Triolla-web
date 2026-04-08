import { type Tool, fetchWithTimeout, isRetryableStatus } from "../utils/tools";
import type { GitProviderConfig } from "./config";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RemoteFile = {
  sha: string;
  content: Record<string, unknown>;
  raw: string;
};

export type CommitFileInput = {
  filePath: string;
  content: string;
  remoteFileSha: string;
  message: string;
};

export type CommitFileOutput = {
  commitSha: string;
  fileSha: string;
};

export type RevertCommitInput = {
  filePath: string;
  originalContent: string;
  currentFileSha: string;
};

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createGitProviderTools(cfg: GitProviderConfig) {
  const headers = (): HeadersInit => ({
    Authorization: `Bearer ${cfg.token}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  });

  const base = `https://api.github.com/repos/${cfg.repo}`;

  const checkHealth: Tool<void, void> = {
    name: "git_provider_health",
    maxAttempts: 2,
    async execute() {
      try {
        const res = await fetchWithTimeout(base, { headers: headers() });
        if (!res.ok) return { ok: false, retryable: isRetryableStatus(res.status), error: `Git provider unreachable: ${res.status}` };
        return { ok: true, data: undefined };
      } catch (e) {
        return { ok: false, retryable: true, error: `Git provider unreachable: ${String(e)}` };
      }
    },
  };

  function makeFetchRemoteFile(filePath: string): Tool<void, RemoteFile> {
    return {
      name: "git_provider_fetch_file",
      maxAttempts: 3,
      async execute() {
        try {
          const res = await fetchWithTimeout(
            `${base}/contents/${filePath}?ref=${cfg.branch}`,
            { headers: headers() }
          );
          if (!res.ok) return { ok: false, retryable: isRetryableStatus(res.status), error: `Git provider GET ${res.status} ${res.statusText}` };
          const json = await res.json();
          const raw = Buffer.from(json.content, "base64").toString("utf8");
          return { ok: true, data: { sha: json.sha, content: JSON.parse(raw), raw } };
        } catch (e) {
          return { ok: false, retryable: true, error: String(e) };
        }
      },
    };
  }

  const commitFile: Tool<CommitFileInput, CommitFileOutput> = {
    name: "git_provider_commit_file",
    maxAttempts: 2,
    async execute({ filePath, content, remoteFileSha, message }) {
      try {
        const res = await fetchWithTimeout(`${base}/contents/${filePath}`, {
          method: "PUT",
          headers: headers(),
          body: JSON.stringify({
            message,
            content: Buffer.from(content).toString("base64"),
            sha: remoteFileSha,
            branch: cfg.branch,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          return { ok: false, retryable: isRetryableStatus(res.status), error: `Git provider PUT ${res.status}: ${JSON.stringify(err)}` };
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

  const revertCommit: Tool<RevertCommitInput, void> = {
    name: "git_provider_revert_file",
    maxAttempts: 3,
    async execute({ filePath, originalContent, currentFileSha }) {
      try {
        const res = await fetchWithTimeout(`${base}/contents/${filePath}`, {
          method: "PUT",
          headers: headers(),
          body: JSON.stringify({
            message: "revert: rollback failed deployment",
            content: Buffer.from(originalContent).toString("base64"),
            sha: currentFileSha,
            branch: cfg.branch,
          }),
        });
        if (!res.ok) return { ok: false, retryable: isRetryableStatus(res.status), error: `Git provider revert ${res.status}` };
        return { ok: true, data: undefined };
      } catch (e) {
        return { ok: false, retryable: true, error: String(e) };
      }
    },
  };

  return { checkHealth, makeFetchRemoteFile, commitFile, revertCommit };
}
