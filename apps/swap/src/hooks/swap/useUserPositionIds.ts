import { Principal } from "@icpswap/dfinity";
import { swapPool } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getUserPositionIds(canisterId: string, principal: string) {
  return resultFormat<Array<bigint>>(
    await (await swapPool(canisterId)).getUserPositionIdsByPrincipal(Principal.fromText(principal)),
  ).data;
}

export function useUserPositionIds(
  canisterId: string | undefined,
  principal: string | undefined,
): UseQueryResult<bigint[] | undefined, Error> {
  return useQuery({
    queryKey: ["useUserPositionIds", canisterId, principal],
    queryFn: async () => {
      if (!canisterId || !principal) return undefined;
      return await getUserPositionIds(canisterId, principal);
    },
    enabled: !!canisterId && !!principal,
  });
}
