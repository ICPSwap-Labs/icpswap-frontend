import { getSwapPosition } from "@icpswap/hooks";
import type { FarmInfoWithId, Null } from "@icpswap/types";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { useQuery } from "@tanstack/react-query";
import { useAccountPrincipal } from "store/auth/hooks";
import type { UserPosition } from "types/swap";

type UserPositions = {
  positions: bigint[];
  poolId: string;
};

export function useSwapPositions(data: UserPositions[] | undefined, refresh?: number) {
  const principal = useAccountPrincipal();

  return useQuery({
    queryKey: ["swapPositions", data, refresh, principal],
    queryFn: async () => {
      if (isUndefinedOrNull(data)) return;
      if (data.length === 0 || isUndefinedOrNull(principal)) {
        return [];
      }

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

      return positions.filter((position) => !!position) as UserPosition[];
    },
    enabled: nonUndefinedOrNull(principal) && nonUndefinedOrNull(data),
  });
}

export function useSwapPositionsMultipleFarm(farms: FarmInfoWithId[] | Null, refresh?: number) {
  const principal = useAccountPrincipal();

  return useQuery({
    queryKey: ["swapPositionsMultipleFarm", farms, principal, refresh],
    queryFn: async () => {
      if (isUndefinedOrNull(farms) || isUndefinedOrNull(principal) || farms.length === 0) {
        return [];
      }

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

      return positions.filter((position) => !!position);
    },
    enabled: nonUndefinedOrNull(farms) && farms.length > 0,
  });
}

export function useSwapPositionsByFarm(farm: FarmInfoWithId | undefined, refresh?: number) {
  return useSwapPositionsMultipleFarm(farm ? [farm] : undefined, refresh);
}
