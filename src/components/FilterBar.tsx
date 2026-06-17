import { useMemo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { alpha, useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import type { Book } from "../api/books";

export type SortField = "title" | "author" | "firstPublishYear" | "pages" | "editionCount";
export type SortDir = "asc" | "desc";

export type Filters = {
  query: string;
  subjects: string[];
  yearRange: [number, number] | null;
  sortField: SortField;
  sortDir: SortDir;
};

export const DEFAULT_FILTERS: Filters = {
  query: "",
  subjects: [],
  yearRange: null,
  sortField: "title",
  sortDir: "asc",
};

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "title", label: "Title" },
  { value: "author", label: "Author" },
  { value: "firstPublishYear", label: "Year published" },
  { value: "pages", label: "Page count" },
  { value: "editionCount", label: "Editions" },
];

type Props = {
  books: Book[];
  filters: Filters;
  onChange: (next: Filters) => void;
  resultCount: number;
};

export function FilterBar({ books, filters, onChange, resultCount }: Props) {
  const theme = useTheme();

  const { allSubjects, yearMin, yearMax } = useMemo(() => {
    const subjectSet = new Set<string>();
    let min = Infinity;
    let max = -Infinity;
    for (const b of books) {
      for (const s of b.subjects) subjectSet.add(s);
      const y = b.firstPublishYear?.getUTCFullYear();
      if (y != null) {
        if (y < min) min = y;
        if (y > max) max = y;
      }
    }
    if (!isFinite(min) || !isFinite(max)) {
      min = 1900;
      max = new Date().getUTCFullYear();
    }
    return {
      allSubjects: Array.from(subjectSet).sort((a, b) => a.localeCompare(b)),
      yearMin: min,
      yearMax: max,
    };
  }, [books]);

  const yearValue: [number, number] = filters.yearRange ?? [yearMin, yearMax];

  const activeCount =
    (filters.query ? 1 : 0) +
    (filters.subjects.length > 0 ? 1 : 0) +
    (filters.yearRange ? 1 : 0);

  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        background: isDark
          ? `linear-gradient(180deg, ${alpha("#1a1f2c", 0.6)} 0%, ${alpha(
              "#141822",
              0.4,
            )} 100%)`
          : `linear-gradient(180deg, ${alpha("#ffffff", 0.9)} 0%, ${alpha(
              "#f6f7fb",
              0.6,
            )} 100%)`,
        backdropFilter: "blur(10px)",
        mb: 2,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        sx={{ alignItems: { xs: "stretch", md: "center" } }}
      >
        <TextField
          placeholder="Search title, author, or subject…"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          sx={{ flex: 1, minWidth: 220 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: filters.query ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => onChange({ ...filters, query: "" })}
                    aria-label="Clear search"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />

        <Autocomplete
          multiple
          size="small"
          options={allSubjects}
          value={filters.subjects}
          onChange={(_, v) => onChange({ ...filters, subjects: v })}
          sx={{ flex: 1.2, minWidth: 220 }}
          limitTags={2}
          renderValue={(value, getItemProps) =>
            value.map((option, index) => {
              const { key, ...props } = getItemProps({ index });
              return (
                <Chip
                  key={key}
                  size="small"
                  label={option}
                  {...props}
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField {...params} placeholder="Filter by subjects…" />
          )}
        />

        <TextField
          select
          label="Sort by"
          value={filters.sortField}
          onChange={(e) =>
            onChange({ ...filters, sortField: e.target.value as SortField })
          }
          sx={{ minWidth: 160 }}
        >
          {SORT_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>

        <ToggleButtonGroup
          exclusive
          size="small"
          value={filters.sortDir}
          onChange={(_, v) => v && onChange({ ...filters, sortDir: v })}
          aria-label="Sort direction"
        >
          <ToggleButton value="asc" aria-label="Ascending">
            <ArrowUpwardIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="desc" aria-label="Descending">
            <ArrowDownwardIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 2, md: 3 }}
        sx={{ mt: 2.5, alignItems: { xs: "stretch", md: "center" } }}
      >
        <Box sx={{ flex: 1, minWidth: 260, px: { xs: 0.5, md: 1 } }}>
          <Stack
            direction="row"
            sx={{
              mb: 0.5,
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Year published
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                color: "text.primary",
                fontWeight: 600,
              }}
            >
              {yearValue[0]} – {yearValue[1]}
            </Typography>
          </Stack>
          <Slider
            value={yearValue}
            min={yearMin}
            max={yearMax}
            onChange={(_, v) => {
              const range = v as [number, number];
              const isFull = range[0] === yearMin && range[1] === yearMax;
              onChange({ ...filters, yearRange: isFull ? null : range });
            }}
            valueLabelDisplay="auto"
            disableSwap
            size="small"
          />
        </Box>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: "center",
            justifyContent: { xs: "space-between", md: "flex-end" },
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <TuneIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                {resultCount}
              </Box>{" "}
              {resultCount === 1 ? "book" : "books"}
              {activeCount > 0 && (
                <>
                  {" "}· {activeCount} active filter{activeCount === 1 ? "" : "s"}
                </>
              )}
            </Typography>
          </Stack>
          <Button
            size="small"
            variant="text"
            startIcon={<ClearIcon fontSize="small" />}
            onClick={() => onChange(DEFAULT_FILTERS)}
            disabled={activeCount === 0}
          >
            Reset
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
