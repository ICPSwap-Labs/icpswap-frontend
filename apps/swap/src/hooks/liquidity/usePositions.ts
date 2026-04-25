import { useSwapPositions, useSwapUserPositions } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { useMemo } from "react";
import type { PositionDetails } from "types/swap";

export function usePositions(poolId: string | Null, principal: string | undefined, offset: number, limit: number) {
  const { data: swapPoolPositions, isLoading: allPositionsLoading } = useSwapPositions(poolId, offset, limit);

  const { data: userSwapPoolAllPositions, isLoading: userAllPositionsLoading } = useSwapUserPositions(
    poolId,
    principal,
  );

  return useMemo(() => {
    if (principal) {
      return {
        loading: userAllPositionsLoading,
        result: userSwapPoolAllPositions
          ? {
              offset: 0,
              limit: 10,
              totalElements: 0,
              content: userSwapPoolAllPositions.map((ele) => ({ ...ele, poolId }) as PositionDetails),
            }
          : undefined,
      };
    }

    return {
      loading: allPositionsLoading,
      result: swapPoolPositions
        ? {
            offset: swapPoolPositions.offset,
            limit: swapPoolPositions.limit,
            totalElements: swapPoolPositions.totalElements,
            content: swapPoolPositions.content.map((ele) => ({ ...ele, poolId }) as PositionDetails),
          }
        : undefined,
    };
  }, [swapPoolPositions, userSwapPoolAllPositions, principal, userAllPositionsLoading, allPositionsLoading, poolId]);
}
