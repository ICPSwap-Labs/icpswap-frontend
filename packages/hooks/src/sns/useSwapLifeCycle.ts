import { sns_swap } from "@icpswap/actor";
import type { GetLifecycleResponse } from "@icpswap/types";
import { resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getSwapLifeCycle(swap_id: string) {
  return resultFormat<GetLifecycleResponse>(await (await sns_swap(swap_id)).get_lifecycle({})).data;
}

export function useSwapLifeCycle(swap_id: string | undefined): UseQueryResult<GetLifecycleResponse | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapLifeCycle", swap_id],
    queryFn: async () => {
      if (!swap_id) return undefined;
      return await getSwapLifeCycle(swap_id);
    },
    enabled: !!swap_id,
  });
}
