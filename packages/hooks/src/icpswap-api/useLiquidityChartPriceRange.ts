import type { Null } from "@icpswap/types";
import { icpswap_fetch_get } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export function useLiquidityChartPriceRange(
  poolId: string | Null,
): UseQueryResult<{ minPrice: string; maxPrice: string } | undefined, Error> {
  return useQuery({
    queryKey: ["useLiquidityChartPriceRange", poolId],
    queryFn: async () => {
      if (!poolId) return undefined;
      return (await icpswap_fetch_get<{ minPrice: string; maxPrice: string }>(`/pool/price/recommend/${poolId}`))?.data;
    },
    enabled: !!poolId,
  });
}
