import { useCallback, useMemo } from "react";
import { useICPPrice } from "hooks/useUSDPrice";
import { parseTokenAmount } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { Token } from "@icpswap/swap-sdk";
import { getUserFarmInfo, getV3UserFarmRewardInfo, getFarmTVL, getFarmUserTVL, useInfoAllTokens } from "@icpswap/hooks";
import type { FarmInfo } from "@icpswap/types";
import { useIntervalFetch } from "hooks/useIntervalFetch";
import { useAccountPrincipalString } from "store/auth/hooks";
import { _getTokenInfo } from "hooks/token/index";
import { useFarmTvlValue } from "./useFarmTvlValue";

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

export function userIntervalFarmUserTVL(
  canisterId: string | undefined,
  principal: string | undefined,
  force?: boolean,
) {
  const call = useCallback(async () => {
    if (!canisterId || !principal) return undefined;
    return await getFarmUserTVL(canisterId, principal);
  }, [canisterId, principal]);

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

export interface useFarmUSDValueArgs {
  token0?: Token | undefined;
  token1?: Token | undefined;
  rewardToken: Token | undefined;
  userFarmInfo: FarmInfo | undefined;
  userRewardAmount: string | undefined;
  farmId: string;
}

export function useFarmUSDValue({
  farmId,
  rewardToken,
  userFarmInfo,
  userRewardAmount,
  token0,
  token1,
}: useFarmUSDValueArgs) {
  const infoAllTokens = useInfoAllTokens();
  const icpPrice = useICPPrice();

  const principal = useAccountPrincipalString();

  const farmTvlValue = useFarmTvlValue({ farmId, token0, token1 });

  const rewardTokenPrice = useMemo(() => {
    if (!rewardToken || !infoAllTokens) return undefined;

    return infoAllTokens.find((token) => token.address === rewardToken.address)?.priceUSD;
  }, [infoAllTokens, rewardToken]);

  const totalRewardUSD = useMemo(() => {
    if (!rewardToken || !rewardTokenPrice || !userFarmInfo) {
      return 0;
    }

    const usdValue = new BigNumber(rewardTokenPrice).multipliedBy(userFarmInfo.totalReward.toString());

    return usdValue.toNumber();
  }, [rewardToken, userFarmInfo, rewardTokenPrice]);

  const userRewardUSD = useMemo(() => {
    if (!rewardToken || !rewardTokenPrice || !userRewardAmount) {
      return 0;
    }

    return new BigNumber(rewardTokenPrice).multipliedBy(userRewardAmount).toNumber();
  }, [rewardToken, rewardTokenPrice, userRewardAmount]);

  const parsedUserRewardAmount = useMemo(() => {
    if (!rewardToken || !userRewardAmount) return undefined;

    return userRewardAmount;
  }, [rewardToken, userRewardAmount]);

  const userTvl = userIntervalFarmUserTVL(farmId, principal);

  const userTvlUSD = useMemo(() => {
    if (!userTvl || !token0 || !token1 || !infoAllTokens || infoAllTokens.length === 0) return undefined;

    const { poolToken0, poolToken1 } = userTvl;

    const token0Price = infoAllTokens.find((e) => e.address === token0.address)?.priceUSD;
    const token1Price = infoAllTokens.find((e) => e.address === token1.address)?.priceUSD;

    if (!token0Price || !token1Price) return undefined;

    const token0Tvl = parseTokenAmount(poolToken0.amount, token0.decimals).multipliedBy(token0Price);
    const token1Tvl = parseTokenAmount(poolToken1.amount, token1.decimals).multipliedBy(token1Price);

    return token0Tvl.plus(token1Tvl).toString();
  }, [userTvl, icpPrice, infoAllTokens]);

  return useMemo(
    () => ({
      farmTvlValue,
      totalRewardUSD,
      userRewardUSD,
      parsedUserRewardAmount,
      userTvl: userTvlUSD,
    }),
    [farmTvlValue, userTvlUSD, userRewardUSD, totalRewardUSD, parsedUserRewardAmount],
  );
}

export * from "./useFarmApr";
export * from "./useFarmTvlValue";
export * from "./useStateColors";
export * from "./useFarmGlobalData";
export * from "./useFarms";
