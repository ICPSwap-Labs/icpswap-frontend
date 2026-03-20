import { getFarmTVL, getUserFarmInfo, getV3UserFarmRewardInfo } from "@icpswap/hooks";
import { useIntervalFetch } from "hooks/useIntervalFetch";
import { useCallback } from "react";

export function useIntervalUserFarmInfo(canisterId: string | undefined, user: string | undefined, force?: boolean) {
  const call = useCallback(async () => {
    if (!canisterId || !user) return undefined;
    return await getUserFarmInfo(canisterId, user);
  }, [canisterId, user]);

  return useIntervalFetch(call, force);
}

export function userIntervalFarmTVL(canisterId: string | undefined, force?: boolean) {
  const call = useCallback(async () => {
    if (!canisterId) return undefined;
    return await getFarmTVL(canisterId);
  }, [canisterId]);

  return useIntervalFetch(call, force);
}

export function useIntervalUserRewardInfo(
  canisterId: string | undefined,
  positionIds: bigint[] | undefined,
  force?: boolean,
) {
  const call = useCallback(async () => {
    if (!canisterId || !positionIds || positionIds.length === 0) return undefined;
    return await getV3UserFarmRewardInfo(canisterId, positionIds);
  }, [canisterId, positionIds]);

  return useIntervalFetch(call, force);
}

export * from "./useAvailableFarmsForPool";
export * from "./useFarmApr";
export * from "./useFarmGlobalData";
export * from "./useFarmRewardAmountAndValue";
export * from "./useFarms";
export * from "./useFarmTvl";
export * from "./useFarmTvlValue";
export * from "./useIntervalFarmUserTVL";
export * from "./useLiquidityIsStaked";
export * from "./useStateColors";
export * from "./useUserAllFarmsInfo";
export * from "./useUserTvl";
