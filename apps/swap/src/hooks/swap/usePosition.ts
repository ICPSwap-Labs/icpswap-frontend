import { useMemo } from "react";
import { Position, Pool } from "@icpswap/swap-sdk";
import { usePoolByPoolId, PoolState } from "hooks/swap/usePools";
import { nonNullArgs } from "@icpswap/utils";

export interface UsePositionProps {
  poolId: string | undefined;
  tickLower: bigint | undefined;
  tickUpper: bigint | undefined;
  liquidity: bigint | undefined;
}

export function usePosition(userPosition: UsePositionProps | undefined) {
  const [poolState, pool] = usePoolByPoolId(userPosition?.poolId);

  let position: Position | undefined;

  if (
    pool &&
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
  liquidity: bigint | number | string | undefined;
  tickLower: bigint | number | string | undefined;
  tickUpper: bigint | number | string | undefined;
}

export function usePositionWithPool({ tickLower, tickUpper, liquidity, pool }: usePositionWithPoolProps) {
  let position: Position | undefined;

  if (pool && nonNullArgs(liquidity) && nonNullArgs(tickLower) && nonNullArgs(tickUpper)) {
    position = new Position({
      pool,
      liquidity: liquidity.toString(),
      tickLower: Number(tickLower),
      tickUpper: Number(tickUpper),
    });
  }

  return useMemo(() => position, [position]);
}
