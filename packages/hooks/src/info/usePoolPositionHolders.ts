import type { Null, PoolPositionHolderResult } from "@icpswap/types";
import { icpswap_fetch_post, isUndefinedOrNull } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getPoolPositionHolders(poolId: string, size: number) {
  const result = await icpswap_fetch_post<PoolPositionHolderResult>("/info/holder/position/top", {
    principal: poolId,
    size,
  });

  return result.data;
}

export function usePoolPositionHolders(
  poolId: string | Null,
  size: number,
): UseQueryResult<PoolPositionHolderResult | undefined, Error> {
  return useQuery({
    queryKey: ["usePoolPositionHolders", poolId, size],
    queryFn: async () => {
      if (isUndefinedOrNull(poolId)) return undefined;

      return await getPoolPositionHolders(poolId, size);
    },
    enabled: !isUndefinedOrNull(poolId),
  });
}
