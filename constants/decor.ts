// constants/decor.ts
import type { TextStyle, ViewStyle } from "react-native";

export const COLORS = {
  bg: "#0B1220",
  card: "#111A2E",
  text: "#E8EEF9",
  muted: "#A9B4CC",
  accent: "#4F8CFF",
  border: "rgba(255,255,255,0.10)",
} as const;

export const SPACING = {
  page: 16,
  card: 14,
  gap: 12,
  radius: 16,
} as const;

export const TYPE = {
  title: { fontSize: 28, fontWeight: "800", lineHeight: 34, color: COLORS.text },
  subtitle: { fontSize: 14, fontWeight: "600", color: COLORS.muted },
  h2: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  body: { fontSize: 15, lineHeight: 22, color: COLORS.text },
  muted: { fontSize: 13, lineHeight: 20, color: COLORS.muted },
} as const satisfies Record<string, TextStyle>;

export const CARD: ViewStyle = {
  backgroundColor: COLORS.card,
  borderRadius: SPACING.radius,
  padding: SPACING.card,
  borderWidth: 1,
  borderColor: COLORS.border,
};