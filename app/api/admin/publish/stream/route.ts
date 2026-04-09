import { NextRequest } from "next/server";
import { getRunStatus } from "../../../../agents/deployment-agent/statusStore";
import { getEmitter } from "../../../../agents/deployment-agent/emitterStore";

function encode(data: unknown): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
}

export async function GET(req: NextRequest) {
  // TODO: add proper auth
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });

  const status = getRunStatus(id);
  if (!status) return new Response("Not found", { status: 404 });

  const stream = new ReadableStream({
    start(controller) {
      // ── Catch-up: send current state immediately ──────────────────────────
      if (status.state === "running") {
        controller.enqueue(encode({ type: "phase", phase: status.phase, updatedAt: status.updatedAt }));
      } else {
        controller.enqueue(encode({ type: "done", result: status.result, updatedAt: status.updatedAt }));
        controller.close();
        return;
      }

      // ── Live: subscribe to emitter ────────────────────────────────────────
      const emitter = getEmitter(id);
      if (!emitter) { controller.close(); return; }

      function onEvent(data: unknown) {
        controller.enqueue(encode(data));
        if ((data as { type: string }).type === "done") {
          controller.close();
          emitter!.off("event", onEvent);
        }
      }

      emitter.on("event", onEvent);

      req.signal.addEventListener("abort", () => {
        emitter.off("event", onEvent);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection":    "keep-alive",
    },
  });
}
