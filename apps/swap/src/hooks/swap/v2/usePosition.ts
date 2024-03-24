import { Position, Pool } from "@icpswap/swap-sdk";
import { usePool, PoolState, usePoolV1 } from "hooks/swap/v2/usePools";
import { useCurrency } from "hooks/useCurrency";
import { PositionResult, UserPosition } from "types/swapv2";

export function usePositionInfo(positionDetails: PositionResult | UserPosition | undefined | null): {
  loading: boolean;
  position: Position | undefined;
  pool: Pool | undefined;
} {
  const [, currency0] = useCurrency(positionDetails?.token0);
  const [, currency1] = useCurrency(positionDetails?.token1);

  const [poolState, pool] = usePool(
    currency0 ?? undefined,
    currency1 ?? undefined,
    positionDetails?.fee ? Number(positionDetails.fee) : undefined,
  );

  let position: Position | undefined = undefined;
  if (pool && positionDetails) {
    position = new Position({
      pool,
      liquidity: positionDetails.liquidity.toString(),
      tickLower: Number(positionDetails.tickLower),
      tickUpper: Number(positionDetails.tickUpper),
    });
  }

  return {
    loading: poolState === PoolState.LOADING,
    position,
    pool: pool ?? undefined,
  };
}

export function usePositionInfoV1(positionDetails: PositionResult | UserPosition | undefined | null): {
  loading: boolean;
  position: Position | undefined;
  pool: Pool | undefined;
} {
  const [, currency0] = useCurrency(positionDetails?.token0);
  const [, currency1] = useCurrency(positionDetails?.token1);

  const [poolState, pool] = usePoolV1(
    currency0 ?? undefined,
    currency1 ?? undefined,
    positionDetails?.fee ? Number(positionDetails.fee) : undefined,
  );

  let position: Position | undefined = undefined;
  if (pool && positionDetails) {
    position = new Position({
      pool,
      liquidity: positionDetails.liquidity.toString(),
      tickLower: Number(positionDetails.tickLower),
      tickUpper: Number(positionDetails.tickUpper),
    });
  }

  return {
    loading: poolState === PoolState.LOADING,
    position,
    pool: pool ?? undefined,
  };
}
