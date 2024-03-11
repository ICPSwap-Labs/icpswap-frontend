export function shorten(str = "", length = 4) {
  if (str.length <= length * 2) return `${str.slice(0, length)}...`;
  return `${str.slice(0, length)}...${str.slice(str.length - length)}`;
}

export function shortenString(str: string, limit?: number): string {
  if (!str) return str;
  if (limit) {
    return str.length > limit ? `${str.slice(0, limit).trim()}...` : str;
  }
  return shorten(str);
}
