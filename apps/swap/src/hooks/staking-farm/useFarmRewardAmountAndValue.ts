import type { Token } from "@icpswap/swap-sdk";
import type { InitFarmArgs } from "@icpswap/types";
import { BigNumber, nonUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { useIntervalUserRewardInfo } from "hooks/staking-farm";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useMemo } from "react";

export interface FarmMainProps {
  farmId: string | undefined;
  rewardToken: Token | undefined;
  farmInitArgs: InitFarmArgs | undefined;
  positionIds: bigint[] | undefined;
  refresh?: number;
}

export function useFarmUserRewardAmountAndValue({ farmId, positionIds, farmInitArgs, rewardToken }: FarmMainProps) {
  const rewardTokenPrice = useUSDPrice(rewardToken);

  const { data: __userRewardAmount } = useIntervalUserRewardInfo(farmId, positionIds);

  const userRewardAmount = useMemo(() => {
    if (!farmInitArgs || __userRewardAmount === undefined || !rewardToken) return undefined;
    const userRewardRatio = new BigNumber(1).minus(new BigNumber(farmInitArgs.fee.toString()).dividedBy(1000));
    return parseTokenAmount(__userRewardAmount, rewardToken.decimals).multipliedBy(userRewardRatio).toString();
  }, [__userRewardAmount, farmInitArgs, rewardToken]);

  return useMemo(
    () => ({
      __userRewardAmount,
      userRewardAmount,
      userRewardValue:
        nonUndefinedOrNull(userRewardAmount) && nonUndefinedOrNull(rewardTokenPrice)
          ? new BigNumber(userRewardAmount).multipliedBy(rewardTokenPrice).toString()
          : undefined,
    }),
    [__userRewardAmount, userRewardAmount, rewardTokenPrice],
  );
}
