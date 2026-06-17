import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { alpha, useTheme } from "@mui/material/styles";
import type { Book } from "../api/books";
import { LazyImage } from "./LazyImage";

type Props = {
  book: Book | null;
  onClose: () => void;
};

function formatYear(date: Date | null): string {
  return date ? String(date.getUTCFullYear()) : "—";
}

export function RowDetailsModal({ book, onClose }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Dialog
      open={book !== null}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            border: `1px solid ${theme.palette.divider}`,
            backgroundImage: isDark
              ? `linear-gradient(180deg, ${alpha("#1a1f2c", 0.95)} 0%, ${alpha(
                  "#141822",
                  1,
                )} 100%)`
              : undefined,
            overflow: "hidden",
          },
        },
      }}
    >
      <Box
        sx={{
          height: 6,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        }}
      />
      <DialogContent sx={{ pt: 3 }}>
        {book && (
          <>
            <Stack
              direction="row"
              sx={{
                mb: 2.5,
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ pr: 4 }}>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{ display: "block", lineHeight: 1 }}
                >
                  Book details
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Merriweather", "Georgia", serif',
                    fontWeight: 800,
                    mt: 0.5,
                    lineHeight: 1.2,
                  }}
                >
                  {book.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: "italic",
                    color: "secondary.main",
                    mt: 0.5,
                  }}
                >
                  by {book.author}
                </Typography>
              </Box>
              <IconButton
                onClick={onClose}
                size="small"
                aria-label="Close details"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              {book.coverThumb && (
                <LazyImage
                  src={book.coverThumb}
                  alt={book.title}
                  eager
                  skeletonRadius={8}
                  sx={{
                    width: { xs: "100%", sm: 170 },
                    height: 250,
                    borderRadius: 2,
                    overflow: "hidden",
                    alignSelf: "flex-start",
                    boxShadow: `0 12px 32px ${alpha("#000", isDark ? 0.5 : 0.18)}`,
                  }}
                />
              )}
              <Stack spacing={1.5} sx={{ flex: 1 }}>
                <Stat
                  label="First published"
                  value={formatYear(book.firstPublishYear)}
                />
                <Stat
                  label="Pages (median)"
                  value={book.pages != null ? String(book.pages) : "—"}
                />
                <Stat label="Editions" value={String(book.editionCount)} />
                {book.subjects.length > 0 && (
                  <Box sx={{ pt: 0.5 }}>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.75 }}
                    >
                      Subjects
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={0.75}
                      useFlexGap
                      sx={{ flexWrap: "wrap" }}
                    >
                      {book.subjects.map((s) => (
                        <Chip
                          key={s}
                          label={s}
                          size="small"
                          sx={{
                            bgcolor: alpha(
                              theme.palette.primary.main,
                              isDark ? 0.15 : 0.08,
                            ),
                            color: theme.palette.primary.main,
                            border: `1px solid ${alpha(
                              theme.palette.primary.main,
                              0.25,
                            )}`,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Stack>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} variant="contained" disableElevation>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontFamily: '"JetBrains Mono", "Consolas", monospace',
          fontVariantNumeric: "tabular-nums",
          fontWeight: 600,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
