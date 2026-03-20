import { useFarmsByFilter } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { useMemo } from "react";

interface UseAvailableFarmsForPool {
  poolId: string | Null;
}

export function useAvailableFarmsForPool({ poolId }: UseAvailableFarmsForPool) {
  const { data: farms } = useFarmsByFilter({
    pair: poolId,
    state: "LIVE",
    token: undefined,
    user: undefined,
  });

  const availableFarms = useMemo(() => {
    if (!farms) return undefined;
    return farms.map((element) => element.toString());
  }, [farms]);

  return useMemo(() => availableFarms, [availableFarms]);
}
