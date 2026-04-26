"use client";

import { useState } from "react";
import { BRAND_COLORS } from "./brandPalette";

type Props = {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  allowNone?: boolean;
};

export function ColorPicker({ label, value, onChange, allowNone }: Props) {
  const [showCustom, setShowCustom] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 11, color: "#555" }}>{label}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxWidth: 200 }}>
        {allowNone && (
          <button
            type="button"
            title="None"
            onClick={() => onChange("transparent")}
            style={{
              width: 22,
              height: 22,
              borderRadius: 4,
              border: "1px solid #ccc",
              background: "linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 50%,#ccc 50%,#ccc 75%,transparent 75%,transparent)",
              cursor: "pointer",
            }}
          />
        )}
        {BRAND_COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            title={c.label}
            onClick={() => {
              onChange(c.value);
              setShowCustom(false);
            }}
            style={{
              width: 22,
              height: 22,
              borderRadius: 4,
              border: value === c.value ? "2px solid #000" : "1px solid #ccc",
              background: c.value,
              cursor: "pointer",
            }}
          />
        ))}
        <button
          type="button"
          onClick={() => setShowCustom((s) => !s)}
          style={{ fontSize: 10, padding: "2px 6px", cursor: "pointer" }}
        >
          Custom…
        </button>
      </div>
      {showCustom && (
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <span>Pick</span>
          <input
            type="color"
            value={value.startsWith("#") && value.length >= 7 ? value.slice(0, 7) : "#000000"}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      )}
    </div>
  );
}
