import type { FarmInfo } from "@icpswap/types";
import { BodyCell, Flex } from "@icpswap/ui";
import { BigNumber, formatAmount, formatDollarAmount, nonUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { Typography } from "components/Mui";
import { useToken } from "hooks/useCurrency";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useMemo } from "react";

export interface TotalRewardsCellProps {
  farmInfo: FarmInfo;
}

export function TotalRewardsCell({ farmInfo }: TotalRewardsCellProps) {
  const [, rewardToken] = useToken(farmInfo?.rewardToken.address);

  const rewardTokenPrice = useUSDPrice(rewardToken);

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
    <Flex vertical gap="5px 0" className="row-item" justify="center" align="flex-end">
      <Flex justify="flex-end">
        <BodyCell>
          {nonUndefinedOrNull(totalRewardAmount) && nonUndefinedOrNull(rewardToken) ? (
            <>
              {formatAmount(totalRewardAmount)}
              &nbsp;
              {rewardToken.symbol}
            </>
          ) : (
            "--"
          )}
        </BodyCell>
      </Flex>
      <Flex justify="flex-end">
        <Typography sx={{ fontSize: "12px" }}>
          {totalRewardUSD ? `~${formatDollarAmount(totalRewardUSD)}` : "--"}
        </Typography>
      </Flex>
    </Flex>
  );
}
