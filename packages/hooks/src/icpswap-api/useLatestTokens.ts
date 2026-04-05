import type { TokenResponse } from "@icpswap/types";
import { icpswap_fetch_post, isUndefinedOrNull } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getLatestTokens() {
  const result = await icpswap_fetch_post<Array<TokenResponse>>(`/info/tokens/latest`);
  if (isUndefinedOrNull(result)) return undefined;
  return result.data;
}

export function useLatestTokens(): UseQueryResult<TokenResponse[], Error> {
  return useQuery({
    queryKey: ["latestTokens"],
    queryFn: async () => {
      return await getLatestTokens();
    },
  });
}
