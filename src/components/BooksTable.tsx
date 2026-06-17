import { useMemo, useState } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridColumnVisibilityModel,
  type GridRenderCellParams,
  type GridSortModel,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { alpha, useTheme } from "@mui/material/styles";
import type { Book } from "../api/books";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ImageZoomModal } from "./ImageZoomModal";
import { RowDetailsModal } from "./RowDetailsModal";
import { FilterBar, DEFAULT_FILTERS, type Filters } from "./FilterBar";
import { LazyImage } from "./LazyImage";

const ROW_MIN = 100;
const ROW_MAX = 300;

type Props = { books: Book[] };

export function BooksTable({ books }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [filters, setFilters] = useLocalStorage<Filters>(
    "books.filters.v2",
    DEFAULT_FILTERS,
  );
  const [paginationModel, setPaginationModel] =
    useLocalStorage<GridPaginationModel>("books.pagination", {
      page: 0,
      pageSize: 10,
    });
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useLocalStorage<GridColumnVisibilityModel>("books.columns", {});

  const [zoomSrc, setZoomSrc] = useState<{ src: string; alt: string } | null>(
    null,
  );
  const [activeBook, setActiveBook] = useState<Book | null>(null);

  const filteredBooks = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const subjectSet = new Set(filters.subjects);
    return books.filter((b) => {
      if (q) {
        const hay =
          b.title.toLowerCase() +
          " " +
          b.author.toLowerCase() +
          " " +
          b.subjects.join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (subjectSet.size > 0) {
        const hasAny = b.subjects.some((s) => subjectSet.has(s));
        if (!hasAny) return false;
      }
      if (filters.yearRange) {
        const y = b.firstPublishYear?.getUTCFullYear();
        if (y == null) return false;
        if (y < filters.yearRange[0] || y > filters.yearRange[1]) return false;
      }
      return true;
    });
  }, [books, filters]);

  const sortModel: GridSortModel = useMemo(
    () => [{ field: filters.sortField, sort: filters.sortDir }],
    [filters.sortField, filters.sortDir],
  );

  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length === 0) {
      setFilters({ ...filters, sortField: "title", sortDir: "asc" });
      return;
    }
    const m = model[0];
    setFilters({
      ...filters,
      sortField: m.field as Filters["sortField"],
      sortDir: (m.sort ?? "asc") as Filters["sortDir"],
    });
  };

  const columns = useMemo<GridColDef<Book>[]>(
    () => [
      {
        field: "coverThumb",
        headerName: "Cover",
        width: 110,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams<Book, string | null>) => {
          const src = params.value;
          const large = params.row.coverLarge;
          if (!src) {
            return (
              <Box
                sx={{
                  width: 72,
                  height: 104,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "action.hover",
                  borderRadius: 1.5,
                  color: "text.secondary",
                  fontSize: 11,
                }}
              >
                no cover
              </Box>
            );
          }
          return (
            <LazyImage
              src={src}
              alt={params.row.title}
              skeletonRadius={6}
              onClick={(e) => {
                e.stopPropagation();
                setZoomSrc({ src: large ?? src, alt: params.row.title });
              }}
              sx={{
                width: 72,
                height: 104,
                borderRadius: 1.5,
                overflow: "hidden",
                cursor: "zoom-in",
                boxShadow: `0 6px 18px ${alpha("#000", isDark ? 0.5 : 0.18)}`,
                transition: "transform 160ms ease, box-shadow 160ms ease",
                "&:hover": {
                  transform: "translateY(-2px) scale(1.03)",
                  boxShadow: `0 12px 24px ${alpha("#000", isDark ? 0.6 : 0.25)}`,
                },
              }}
            />
          );
        },
      },
      {
        field: "title",
        headerName: "Title",
        flex: 2,
        minWidth: 220,
        renderCell: (params) => (
          <Typography
            sx={{
              fontFamily: '"Merriweather", "Georgia", serif',
              fontWeight: 700,
              color: "text.primary",
              whiteSpace: "normal",
              lineHeight: 1.3,
              py: 1,
            }}
          >
            {params.value as string}
          </Typography>
        ),
      },
      {
        field: "author",
        headerName: "Author",
        flex: 1.2,
        minWidth: 160,
        renderCell: (params) => (
          <Typography
            sx={{
              fontStyle: "italic",
              color: "secondary.main",
              letterSpacing: 0.2,
              whiteSpace: "normal",
              py: 1,
            }}
          >
            {params.value as string}
          </Typography>
        ),
      },
      {
        field: "firstPublishYear",
        headerName: "First published",
        type: "date",
        width: 150,
        valueFormatter: (value: Date | null) =>
          value ? String(value.getUTCFullYear()) : "—",
        renderCell: (params) => {
          const v = params.value as Date | null;
          return (
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", "Consolas", monospace',
                fontVariantNumeric: "tabular-nums",
                color: "text.secondary",
              }}
            >
              {v ? v.getUTCFullYear() : "—"}
            </Typography>
          );
        },
      },
      {
        field: "pages",
        headerName: "Pages",
        type: "number",
        width: 100,
        renderCell: (params) => (
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", "Consolas", monospace',
              fontVariantNumeric: "tabular-nums",
              fontWeight: 600,
            }}
          >
            {params.value != null ? params.value : "—"}
          </Typography>
        ),
      },
      {
        field: "editionCount",
        headerName: "Editions",
        type: "number",
        width: 110,
        renderCell: (params) => (
          <Chip
            label={params.value as number}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }}
          />
        ),
      },
      {
        field: "subjects",
        headerName: "Subjects",
        flex: 1.5,
        minWidth: 220,
        sortable: false,
        valueGetter: (value: string[]) => value.join(", "),
        renderCell: (params) => {
          const subjects = (params.row as Book).subjects;
          return (
            <Stack
              direction="row"
              spacing={0.5}
              useFlexGap
              sx={{ py: 1, flexWrap: "wrap" }}
            >
              {subjects.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  size="small"
                  variant="outlined"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, isDark ? 0.1 : 0.06),
                    borderColor: alpha(theme.palette.primary.main, 0.25),
                  }}
                />
              ))}
            </Stack>
          );
        },
      },
    ],
    [theme.palette.primary.main, isDark],
  );

  return (
    <>
      <FilterBar
        books={books}
        filters={filters}
        onChange={setFilters}
        resultCount={filteredBooks.length}
      />

      <Box
        sx={{
          width: "100%",
          "& .MuiDataGrid-root": {
            border: 0,
            "--DataGrid-rowBorderColor": theme.palette.divider,
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "transparent",
          },
          "& .MuiDataGrid-row": {
            minHeight: `${ROW_MIN}px !important`,
            maxHeight: `${ROW_MAX}px !important`,
            transition: "background-color 120ms ease",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.08 : 0.04),
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            borderTop: `1px solid ${theme.palette.divider}`,
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <DataGrid
          rows={filteredBooks}
          columns={columns}
          getRowHeight={() => "auto"}
          getEstimatedRowHeight={() => 150}
          autoHeight
          disableRowSelectionOnClick
          onRowClick={(p) => setActiveBook(p.row as Book)}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={setColumnVisibilityModel}
          pageSizeOptions={[5, 10, 25, 50]}
          sx={{
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              fontSize: 11,
              color: theme.palette.text.secondary,
            },
            cursor: "pointer",
          }}
        />
      </Box>

      <ImageZoomModal
        open={zoomSrc !== null}
        src={zoomSrc?.src ?? null}
        alt={zoomSrc?.alt ?? ""}
        onClose={() => setZoomSrc(null)}
      />
      <RowDetailsModal
        book={activeBook}
        onClose={() => setActiveBook(null)}
      />
    </>
  );
}

