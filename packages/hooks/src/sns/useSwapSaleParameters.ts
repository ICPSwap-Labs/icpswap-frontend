import { resultFormat } from "@icpswap/utils";
import { sns_swap } from "@icpswap/actor";
import type { GetSaleParametersResponse } from "@icpswap/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export async function getSwapSaleParameters(swap_id: string) {
  const result = resultFormat<GetSaleParametersResponse>(await (await sns_swap(swap_id)).get_sale_parameters({})).data;

  return result ? result.params[0] : undefined;
}

export function useSwapSaleParameters(
  swap_id: string | undefined,
  reload?: number | boolean,
): UseQueryResult<Awaited<ReturnType<typeof getSwapSaleParameters>> | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapSaleParameters", swap_id, reload],
    queryFn: async () => {
      if (!swap_id) return undefined;
      return await getSwapSaleParameters(swap_id);
    },
    enabled: !!swap_id,
  });
}
