import * as Sentry from "@sentry/react";
import { ClientOptions, ErrorEvent, EventHint } from "@sentry/types";
import { isSentryEnabled } from "utils/env";
import { getEnvName } from "utils/env";

/**
 * Filters known (ignorable) errors out before sending them to Sentry. Also, adds tags to the event.
 * Intended as a {@link ClientOptions.beforeSend} callback. Returning null filters the error from Sentry.
 */
export const beforeSend: Required<ClientOptions>["beforeSend"] = (event: ErrorEvent, hint: EventHint) => {
  if (shouldRejectError(event)) {
    return null;
  }

  return event;
};

function shouldRejectError(error: ErrorEvent) {
  // User reject plug connect
  if (error.message?.includes("The agent creation was rejected")) return true;

  return false;
}

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: getEnvName(),
  enabled: isSentryEnabled(),
  tracesSampleRate: Number(process.env.REACT_APP_SENTRY_TRACES_SAMPLE_RATE ?? 0),
  beforeSend,
});
