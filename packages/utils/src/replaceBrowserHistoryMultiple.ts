import { isUndefinedOrNull } from "./isUndefinedOrNull";

/**
 * Updates the current URL query string in-place via `history.replaceState` and dispatches `popstate#urlChange`.
 * Nullish values remove their keys.
 */
export const replaceBrowserHistoryMultiple = (params: { [key: string]: string | number | null | undefined }) => {
  const url = new URL(window.location.href);

  Object.entries(params).forEach(([key, value]) => {
    if (isUndefinedOrNull(value)) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, String(value));
    }
  });

  const urlString = url.toString();
  window.history.replaceState({ ...window.history.state, as: urlString, url: urlString }, "", url);
  window.dispatchEvent(new Event("popstate#urlChange"));
};
