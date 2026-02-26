import { icpswap_fetch_post, isUndefinedOrNull } from "@icpswap/utils";
import { useQuery } from "@tanstack/react-query";
import { LatestToken } from "@icpswap/types";

export async function getLatestPools() {
  const result = await icpswap_fetch_post<Array<LatestToken>>(`/info/pool/latest`);
  if (isUndefinedOrNull(result)) return undefined;
  return result.data;
}

export function useLatestPools() {
  return useQuery({
    queryKey: ["latestPools"],
    queryFn: async () => {
      return await getLatestPools();
    },
  });
}
