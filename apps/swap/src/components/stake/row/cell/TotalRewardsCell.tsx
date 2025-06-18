import { Typography } from "components/Mui";
import { Flex, BodyCell } from "@icpswap/ui";
import { useMemo } from "react";
import { type StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useToken } from "hooks/useCurrency";
import { formatDollarAmount, parseTokenAmount, formatAmount, nonUndefinedOrNull, BigNumber } from "@icpswap/utils";
import { useStakePoolStatInfo } from "@icpswap/hooks";
import { useUSDPrice } from "hooks/useUSDPrice";

interface TotalRewardsCellProps {
  poolInfo: StakingPoolControllerPoolInfo;
}

export function TotalRewardsCell({ poolInfo }: TotalRewardsCellProps) {
  const [, rewardToken] = useToken(poolInfo.rewardToken.address);
  const rewardTokenPrice = useUSDPrice(rewardToken);
  const { result: stakeStatInfo } = useStakePoolStatInfo(poolInfo.canisterId.toString());

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
    <Flex vertical gap="5px 0" className="row-item" justify="center" align="flex-end">
      <Flex fullWidth justify="flex-end">
        <BodyCell>
          {rewardAmount && rewardToken ? `${formatAmount(rewardAmount)} ${rewardToken.symbol}` : "--"}
        </BodyCell>
      </Flex>

      <Flex gap="0 4px" justify="flex-end" fullWidth>
        <Typography sx={{ fontSize: "12px" }}>
          {rewardsUSDValue ? `${formatDollarAmount(rewardsUSDValue)}` : "--"}
        </Typography>
      </Flex>
    </Flex>
  );
}
