import { Principal } from "@icp-sdk/core/principal";
import { stakeIndex } from "@icpswap/actor";
import type { PaginationResult, StakeAprInfo, StakeIndexPoolInfo, StakeUserStakeInfo } from "@icpswap/types";
import { isAvailablePageArgs, isUndefinedOrNull, optionalArg, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getUserStakePools(
  principal: string,
  offset: number,
  limit: number,
  stakeTokenId?: string | undefined | null,
  rewardTokenId?: string | undefined | null,
) {
  return resultFormat<PaginationResult<StakeIndexPoolInfo>>(
    await (await stakeIndex()).queryPool(
      Principal.fromText(principal),
      BigInt(offset),
      BigInt(limit),
      optionalArg<string>(stakeTokenId),
      optionalArg<string>(rewardTokenId),
    ),
  ).data;
}

export function useUserStakePools(
  principal: string | undefined,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<StakeIndexPoolInfo> | undefined, Error> {
  return useQuery({
    queryKey: ["useUserStakePools", principal, offset, limit],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getUserStakePools(principal!, offset, limit);
    },
    enabled: isAvailablePageArgs(offset, limit) && !!principal,
  });
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
): UseQueryResult<StakeAprInfo[] | undefined, Error> {
  return useQuery({
    queryKey: ["useStakeAprChartData", principal, start_time, end_time],
    queryFn: async () => {
      if (isUndefinedOrNull(start_time) || isUndefinedOrNull(principal) || isUndefinedOrNull(end_time))
        return undefined;
      return await getStakeAprChartData(principal, start_time, end_time);
    },
    enabled: !isUndefinedOrNull(start_time) && !isUndefinedOrNull(principal) && !isUndefinedOrNull(end_time),
  });
}

export async function getUserStakedTokens(principal: string) {
  return resultFormat<Array<StakeUserStakeInfo>>(
    await (await stakeIndex()).queryUserStakedTokens(Principal.fromText(principal)),
  ).data;
}

export function useUserStakedTokens(
  principal: string | undefined,
): UseQueryResult<StakeUserStakeInfo[] | undefined, Error> {
  return useQuery({
    queryKey: ["useUserStakedTokens", principal],
    queryFn: async () => {
      if (isUndefinedOrNull(principal)) return undefined;

      return await getUserStakedTokens(principal);
    },
    enabled: !isUndefinedOrNull(principal),
  });
}
