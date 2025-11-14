import { swapPool } from "@icpswap/actor";
import { isUndefinedOrNull, resultFormat } from "@icpswap/utils";
import { useCallback } from "react";
import type { Null, UserWithdrawQueueInfo } from "@icpswap/types";

import { useCallsData } from "../useCallData";

export async function getUserWithdrawQueue(poolId: string) {
  const result = await (await swapPool(poolId, true)).getUserWithdrawQueue();
  return resultFormat<UserWithdrawQueueInfo>(result).data;
}

export function useUserWithdrawQueue(poolId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(poolId)) return;
      return await getUserWithdrawQueue(poolId);
    }, [poolId]),
  );
}
