import { useCallback, useMemo, useState } from "react";
import { useICPPrice, useUSDPrice } from "hooks/useUSDPrice";
import { resultFormat, parseTokenAmount, formatDollarAmount } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { Token } from "@icpswap/swap-sdk";
import {
  getV3StakingFarms,
  usePaginationAllData,
  getPaginationAllData,
  useCallsData,
  getV3UserFarmInfo,
  getV3UserFarmRewardInfo,
  getFarmTVL,
  getFarmUserTVL,
} from "@icpswap/hooks";
import { v3FarmController, v3Farm } from "@icpswap/actor";
import { type StakingFarmInfo, type ActorIdentity } from "@icpswap/types";
import { useIntervalFetch } from "hooks/useIntervalFetch";
import { useAccountPrincipalString } from "store/auth/hooks";

type GlobalData = { stakeTokenTVL: string; rewardTokenTVL: string };

export function useGetGlobalData(): [GlobalData, () => void] {
  const _ICPPrice = useICPPrice();

  const [data, setData] = useState<GlobalData>({
    stakeTokenTVL: "0",
    rewardTokenTVL: "0",
  });

  const [forceUpdate, setForceUpdate] = useState(0);

  useMemo(async () => {
    if (_ICPPrice) {
      const { data } = resultFormat<{ stakedTokenTVL: number; rewardTokenTVL: number }>(
        await (await v3FarmController()).getGlobalTVL(),
      );

      if (data) {
        setData({
          stakeTokenTVL: formatDollarAmount(new BigNumber(data.stakedTokenTVL).multipliedBy(_ICPPrice).toFixed(4)),
          rewardTokenTVL: formatDollarAmount(new BigNumber(data.rewardTokenTVL).multipliedBy(_ICPPrice).toFixed(4)),
        });
      }
    }
  }, [_ICPPrice, forceUpdate]);

  const update = useCallback(() => {
    setForceUpdate((prevState) => prevState + 1);
  }, [setForceUpdate]);

  return [data, update];
}

export async function getAllFarms() {
  const call = async (offset: number, limit: number) => {
    return await getV3StakingFarms(offset, limit, "all");
  };

  return getPaginationAllData(call, 400);
}

export function useAllFarmPools() {
  const call = useCallback(async (offset: number, limit: number) => {
    return await getV3StakingFarms(offset, limit, "all");
  }, []);

  return usePaginationAllData(call, 100);
}

export function useIntervalUserFarmInfo(canisterId: string | undefined, user: string | undefined, force?: boolean) {
  const call = useCallback(async () => {
    if (!canisterId || !user) return undefined;
    return await getV3UserFarmInfo(canisterId, user);
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

export async function stake(identity: ActorIdentity, farmId: string, positionIndex: bigint) {
  const result = await (await v3Farm(farmId, identity)).stake(positionIndex);
  return resultFormat<string>(result);
}

export async function unStake(identity: ActorIdentity, farmId: string, tokenId: bigint) {
  const result = await (await v3Farm(farmId, identity)).unstake(tokenId);
  return resultFormat<string>(result);
}

export function usePoolCycles(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return resultFormat<{ balance: bigint }>(await (await v3Farm(canisterId)).getCycleInfo()).data?.balance;
    }, [canisterId]),
  );
}

export function useV3StakingCycles(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return resultFormat<{ balance: bigint; available: bigint }>(await (await v3Farm(canisterId)).getCycleInfo()).data;
    }, [canisterId]),
  );
}

export function useFarmUSDValue(
  token0: Token | undefined,
  token1: Token | undefined,
  rewardToken: Token | undefined,
  farm: StakingFarmInfo,
  userRewardAmount: bigint | undefined,
  userFarmInfo: StakingFarmInfo | undefined,
) {
  const rewardTokenPrice = useUSDPrice(rewardToken);
  const icpPrice = useICPPrice();

  const principal = useAccountPrincipalString();

  const farmTVL = userIntervalFarmTVL(farm.farmCid);

  const poolTVL = useMemo(() => {
    if (!farmTVL || !icpPrice) return 0;
    return new BigNumber(icpPrice).multipliedBy(farmTVL.stakedTokenTVL).toFixed(3);
  }, [farmTVL, icpPrice]);

  const totalRewardUSD = useMemo(() => {
    if (!rewardToken || !rewardTokenPrice) {
      return 0;
    }

    const usdValue = new BigNumber(rewardTokenPrice).multipliedBy(farm.totalReward.toString());

    return usdValue.toNumber();
  }, [rewardToken, farm, rewardTokenPrice]);

  const userRewardUSD = useMemo(() => {
    if (!rewardToken || !rewardTokenPrice || !userRewardAmount) {
      return 0;
    }

    return new BigNumber(rewardTokenPrice)
      .multipliedBy(parseTokenAmount(userRewardAmount, rewardToken.decimals))
      .toNumber();
  }, [rewardToken, rewardTokenPrice, userRewardAmount]);

  const parsedUserRewardAmount = useMemo(() => {
    if (!rewardToken || !userRewardAmount) return undefined;

    return parseTokenAmount(userRewardAmount, rewardToken.decimals).toNumber();
  }, [rewardToken, userRewardAmount]);

  const userTVLAmount = userIntervalFarmUserTVL(farm.farmCid, principal);

  const userTVL = useMemo(() => {
    if (!userTVLAmount || !icpPrice) return 0;
    return new BigNumber(userTVLAmount).multipliedBy(icpPrice).toFixed(3);
  }, [userTVLAmount, icpPrice]);

  return useMemo(
    () => ({
      poolTVL,
      totalRewardUSD,
      userRewardUSD,
      parsedUserRewardAmount,
      userTVL,
    }),
    [poolTVL, userTVL, userRewardUSD, totalRewardUSD, parsedUserRewardAmount],
  );
}
