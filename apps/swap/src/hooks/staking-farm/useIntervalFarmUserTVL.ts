import { useCallback } from "react";
import { getFarmUserTVL } from "@icpswap/hooks";
import { useIntervalFetch } from "hooks/useIntervalFetch";

export function useIntervalFarmUserTVL(canisterId: string | undefined, principal: string | undefined, force?: boolean) {
  const call = useCallback(async () => {
    if (!canisterId || !principal) return undefined;

    return await getFarmUserTVL(canisterId, principal);
  }, [canisterId, principal]);

  return useIntervalFetch(call, force);
}
