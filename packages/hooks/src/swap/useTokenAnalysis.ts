import type { Null, TokenResponse } from "@icpswap/types";
import { icpswap_fetch_post, isUndefinedOrNull } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getTokenAnalysis(canisterId: string) {
  const result = await icpswap_fetch_post<TokenResponse>("/token/data", { pid: canisterId });
  return result?.data;
}

export function useTokenAnalysis(canisterId: string | Null): UseQueryResult<TokenResponse | undefined, Error> {
  return useQuery({
    queryKey: ["useTokenAnalysis", canisterId],
    queryFn: async () => {
      if (isUndefinedOrNull(canisterId)) return undefined;
      return await getTokenAnalysis(canisterId);
    },
    enabled: !isUndefinedOrNull(canisterId),
  });
}
