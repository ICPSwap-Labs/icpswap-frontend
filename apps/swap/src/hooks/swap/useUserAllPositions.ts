import { getSwapPosition } from "@icpswap/hooks";
import { useEffect, useMemo, useState } from "react";
import { UserPosition } from "types/swap";
import { useStoreUserPositionPools } from "store/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { isNullArgs } from "@icpswap/utils";
import { Null } from "@icpswap/types";

import { getUserPositionIds } from "./useUserPositionIds";

type UserPositions = {
  positions: bigint[];
  poolId: string;
};

export function useUserAllPositionsByPoolIds(poolIds: string[] | undefined, refresh?: number) {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<UserPosition[] | undefined>(undefined);

  const principal = useAccountPrincipal();

  useEffect(() => {
    async function call() {
      if (isNullArgs(poolIds) || poolIds.length === 0 || isNullArgs(principal)) {
        setPositions([]);
        return;
      }

      setLoading(true);

      const userPositionsResult = (
        await Promise.all(
          poolIds.map(async (poolId: string) => {
            return await getUserPositionIds(poolId, principal.toString());
          }),
        )
      )
        .map((positions, index) => (positions ? { positions, poolId: poolIds[index] } : undefined))
        .filter((ele) => !!ele) as UserPositions[];

      const positions = await Promise.all(
        userPositionsResult
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
  }, [poolIds, principal, refresh]);

  return useMemo(() => ({ loading, result: positions }), [positions, loading]);
}

export function useUserAllPositions(refresh?: number) {
  const userPositionPools = useStoreUserPositionPools();
  return useUserAllPositionsByPoolIds(userPositionPools, refresh);
}

export function useUserPoolPositions(poolId: string | Null, refresh?: number) {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<UserPosition[]>([]);

  const principal = useAccountPrincipal();

  useEffect(() => {
    async function call() {
      if (!!principal && poolId) {
        setLoading(true);

        const userPositionsResult = await getUserPositionIds(poolId, principal.toString());

        if (userPositionsResult) {
          const positions = await Promise.all(
            userPositionsResult.map(async (index) => {
              const position = await getSwapPosition(poolId, index);
              return { ...position, id: poolId, index: Number(index) };
            }),
          );

          setPositions(positions.filter((position) => !!position) as UserPosition[]);
        }

        setLoading(false);
      } else {
        setPositions([]);
      }
    }

    call();
  }, [principal, refresh, poolId]);

  return useMemo(() => ({ loading, result: positions }), [positions, loading]);
}
