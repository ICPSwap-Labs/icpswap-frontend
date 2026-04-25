import { useInterval } from "@icpswap/hooks";

export function useIntervalFetch<T>(
  call: (() => Promise<T | undefined>) | undefined,
  refresh?: number,
  interval = 5_000,
) {
  return useInterval({ callback: call, interval, force: refresh });
}
