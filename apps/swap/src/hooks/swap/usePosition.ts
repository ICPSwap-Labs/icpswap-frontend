import { Position } from "@icpswap/swap-sdk";
import { useSwapPoolMetadata } from "@icpswap/hooks";
import { usePool, PoolState } from "hooks/swap/usePools";
import { useCurrency } from "hooks/useCurrency";

export interface usePositionProps {
  poolId: string | undefined;
  tickLower: bigint | undefined;
  tickUpper: bigint | undefined;
  liquidity: bigint | undefined;
}

export function usePosition(userPosition: usePositionProps | undefined) {
  const { result: poolMetadata } = useSwapPoolMetadata(userPosition?.poolId);

  const [, currency0] = useCurrency(poolMetadata?.token0.address);
  const [, currency1] = useCurrency(poolMetadata?.token1.address);

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
