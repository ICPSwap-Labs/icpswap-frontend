import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs, isUndefinedOrNull, availableArgsNull } from "@icpswap/utils";
import { stakeIndex } from "@icpswap/actor";
import type { PaginationResult, StakeIndexPoolInfo, StakeAprInfo, StakeUserStakeInfo } from "@icpswap/types";
import { Principal } from "@dfinity/principal";

import { useCallsData } from "../useCallData";

export async function getUserStakePools(
  principal: string,
  offset: number,
  limit: number,
  stakeTokenId?: string | undefined | null,
  rewardTokenId?: string | undefined | null,
) {
  return resultFormat<PaginationResult<StakeIndexPoolInfo>>(
    await (
      await stakeIndex()
    ).queryPool(
      Principal.fromText(principal),
      BigInt(offset),
      BigInt(limit),
      availableArgsNull<string>(stakeTokenId),
      availableArgsNull<string>(rewardTokenId),
    ),
  ).data;
}

export function useUserStakePools(principal: string | undefined, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getUserStakePools(principal, offset, limit);
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
      if (isUndefinedOrNull(start_time) || isUndefinedOrNull(principal) || isUndefinedOrNull(end_time))
        return undefined;
      return await getStakeAprChartData(principal, start_time, end_time);
    }, [start_time, end_time, principal]),
  );
}

export async function getUserStakedTokens(principal: string) {
  return resultFormat<Array<StakeUserStakeInfo>>(
    await (await stakeIndex()).queryUserStakedTokens(Principal.fromText(principal)),
  ).data;
}

export function useUserStakedTokens(principal: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(principal)) return undefined;

      return await getUserStakedTokens(principal);
    }, [principal]),
  );
}
