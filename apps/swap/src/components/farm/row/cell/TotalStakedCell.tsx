import { Flex, BodyCell } from "@icpswap/ui";
import { useMemo } from "react";
import { useFarmTvlValue } from "hooks/staking-farm";
import { useToken } from "hooks/useCurrency";
import { formatDollarAmount, isNullArgs } from "@icpswap/utils";
import type { FarmInfo, Null } from "@icpswap/types";

interface TotalStakedCellProps {
  farmId: string;
  farmInfo: FarmInfo | Null;
}

export function TotalStakedCell({ farmId, farmInfo }: TotalStakedCellProps) {
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

  const farmTvlValue = useFarmTvlValue({
    token0,
    token1,
    farmId,
  });

  return (
    <Flex justify="flex-end" className="row-item">
      <BodyCell>{farmTvlValue ? formatDollarAmount(farmTvlValue) : "--"}</BodyCell>
    </Flex>
  );
}
