import * as Sentry from "@sentry/react";
import { ClientOptions, ErrorEvent } from "@sentry/types";
import { isSentryEnabled, getEnvName } from "utils/env";

export function shouldRejectError(error: ErrorEvent) {
  // User reject plug connect
  if (error.message?.includes("The agent creation was rejected")) return true;

  // Plug disconnect error
  if (error.message?.includes("Attempting to use a disconnected port object")) return true;

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
});
