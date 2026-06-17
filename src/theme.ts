import { createTheme, alpha, type Theme } from "@mui/material/styles";

export type ColorMode = "light" | "dark";

export function buildTheme(mode: ColorMode): Theme {
  const isDark = mode === "dark";

  const primary = isDark ? "#7c9eff" : "#3b5bdb";
  const secondary = isDark ? "#f783ac" : "#d6336c";
  const accent = isDark ? "#63e6be" : "#0ca678";

  return createTheme({
    palette: {
      mode,
      primary: { main: primary },
      secondary: { main: secondary },
      success: { main: accent },
      background: isDark
        ? { default: "#0b0d13", paper: "#141822" }
        : { default: "#f6f7fb", paper: "#ffffff" },
      divider: isDark ? alpha("#ffffff", 0.08) : alpha("#0b0d13", 0.08),
      text: isDark
        ? { primary: "#e8ecf4", secondary: alpha("#e8ecf4", 0.65) }
        : { primary: "#0b0d13", secondary: alpha("#0b0d13", 0.62) },
    },
    typography: {
      fontFamily:
        '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
      h4: { fontWeight: 800, letterSpacing: -0.5 },
      h5: { fontWeight: 700, letterSpacing: -0.3 },
      h6: { fontWeight: 700, letterSpacing: -0.2 },
      button: { textTransform: "none", fontWeight: 600 },
      overline: { letterSpacing: 1.2, fontWeight: 600 },
    },
    shape: { borderRadius: 14 },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: "saturate(180%) blur(14px)",
            backgroundColor: isDark
              ? alpha("#141822", 0.7)
              : alpha("#ffffff", 0.75),
            borderBottom: `1px solid ${
              isDark ? alpha("#ffffff", 0.06) : alpha("#0b0d13", 0.06)
            }`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500 },
          outlined: {
            borderColor: isDark
              ? alpha("#ffffff", 0.14)
              : alpha("#0b0d13", 0.12),
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 10 },
        },
      },
      MuiTextField: {
        defaultProps: { size: "small" },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: 12,
            borderRadius: 8,
          },
        },
      },
    },
  });
}
