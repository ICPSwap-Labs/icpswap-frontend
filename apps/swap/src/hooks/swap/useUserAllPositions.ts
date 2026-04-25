import { getSwapUserPositions } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAccountPrincipal } from "store/auth/hooks";
import { useStoreUserPositionPools } from "store/hooks";
import type { UserPositionByList } from "types/swap";

export function useUserAllPositionsByPoolIds(poolIds: string[] | undefined, refresh?: number) {
  const principal = useAccountPrincipal();

  const { isLoading, data } = useQuery({
    queryKey: ["userAllPositionsByPoolIds", poolIds, principal, refresh],
    queryFn: async () => {
      if (isUndefinedOrNull(poolIds) || poolIds.length === 0 || isUndefinedOrNull(principal)) {
        return [];
      }

      const allPositions = await Promise.all(
        poolIds.map(async (poolId: string) => {
          const positions = await getSwapUserPositions(poolId, principal.toString());

          return {
            positions: positions ?? [],
            poolId,
          };
        }),
      );

      const positions = allPositions.reduce((prev, curr) => {
        const __positions = curr.positions.map((position) => ({ position, poolId: curr.poolId }));
        return prev.concat(__positions);
      }, [] as UserPositionByList[]);

      return positions;
    },
  });

  return useMemo(() => ({ loading: isLoading, result: data }), [data, isLoading]);
}

export function useUserAllPositions(refresh?: number) {
  const userPositionPools = useStoreUserPositionPools();
  return useUserAllPositionsByPoolIds(userPositionPools, refresh);
}

export function useUserPoolPositions(poolId: string | Null, refresh?: number) {
  const poolIds = useMemo(() => {
    return poolId ? [poolId] : undefined;
  }, [poolId]);

  return useUserAllPositionsByPoolIds(poolIds, refresh);
}
