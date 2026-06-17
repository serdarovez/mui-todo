import { useEffect, useState } from "react";
import { fetchBooks, type Book } from "../api/books";

type State =
  | { status: "loading" }
  | { status: "ready"; books: Book[] }
  | { status: "error"; error: string };

export function useBooks(): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetchBooks(controller.signal)
      .then((books) => setState({ status: "ready", books }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const message =
          err instanceof Error ? err.message : "Failed to load books";
        setState({ status: "error", error: message });
      });
    return () => controller.abort();
  }, []);

  return state;
}
