import { useMemo } from "react";
import { useNodeInfoAllPools } from "@icpswap/hooks";
import { Null } from "@icpswap/types";
import { ICP } from "@icpswap/tokens";

interface UesTokenPairWithIcpProps {
  tokenId: string | Null;
}

export function uesTokenPairWithIcp({ tokenId }: UesTokenPairWithIcpProps) {
  const { result: infoAllPools } = useNodeInfoAllPools();

  return useMemo(() => {
    if (!tokenId || !infoAllPools) return null;

    const infoPool = infoAllPools.find((element) =>
      element.token0Id === tokenId || element.token0Id === tokenId
        ? element.token0Id === tokenId
          ? element.token1Id === ICP.address
          : element.token0Id === ICP.address
        : false,
    );

    return infoPool?.pool;
  }, [tokenId, infoAllPools]);
}
