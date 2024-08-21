import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs, isNullArgs } from "@icpswap/utils";
import { stakeIndex } from "@icpswap/actor";
import type { PaginationResult, StakeIndexPoolInfo, StakeAprInfo } from "@icpswap/types";
import { Principal } from "@dfinity/principal";

import { useCallsData } from "../useCallData";

export async function getStakingUserPools(principal: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<StakeIndexPoolInfo>>(
    await (await stakeIndex()).queryPool(Principal.fromText(principal), BigInt(offset), BigInt(limit), [], []),
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

export async function getStakeAprChartData(principal: string, start_time: number, end_time: number) {
  return resultFormat<Array<StakeAprInfo>>(
    await (await stakeIndex()).queryAPR(Principal.fromText(principal), BigInt(start_time), BigInt(end_time)),
  ).data;
}

export function useStakeAprChartData(
  principal: string | undefined,
  start_time: number | undefined,
  end_time: number | undefined,
) {
  return useCallsData(
    useCallback(async () => {
      if (isNullArgs(start_time) || isNullArgs(principal) || isNullArgs(end_time)) return undefined;
      return await getStakeAprChartData(principal, start_time, end_time);
    }, [start_time, end_time, principal]),
  );
}
