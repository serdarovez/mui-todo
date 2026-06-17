import { useMemo } from "react";
import { ThemeProvider, alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { buildTheme, type ColorMode } from "./theme";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useBooks } from "./hooks/useBooks";
import { BooksTable } from "./components/BooksTable";

function prefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function App() {
  const [mode, setMode] = useLocalStorage<ColorMode>(
    "books.mode",
    prefersDark() ? "dark" : "light",
  );
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const state = useBooks();
  const isDark = mode === "dark";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: isDark
            ? `radial-gradient(1200px 600px at 80% -10%, ${alpha(
                "#3b5bdb",
                0.18,
              )} 0%, transparent 60%), radial-gradient(900px 500px at -10% 10%, ${alpha(
                "#d6336c",
                0.12,
              )} 0%, transparent 55%), ${theme.palette.background.default}`
            : `radial-gradient(1200px 600px at 80% -10%, ${alpha(
                "#3b5bdb",
                0.10,
              )} 0%, transparent 60%), radial-gradient(900px 500px at -10% 10%, ${alpha(
                "#d6336c",
                0.06,
              )} 0%, transparent 55%), ${theme.palette.background.default}`,
        }}
      >
        <AppBar position="sticky" color="default" elevation={0}>
          <Toolbar>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                mr: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: "#fff",
                boxShadow: `0 8px 24px ${alpha(
                  theme.palette.primary.main,
                  0.35,
                )}`,
              }}
            >
              <MenuBookIcon fontSize="small" />
            </Box>
            <Stack sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: -0.3,
                }}
              >
                Open Library Explorer
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ lineHeight: 1.1 }}
              >
                Browse books from the Open Library API
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Button
                component="a"
                href="https://serdar-eight.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                variant="outlined"
                endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  borderRadius: 2,
                  borderColor: theme.palette.divider,
                  color: "text.primary",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                  },
                }}
              >
                Portfolio
              </Button>
              <Tooltip
                title={mode === "dark" ? "Switch to light" : "Switch to dark"}
              >
                <IconButton
                  onClick={() => setMode(mode === "dark" ? "light" : "dark")}
                  color="inherit"
                  aria-label="Toggle color mode"
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                  }}
                >
                  {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography
              variant="overline"
              sx={{ color: "primary.main", fontWeight: 700 }}
            >
              Library
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mt: 0.5,
                background: `linear-gradient(90deg, ${theme.palette.text.primary}, ${alpha(
                  theme.palette.primary.main,
                  0.8,
                )})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Discover what's on the shelf
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, maxWidth: 620 }}
            >
              Search, filter, and sort books by year, subject, page count and
              more. Click any row for full details. Click a cover to zoom.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              backdropFilter: "blur(12px)",
            }}
          >
            {state.status === "loading" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  py: 10,
                }}
              >
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                  Loading the library…
                </Typography>
              </Box>
            )}
            {state.status === "error" && (
              <Alert severity="error">{state.error}</Alert>
            )}
            {state.status === "ready" && <BooksTable books={state.books} />}
          </Paper>

          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Data from{" "}
              <Box
                component="a"
                href="https://openlibrary.org/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "primary.main", textDecoration: "none" }}
              >
                Open Library
              </Box>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Built by{" "}
              <Box
                component="a"
                href="https://serdar-eight.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  fontWeight: 700,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Serdar
              </Box>
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
