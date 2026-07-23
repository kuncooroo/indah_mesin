export const stitchColors = {
  primary: "#00236f",
  primaryContainer: "#1e3a8a",
  onPrimary: "#ffffff",
  onPrimaryContainer: "#90a8ff",
  secondary: "#006d2f",
  secondaryContainer: "#5dfd8a",
  onSecondaryContainer: "#007232",
  background: "#faf8ff",
  surface: "#faf8ff",
  surfaceDim: "#f8fafc",
  onSurface: "#1a1b21",
  onSurfaceVariant: "#444651",
  outline: "#757682",
  borderSubtle: "#E2E8F0",
  metallicBg: "#F3F4F6",
  statusReady: "#10B981",
  statusIndent: "#F59E0B",
  whatsapp: "#25D366",
  industrialBlue: "#1e3a8a",
  industrialSlate: "#334155",
  error: "#ba1a1a",
} as const;

export const WHATSAPP_ADMIN =
  process.env.NEXT_PUBLIC_WHATSAPP_ADMIN ?? "6281234567890";
