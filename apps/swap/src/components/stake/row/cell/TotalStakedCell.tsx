import { Flex, BodyCell } from "@icpswap/ui";
import { useMemo } from "react";
import { type StakingPoolControllerPoolInfo, StakingPoolInfo, Null } from "@icpswap/types";
import { useToken } from "hooks/useCurrency";
import { formatDollarAmount, parseTokenAmount } from "@icpswap/utils";
import { useUSDPrice } from "hooks/useUSDPrice";

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
