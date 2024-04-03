export function isDevelopmentEnv(): boolean {
  return process.env.NODE_ENV === "development";
}

export function isTestEnv(): boolean {
  return process.env.NODE_ENV === "test";
}

export function isStagingEnv(): boolean {
  // This is set in vercel builds and deploys from releases/staging.
  return Boolean(process.env.REACT_APP_STAGING);
}

export function isProductionEnv(): boolean {
  return process.env.NODE_ENV === "production" && !isStagingEnv();
}

export function isLocalhost({ hostname }: { hostname: string }): boolean {
  return hostname === "localhost";
}

export function isSentryEnabled(): boolean {
  // disable in develop
  if (isDevelopmentEnv()) return false;

  return process.env.REACT_APP_SENTRY_ENABLED === "true";
}

export function getEnvName(): "production" | "staging" | "development" {
  if (isStagingEnv()) return "staging";
  if (isProductionEnv()) return "production";

  return "development";
}
