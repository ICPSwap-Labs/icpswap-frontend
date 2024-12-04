import { useMemo } from "react";
import { parseTokenAmount, BigNumber, nowInSeconds, isNullArgs } from "@icpswap/utils";
import type { InitFarmArgs, FarmRewardMetadata, FarmState, FarmDepositArgs } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";
import { useUSDPriceById } from "hooks/useUSDPrice";

export interface UseFarmAprArgs {
  farmTvlValue: string | undefined;
  state: FarmState | undefined;
  farmInitArgs: InitFarmArgs | undefined;
  rewardToken: Token | undefined;
  rewardMetadata: FarmRewardMetadata | undefined;
}

// (Reward token amount each cycles * reward token price / Total valued staked ) * (360 * 24 * 3600/seconds each cycle) *100%
export function useFarmApr({ farmTvlValue, state, rewardToken, farmInitArgs, rewardMetadata }: UseFarmAprArgs) {
  const rewardTokenPrice = useUSDPriceById(rewardToken?.address);

  return useMemo(() => {
    if (!farmTvlValue || !farmInitArgs || !rewardMetadata || !rewardToken || new BigNumber(farmTvlValue).isEqualTo(0))
      return undefined;

    if (state !== "LIVE" || isNullArgs(rewardTokenPrice)) return undefined;

    const val = parseTokenAmount(rewardMetadata.rewardPerCycle, rewardToken.decimals)
      .multipliedBy(rewardTokenPrice)
      .dividedBy(farmTvlValue)
      .multipliedBy(new BigNumber(3600 * 24 * 360).dividedBy(farmInitArgs.secondPerCycle.toString()))
      .multipliedBy(100)
      .toFixed(2);

    return `${val}%`;
  }, [farmTvlValue, state, farmInitArgs, rewardMetadata, rewardToken]);
}

export interface UseUserAprArgs {
  farmTvlValue: string | undefined;
  state: FarmState | undefined;
  farmInitArgs: InitFarmArgs | undefined;
  rewardToken: Token | undefined;
  rewardAmount: string | undefined;
  positionValue: string | undefined;
  deposits: FarmDepositArgs[] | undefined;
}

// (Total rewarded amount * reward token price) / User staked positions total value) * (3600 * 24 * 360 / (staked cycles * seconds each cycles))*100%
export function useUserApr({
  farmTvlValue,
  state,
  rewardToken,
  farmInitArgs,
  positionValue,
  deposits,
  rewardAmount,
}: UseUserAprArgs) {
  const rewardTokenPrice = useUSDPriceById(rewardToken?.address);

  return useMemo(() => {
    if (
      !farmTvlValue ||
      !farmInitArgs ||
      !rewardAmount ||
      !rewardToken ||
      !positionValue ||
      !deposits ||
      new BigNumber(farmTvlValue).isEqualTo(0)
    )
      return undefined;

    if (state !== "LIVE" || isNullArgs(rewardTokenPrice)) return undefined;

    const depositTime = deposits.reduce((prev, curr) => {
      if (prev === BigInt(0)) return curr.initTime;
      return curr.initTime > prev ? curr.initTime : prev;
    }, BigInt(0));

    if (depositTime === BigInt(0)) return undefined;

    const now = nowInSeconds();
    const stakedSeconds = new BigNumber(String(BigInt(now) - depositTime)).toString();

    const val = new BigNumber(rewardAmount)
      .multipliedBy(rewardTokenPrice)
      .dividedBy(positionValue)
      .multipliedBy(3600 * 24 * 360)
      .dividedBy(stakedSeconds)
      .multipliedBy(100)
      .toFixed(2);

    return `${val}%`;
  }, [farmTvlValue, state, farmInitArgs, rewardToken, positionValue, deposits]);
}

export interface UseUserSingleLiquidityAprProps {
  farmTvlValue: string | undefined;
  state: FarmState | undefined;
  farmInitArgs: InitFarmArgs | undefined;
  rewardToken: Token | undefined;
  rewardAmount: string | undefined;
  positionValue: string | undefined;
  deposit: FarmDepositArgs | undefined;
}

export function useUserSingleLiquidityApr({
  farmTvlValue,
  state,
  rewardToken,
  farmInitArgs,
  positionValue,
  deposit,
  rewardAmount,
}: UseUserSingleLiquidityAprProps) {
  const rewardTokenPrice = useUSDPriceById(rewardToken?.address);

  return useMemo(() => {
    if (
      !farmTvlValue ||
      !farmInitArgs ||
      !rewardAmount ||
      !rewardToken ||
      !positionValue ||
      !deposit ||
      new BigNumber(farmTvlValue).isEqualTo(0)
    )
      return undefined;

    if (state !== "LIVE" || isNullArgs(rewardTokenPrice)) return undefined;

    const depositTime = deposit.initTime;

    const now = nowInSeconds();
    const stakedSeconds = new BigNumber(String(BigInt(now) - depositTime)).toString();

    const val = new BigNumber(rewardAmount)
      .multipliedBy(rewardTokenPrice)
      .dividedBy(positionValue)
      .multipliedBy(3600 * 24 * 360)
      .dividedBy(stakedSeconds)
      .multipliedBy(100)
      .toFixed(2);

    return `${val}%`;
  }, [farmTvlValue, state, farmInitArgs, rewardToken, positionValue, deposit]);
}
