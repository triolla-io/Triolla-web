import "server-only";
import { simpleGit, type SimpleGit } from "simple-git";

export type PublishResult = { ok: true; sha: string } | { ok: false; error: string };

let configured = false;

async function ensureConfigured(git: SimpleGit, authorEmail: string, authorName: string) {
  await git.addConfig("user.email", authorEmail, false, "local");
  await git.addConfig("user.name", authorName, false, "local");
  if (configured) return;
  const token = process.env.GITHUB_TOKEN;
  const remote = process.env.GIT_REMOTE_URL;
  if (token && remote) {
    const authed = remote.replace(
      /^https:\/\//,
      `https://x-access-token:${token}@`
    );
    try {
      await git.remote(["set-url", "origin", authed]);
    } catch {
      /* no origin yet — surface error at push time */
    }
  }
  configured = true;
}

export async function publish({
  message,
  authorEmail,
  authorName,
  paths,
}: {
  message: string;
  authorEmail: string;
  authorName: string;
  paths: string[];
}): Promise<PublishResult> {
  const git = simpleGit(process.cwd());
  try {
    await ensureConfigured(git, authorEmail, authorName);
    await git.add(paths);
    const status = await git.status();
    if (status.staged.length === 0 && status.created.length === 0 && status.modified.length === 0 && status.deleted.length === 0) {
      return { ok: false, error: "Nothing to commit" };
    }
    await git.commit(message);
    const log = await git.log({ maxCount: 1 });
    const sha = log.latest?.hash ?? "";
    const branch = process.env.GIT_BRANCH ?? "main";
    await git.push("origin", branch);
    return { ok: true, sha };
  } catch (err) {
    return { ok: false, error: String((err as Error).message ?? err) };
  }
}
