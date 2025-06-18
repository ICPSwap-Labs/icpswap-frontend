import { Flex, APRPanel } from "@icpswap/ui";
import { useMemo } from "react";
import { Null, type StakingPoolControllerPoolInfo } from "@icpswap/types";
import { formatDollarAmount, parseTokenAmount, formatAmount, nonUndefinedOrNull, BigNumber } from "@icpswap/utils";
import { useStakePoolStatInfo } from "@icpswap/hooks";
import { StakingPoolInfo } from "@icpswap/types";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useApr } from "hooks/staking-token/useApr";
import { useTranslation } from "react-i18next";
import { useToken } from "hooks/useCurrency";

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
  const { result: stakeStatInfo } = useStakePoolStatInfo(poolInfo.canisterId.toString());

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
