import { useMemo } from "react";
import type { PoolMetadata } from "@icpswap/types";
import { BigNumber } from "@icpswap/utils";
import { useInfoAllTokens } from "@icpswap/hooks";
import { useMultiplePositions, type PositionInfo } from "hooks/swap/useMultiplePositions";

export interface UseMultiPositionsValueProps {
  positionInfos: PositionInfo[] | undefined;
  metadata: PoolMetadata | undefined;
}

export function useMultiPoolPositionsValue(args: UseMultiPositionsValueProps[]) {
  const allTokenInfos = useInfoAllTokens();

  const positions = useMultiplePositions(args);

  return useMemo(() => {
    if (!allTokenInfos || !positions) return undefined;
    if (allTokenInfos.length === 0 || positions.length === 0) return undefined;

    const vals = positions.flat().map((position) => {
      if (position) {
        const token0Amount = position.amount0.toExact();
        const token1Amount = position.amount1.toExact();

        const token0Price = allTokenInfos.find((info) => info.address === position.pool.token0.address)?.priceUSD;
        const token1Price = allTokenInfos.find((info) => info.address === position.pool.token1.address)?.priceUSD;

        if (token0Price !== undefined && token1Price !== undefined) {
          return new BigNumber(token0Amount)
            .multipliedBy(token0Price)
            .plus(new BigNumber(token1Amount).multipliedBy(token1Price));
        }
      }

      return null;
    });

    return vals;
  }, [JSON.stringify(positions), allTokenInfos]);
}

export interface UsePositionsValue {
  positionInfos: PositionInfo[] | undefined;
  metadata: PoolMetadata | undefined;
}

export function usePositionsValue({ metadata, positionInfos }: UsePositionsValue) {
  return useMultiPoolPositionsValue([{ metadata, positionInfos }]);
}

export interface UseMultiPoolPositionsTotalValue {
  positionInfos: PositionInfo[] | undefined;
  metadata: PoolMetadata | undefined;
}

export function useMultiPoolPositionsTotalValue(args: UseMultiPoolPositionsTotalValue[]) {
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

export interface UsePositionsTotalValue {
  positionInfos: PositionInfo[] | undefined;
  metadata: PoolMetadata | undefined;
}

export function usePositionsTotalValue({ metadata, positionInfos }: UsePositionsTotalValue) {
  return useMultiPoolPositionsTotalValue([{ metadata, positionInfos }]);
}
