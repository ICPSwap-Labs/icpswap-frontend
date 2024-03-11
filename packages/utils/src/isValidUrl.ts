export function isValidUrl(urlString: string): boolean {
  const reg = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);
  return reg.test(urlString);
}
