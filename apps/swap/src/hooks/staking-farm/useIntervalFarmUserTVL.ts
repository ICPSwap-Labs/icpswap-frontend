import { getFarmUserTVL } from "@icpswap/hooks";
import { useIntervalFetch } from "hooks/useIntervalFetch";
import { useCallback } from "react";

export function useIntervalFarmUserTVL(canisterId: string | undefined, principal: string | undefined, force?: number) {
  const call = useCallback(async () => {
    if (!canisterId || !principal) return undefined;

    return await getFarmUserTVL(canisterId, principal);
  }, [canisterId, principal]);

  return useIntervalFetch(call, force);
}
