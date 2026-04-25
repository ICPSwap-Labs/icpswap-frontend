import { Principal } from "@icpswap/dfinity";
import { farmIndex } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

/**
 *
 * @param poolIds
 * @returns [Principal, Principal]: [poolId, farmId]
 */
export async function getLiveFarmsByPoolIds(poolIds: string[]) {
  const result = await (await farmIndex()).getLiveFarmsByPools(poolIds.map((poolId) => Principal.fromText(poolId)));
  return resultFormat<Array<[Principal, Principal]>>(result).data;
}

export function useLiveFarmsByPoolIds(
  poolIds: string[] | undefined,
  reload?: boolean,
): UseQueryResult<Array<[Principal, Principal]> | undefined, Error> {
  return useQuery({
    queryKey: ["useLiveFarmsByPoolIds", poolIds, reload],
    queryFn: async () => {
      if (!poolIds) return undefined;

      return await getLiveFarmsByPoolIds(poolIds);
    },
    enabled: !!poolIds,
  });
}

export async function getFarmsByPool(poolId: string) {
  const result = await (await farmIndex()).getFarmsByPool(Principal.fromText(poolId));
  return resultFormat<Array<Principal>>(result).data;
}

export function useFarmsByPool(
  poolId: string | undefined,
  reload?: boolean,
): UseQueryResult<Principal[] | undefined, Error> {
  return useQuery({
    queryKey: ["useFarmsByPool", poolId, reload],
    queryFn: async () => {
      if (!poolId) return undefined;

      return await getFarmsByPool(poolId);
    },
    enabled: !!poolId,
  });
}
