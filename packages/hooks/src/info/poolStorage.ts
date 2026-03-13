import { icpswap_info_fetch_get } from "@icpswap/utils";
import type { InfoPoolRealTimeDataResponse } from "@icpswap/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export async function getInfoPool(poolId: string) {
  const result = await icpswap_info_fetch_get<InfoPoolRealTimeDataResponse>(`/pool/${poolId}`);
  return result?.data;
}

export function useInfoPool(
  poolId: string | undefined,
): UseQueryResult<InfoPoolRealTimeDataResponse | undefined, Error> {
  return useQuery({
    queryKey: ["useInfoPool", poolId],
    queryFn: async () => {
      if (!poolId) return undefined;
      return await getInfoPool(poolId);
    },
    enabled: !!poolId,
  });
}
