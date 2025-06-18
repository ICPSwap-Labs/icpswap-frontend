import { Flex, APRPanel, BodyCell } from "@icpswap/ui";
import { useMemo } from "react";
import { useToken } from "hooks/useCurrency";
import { formatDollarAmount, parseTokenAmount, BigNumber, nonUndefinedOrNull, formatAmount } from "@icpswap/utils";
import { useFarmAvgApr } from "@icpswap/hooks";
import type { FarmInfo } from "@icpswap/types";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useTranslation } from "react-i18next";

interface AvgAprCellProps {
  farmId: string;
  farmInfo: FarmInfo;
}

export function AvgAprCell({ farmId, farmInfo }: AvgAprCellProps) {
  const { t } = useTranslation();
  const { result: avgAPR } = useFarmAvgApr(farmId);

  const [, rewardToken] = useToken(farmInfo?.rewardToken.address);
  const rewardTokenPrice = useUSDPrice(rewardToken);

  const apr = useMemo(() => {
    return avgAPR ? `${new BigNumber(avgAPR).toFixed(2)}%` : null;
  }, [avgAPR]);

  const { totalRewardAmount, totalRewardUSD } = useMemo(() => {
    if (nonUndefinedOrNull(farmInfo) && nonUndefinedOrNull(rewardToken)) {
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
            nonUndefinedOrNull(rewardToken) && nonUndefinedOrNull(totalRewardAmount)
              ? t("farm.apr.descriptions", {
                  reward: `${formatAmount(totalRewardAmount)} ${rewardToken.symbol}`,
                  rewardUsd: nonUndefinedOrNull(totalRewardUSD) ? formatDollarAmount(totalRewardUSD) : "--",
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
