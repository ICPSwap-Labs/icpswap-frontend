import { Flex, BodyCell } from "@icpswap/ui";
import { useMemo } from "react";
import { useToken } from "hooks/useCurrency";
import { isUndefinedOrNull } from "@icpswap/utils";
import type { FarmInfo, Null } from "@icpswap/types";
import { TokenImage } from "components/index";

interface PoolCellProps {
  farmInfo: FarmInfo | Null;
}

export function PoolCell({ farmInfo }: PoolCellProps) {
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

  return (
    <Flex gap="0 8px" className="row-item">
      <Flex>
        <TokenImage logo={token0?.logo} tokenId={token0?.address} size="24px" />
        <TokenImage logo={token1?.logo} tokenId={token1?.address} size="24px" />
      </Flex>

      <BodyCell>{token0 && token1 ? `${token0.symbol}/${token1.symbol} ` : "--"}</BodyCell>
    </Flex>
  );
}
