export const CATEGORIES = [
  { value: "FIRE", label: "Kebakaran Tebu", emoji: "\uD83D\uDD25" },
  { value: "PEST", label: "Serangan Hama", emoji: "\uD83D\uDC1B" },
  { value: "DISEASE", label: "Penyakit Tanaman", emoji: "\uD83E\uDDA0" },
  { value: "FLOODING", label: "Banjir/Genangan", emoji: "\uD83D\uDCA7" },
  { value: "OTHER", label: "Kendala Lainnya", emoji: "\u26A0\uFE0F" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export const STATUSES = [
  { value: "OPEN", label: "Terbuka", color: "bg-red-500" },
  { value: "ON_PROGRESS", label: "Dalam Proses", color: "bg-amber-500" },
  { value: "CLOSED", label: "Selesai", color: "bg-green-500" },
] as const;

export type StatusValue = (typeof STATUSES)[number]["value"];

export const CATEGORY_COLORS: Record<CategoryValue, string> = {
  FIRE: "#ef4444",
  PEST: "#f59e0b",
  DISEASE: "#a855f7",
  FLOODING: "#3b82f6",
  OTHER: "#6b7280",
};

export const CATEGORY_MARKER_COLORS: Record<CategoryValue, string> = {
  FIRE: "#dc2626",
  PEST: "#d97706",
  DISEASE: "#9333ea",
  FLOODING: "#2563eb",
  OTHER: "#4b5563",
};

export const INCIDENT_BUCKET = "incident-reports";
