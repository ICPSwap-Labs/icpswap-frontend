import type { InfoPoolRealTimeDataResponse } from "@icpswap/types";
import { icpswap_fetch_post, isUndefinedOrNull } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getLatestPools() {
  const result = await icpswap_fetch_post<Array<InfoPoolRealTimeDataResponse>>(`/info/pool/latest`);
  if (isUndefinedOrNull(result)) return undefined;
  return result.data;
}

export function useLatestPools(): UseQueryResult<Array<InfoPoolRealTimeDataResponse>, Error> {
  return useQuery({
    queryKey: ["latestPools"],
    queryFn: async () => {
      return await getLatestPools();
    },
  });
}
