import { getUserWithdrawQueue, useInterval } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useCallback } from "react";

export function useIntervalUserWithdrawQueue(poolId: string | Null) {
  const callback = useCallback(async () => {
    if (isUndefinedOrNull(poolId)) return undefined;
    return await getUserWithdrawQueue(poolId);
  }, [poolId]);

  return useInterval({ callback });
}
