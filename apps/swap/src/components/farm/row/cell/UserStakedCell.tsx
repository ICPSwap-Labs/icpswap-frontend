import { Flex, BodyCell } from "@icpswap/ui";
import { useMemo } from "react";
import { useUserTvlValue } from "hooks/staking-farm";
import { useToken } from "hooks/useCurrency";
import { formatDollarAmount, isUndefinedOrNull } from "@icpswap/utils";
import type { FarmInfo, Null } from "@icpswap/types";

interface UserStakedCellProps {
  farmId: string;
  farmInfo: FarmInfo | Null;
}

export function UserStakedCell({ farmId, farmInfo }: UserStakedCellProps) {
  const { poolToken0Id, poolToken1Id } = useMemo(() => {
    if (isUndefinedOrNull(farmInfo)) return {};

    return {
      poolId: farmInfo.pool.toString(),
      poolToken0Id: farmInfo.poolToken0.address,
      poolToken1Id: farmInfo.poolToken1.address,
    };
  }, [farmInfo]);

  const [, token0] = useToken(poolToken0Id);
  const [, token1] = useToken(poolToken1Id);

  const userTvlValue = useUserTvlValue({ farmId, token0, token1 });

  return (
    <Flex justify="flex-end" className="row-item">
      <BodyCell>{userTvlValue ? formatDollarAmount(userTvlValue) : "--"}</BodyCell>
    </Flex>
  );
}
