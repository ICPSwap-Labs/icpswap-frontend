import { useMemo } from "react";
import type { PoolMetadata } from "@icpswap/types";
import { BigNumber } from "@icpswap/utils";
import { useInfoAllTokens } from "@icpswap/hooks";
import { useMultiplePositions, type PositionInfo } from "hooks/swap/useMultiplePositions";

export interface UseUserPositionsValuesArgs {
  positionInfos: PositionInfo[] | undefined;
  metadata: PoolMetadata | undefined;
}

export function useUserPositionsValues(args: UseUserPositionsValuesArgs[]) {
  const allTokenInfos = useInfoAllTokens();

  const positions = useMultiplePositions(args);

  return useMemo(() => {
    if (!allTokenInfos || !positions) return undefined;
    if (allTokenInfos.length === 0 || positions.length === 0) return undefined;

    let totalValue: BigNumber | undefined;

    positions.flat().forEach((position) => {
      if (position) {
        const token0Amount = position.amount0.toExact();
        const token1Amount = position.amount1.toExact();

        const token0Price = allTokenInfos.find((info) => info.address === position.pool.token0.address)?.priceUSD;
        const token1Price = allTokenInfos.find((info) => info.address === position.pool.token1.address)?.priceUSD;

        if (token0Price !== undefined && token1Price !== undefined) {
          totalValue = (totalValue ?? new BigNumber(0))
            .plus(new BigNumber(token0Amount).multipliedBy(token0Price))
            .plus(new BigNumber(token1Amount).multipliedBy(token1Price));
        }
      }
    });

    return totalValue?.toString();
  }, [JSON.stringify(positions), allTokenInfos]);
}

export interface UseUserPositionsValueArgs {
  positionInfos: PositionInfo[] | undefined;
  metadata: PoolMetadata | undefined;
}

export function useUserPositionsValue({ metadata, positionInfos }: UseUserPositionsValueArgs) {
  return useUserPositionsValues([{ metadata, positionInfos }]);
}
