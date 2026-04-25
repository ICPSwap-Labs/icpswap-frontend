import type { Null } from "@icpswap/types";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { useQuery } from "@tanstack/react-query";

export function useIntervalFetch<T>(
  call: (() => Promise<T | undefined>) | undefined,
  refresh?: number | Null,
  interval = 5_000,
) {
  return useQuery({
    queryKey: ["intervalFetch", call, interval, refresh],
    queryFn: async () => {
      if (call) {
        const result = await call();
        return result;
      }
    },
    refetchInterval: interval,
    enabled: nonUndefinedOrNull(call),
  });
}
