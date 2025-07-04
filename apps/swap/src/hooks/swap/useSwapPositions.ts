import { getSwapPosition } from "@icpswap/hooks";
import { isUndefinedOrNull } from "@icpswap/utils";
import { Null, type FarmInfoWithId } from "@icpswap/types";
import { useEffect, useMemo, useState } from "react";
import { UserPosition, UserPositionForFarm } from "types/swap";
import { useAccountPrincipal } from "store/auth/hooks";

type UserPositions = {
  positions: bigint[];
  poolId: string;
};

export function useSwapPositions(data: UserPositions[] | undefined, refresh?: number) {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<UserPosition[] | undefined>(undefined);

  const principal = useAccountPrincipal();

  useEffect(() => {
    async function call() {
      if (isUndefinedOrNull(data)) return;
      if (data.length === 0 || isUndefinedOrNull(principal)) {
        setPositions([]);
        return;
      }

      setLoading(true);

      const positions = await Promise.all(
        data
          .reduce(
            (prev, curr) => {
              return prev.concat(curr.positions.map((index) => [curr.poolId, index]));
            },
            [] as [string, bigint][],
          )
          .map(async ([canisterId, index]) => {
            const position = await getSwapPosition(canisterId, index);
            return { ...position, id: canisterId, index: Number(index) };
          }),
      );

      setPositions(positions.filter((position) => !!position) as UserPosition[]);
      setLoading(false);
    }

    call();
  }, [data, principal, refresh]);

  return useMemo(() => ({ loading, result: positions }), [positions, loading]);
}

export function useSwapPositionsMultipleFarm(farms: FarmInfoWithId[] | Null, refresh?: number) {
  const principal = useAccountPrincipal();
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<UserPositionForFarm[] | undefined>(undefined);

  useEffect(() => {
    async function call() {
      if (isUndefinedOrNull(farms) || isUndefinedOrNull(principal) || farms.length === 0) {
        setPositions([]);
        return;
      }

      setLoading(true);

      const positions = await Promise.all(
        farms
          .reduce(
            (prev, curr) => {
              return prev.concat(curr.positionIds.map((positionId) => [curr.pool.toString(), positionId, curr]));
            },
            [] as [string, bigint, FarmInfoWithId][],
          )
          .map(async ([poolId, positionId, farm]) => {
            const position = await getSwapPosition(poolId.toString(), positionId);

            return {
              position,
              poolId: poolId.toString(),
              farm,
              positionId,
            };
          }),
      );

      setPositions(positions.filter((position) => !!position));
      setLoading(false);
    }

    call();
  }, [farms, principal, refresh]);

  return useMemo(() => ({ loading, result: positions }), [positions, loading]);
}

export function useSwapPositionsByFarm(farm: FarmInfoWithId | undefined, refresh?: number) {
  return useSwapPositionsMultipleFarm(farm ? [farm] : undefined, refresh);
}
