import { useMemo } from "react";
import { isNullArgs, parseTokenAmount, BigNumber } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { StakingPoolInfo } from "@icpswap/types";

export interface UserStakingProps {
  poolInfo: StakingPoolInfo | undefined | null;
  rewardToken: Token | undefined | null;
  stakeToken: Token | undefined | null;
  rewardTokenPrice: string | number | undefined | null;
  stakeTokenPrice: string | number | undefined | null;
}

// apr = (amountPerSecond  * rewardTokenPrice* 3600  * 24 * 360) / (totalStakedAmount * stakedTokenPrice))
export function useApr({ poolInfo, rewardToken, stakeToken, rewardTokenPrice, stakeTokenPrice }: UserStakingProps) {
  const { totalDepositUSD } = useMemo(() => {
    if (!poolInfo || !stakeToken) return {};

    const totalDeposit = parseTokenAmount(poolInfo.totalDeposit, stakeToken.decimals).toNumber();

    return {
      totalDeposit,
      totalDepositUSD: stakeTokenPrice
        ? new BigNumber(totalDeposit).multipliedBy(stakeTokenPrice).toNumber()
        : undefined,
    };
  }, [poolInfo, stakeToken, stakeTokenPrice]);

  return useMemo(() => {
    if (isNullArgs(totalDepositUSD) || isNullArgs(poolInfo) || isNullArgs(stakeToken) || isNullArgs(rewardToken))
      return undefined;

    const poolInfoPerSecond = Number(poolInfo.rewardPerTime);
    if (rewardTokenPrice && rewardToken.decimals && poolInfoPerSecond > 0) {
      const perSecond = parseTokenAmount(poolInfoPerSecond, rewardToken.decimals).toNumber();

      const apr = new BigNumber(perSecond)
        .multipliedBy(rewardTokenPrice)
        .multipliedBy(3600 * 24 * 360)
        .dividedBy(totalDepositUSD)
        .multipliedBy(100)
        .toNumber();

      return Number.isFinite(apr) ? `${new BigNumber(apr).toFixed(2)}%` : undefined;
    }
  }, [totalDepositUSD, poolInfo, rewardToken, rewardTokenPrice, stakeToken]);
}
