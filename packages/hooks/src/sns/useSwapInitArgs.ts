import { resultFormat } from "@icpswap/utils";
import { sns_swap } from "@icpswap/actor";
import type { GetInitResponse } from "@icpswap/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export async function getSNSSwapInitArgs(swap_id: string) {
  const result = resultFormat<GetInitResponse>(await (await sns_swap(swap_id)).get_init({})).data;

  return result ? result.init[0] : undefined;
}

export function useSNSSwapInitArgs(
  swap_id: string | undefined,
): UseQueryResult<Awaited<ReturnType<typeof getSNSSwapInitArgs>>, Error> {
  return useQuery({
    queryKey: ["useSNSSwapInitArgs", swap_id],
    queryFn: async () => {
      if (!swap_id) return undefined;
      return await getSNSSwapInitArgs(swap_id);
    },
    enabled: !!swap_id,
  });
}
