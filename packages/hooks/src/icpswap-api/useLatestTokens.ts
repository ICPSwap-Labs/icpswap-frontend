import { icpswap_fetch_post, isUndefinedOrNull } from "@icpswap/utils";
import { useQuery } from "@tanstack/react-query";
import { LatestToken } from "@icpswap/types";

export async function getLatestTokens() {
  const result = await icpswap_fetch_post<Array<LatestToken>>(`/info/tokens/latest`);
  if (isUndefinedOrNull(result)) return undefined;
  return result.data;
}

export function useLatestTokens() {
  return useQuery({
    queryKey: ["latestTokens"],
    queryFn: async () => {
      return await getLatestTokens();
    },
  });
}
