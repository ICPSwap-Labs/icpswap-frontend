import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs } from "@icpswap/utils";
import { stakingUserStorage } from "@icpswap/actor";
import type { PaginationResult, StakingUserStoragePoolInfo } from "@icpswap/types";
import { Principal } from "@dfinity/principal";

import { useCallsData } from "../useCallData";

export async function getStakingUserPools(principal: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<StakingUserStoragePoolInfo>>(
    await (await stakingUserStorage()).queryPool(Principal.fromText(principal), BigInt(offset), BigInt(limit), [], []),
  ).data;
}

export function useStakingUserPools(principal: string | undefined, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getStakingUserPools(principal, offset, limit);
    }, [offset, limit, principal]),
  );
}
