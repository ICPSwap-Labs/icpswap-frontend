import { useEffect, useMemo, useState } from "react";
import { useSwapPools, getSwapUserPositions } from "@icpswap/hooks";
import { UserPosition } from "types/swap";

export function useUserAllPositions(principal: string | undefined | null, reload?: boolean) {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<undefined | UserPosition[]>(undefined);

  const { result: pools, loading: poolsLoading } = useSwapPools();

  const poolIds = useMemo(() => {
    return pools?.map((pool) => pool.canisterId.toString());
  }, [pools]);

  useEffect(() => {
    async function call() {
      if (!poolIds || !principal) return;

      setLoading(true);

      const result = await Promise.all(
        poolIds.map(async (poolId: string) => {
          try {
            const result = await getSwapUserPositions(poolId, principal);
            return result?.map((ele) => ({ ...ele, poolId }));
          } catch (error) {
            return undefined;
          }
        }),
      );

      const positions = (result.filter((ele) => !!ele) as UserPosition[][]).flat();

      setPositions(positions);

      setLoading(false);
    }

    call();
  }, [poolIds, reload, principal]);

  return useMemo(
    () => ({
      loading: loading || poolsLoading,
      result: positions,
      pools,
    }),
    [positions, pools, poolsLoading, loading],
  );
}
