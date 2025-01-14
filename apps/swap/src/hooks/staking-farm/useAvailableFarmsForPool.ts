import { useMemo } from "react";
import { useFarmsByFilter } from "@icpswap/hooks";
import { Null } from "@icpswap/types";

interface UseAvailableFarmsForPool {
  poolId: string | Null;
}

export function useAvailableFarmsForPool({ poolId }: UseAvailableFarmsForPool) {
  const { result: farms } = useFarmsByFilter({
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
