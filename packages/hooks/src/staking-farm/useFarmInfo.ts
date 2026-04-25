import { Principal } from "@icpswap/dfinity";
import { farmIndex } from "@icpswap/actor";
import type { FarmRewardInfo, FarmState, FarmStatusArgs } from "@icpswap/types";
import { optionalArg, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getFarmRewardInfo(farmId: string) {
  const result = await (await farmIndex()).getFarmRewardTokenInfo(Principal.fromText(farmId));
  return resultFormat<FarmRewardInfo>(result).data;
}

export function useFarmRewardInfo(
  farmId: string | undefined,
  refresh?: number,
): UseQueryResult<FarmRewardInfo | undefined, Error> {
  return useQuery({
    queryKey: ["useFarmRewardInfo", farmId, refresh],
    queryFn: async () => {
      if (!farmId) return undefined;
      return await getFarmRewardInfo(farmId);
    },
    enabled: !!farmId,
  });
}

export async function getFarmRewardInfos(state: FarmState | undefined) {
  const result = await (
    await farmIndex()
  ).getFarmRewardTokenInfos(optionalArg<FarmStatusArgs>(state ? ({ [state]: null } as FarmStatusArgs) : undefined));

  return resultFormat<Array<[Principal, FarmRewardInfo]>>(result).data;
}

export function useFarmRewardInfos(
  state: FarmState | undefined,
  refresh?: number,
): UseQueryResult<Array<[Principal, FarmRewardInfo]> | undefined, Error> {
  return useQuery({
    queryKey: ["useFarmRewardInfos", state, refresh],
    queryFn: async () => {
      return await getFarmRewardInfos(state);
    },
  });
}
