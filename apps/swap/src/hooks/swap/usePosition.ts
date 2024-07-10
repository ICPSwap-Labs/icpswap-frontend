import { useMemo } from "react";
import { Position, Pool } from "@icpswap/swap-sdk";
import { useSwapPoolMetadata } from "@icpswap/hooks";
import { usePool, PoolState } from "hooks/swap/usePools";
import { useToken } from "hooks/useCurrency";
import type { PoolMetadata } from "@icpswap/types";

export interface UsePositionProps {
  poolId: string | undefined;
  tickLower: bigint | undefined;
  tickUpper: bigint | undefined;
  liquidity: bigint | undefined;
}

export function usePosition(userPosition: UsePositionProps | undefined) {
  const { result: poolMetadata } = useSwapPoolMetadata(userPosition?.poolId);

  const [, currency0] = useToken(poolMetadata?.token0.address);
  const [, currency1] = useToken(poolMetadata?.token1.address);

  const [poolState, pool] = usePool(
    currency0 ?? undefined,
    currency1 ?? undefined,
    poolMetadata?.fee ? Number(poolMetadata.fee) : undefined,
  );

  let position: Position | undefined;

  if (
    pool &&
    poolMetadata &&
    userPosition &&
    userPosition.tickLower !== undefined &&
    userPosition.tickUpper !== undefined &&
    userPosition.liquidity !== undefined
  ) {
    position = new Position({
      pool,
      liquidity: userPosition.liquidity.toString(),
      tickLower: Number(userPosition.tickLower),
      tickUpper: Number(userPosition.tickUpper),
    });
  }

  return {
    loading: poolState === PoolState.LOADING,
    checking: poolState === PoolState.NOT_CHECK,
    position,
    pool: pool ?? undefined,
  };
}

export interface usePositionWithPoolProps {
  pool: Pool | null | undefined;
  liquidity: number | string | undefined;
  tickLower: number | string | undefined;
  tickUpper: number | string | undefined;
}

export function usePositionWithPool({ tickLower, tickUpper, liquidity, pool }: usePositionWithPoolProps) {
  let position: Position | undefined;

  if (pool && liquidity && (tickLower || tickLower === 0) && (tickUpper || tickUpper === 0)) {
    position = new Position({
      pool,
      liquidity,
      tickLower: Number(tickLower),
      tickUpper: Number(tickUpper),
    });
  }

  return useMemo(() => position, [position]);
}

export interface PositionInfo {
  liquidity: bigint;
  tickLower: bigint;
  tickUpper: bigint;
}

export interface UseMultiplePositionProps {
  positionInfos: PositionInfo[] | undefined;
  metadata: PoolMetadata | undefined;
}

export function useMultiplePositions({ metadata, positionInfos }: UseMultiplePositionProps) {
  const [, currency0] = useToken(metadata?.token0.address);
  const [, currency1] = useToken(metadata?.token1.address);

  const [, pool] = usePool(
    currency0 ?? undefined,
    currency1 ?? undefined,
    metadata?.fee ? Number(metadata.fee) : undefined,
  );

  return useMemo(() => {
    if (!positionInfos || !pool) return undefined;

    const positions = positionInfos.map(
      (info) =>
        new Position({
          pool,
          liquidity: info.liquidity.toString(),
          tickLower: Number(info.tickLower),
          tickUpper: Number(info.tickUpper),
        }),
    );

    return positions;
  }, [positionInfos, pool]);
}
