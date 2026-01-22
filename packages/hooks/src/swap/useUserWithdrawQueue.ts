import { swapPool } from "@icpswap/actor";
import { isUndefinedOrNull, resultFormat } from "@icpswap/utils";
import { useCallback } from "react";
import type { Null, UserWithdrawQueueInfo } from "@icpswap/types";
import { Principal } from "@dfinity/principal";

import { useCallsData } from "../useCallData";

export async function getUserWithdrawQueue(poolId: string, principal: Principal) {
  const result = await (await swapPool(poolId)).getUserWithdrawQueue(principal);
  return resultFormat<UserWithdrawQueueInfo>(result).data;
}

export function useUserWithdrawQueue(poolId: string | Null, principal: Principal | Null) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(poolId) || isUndefinedOrNull(principal)) return;
      return await getUserWithdrawQueue(poolId, principal);
    }, [poolId, principal]),
  );
}
