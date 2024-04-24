import * as Sentry from "@sentry/react";
import { ClientOptions, ErrorEvent } from "@sentry/types";
import { isSentryEnabled, getEnvName } from "utils/env";
import { BrowserTracing } from "@sentry/browser";

export function shouldRejectError(error: ErrorEvent) {
  // User reject plug connect
  if (error.message?.includes("The agent creation was rejected")) return true;

  // Plug disconnect error
  if (error.message?.includes("Attempting to use a disconnected port object")) return true;

  if ("stack" in error && typeof error.stack === "string") {
    // Errors coming from a browser extension can be ignored. These errors are usually caused by extensions injecting
    // scripts into the page, which we cannot control.
    if (error.stack.match(/-extension:\/\//i)) return true;
  }

  // Network error
  if (error.message?.match(/Failed to fetch/)) return true;

  // Failed to load some static files
  if (error.message?.match(/Load failed/)) return true;

  // These are caused by user navigation away from the page before a request has finished.
  if (error instanceof DOMException && error?.name === "AbortError") return true;

  return false;
}

/**
 * Filters known (ignorable) errors out before sending them to Sentry. Also, adds tags to the event.
 * Intended as a {@link ClientOptions.beforeSend} callback. Returning null filters the error from Sentry.
 */
export const beforeSend: Required<ClientOptions>["beforeSend"] = (event: ErrorEvent) => {
  if (shouldRejectError(event)) {
    return null;
  }

  return event;
};

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: getEnvName(),
  enabled: isSentryEnabled(),
  tracesSampleRate: Number(process.env.REACT_APP_SENTRY_TRACES_SAMPLE_RATE ?? 0),
  beforeSend,
  integrations: [
    new BrowserTracing({
      startTransactionOnLocationChange: false,
      startTransactionOnPageLoad: true,
    }),
  ],
});
