// src/ui/theme.ts
// src/ui/theme.ts

export const colors = {
  // 🌌 Base Backgrounds
  bgTop:    "#111111",
  bgMid:    "#0B1523",
  bgBottom: "#2B3D56FF",

  // 🎨 Neutral & Surfaces
  glass:    "rgba(255,255,255,0.06)",
  line:     "rgba(255,255,255,0.08)",
  inputBg:  "rgba(255,255,255,0.08)",
  pillBg:   "rgba(255,255,255,0.12)",

  // 🖋️ Text & Subtext
  text:     "rgba(255,255,255,0.94)",
  sub:      "rgba(255,255,255,0.65)",
  muted:    "rgba(255,255,255,0.45)",

  // ⚡ Primary (brand color)
  primary: {
    50:  "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1",   // ⚡ main
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
    DEFAULT: "#4F46E5",
  },

  // 💙 Secondary / Accent
  secondary: {
    50:  "#E0F2FE",
    100: "#BAE6FD",
    200: "#7DD3FC",
    300: "#38BDF8",
    400: "#0EA5E9",
    500: "#0284C7",  // main
    600: "#0369A1",
    700: "#075985",
    800: "#0C4A6E",
    900: "#0A344F",
    DEFAULT: "#0284C7",
  },

  // ✅ Success
  success: {
    50:  "#ECFDF5",
    100: "#D1FAE5",
    200: "#A7F3D0",
    300: "#6EE7B7",
    400: "#34D399",
    500: "#10B981",  // main
    600: "#059669",
    700: "#047857",
    800: "#065F46",
    900: "#064E3B",
    DEFAULT: "#10B981",
  },

  // ⚠️ Warning
  warning: {
    50:  "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",  // main
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
    DEFAULT: "#F59E0B",
  },

  // ❌ Error / Danger
  danger: {
    50:  "#FEF2F2",
    100: "#FEE2E2",
    200: "#FECACA",
    300: "#FCA5A5",
    400: "#F87171",
    500: "#EF4444",  // main
    600: "#DC2626",
    700: "#B91C1C",
    800: "#991B1B",
    900: "#7F1D1D",
    DEFAULT: "#EF4444",
  },

  // 💜 Purple accent (for buttons or gradients)
  violet: {
    100: "#EDE9FE",
    300: "#C4B5FD",
    500: "#8B5CF6",
    700: "#6D28D9",
    900: "#4C1D95",
  },

  // 🌈 Gradients
  gradients: {
    blue: ["#0B1523", "#1E3A8A", "#3B82F6"],
    purple: ["#1E1B4B", "#6D28D9", "#A78BFA"],
    teal: ["#0F172A", "#0D9488", "#5EEAD4"],
  },

  // 💬 Action
  send: "#4C64FF",
};

export const radius = { lg: 18, md: 12, pill: 999 };
export const gaps   = { xs: 6, sm: 10, md: 14, lg: 18 };
