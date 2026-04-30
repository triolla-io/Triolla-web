import "server-only";

export type RedeployResult = { ok: true; status: number } | { ok: false; error: string };

export async function triggerCoolifyRedeploy(): Promise<RedeployResult> {
  const url = process.env.COOLIFY_API_URL;
  const token = process.env.COOLIFY_API_TOKEN;
  const uuid = process.env.COOLIFY_APP_UUID;
  if (!url || !token || !uuid) {
    return { ok: false, error: "Coolify env not configured" };
  }
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/api/v1/deploy?uuid=${encodeURIComponent(uuid)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: `${res.status}: ${text.slice(0, 500)}` };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, error: String((err as Error).message ?? err) };
  }
}
