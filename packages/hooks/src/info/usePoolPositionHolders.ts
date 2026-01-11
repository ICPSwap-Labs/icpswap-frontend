import { useCallback } from "react";
import { isUndefinedOrNull, icpswap_fetch_post } from "@icpswap/utils";
import type { Null, PoolPositionHolderResult } from "@icpswap/types";

import { useCallsData } from "../useCallData";

export async function getPoolPositionHolders(poolId: string, size: number) {
  const result = await icpswap_fetch_post<PoolPositionHolderResult>("/info/holder/position/top", {
    principal: poolId,
    size,
  });

  return result.data;
}

export function usePoolPositionHolders(poolId: string | Null, size: number) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(poolId)) return undefined;

      return await getPoolPositionHolders(poolId, size);
    }, [poolId, size]),
  );
}
