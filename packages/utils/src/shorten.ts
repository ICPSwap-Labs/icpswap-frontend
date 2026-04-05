/**
 * Shortens a string for display: if longer than `2 * length`, shows `length` start + `...` + `length` end;
 * otherwise shows the first `length` characters followed by `...`.
 */
export function shorten(str = "", length = 4) {
  if (str.length <= length * 2) return `${str.slice(0, length)}...`;
  return `${str.slice(0, length)}...${str.slice(str.length - length)}`;
}

/** Truncates `str` to `limit` characters with an ellipsis when needed; passes through empty/falsy unchanged. */
export function shortenString(str: string, limit?: number): string {
  if (!str) return str;
  if (limit) {
    return str.length > limit ? `${str.slice(0, limit).trim()}...` : str;
  }
  return shorten(str);
}
