import { Flex, APRPanel, BodyCell } from "@icpswap/ui";
import { useMemo } from "react";
import { useFarmApr, useFarmTvlValue } from "hooks/staking-farm";
import { useToken } from "hooks/useCurrency";
import { formatDollarAmount, parseTokenAmount, BigNumber, nonNullArgs, formatAmount, isNullArgs } from "@icpswap/utils";
import { useV3FarmRewardMetadata } from "@icpswap/hooks";
import type { FarmInfo, Null, FarmState, InitFarmArgs } from "@icpswap/types";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useTranslation } from "react-i18next";

interface AprCellProps {
  farmId: string;
  farmInfo: FarmInfo | Null;
  state: FarmState;
  initArgs: InitFarmArgs | Null;
}

export function AprCell({ farmId, state, initArgs, farmInfo }: AprCellProps) {
  const { t } = useTranslation();

  const { poolToken0Id, poolToken1Id } = useMemo(() => {
    if (isNullArgs(farmInfo)) return {};

    return {
      poolId: farmInfo.pool.toString(),
      poolToken0Id: farmInfo.poolToken0.address,
      poolToken1Id: farmInfo.poolToken1.address,
    };
  }, [farmInfo]);

  const [, token0] = useToken(poolToken0Id);
  const [, token1] = useToken(poolToken1Id);
  const [, rewardToken] = useToken(farmInfo?.rewardToken.address);

  const rewardTokenPrice = useUSDPrice(rewardToken);

  const farmTvlValue = useFarmTvlValue({
    token0,
    token1,
    farmId,
  });

  const { result: rewardMetadata } = useV3FarmRewardMetadata(farmId);

  const apr = useFarmApr({
    farmTvlValue,
    rewardToken,
    rewardMetadata,
    farmInitArgs: initArgs,
    state,
  });

  const { totalRewardAmount, totalRewardUSD } = useMemo(() => {
    if (nonNullArgs(farmInfo) && nonNullArgs(rewardToken)) {
      const amount = parseTokenAmount(farmInfo.totalReward, rewardToken.decimals).toString();

      return {
        totalRewardAmount: amount,
        totalRewardUSD: rewardTokenPrice ? new BigNumber(amount).multipliedBy(rewardTokenPrice).toString() : null,
      };
    }

    return {};
  }, [farmInfo, rewardToken, rewardTokenPrice]);

  return (
    <Flex justify="flex-end" className="row-item">
      {apr ? (
        <APRPanel
          value={apr}
          tooltip={
            nonNullArgs(rewardToken) && nonNullArgs(totalRewardAmount)
              ? t("farm.apr.descriptions", {
                  reward: `${formatAmount(totalRewardAmount)} ${rewardToken.symbol}`,
                  rewardUsd: nonNullArgs(totalRewardUSD) ? formatDollarAmount(totalRewardUSD) : "--",
                })
              : null
          }
        />
      ) : (
        <BodyCell>--</BodyCell>
      )}
    </Flex>
  );
}
