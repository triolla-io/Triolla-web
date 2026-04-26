"use client";

import { useState } from "react";

export type ToastKind = "success" | "error" | "info";

export type ToastMessage = { id: number; kind: ToastKind; text: string };

let toastId = 0;

export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const push = (kind: ToastKind, text: string) => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, kind, text }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  };

  return { toasts, push };
}

export function ToastViewport({ toasts }: { toasts: ToastMessage[] }) {
  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 999999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: ToastMessage }) {
  const bg =
    toast.kind === "success"
      ? "#1b5e20"
      : toast.kind === "error"
        ? "#b71c1c"
        : "#1565c0";
  return (
    <div
      role="status"
      style={{
        background: bg,
        color: "#fff",
        padding: "10px 14px",
        borderRadius: 8,
        fontSize: 14,
        fontFamily: "system-ui, sans-serif",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        maxWidth: 360,
      }}
    >
      {toast.text}
    </div>
  );
}
