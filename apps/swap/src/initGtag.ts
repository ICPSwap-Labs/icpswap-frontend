/**
 * Loads gtag from same-origin bundle (no inline script) so CSP can omit script-src 'unsafe-inline'.
 */
export function initGtag(): void {
  const id = import.meta.env.VITE_GOOGLE_TAG_MANAGER_ID;
  if (!id) return;

  window.dataLayer = window.dataLayer ?? [];
  const dataLayer = window.dataLayer;
  const gtag = function gtag(...args: unknown[]) {
    dataLayer.push(args);
  };
  window.gtag = gtag;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", id);
}
