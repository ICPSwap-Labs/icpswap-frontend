import { useStakePoolStatInfo } from "@icpswap/hooks";
import type { Null, StakingPoolControllerPoolInfo, StakingPoolInfo } from "@icpswap/types";
import { APRPanel, Flex } from "@icpswap/ui";
import { BigNumber, formatAmount, formatDollarAmount, nonUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { useApr } from "hooks/staking-token/useApr";
import { useToken } from "hooks/useCurrency";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface AprCellProps {
  poolInfo: StakingPoolControllerPoolInfo;
  stakingPoolInfo: StakingPoolInfo | Null;
}

export function AprCell({ poolInfo, stakingPoolInfo }: AprCellProps) {
  const { t } = useTranslation();

  const [, stakeToken] = useToken(poolInfo.stakingToken.address);
  const [, rewardToken] = useToken(poolInfo.rewardToken.address);
  const stakeTokenPrice = useUSDPrice(stakeToken);
  const rewardTokenPrice = useUSDPrice(rewardToken);
  const { data: stakeStatInfo } = useStakePoolStatInfo(poolInfo.canisterId.toString());

  const apr = useApr({
    poolInfo: stakingPoolInfo,
    stakeToken,
    stakeTokenPrice,
    rewardToken,
    rewardTokenPrice,
  });

  const { rewardAmount, rewardsUSDValue } = useMemo(() => {
    if (nonUndefinedOrNull(rewardToken) && nonUndefinedOrNull(stakeStatInfo)) {
      const amount = parseTokenAmount(stakeStatInfo.rewardTokenAmount, rewardToken.decimals).toString();

      return {
        rewardAmount: amount,
        rewardsUSDValue: !rewardTokenPrice ? null : new BigNumber(amount).multipliedBy(rewardTokenPrice).toString(),
      };
    }

    return {};
  }, [stakeStatInfo, rewardToken, rewardTokenPrice]);

  return (
    <Flex justify="flex-end" className="row-item">
      {apr ? (
        <APRPanel
          value={apr}
          tooltip={
            rewardToken && rewardAmount
              ? t("farm.apr.descriptions", {
                  reward: `${formatAmount(rewardAmount)} ${rewardToken.symbol}`,
                  rewardUsd: rewardsUSDValue ? formatDollarAmount(rewardsUSDValue) : "--",
                })
              : null
          }
        />
      ) : (
        "--"
      )}
    </Flex>
  );
}
