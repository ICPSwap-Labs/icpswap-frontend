import { resultFormat } from "@icpswap/utils";
import { sns_swap } from "@icpswap/actor";
import type { GetDerivedStateResponse } from "@icpswap/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export async function getSNSSwapDerivedState(swap_id: string) {
  return resultFormat<GetDerivedStateResponse>(await (await sns_swap(swap_id)).get_derived_state({})).data;
}

export function useSNSSwapDerivedState(
  swap_id: string | undefined,
  reload?: boolean | number,
): UseQueryResult<GetDerivedStateResponse | undefined, Error> {
  return useQuery({
    queryKey: ["useSNSSwapDerivedState", swap_id, reload],
    queryFn: async () => {
      if (!swap_id) return undefined;
      return await getSNSSwapDerivedState(swap_id);
    },
    enabled: !!swap_id,
  });
}
