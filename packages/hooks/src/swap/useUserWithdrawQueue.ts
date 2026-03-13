import { swapPool } from "@icpswap/actor";
import { isUndefinedOrNull, resultFormat } from "@icpswap/utils";
import type { Null, UserWithdrawQueueInfo } from "@icpswap/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export async function getUserWithdrawQueue(poolId: string) {
  const result = await (await swapPool(poolId, true)).getUserWithdrawQueue();
  return resultFormat<UserWithdrawQueueInfo>(result).data;
}

export function useUserWithdrawQueue(poolId: string | Null): UseQueryResult<UserWithdrawQueueInfo | undefined, Error> {
  return useQuery({
    queryKey: ["useUserWithdrawQueue", poolId],
    queryFn: async () => {
      if (isUndefinedOrNull(poolId)) return;
      return await getUserWithdrawQueue(poolId);
    },
    enabled: !isUndefinedOrNull(poolId),
  });
}
