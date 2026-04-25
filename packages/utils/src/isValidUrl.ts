/** Loose HTTP(S) URL validation via regex (not a full WHATWG parse). */
export function isValidUrl(urlString: string): boolean {
  const reg = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/);
  return reg.test(urlString);
}
