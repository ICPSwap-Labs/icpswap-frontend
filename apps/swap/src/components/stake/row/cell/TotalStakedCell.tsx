import type { Null, StakingPoolControllerPoolInfo, StakingPoolInfo } from "@icpswap/types";
import { BodyCell, Flex } from "@icpswap/ui";
import { formatDollarAmount, parseTokenAmount } from "@icpswap/utils";
import { useToken } from "hooks/useCurrency";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useMemo } from "react";

interface TotalStakedCellProps {
  poolInfo: StakingPoolControllerPoolInfo;
  stakingPoolInfo: StakingPoolInfo | Null;
}

export function TotalStakedCell({ poolInfo, stakingPoolInfo }: TotalStakedCellProps) {
  const [, stakeToken] = useToken(poolInfo.stakingToken.address);
  const stakeTokenPrice = useUSDPrice(stakeToken);

  const poolStakeTvl = useMemo(() => {
    if (!stakeToken || !stakeTokenPrice || !stakingPoolInfo) return undefined;
    return parseTokenAmount(stakingPoolInfo.totalDeposit, stakeToken.decimals).multipliedBy(stakeTokenPrice).toString();
  }, [stakeToken, stakeTokenPrice, stakingPoolInfo]);

  return (
    <Flex justify="flex-end" className="row-item">
      <BodyCell>{poolStakeTvl ? formatDollarAmount(poolStakeTvl) : "--"}</BodyCell>
    </Flex>
  );
}
