import { stakingPool } from "@icpswap/actor";
import type { PaginationResult, StakingPoolUserInfo } from "@icpswap/types";
import { isAvailablePageArgs, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getStakingPoolUserInfo(canisterId: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<StakingPoolUserInfo>>(
    await (await stakingPool(canisterId)).findUserInfo(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useStakingPoolUserInfo(
  canisterId: string | undefined,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<StakingPoolUserInfo> | undefined, Error> {
  return useQuery({
    queryKey: ["useStakingPoolUserInfo", canisterId, offset, limit],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit) || !canisterId) return undefined;
      return await getStakingPoolUserInfo(canisterId, offset, limit);
    },
    enabled: isAvailablePageArgs(offset, limit) && !!canisterId,
  });
}
