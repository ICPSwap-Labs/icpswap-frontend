import { getSwapUserPositions } from "@icpswap/hooks";
import { useEffect, useMemo, useState } from "react";
import { useStoreUserPositionPools } from "store/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { isUndefinedOrNull } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { UserPositionByList } from "types/swap";

export function useUserAllPositionsByPoolIds(poolIds: string[] | undefined, refresh?: number) {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<UserPositionByList[] | undefined>(undefined);

  const principal = useAccountPrincipal();

  useEffect(() => {
    async function call() {
      if (isUndefinedOrNull(poolIds) || poolIds.length === 0 || isUndefinedOrNull(principal)) {
        setPositions([]);
        return;
      }

      setLoading(true);

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

      setPositions(positions);
      setLoading(false);
    }

    call();
  }, [poolIds, principal, refresh]);

  return useMemo(() => ({ loading, result: positions }), [positions, loading]);
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
