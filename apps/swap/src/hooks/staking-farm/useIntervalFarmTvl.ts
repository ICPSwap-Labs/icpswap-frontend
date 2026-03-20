import { getFarmTVL, useInterval } from "@icpswap/hooks";
import { useCallback } from "react";

export function useIntervalFarmTVL(canisterId: string | undefined, force?: boolean) {
  const call = useCallback(async () => {
    if (!canisterId) return undefined;
    return await getFarmTVL(canisterId);
  }, [canisterId]);

  return useInterval({ callback: call, interval: 5_000, force });
}
