import { useMemo } from "react";
import { parseTokenAmount } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import BigNumber from "bignumber.js";
import { useICPPrice } from "store/global/hooks";
import { StakingPoolInfo } from "@icpswap/types";

export interface UserStakingProps {
  poolInfo: StakingPoolInfo | undefined | null;
  rewardToken: Token | undefined | null;
  stakeToken: Token | undefined | null;
  rewardTokenPrice: string | number | undefined | null;
  stakeTokenPrice: string | number | undefined | null;
}

// apr = (amountPerSecond * 3600  * 24 * 365) / totalStakedAmount * 100 * (rewardTokenPrice / stakedTokenPrice)
export function useApr({ poolInfo, rewardToken, stakeToken, rewardTokenPrice, stakeTokenPrice }: UserStakingProps) {
  const ICPPrice = useICPPrice();

  const { totalDeposit } = useMemo(() => {
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
    if (poolInfo?.rewardPerTime && stakeToken && rewardToken && totalDeposit) {
      const poolInfoPerSecond = Number(poolInfo.rewardPerTime);
      if (ICPPrice && rewardTokenPrice && stakeTokenPrice && rewardToken.decimals && poolInfoPerSecond > 0) {
        const perSecond = parseTokenAmount(poolInfoPerSecond, rewardToken.decimals).toNumber();
        const apr =
          ((perSecond * 3600 * 24 * 365) / totalDeposit) *
          100 *
          new BigNumber(rewardTokenPrice).dividedBy(stakeTokenPrice).toNumber();

        return Number.isFinite(apr) ? `${new BigNumber(apr).toFixed(2)}%` : undefined;
      }
    }

    return undefined;
  }, [ICPPrice, totalDeposit, poolInfo, rewardToken, rewardTokenPrice, stakeTokenPrice, stakeToken]);
}
