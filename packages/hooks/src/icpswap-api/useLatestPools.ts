import { icpswap_fetch_post, isUndefinedOrNull } from "@icpswap/utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { LatestPool } from "@icpswap/types";

export async function getLatestPools() {
  const result = await icpswap_fetch_post<Array<LatestPool>>(`/info/pool/latest`);
  if (isUndefinedOrNull(result)) return undefined;
  return result.data;
}

export function useLatestPools(): UseQueryResult<Array<LatestPool>, Error> {
  return useQuery({
    queryKey: ["latestPools"],
    queryFn: async () => {
      return await getLatestPools();
    },
  });
}
