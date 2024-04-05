import { getSwapPosition } from "@icpswap/hooks";
import { useEffect, useMemo, useState } from "react";
import { UserPosition } from "types/swap";
import { useStoreUserPositionPools } from "store/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { getUserPositionIds } from "./useUserPositionIds";

type UserPositions = {
  positions: bigint[];
  poolId: string;
};

export function useUserAllPositions(refresh?: number) {
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState<UserPosition[]>([]);

  const principal = useAccountPrincipal();

  const userPositionPools = useStoreUserPositionPools();

  useEffect(() => {
    async function call() {
      if (userPositionPools && !!principal) {
        if (userPositionPools.length === 0) {
          setLoading(false);
          setPositions([]);
        } else {
          const userPositionsResult = (
            await Promise.all(
              userPositionPools.map(async (poolId: string) => {
                return await getUserPositionIds(poolId, principal.toString());
              }),
            )
          )
            .map((positions, index) => (positions ? { positions, poolId: userPositionPools[index] } : undefined))
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
      } else if (!principal) {
        setPositions([]);
      }
    }

    call();
  }, [userPositionPools, principal, refresh]);

  return useMemo(() => ({ loading, result: positions }), [positions, loading]);
}

export function useUserPoolPositions(poolId: string | undefined, refresh?: number) {
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
