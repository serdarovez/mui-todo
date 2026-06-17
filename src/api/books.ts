export type Book = {
  id: string;
  title: string;
  author: string;
  firstPublishYear: Date | null;
  pages: number | null;
  coverThumb: string | null;
  coverLarge: string | null;
  editionCount: number;
  subjects: string[];
};

type OpenLibraryDoc = {
  key: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  cover_i?: number;
  edition_count?: number;
  subject?: string[];
};

type OpenLibraryResponse = {
  docs: OpenLibraryDoc[];
  numFound: number;
};

const SEARCH_URL =
  "https://openlibrary.org/search.json?q=javascript+OR+react+OR+typescript&limit=60&fields=key,title,author_name,first_publish_year,number_of_pages_median,cover_i,edition_count,subject";

export async function fetchBooks(signal?: AbortSignal): Promise<Book[]> {
  const res = await fetch(SEARCH_URL, { signal });
  if (!res.ok) {
    throw new Error(`Open Library request failed: ${res.status}`);
  }
  const data = (await res.json()) as OpenLibraryResponse;
  return data.docs
    .filter((d) => d.cover_i && d.title)
    .map((d) => ({
      id: d.key,
      title: d.title ?? "Untitled",
      author: d.author_name?.slice(0, 2).join(", ") ?? "Unknown",
      firstPublishYear: d.first_publish_year
        ? new Date(Date.UTC(d.first_publish_year, 0, 1))
        : null,
      pages: d.number_of_pages_median ?? null,
      coverThumb: d.cover_i
        ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
        : null,
      coverLarge: d.cover_i
        ? `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg`
        : null,
      editionCount: d.edition_count ?? 0,
      subjects: d.subject?.slice(0, 4) ?? [],
    }));
}
