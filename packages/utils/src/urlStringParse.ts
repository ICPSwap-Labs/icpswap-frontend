/** Decodes a base64 string (browser `atob`). */
export function urlStringParse(str: string) {
  return window.atob(str);
}

/** Encodes a string to base64 (browser `btoa`). */
export function urlStringFormat(str: string) {
  return window.btoa(str);
}
