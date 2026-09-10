import { useEffect, useRef } from "react";

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/** Scrolls the attached element into view once, when results first render. */
export function useScrollIntoView<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const t = setTimeout(
      () => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      120,
    );
    return () => clearTimeout(t);
  }, []);
  return ref;
}
