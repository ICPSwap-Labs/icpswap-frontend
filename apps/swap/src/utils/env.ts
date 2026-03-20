export function isDevelopmentEnv(): boolean {
  return import.meta.env.MODE === "development";
}

export function isTestEnv(): boolean {
  return import.meta.env.MODE === "test";
}

export function isStagingEnv(): boolean {
  // This is set in vercel builds and deploys from releases/staging.
  return Boolean(import.meta.env.VITE_STAGING);
}

export function isProductionEnv(): boolean {
  return import.meta.env.MODE === "production" && !isStagingEnv();
}

export function isLocalhost({ hostname }: { hostname: string }): boolean {
  return hostname === "localhost";
}

export function isSentryEnabled(): boolean {
  // disable in develop
  if (isDevelopmentEnv()) return false;

  return import.meta.env.VITE_SENTRY_ENABLED === "true";
}

export function getEnvName(): "production" | "staging" | "development" {
  if (isStagingEnv()) return "staging";
  if (isProductionEnv()) return "production";

  return "development";
}
