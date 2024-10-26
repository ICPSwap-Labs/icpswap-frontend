import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs } from "@icpswap/utils";
import { stakingPool } from "@icpswap/actor";
import type { StakingPoolUserInfo, PaginationResult } from "@icpswap/types";
import { useCallsData } from "../useCallData";

export async function getStakingPoolUserInfo(canisterId: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<StakingPoolUserInfo>>(
    await (await stakingPool(canisterId)).findUserInfo(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useStakingPoolUserInfo(canisterId: string | undefined, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit) || !canisterId) return undefined;
      return await getStakingPoolUserInfo(canisterId, offset, limit);
    }, [offset, limit, canisterId]),
  );
}
