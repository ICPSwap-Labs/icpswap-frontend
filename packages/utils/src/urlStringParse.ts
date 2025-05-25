export function urlStringParse(str: string) {
  return window.atob(str);
}

export function urlStringFormat(str: string) {
  return window.btoa(str);
}
