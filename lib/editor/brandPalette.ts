/** Curated brand + neutrals (Triolla snapshot palette). */
export const BRAND_COLORS = [
  { label: "Brand blue", value: "#1a73e8" },
  { label: "Brand dark", value: "#0d47a1" },
  { label: "Brand accent", value: "#00bcd4" },
  { label: "Success", value: "#2e7d32" },
  { label: "Warning", value: "#f9a825" },
  { label: "Neutral 900", value: "#111111" },
  { label: "Neutral 700", value: "#424242" },
  { label: "Neutral 500", value: "#757575" },
  { label: "Neutral 300", value: "#bdbdbd" },
  { label: "Neutral 100", value: "#f5f5f5" },
] as const;

/** Font-size ramp (px) — matches typical marketing type scale. */
export const FONT_SIZE_SCALE = [12, 14, 16, 18, 20, 24, 32, 48, 64] as const;

export function isOnTypeScale(px: number): boolean {
  return (FONT_SIZE_SCALE as readonly number[]).includes(px);
}
