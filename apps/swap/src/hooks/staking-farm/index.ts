import { useCallback } from "react";
import { getUserFarmInfo, getV3UserFarmRewardInfo, getFarmTVL } from "@icpswap/hooks";
import { useIntervalFetch } from "hooks/useIntervalFetch";

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

export * from "./useFarmApr";
export * from "./useFarmTvlValue";
export * from "./useStateColors";
export * from "./useFarmGlobalData";
export * from "./useFarms";
export * from "./useIntervalFarmUserTVL";
export * from "./useUserTvl";
