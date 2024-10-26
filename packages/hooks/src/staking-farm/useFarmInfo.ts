import { useCallback } from "react";
import { resultFormat, availableArgsNull } from "@icpswap/utils";
import { Principal } from "@dfinity/principal";
import { farmIndex } from "@icpswap/actor";
import type { FarmState, FarmStatusArgs, FarmRewardInfo } from "@icpswap/types";

import { useCallsData } from "../useCallData";

export async function getFarmRewardInfo(farmId: string) {
  const result = await (await farmIndex()).getFarmRewardTokenInfo(Principal.fromText(farmId));
  return resultFormat<FarmRewardInfo>(result).data;
}

export function useFarmRewardInfo(farmId: string | undefined, refresh?: number) {
  return useCallsData(
    useCallback(async () => {
      if (!farmId) return undefined;
      return await getFarmRewardInfo(farmId);
    }, [farmId]),
    refresh,
  );
}

export async function getFarmRewardInfos(state: FarmState | undefined) {
  const result = await (
    await farmIndex()
  ).getFarmRewardTokenInfos(
    availableArgsNull<FarmStatusArgs>(state ? ({ [state]: null } as FarmStatusArgs) : undefined),
  );

  return resultFormat<Array<[Principal, FarmRewardInfo]>>(result).data;
}

export function useFarmRewardInfos(state: FarmState | undefined, refresh?: number) {
  return useCallsData(
    useCallback(async () => {
      return await getFarmRewardInfos(state);
    }, [state]),
    refresh,
  );
}
