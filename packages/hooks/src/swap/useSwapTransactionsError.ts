import { swapPool } from "@icpswap/actor";
import type { SwapFailedTransaction } from "@icpswap/types";
import { resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getSwapFailedTransactions(canisterId: string) {
  return resultFormat<Array<[bigint, SwapFailedTransaction]>>(
    await (await swapPool(canisterId)).getFailedTransactions(),
  ).data;
}

export function useSwapFailedTransactions(
  canisterId: string | null | undefined,
  refreshTrigger?: boolean | number,
): UseQueryResult<Array<[bigint, SwapFailedTransaction]> | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapFailedTransactions", canisterId, refreshTrigger],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getSwapFailedTransactions(canisterId);
    },
    enabled: !!canisterId,
  });
}
