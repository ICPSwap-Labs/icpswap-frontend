import { Principal } from "@icp-sdk/core/principal";
import { swapFactory } from "@icpswap/actor";
import type { PassCode } from "@icpswap/candid";
import { nonUndefinedOrNull, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getPassCode(principal: string): Promise<PassCode[] | undefined> {
  return resultFormat<PassCode[]>(await (await swapFactory()).getPasscodesByPrincipal(Principal.fromText(principal)))
    .data;
}

export function usePassCode(
  principal: string | undefined,
  refresh?: number,
): UseQueryResult<PassCode[] | undefined, Error> {
  return useQuery({
    queryKey: ["passCode", principal, refresh],
    queryFn: async () => {
      if (!principal) return undefined;
      return getPassCode(principal);
    },
    enabled: nonUndefinedOrNull(principal),
  });
}
