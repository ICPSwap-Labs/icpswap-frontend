import { Pool, Position } from "@icpswap/swap-sdk";
import { usePool, PoolState } from "hooks/swap/usePools";
import { useToken } from "hooks/useToken";
import { useMemo } from "react";

export interface usePositionProps {
  token0Address: string | undefined;
  token1Address: string | undefined;
  feeAmount: number | undefined;
  liquidity: string | undefined;
  tickLower: number | undefined;
  tickUpper: number | undefined;
}

export function usePosition({
  token0Address,
  token1Address,
  tickLower,
  tickUpper,
  liquidity,
  feeAmount,
}: usePositionProps): {
  loading: boolean;
  position: Position | undefined;
  pool: Pool | undefined;
} {
  const [, currency0] = useToken(token0Address);
  const [, currency1] = useToken(token1Address);

  const [poolState, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined, feeAmount ? feeAmount : undefined);

  let position: Position | undefined = undefined;
  if (pool && liquidity && (tickLower || tickLower === 0) && (tickUpper || tickUpper === 0)) {
    position = new Position({
      pool,
      liquidity: liquidity,
      tickLower: tickLower,
      tickUpper: tickUpper,
    });
  }

  return {
    loading: poolState === PoolState.LOADING,
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
  let position: Position | undefined = undefined;

  if (pool && liquidity && (tickLower || tickLower === 0) && (tickUpper || tickUpper === 0)) {
    position = new Position({
      pool,
      liquidity: liquidity,
      tickLower: Number(tickLower),
      tickUpper: Number(tickUpper),
    });
  }

  return useMemo(() => position, [position]);
}
