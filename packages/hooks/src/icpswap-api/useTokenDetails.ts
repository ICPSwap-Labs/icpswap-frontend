import type { Null, TokenResponse } from "@icpswap/types";
import { icpswap_fetch_post } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export function useTokenDetails(tokenId: string | Null): UseQueryResult<TokenResponse | undefined, Error> {
  return useQuery({
    queryKey: ["useTokenDetails", tokenId],
    queryFn: async () => {
      if (!tokenId) return undefined;

      const result = await icpswap_fetch_post<TokenResponse>(`/info/tokens/detail`, {
        ledgerId: tokenId,
      });

      return result?.data;
    },
    enabled: !!tokenId,
  });
}
