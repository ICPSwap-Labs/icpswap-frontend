import { useSwapPositions, useSwapUserPositions } from "@icpswap/hooks";
import { useMemo } from "react";
import { UserPosition } from "types/swap";

export function usePositions(poolId: string | undefined, principal: string | undefined, offset: number, limit: number) {
  const { result: swapPoolPositions, loading: allPositionsLoading } = useSwapPositions(poolId, offset, limit);

  const { result: userSwapPoolAllPositions, loading: userAllPositionsLoading } = useSwapUserPositions(
    poolId,
    principal,
  );

  return useMemo(() => {
    if (principal) {
      return {
        loading: userAllPositionsLoading,
        result: !!userSwapPoolAllPositions
          ? {
              offset: 0,
              limit: 10,
              totalElements: 0,
              content: userSwapPoolAllPositions.map((ele) => ({ ...ele, poolId }) as UserPosition),
            }
          : undefined,
      };
    }

    return {
      loading: allPositionsLoading,
      result: !!swapPoolPositions
        ? {
            offset: swapPoolPositions.offset,
            limit: swapPoolPositions.limit,
            totalElements: swapPoolPositions.totalElements,
            content: swapPoolPositions.content.map((ele) => ({ ...ele, poolId }) as UserPosition),
          }
        : undefined,
    };
  }, [swapPoolPositions, userSwapPoolAllPositions, principal, userAllPositionsLoading, allPositionsLoading, poolId]);
}
