import { useCallback } from "react";
import { getFarmTVL, useInterval } from "@icpswap/hooks";

export function useIntervalFarmTVL(canisterId: string | undefined, force?: boolean) {
  const call = useCallback(async () => {
    if (!canisterId) return undefined;
    return await getFarmTVL(canisterId);
  }, [canisterId]);

  return useInterval(call, force);
}
