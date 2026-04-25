/** Promise that resolves after `ms` milliseconds. */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
