/**
 * Programmatically clicks a temporary `<a href={url} target="_blank">` with stable `id` (creates if missing).
 */
export function mockALinkAndOpen(url: string, id: string): void {
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("target", "_blank");
  a.setAttribute("id", id);
  if (!document.getElementById(id)) {
    document.body.appendChild(a);
  }
  a.click();
}
