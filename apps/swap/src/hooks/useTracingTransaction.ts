import * as Sentry from "@sentry/react";

export async function sendSentryError(message: string) {
  Sentry.captureMessage(message);
}
